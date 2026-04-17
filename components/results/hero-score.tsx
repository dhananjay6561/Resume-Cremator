'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { scoreColor } from '@/lib/score-color';

interface HeroScoreProps {
  score: number;
  verdict: string;
  roastSummary: string;
  onStartFixing: () => void;
}

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function HeroScore({ score, verdict, roastSummary, onStartFixing }: HeroScoreProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setMounted(true), 200);
    return () => clearTimeout(t);
  }, []);

  const col = scoreColor(score);
  const offset = mounted ? CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE : CIRCUMFERENCE;

  return (
    <div className="rounded-2xl border border-[#334155] bg-[#1E293B] overflow-hidden mb-8" style={{ boxShadow: `0 0 40px ${col.hex}33` }}>
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${col.hex}, transparent)` }} />
      <div className="px-6 py-8 flex flex-col md:flex-row items-center gap-8">
        <div className="relative flex-shrink-0 flex items-center justify-center w-40 h-40">
          <div className="absolute inset-0 rounded-full blur-2xl" style={{ background: `${col.hex}22` }} />
          <svg width="160" height="160" viewBox="0 0 128 128" className="-rotate-90 relative z-10" aria-hidden="true">
            <circle cx="64" cy="64" r={RADIUS} stroke="rgba(51,65,85,0.8)" strokeWidth="10" fill="none" />
            <circle cx="64" cy="64" r={RADIUS} stroke={col.hex} strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray={CIRCUMFERENCE} strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1)', filter: `drop-shadow(0 0 8px ${col.hex})` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <span className="font-mono font-bold tabular-nums leading-none" style={{ fontSize: '2.75rem', color: col.hex }}>{score}</span>
            <span className="text-xs text-[#475569] font-medium mt-0.5">/ 100</span>
          </div>
        </div>
        <div className="flex-1 text-center md:text-left">
          <p className="font-heading font-bold text-[#F8FAFC] text-xl md:text-2xl leading-snug mb-2 max-w-md">{roastSummary}</p>
          <p className="text-sm text-[#475569] font-body mb-6 italic">{verdict}</p>
          <motion.button onClick={onStartFixing} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0077b5] text-white text-sm font-semibold rounded-xl hover:bg-[#0a8fd1] transition-all duration-150 font-heading"
          >
            Start Fixing
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></svg>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
