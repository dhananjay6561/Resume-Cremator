'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import type { AnalysisResult, Section } from '@/types/analysis';
import { formatResultAsText } from '@/lib/analysis-utils';
import { scoreColor } from '@/lib/score-color';
import { ScoreGauge } from '@/components/ScoreGauge';
import { BreakdownBars } from '@/components/BreakdownBars';
import { RoastCard } from '@/components/RoastCard';
import { SectionCard } from '@/components/SectionCard';
import { RewriteCard } from '@/components/RewriteCard';

const ratingBadge = {
  poor:    { pill: 'bg-[#ff3b30]/15 text-[#ff3b30] border-[#ff3b30]/25', label: '💀' },
  average: { pill: 'bg-[#f5a623]/15 text-[#f5a623] border-[#f5a623]/25', label: '⚠️' },
  good:    { pill: 'bg-[#22c55e]/15 text-[#22c55e] border-[#22c55e]/25', label: '✅' },
} as const;

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = React.useState<AnalysisResult | null>(null);
  const [loadError, setLoadError] = React.useState(false);
  const rightColRef = React.useRef<HTMLDivElement>(null);
  const sectionRefs = React.useRef<Record<string, HTMLDivElement | null>>({});

  React.useEffect(() => {
    const stored = sessionStorage.getItem('analysisResult');
    if (!stored) { router.push('/'); return; }
    try {
      const parsed = JSON.parse(stored);
      if (!parsed?.ats_score) { setLoadError(true); return; }
      setResult(parsed);
    } catch { setLoadError(true); }
  }, [router]);

  if (loadError) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--navy-950)' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center rounded-2xl p-8 border"
          style={{ background: 'var(--navy-800)', borderColor: 'rgba(255,59,48,0.3)' }}
        >
          <p className="text-4xl mb-4">💀</p>
          <h2 className="font-heading font-bold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>
            Analysis failed
          </h2>
          <p className="text-sm mb-6 font-body" style={{ color: 'var(--text-secondary)' }}>
            The AI couldn&apos;t process your resume. Either it&apos;s blank, or even we gave up.
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold font-heading text-white cursor-pointer transition-opacity hover:opacity-80"
            style={{ background: 'var(--steel)' }}
          >
            Try Again
          </button>
        </motion.div>
      </main>
    );
  }

  if (!result) return null;

  const handleStartOver = () => {
    sessionStorage.removeItem('analysisResult');
    router.push('/');
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(formatResultAsText(result));
  };

  const scrollToSection = (name: string) => {
    sectionRefs.current[name]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const score = result.ats_score.overall;
  const col = scoreColor(score);

  return (
    <main className="min-h-screen" style={{ background: 'var(--navy-950)' }}>
      {/* Top bar */}
      <div className="sticky top-0 z-20 border-b backdrop-blur-md" style={{ borderColor: 'var(--border-subtle)', background: 'rgba(4,13,26,0.85)' }}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className={`font-mono text-sm font-bold tabular-nums ${col.text}`}>{score}/100</span>
            <span className="text-xs font-body hidden sm:block" style={{ color: 'var(--text-muted)' }}>{result.ats_score.verdict}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAll}
              className="hidden md:inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border cursor-pointer transition-opacity hover:opacity-80 font-heading"
              style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
            >
              Copy all tips
            </button>
            <button
              onClick={handleStartOver}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold cursor-pointer transition-opacity hover:opacity-80 font-heading text-white"
              style={{ background: 'var(--steel)' }}
            >
              Scan Again
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 2-column grid */}
        <div className="flex flex-col md:grid md:gap-6" style={{ gridTemplateColumns: '300px 1fr' }}>

          {/* LEFT COLUMN */}
          <motion.aside
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 md:mb-0 rounded-2xl border overflow-hidden self-start md:sticky md:top-20"
            style={{ borderColor: 'var(--border-default)', background: 'var(--navy-800)' }}
          >
            {/* Score gauge */}
            <ScoreGauge score={score} />

            <div className="border-t" style={{ borderColor: 'var(--border-subtle)' }}>
              <BreakdownBars breakdown={result.ats_score.breakdown} />
            </div>

            {/* Section ratings */}
            <div className="border-t px-4 py-4" style={{ borderColor: 'var(--border-subtle)' }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-3 font-heading" style={{ color: 'var(--text-muted)' }}>Sections</p>
              <div className="space-y-1.5">
                {result.sections.map((sec: Section) => {
                  const cfg = ratingBadge[sec.rating];
                  return (
                    <button
                      key={sec.name}
                      onClick={() => scrollToSection(sec.name)}
                      className="w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg cursor-pointer hover:opacity-80 transition-opacity text-left"
                      style={{ background: 'var(--border-subtle)' }}
                    >
                      <span className="text-xs font-body truncate" style={{ color: 'var(--text-secondary)' }}>{sec.name}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border flex-shrink-0 font-heading ${cfg.pill}`}>
                        {cfg.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Red flags */}
            {result.red_flags.length > 0 && (
              <div className="border-t px-4 py-4" style={{ borderColor: 'var(--border-subtle)' }}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-3 font-heading" style={{ color: 'var(--roast-red)' }}>
                  🚩 Red Flags
                </p>
                <ul className="space-y-2">
                  {result.red_flags.slice(0, 5).map((flag, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs font-body border-l-2 pl-2" style={{ borderColor: 'var(--roast-red)', color: 'var(--text-secondary)' }}>
                      {flag}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* One thing */}
            <div className="border-t px-4 py-4" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="rounded-xl p-3 border-l-4" style={{ borderLeftColor: 'var(--steel)', background: 'rgba(0,119,181,0.08)' }}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5 font-heading" style={{ color: 'var(--steel)' }}>Fix This First</p>
                <p className="text-xs leading-relaxed font-body" style={{ color: 'var(--text-primary)' }}>{result.one_thing}</p>
              </div>
            </div>
          </motion.aside>

          {/* RIGHT COLUMN */}
          <div ref={rightColRef} className="space-y-6 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <RoastCard roast={result.roast} verdict={result.ats_score.verdict} />
            </motion.div>

            {/* Section cards */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-3 font-heading" style={{ color: 'var(--text-muted)' }}>Section Feedback</p>
              <div className="space-y-2">
                {result.sections.map((sec: Section, idx: number) => (
                  <div key={sec.name} ref={(el) => { sectionRefs.current[sec.name] = el; }} className="scroll-mt-24">
                    <SectionCard section={sec} defaultOpen={idx < 2} />
                  </div>
                ))}
              </div>
            </div>

            {/* Rewrite suggestions */}
            {result.rewrites.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-3 font-heading" style={{ color: 'var(--text-muted)' }}>
                  ✍️ Rewrite Suggestions
                </p>
                <div className="space-y-3">
                  {result.rewrites.map((rw, i) => (
                    <RewriteCard key={i} rewrite={rw} index={i} />
                  ))}
                </div>
              </div>
            )}

            <div className="h-8" />
          </div>
        </div>
      </div>

      {/* Mobile bottom bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 px-4 py-3 border-t flex gap-3 z-10 backdrop-blur-md" style={{ background: 'rgba(4,13,26,0.9)', borderColor: 'var(--border-subtle)' }}>
        <button onClick={handleStartOver} className="flex-1 text-sm py-2 rounded-xl border font-semibold font-heading cursor-pointer" style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}>
          Start Over
        </button>
        <button onClick={handleCopyAll} className="flex-1 text-sm py-2 rounded-xl font-semibold font-heading cursor-pointer text-white" style={{ background: 'var(--steel)' }}>
          Copy Tips
        </button>
      </div>
    </main>
  );
}
