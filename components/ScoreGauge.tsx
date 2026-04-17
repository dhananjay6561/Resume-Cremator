'use client';

import * as React from 'react';
import { scoreColor } from '@/lib/score-color';

interface ScoreGaugeProps {
  score: number;
}

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ScoreGauge({ score }: ScoreGaugeProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setMounted(true), 200);
    return () => clearTimeout(t);
  }, []);

  const col = scoreColor(score);
  const offset = mounted ? CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE : CIRCUMFERENCE;

  return (
    <div className="flex flex-col items-center py-6 px-4">
      <div className="relative flex items-center justify-center w-36 h-36">
        <svg width="144" height="144" viewBox="0 0 128 128" className="-rotate-90" aria-hidden="true">
          <circle cx="64" cy="64" r={RADIUS} stroke="#E5E5E5" strokeWidth="9" fill="none" />
          <circle
            cx="64" cy="64" r={RADIUS}
            stroke={col.hex}
            strokeWidth="9"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono font-bold tabular-nums leading-none" style={{ fontSize: '2.25rem', color: col.hex }}>
            {score}
          </span>
          <span className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>/ 100</span>
        </div>
      </div>
      <span className="mt-2 text-xs font-semibold uppercase tracking-widest font-heading" style={{ color: 'var(--text-muted)' }}>
        ATS Score
      </span>
    </div>
  );
}
