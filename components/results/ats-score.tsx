'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import type { AtsScore as AtsScoreType } from '@/types/analysis';
import { scoreColor } from '@/lib/score-color';

interface AtsScoreProps {
  score: AtsScoreType;
}

const bars = [
  { key: 'formatting',     label: 'Formatting' },
  { key: 'keywords',       label: 'Keywords' },
  { key: 'quantification', label: 'Quantification' },
  { key: 'clarity',        label: 'Clarity' },
  { key: 'impact',         label: 'Impact' },
] as const;

export function AtsScore({ score }: AtsScoreProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setMounted(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="px-5 py-5 space-y-5">
      {bars.map((bar, i) => {
        const value = score.breakdown[bar.key];
        const col = scoreColor(value);
        return (
          <div key={bar.key}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium font-body text-[#94A3B8]">{bar.label}</span>
              <span className={`font-mono text-sm font-bold tabular-nums ${col.text}`}>
                {value}
                <span className="text-[#334155] font-normal text-xs">/100</span>
              </span>
            </div>
            <div className="h-2 w-full bg-[#334155]/60 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${col.bg}`}
                initial={{ width: 0 }}
                animate={{ width: mounted ? `${value}%` : '0%' }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
