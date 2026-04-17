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

const ratingDot = {
  poor:    'bg-red-500',
  average: 'bg-amber-500',
  good:    'bg-green-600',
} as const;

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = React.useState<AnalysisResult | null>(null);
  const [loadError, setLoadError] = React.useState(false);
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
      <main className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-page)' }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-sm w-full text-center rounded-xl p-8"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
        >
          <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--red-light)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="font-heading font-bold text-lg mb-1.5" style={{ color: 'var(--text-primary)' }}>
            Analysis failed
          </h2>
          <p className="text-sm mb-6 font-body" style={{ color: 'var(--text-secondary)' }}>
            The AI couldn&apos;t process your resume. Please try again.
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-5 py-2 rounded-lg text-sm font-semibold font-heading text-white cursor-pointer transition-colors hover:opacity-90"
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
    <main className="min-h-screen" style={{ background: 'var(--bg-page)' }}>
      {/* Top bar */}
      <div
        className="sticky top-0 z-20 border-b"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <div className="max-w-7xl mx-auto px-5 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className={`font-mono text-sm font-bold tabular-nums ${col.text}`}>{score}/100</span>
            <span className="text-xs font-body hidden sm:block" style={{ color: 'var(--text-muted)' }}>
              {result.ats_score.verdict}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAll}
              className="hidden md:inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border cursor-pointer transition-colors hover:bg-slate-50 font-heading"
              style={{ borderColor: 'var(--border-medium)', color: 'var(--text-secondary)' }}
            >
              Copy all tips
            </button>
            <button
              onClick={handleStartOver}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md font-semibold cursor-pointer transition-colors hover:opacity-90 font-heading text-white"
              style={{ background: 'var(--steel)' }}
            >
              Scan Again
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:grid md:gap-5" style={{ gridTemplateColumns: '280px 1fr' }}>

          {/* LEFT COLUMN */}
          <motion.aside
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mb-5 md:mb-0 rounded-xl overflow-hidden self-start md:sticky md:top-[57px]"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}
          >
            <ScoreGauge score={score} />

            <div className="border-t" style={{ borderColor: 'var(--border)' }}>
              <BreakdownBars breakdown={result.ats_score.breakdown} />
            </div>

            {/* Section ratings */}
            <div className="border-t px-4 py-4" style={{ borderColor: 'var(--border)' }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2.5 font-heading" style={{ color: 'var(--text-muted)' }}>
                Sections
              </p>
              <div className="space-y-1">
                {result.sections.map((sec: Section) => (
                  <button
                    key={sec.name}
                    onClick={() => scrollToSection(sec.name)}
                    className="w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors duration-150 text-left"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${ratingDot[sec.rating]}`} />
                      <span className="text-xs font-body truncate" style={{ color: 'var(--text-secondary)' }}>{sec.name}</span>
                    </div>
                    <span className="font-mono text-[10px] font-bold flex-shrink-0" style={{ color: scoreColor(sec.score).hex }}>
                      {sec.score}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Red flags */}
            {result.red_flags.length > 0 && (
              <div className="border-t px-4 py-4" style={{ borderColor: 'var(--border)' }}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2.5 font-heading" style={{ color: 'var(--red)' }}>
                  Red Flags
                </p>
                <ul className="space-y-2">
                  {result.red_flags.slice(0, 5).map((flag, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs font-body border-l-2 pl-2.5" style={{ borderColor: 'var(--red)', color: 'var(--text-secondary)' }}>
                      {flag}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* One thing */}
            <div className="border-t px-4 py-4" style={{ borderColor: 'var(--border)' }}>
              <div className="rounded-lg p-3 border-l-4" style={{ borderLeftColor: 'var(--steel)', background: 'var(--steel-light)' }}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1 font-heading" style={{ color: 'var(--steel)' }}>
                  Fix This First
                </p>
                <p className="text-xs leading-relaxed font-body" style={{ color: 'var(--text-primary)' }}>{result.one_thing}</p>
              </div>
            </div>
          </motion.aside>

          {/* RIGHT COLUMN */}
          <div className="space-y-5 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <RoastCard roast={result.roast} verdict={result.ats_score.verdict} />
            </motion.div>

            {/* Section cards */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-2.5 font-heading" style={{ color: 'var(--text-muted)' }}>
                Section Feedback
              </p>
              <div className="space-y-2">
                {result.sections.map((sec: Section, idx: number) => (
                  <div key={sec.name} ref={(el) => { sectionRefs.current[sec.name] = el; }} className="scroll-mt-20">
                    <SectionCard section={sec} defaultOpen={idx < 2} />
                  </div>
                ))}
              </div>
            </div>

            {/* Rewrite suggestions */}
            {result.rewrites.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-2.5 font-heading" style={{ color: 'var(--text-muted)' }}>
                  Rewrite Suggestions
                </p>
                <div className="space-y-2.5">
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
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 px-4 py-3 border-t flex gap-2.5 z-10"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <button
          onClick={handleStartOver}
          className="flex-1 text-sm py-2 rounded-lg border font-semibold font-heading cursor-pointer hover:bg-slate-50 transition-colors"
          style={{ borderColor: 'var(--border-medium)', color: 'var(--text-secondary)' }}
        >
          Start Over
        </button>
        <button
          onClick={handleCopyAll}
          className="flex-1 text-sm py-2 rounded-lg font-semibold font-heading cursor-pointer text-white"
          style={{ background: 'var(--steel)' }}
        >
          Copy Tips
        </button>
      </div>
    </main>
  );
}
