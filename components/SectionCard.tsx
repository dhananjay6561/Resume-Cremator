'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Section } from '@/types/analysis';
import { scoreColor } from '@/lib/score-color';

interface SectionCardProps {
  section: Section;
  defaultOpen?: boolean;
}

const ratingLabel = { poor: 'Poor', average: 'Average', good: 'Good' } as const;

const ratingBadge = {
  poor:    'bg-red-50 text-red-700 border-red-100',
  average: 'bg-amber-50 text-amber-700 border-amber-100',
  good:    'bg-green-50 text-green-700 border-green-100',
} as const;

const accentBorder = {
  poor:    'border-l-red-500',
  average: 'border-l-amber-500',
  good:    'border-l-green-600',
} as const;

export function SectionCard({ section, defaultOpen = false }: SectionCardProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  const col = scoreColor(section.score);

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between px-4 py-3 border-l-4 ${accentBorder[section.rating]} hover:bg-slate-50 transition-colors duration-150 cursor-pointer`}
        aria-expanded={open}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <motion.svg
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.18 }}
            width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="var(--text-muted)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            className="flex-shrink-0"
          >
            <polyline points="9 18 15 12 9 6" />
          </motion.svg>
          <span className="font-heading font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
            {section.name}
          </span>
        </div>
        <div className="flex items-center gap-2 ml-3 flex-shrink-0">
          <span className={`font-mono text-xs font-bold ${col.text}`}>{section.score}</span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border font-heading ${ratingBadge[section.rating]}`}>
            {ratingLabel[section.rating]}
          </span>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 py-4 border-t" style={{ borderColor: 'var(--border)', background: '#FAFAFA' }}>
              {section.roast && (
                <p className="text-xs italic mb-4 font-body" style={{ color: 'var(--text-muted)' }}>{section.roast}</p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-2 font-heading" style={{ color: 'var(--red)' }}>Issues</p>
                  <ul className="space-y-1.5">
                    {section.issues.map((issue, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs font-body" style={{ color: 'var(--text-secondary)' }}>
                        <span className="mt-0.5 flex-shrink-0" style={{ color: 'var(--red)' }}>•</span>
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-2 font-heading" style={{ color: 'var(--green)' }}>Fixes</p>
                  <ul className="space-y-1.5">
                    {section.fixes.map((fix, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs font-body" style={{ color: 'var(--text-secondary)' }}>
                        <span className="mt-0.5 flex-shrink-0" style={{ color: 'var(--green)' }}>→</span>
                        {fix}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
