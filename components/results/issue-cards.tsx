'use client';

import * as React from 'react';
import { motion, type Variants } from 'framer-motion';
import type { Section } from '@/types/analysis';

interface IssueCardsProps {
  sections: Section[];
}

const ratingConfig = {
  poor: {
    icon: (
      <div className="w-9 h-9 rounded-xl bg-red-500/15 border border-red-500/20 flex items-center justify-center flex-shrink-0">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E5451F" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </div>
    ),
    cardClass: 'border-[#E5451F]/20 bg-[#E5451F]/5 hover:bg-[#E5451F]/8 hover:border-[#E5451F]/35',
    badge: 'text-[#E5451F] bg-[#E5451F]/15 border-[#E5451F]/20',
    label: 'Critical',
  },
  average: {
    icon: (
      <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>
    ),
    cardClass: 'border-orange-500/20 bg-orange-500/5 hover:bg-orange-500/8 hover:border-orange-500/35',
    badge: 'text-[#F97316] bg-orange-500/15 border-orange-500/20',
    label: 'Needs Work',
  },
  good: {
    icon: (
      <div className="w-9 h-9 rounded-xl bg-green-500/15 border border-green-500/20 flex items-center justify-center flex-shrink-0">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    ),
    cardClass: 'border-green-500/20 bg-green-500/5 hover:bg-green-500/8 hover:border-green-500/35',
    badge: 'text-[#22C55E] bg-green-500/15 border-green-500/20',
    label: 'Good',
  },
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export function IssueCards({ sections = [] }: IssueCardsProps) {
  const topIssues = [
    ...sections.filter((s) => s.rating === 'poor'),
    ...sections.filter((s) => s.rating === 'average'),
  ].slice(0, 4);

  if (topIssues.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2.5 mb-5">
        <h2 className="font-heading font-bold text-sm text-[#F8FAFC] uppercase tracking-widest">Key Issues</h2>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#E5451F] text-white tabular-nums">
          {topIssues.length}
        </span>
      </div>
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-3" variants={containerVariants} initial="hidden" animate="show">
        {topIssues.map((section, i) => {
          const cfg = ratingConfig[section.rating];
          const firstIssue = section.issues[0];
          return (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{ y: -2 }}
              className={`flex items-start gap-3 p-4 rounded-2xl border transition-all duration-200 cursor-default ${cfg.cardClass}`}
            >
              {cfg.icon}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-heading font-semibold text-sm text-[#F8FAFC] truncate">{section.name}</span>
                  <span className={`flex-shrink-0 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${cfg.badge}`}>
                    {cfg.label}
                  </span>
                </div>
                {firstIssue && (
                  <p className="text-xs text-[#64748B] leading-relaxed line-clamp-2 font-body">{firstIssue}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
