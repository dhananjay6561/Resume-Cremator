'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

interface HeroScoreProps {
  score: number;
  label: string;
  roastSummary: string;
  onStartFixing: () => void;
}

function getScoreConfig(score: number) {
  if (score >= 75)
    return {
      color: '#22C55E',
      glow: 'rgba(34,197,94,0.2)',
      badgeBg: 'bg-green-500/10',
      badgeBorder: 'border-green-500/20',
      badgeText: 'text-[#22C55E]',
      trackColor: 'rgba(34,197,94,0.15)',
    };
  if (score >= 40)
    return {
      color: '#F97316',
      glow: 'rgba(249,115,22,0.2)',
      badgeBg: 'bg-orange-500/10',
      badgeBorder: 'border-orange-500/20',
      badgeText: 'text-[#F97316]',
      trackColor: 'rgba(249,115,22,0.15)',
    };
  return {
    color: '#E5451F',
    glow: 'rgba(229,69,31,0.25)',
    badgeBg: 'bg-red-500/10',
    badgeBorder: 'border-red-500/20',
    badgeText: 'text-[#E5451F]',
    trackColor: 'rgba(229,69,31,0.15)',
  };
}

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function HeroScore({ score, label, roastSummary, onStartFixing }: HeroScoreProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setMounted(true), 200);
    return () => clearTimeout(t);
  }, []);

  const cfg = getScoreConfig(score);
  const offset = mounted ? CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE : CIRCUMFERENCE;

  return (
    <div
      className="rounded-2xl border border-[#334155] bg-[#1E293B] overflow-hidden mb-8"
      style={{ boxShadow: `0 0 40px ${cfg.glow}` }}
    >
      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${cfg.color}, transparent)` }} />

      <div className="px-6 py-8 flex flex-col md:flex-row items-center gap-8">
        {/* Ring gauge */}
        <div className="relative flex-shrink-0 flex items-center justify-center w-40 h-40">
          {/* Glow behind ring */}
          <div
            className="absolute inset-0 rounded-full blur-2xl"
            style={{ background: cfg.trackColor }}
          />
          <svg width="160" height="160" viewBox="0 0 128 128" className="-rotate-90 relative z-10" aria-hidden="true">
            <circle cx="64" cy="64" r={RADIUS} stroke="rgba(51,65,85,0.8)" strokeWidth="10" fill="none" />
            <circle
              cx="64" cy="64" r={RADIUS}
              stroke={cfg.color}
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              style={{
                transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1)',
                filter: `drop-shadow(0 0 8px ${cfg.color})`,
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <span
              className="font-mono font-bold tabular-nums leading-none"
              style={{ fontSize: '2.75rem', color: cfg.color }}
            >
              {score}
            </span>
            <span className="text-xs text-[#475569] font-medium mt-0.5">/ 100</span>
          </div>
        </div>

        {/* Right text block */}
        <div className="flex-1 text-center md:text-left">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${cfg.badgeBg} ${cfg.badgeBorder} mb-3`}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cfg.color }} />
            <span className={`text-xs font-bold uppercase tracking-widest font-heading ${cfg.badgeText}`}>{label}</span>
          </div>

          <p className="font-heading font-bold text-[#F8FAFC] text-xl md:text-2xl leading-snug mb-1 max-w-md">
            {roastSummary}
          </p>
          <p className="text-sm text-[#475569] font-body mb-6">
            Here&apos;s exactly what to fix.
          </p>

          <motion.button
            onClick={onStartFixing}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E5451F] text-white text-sm font-semibold rounded-xl hover:bg-[#C93A18] transition-all duration-150 shadow-lg shadow-[#E5451F]/25 font-heading"
          >
            Start Fixing
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
