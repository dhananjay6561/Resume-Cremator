'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AtsScore } from '@/types/analysis';
import { AtsScore as AtsScorePanel } from './ats-score';
import { scoreColorClass } from '@/lib/analysis-utils';

interface AtsBreakdownProps {
  score: AtsScore;
}

export function AtsBreakdown({ score }: AtsBreakdownProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="mb-8 rounded-2xl border border-[#334155] bg-[#1E293B] overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-[#243449] transition-colors duration-150 cursor-pointer"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2.5">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          <span className="text-sm font-bold text-[#F8FAFC] font-heading">ATS Breakdown</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`font-mono text-sm font-bold tabular-nums ${scoreColorClass(score.overall)}`}>
            {score.overall}
            <span className="text-[#334155] font-normal text-xs">/100</span>
          </span>
          <motion.svg
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            xmlns="http://www.w3.org/2000/svg"
            width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </motion.svg>
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-[#334155]">
              <AtsScorePanel score={score} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
