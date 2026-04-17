'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Section } from '@/types/analysis';
import { scoreColor } from '@/lib/score-color';

interface SectionCardProps {
  section: Section;
  defaultOpen?: boolean;
}

const ratingLabel = { poor: '💀 Poor', average: '⚠️ Average', good: '✅ Good' } as const;
const ratingBadge = {
  poor:    'bg-[#ff3b30]/15 text-[#ff3b30] border-[#ff3b30]/25',
  average: 'bg-[#f5a623]/15 text-[#f5a623] border-[#f5a623]/25',
  good:    'bg-[#22c55e]/15 text-[#22c55e] border-[#22c55e]/25',
} as const;
const accentBorder = {
  poor: 'border-l-[#ff3b30]',
  average: 'border-l-[#f5a623]',
  good: 'border-l-[#22c55e]',
} as const;

export function SectionCard({ section, defaultOpen = false }: SectionCardProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  const col = scoreColor(section.score);

  return (
    <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border-default)' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between px-4 py-3 border-l-4 ${accentBorder[section.rating]} hover:opacity-90 transition-opacity cursor-pointer`}
        style={{ background: 'var(--navy-800)' }}
        aria-expanded={open}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <motion.svg animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.2 }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4a5878" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
            <polyline points="9 18 15 12 9 6" />
          </motion.svg>
          <span className="font-heading font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{section.name}</span>
        </div>
        <div className="flex items-center gap-2 ml-3 flex-shrink-0">
          <span className={`font-mono text-xs font-bold ${col.text}`}>{section.score}</span>
          <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border font-heading ${ratingBadge[section.rating]}`}>
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
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 py-4 border-t" style={{ borderColor: 'var(--border-subtle)', background: 'var(--navy-900)' }}>
              {section.roast && (
                <p className="text-xs italic mb-4 font-body" style={{ color: 'var(--text-muted)' }}>{section.roast}</p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-2 font-heading" style={{ color: '#ff3b30' }}>Issues</p>
                  <ul className="space-y-1.5">
                    {section.issues.map((issue, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs font-body" style={{ color: 'var(--text-secondary)' }}>
                        <span className="mt-0.5 flex-shrink-0" style={{ color: '#ff3b30' }}>•</span>
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-2 font-heading" style={{ color: '#22c55e' }}>Fixes</p>
                  <ul className="space-y-1.5">
                    {section.fixes.map((fix, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs font-body" style={{ color: 'var(--text-secondary)' }}>
                        <span className="mt-0.5 flex-shrink-0" style={{ color: '#22c55e' }}>→</span>
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
