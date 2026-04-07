'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import type { AtsScore as AtsScoreType } from '@/types/analysis';

interface AtsScoreProps {
  score: AtsScoreType;
}

function getColor(score: number) {
  if (score >= 75) return { text: 'text-[#22C55E]', bar: 'bg-[#22C55E]', glow: 'shadow-green-500/30' };
  if (score >= 40) return { text: 'text-[#F97316]', bar: 'bg-[#F97316]', glow: 'shadow-orange-500/30' };
  return { text: 'text-[#E5451F]', bar: 'bg-[#E5451F]', glow: 'shadow-red-500/30' };
}

const bars = [
  { key: 'formatting',     label: 'Formatting',     max: 25 },
  { key: 'keywords',       label: 'Keywords',        max: 25 },
  { key: 'quantification', label: 'Quantification',  max: 25 },
  { key: 'clarity',        label: 'Clarity',         max: 25 },
] as const;

export function AtsScore({ score }: AtsScoreProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setMounted(true), 150);
    return () => clearTimeout(t);
  }, []);

  const col = getColor(score.score);

  return (
    <div className="px-5 py-5 space-y-5">
      {bars.map((bar, i) => {
        const value = score.breakdown[bar.key];
        const pct = (value / bar.max) * 100;
        return (
          <div key={bar.key}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium font-body text-[#94A3B8]">{bar.label}</span>
              <span className={`font-mono text-sm font-bold tabular-nums ${col.text}`}>
                {value}
                <span className="text-[#334155] font-normal text-xs">/{bar.max}</span>
              </span>
            </div>
            <div className="h-2 w-full bg-[#334155]/60 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${col.bar}`}
                initial={{ width: 0 }}
                animate={{ width: mounted ? `${pct}%` : '0%' }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                style={{ boxShadow: pct > 0 ? `0 0 8px currentColor` : 'none' }}
              />
            </div>
          </div>
        );
      })}
      <p className="text-xs text-[#334155] font-body pt-1">
        Score = formatting + keywords + quantification + clarity (25 pts each)
      </p>
    </div>
  );
}
