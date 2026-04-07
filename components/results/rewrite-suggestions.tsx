'use client';

import * as React from 'react';
import { motion, type Variants } from 'framer-motion';
import type { RewriteSuggestion as RewriteSuggestionType } from '@/types/analysis';

interface RewriteSuggestionsProps {
  suggestions: RewriteSuggestionType[];
}

function CopyButton({ text }: { text: string }) {
  const [state, setState] = React.useState<'idle' | 'copied'>('idle');

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setState('copied');
      setTimeout(() => setState('idle'), 2000);
    });
  };

  return (
    <motion.button
      onClick={handleCopy}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      aria-label="Copy improved text"
      className={`flex-shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer select-none font-heading ${
        state === 'copied'
          ? 'bg-green-500/15 border-green-500/25 text-[#22C55E]'
          : 'bg-[#334155]/50 border-[#334155] text-[#94A3B8] hover:bg-[#475569]/50 hover:text-[#F8FAFC] hover:border-[#475569]'
      }`}
    >
      {state === 'copied' ? (
        <>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          Copy
        </>
      )}
    </motion.button>
  );
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

export function RewriteSuggestions({ suggestions = [] }: RewriteSuggestionsProps) {
  return (
    <div className="mb-8">
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <svg width="16" height="16" viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg">
              <path d="M30 78 C10 78 4 62 4 50 C4 34 14 23 20 13 C22 24 27 27 27 27 C27 18 30 4 30 4 C30 4 56 30 56 50 C56 64 48 78 30 78Z" fill="#E5451F"/>
            </svg>
            <h2 className="font-heading font-bold text-sm text-[#F8FAFC] uppercase tracking-widest">Instant Fixes</h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#E5451F] text-white tabular-nums">
              {suggestions.length}
            </span>
          </div>
          <p className="text-xs text-[#475569] font-body pl-6">
            Copy the improved versions straight into your resume.
          </p>
        </div>
      </div>

      <motion.div
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {suggestions.map((sug, idx) => (
          <motion.div
            key={idx}
            variants={cardVariants}
            whileHover={{ y: -2 }}
            className="rounded-2xl border border-[#334155] bg-[#1E293B] overflow-hidden transition-shadow duration-200 hover:shadow-lg hover:shadow-black/20"
          >
            {/* Before */}
            <div className="px-5 pt-4 pb-3.5 bg-[#E5451F]/5 border-b border-[#E5451F]/10">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-md bg-[#E5451F]/15 flex items-center justify-center">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#E5451F" strokeWidth="3" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-[#E5451F]/60 mb-1 font-heading">
                    Before — recruiter will skip this
                  </span>
                  <p className="text-sm text-[#475569] line-through leading-relaxed font-body">{sug.original}</p>
                </div>
              </div>
            </div>

            {/* After */}
            <div className="px-5 pt-4 pb-3.5 bg-green-500/5 border-b border-green-500/10">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-md bg-green-500/15 flex items-center justify-center">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-[#22C55E]/60 mb-1 font-heading">
                      After — this gets interviews
                    </span>
                    <p className="text-sm font-semibold text-[#F8FAFC] leading-relaxed font-body">{sug.rewritten}</p>
                  </div>
                </div>
                <CopyButton text={sug.rewritten} />
              </div>
            </div>

            {/* Why */}
            <div className="px-5 py-3 flex items-start gap-2">
              <svg
                width="12" height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#475569"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-0.5 flex-shrink-0"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="text-xs text-[#64748B] leading-relaxed font-body">{sug.reason}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
