'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SectionFeedback as SectionFeedbackType } from '@/types/analysis';

interface SectionFeedbackProps {
  sections: SectionFeedbackType[];
}

const ratingConfig = {
  poor: {
    accent: 'border-l-[#E5451F]',
    badge: 'bg-[#E5451F]/15 text-[#E5451F] border-[#E5451F]/20',
    label: 'Poor',
  },
  average: {
    accent: 'border-l-[#F97316]',
    badge: 'bg-orange-500/15 text-[#F97316] border-orange-500/20',
    label: 'Average',
  },
  good: {
    accent: 'border-l-[#22C55E]',
    badge: 'bg-green-500/15 text-[#22C55E] border-green-500/20',
    label: 'Good',
  },
};

function SectionItem({ section, defaultOpen }: { section: SectionFeedbackType; defaultOpen: boolean }) {
  const [open, setOpen] = React.useState(defaultOpen);
  const cfg = ratingConfig[section.rating];

  return (
    <div className="rounded-2xl overflow-hidden border border-[#334155]">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between px-4 py-3.5 bg-[#1E293B] border-l-4 ${cfg.accent} hover:bg-[#243449] transition-colors duration-150 cursor-pointer`}
        aria-expanded={open}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <motion.svg
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            xmlns="http://www.w3.org/2000/svg"
            width="14" height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#475569"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="flex-shrink-0"
          >
            <polyline points="9 18 15 12 9 6" />
          </motion.svg>
          <span className="font-heading font-semibold text-sm text-[#F8FAFC] truncate">{section.section}</span>
        </div>
        <span className={`ml-3 flex-shrink-0 text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border font-heading ${cfg.badge}`}>
          {cfg.label}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="bg-[#0F172A]/60 px-5 py-4 space-y-4 border-t border-[#334155]">
              {section.issues.length === 0 ? (
                <p className="text-sm text-[#475569] italic font-body">No major issues — solid work here.</p>
              ) : (
                section.issues.map((issue, i) => (
                  <div key={i}>
                    <div className="flex items-start gap-2.5 mb-2">
                      <div className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-[#E5451F]/15 flex items-center justify-center">
                        <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#E5451F" strokeWidth="3" strokeLinecap="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </div>
                      <p className="text-sm text-[#94A3B8] leading-relaxed font-body">{issue}</p>
                    </div>
                    {section.fixes[i] && (
                      <div className="flex items-start gap-2.5 pl-6">
                        <div className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-green-500/15 flex items-center justify-center">
                          <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                        <p className="text-sm text-[#64748B] leading-relaxed font-body">{section.fixes[i]}</p>
                      </div>
                    )}
                    {i < section.issues.length - 1 && (
                      <div className="ml-6 mt-3.5 border-t border-[#1E293B]" />
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SectionFeedback({ sections = [] }: SectionFeedbackProps) {
  return (
    <div className="mb-8">
      <h2 className="font-heading font-bold text-sm text-[#F8FAFC] uppercase tracking-widest mb-4">
        Section Breakdown
      </h2>

      <div className="space-y-2.5">
        {sections.map((section, idx) => (
          <SectionItem
            key={idx}
            section={section}
            defaultOpen={idx === 0 && section.rating !== 'good'}
          />
        ))}
      </div>
    </div>
  );
}
