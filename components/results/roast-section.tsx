'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RoastSectionProps {
  roast: string;
}

export function RoastSection({ roast }: RoastSectionProps) {
  const [open, setOpen] = React.useState(false);
  const paragraphs = roast.split('\n\n').filter((p) => p.trim() !== '');

  return (
    <div className="mb-6 rounded-2xl overflow-hidden border border-[#334155]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full bg-[#1E293B] px-5 py-4 flex items-center justify-between hover:bg-[#243449] transition-colors duration-150 cursor-pointer"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E5451F]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#F97316]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
          </div>
          <span className="font-heading font-bold text-lg text-[#F8FAFC] tracking-tight">The Full Verdict</span>
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#E5451F] border border-[#E5451F]/30 rounded-full px-2.5 py-0.5 bg-[#E5451F]/10 font-heading">
            Brutal
          </span>
        </div>
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          xmlns="http://www.w3.org/2000/svg"
          width="16" height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#475569"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="flex-shrink-0"
        >
          <polyline points="6 9 12 15 18 9" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="bg-[#0F172A] px-5 pb-7 pt-4 space-y-4 border-t border-[#334155]">
              {paragraphs.map((p, i) => (
                <p
                  key={i}
                  className={`leading-relaxed text-sm md:text-base font-body ${
                    i === 0 ? 'text-[#F8FAFC] font-medium md:text-lg' : 'text-[#64748B]'
                  }`}
                >
                  {p}
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
