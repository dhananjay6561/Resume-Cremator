'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import type { AnalysisResult } from '@/types/analysis';
import { extractOneLiner, formatResultAsText } from '@/lib/analysis-utils';
import { ResultNav } from '@/components/results/result-nav';
import { HeroScore } from '@/components/results/hero-score';
import { IssueCards } from '@/components/results/issue-cards';
import { RewriteSuggestions } from '@/components/results/rewrite-suggestions';
import { AtsBreakdown } from '@/components/results/ats-breakdown';
import { SectionFeedback } from '@/components/results/section-feedback';
import { RoastSection } from '@/components/results/roast-section';
import { ResultFooter } from '@/components/results/result-footer';

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = React.useState<AnalysisResult | null>(null);
  const fixesRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const stored = sessionStorage.getItem('analysisResult');
    if (!stored) { router.push('/'); return; }
    try { setResult(JSON.parse(stored)); }
    catch { router.push('/'); }
  }, [router]);

  if (!result) return null;

  const handleStartOver = () => {
    sessionStorage.removeItem('analysisResult');
    router.push('/');
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(formatResultAsText(result));
  };

  const handleScrollToFixes = () => {
    fixesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="relative min-h-screen">
      {/* Grid bg */}
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" aria-hidden="true" />
      {/* Fire glow top */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(229,69,31,0.08) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[860px] mx-auto px-5 py-8 md:py-12">
        <ResultNav onStartOver={handleStartOver} onCopyAll={handleCopyAll} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <HeroScore
            score={result.atsScore.score}
            label={result.atsScore.label}
            roastSummary={extractOneLiner(result.roast)}
            onStartFixing={handleScrollToFixes}
          />
        </motion.div>

        <IssueCards sections={result.sectionFeedback} />

        <div ref={fixesRef} className="scroll-mt-8">
          <RewriteSuggestions suggestions={result.rewriteSuggestions} />
        </div>

        <AtsBreakdown score={result.atsScore} />
        <SectionFeedback sections={result.sectionFeedback} />
        <RoastSection roast={result.roast} />
        <ResultFooter onStartOver={handleStartOver} onCopyAll={handleCopyAll} />

        <div className="h-24 md:h-0" aria-hidden="true" />
      </div>
    </main>
  );
}
