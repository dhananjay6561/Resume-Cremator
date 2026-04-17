'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import type { AtsBreakdown } from '@/types/analysis';
import { scoreColor } from '@/lib/score-color';

interface BreakdownBarsProps {
  breakdown: AtsBreakdown;
}

const BARS: { key: keyof AtsBreakdown; label: string }[] = [
  { key: 'formatting',     label: 'Formatting' },
  { key: 'keywords',       label: 'Keywords' },
  { key: 'quantification', label: 'Quantification' },
  { key: 'clarity',        label: 'Clarity' },
  { key: 'impact',         label: 'Impact' },
];

export function BreakdownBars({ breakdown }: BreakdownBarsProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setMounted(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="px-4 pb-5 space-y-3">
      {BARS.map(({ key, label }, i) => {
        const value = breakdown[key];
        const col = scoreColor(value);
        return (
          <div key={key}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-medium font-body" style={{ color: 'var(--text-secondary)' }}>{label}</span>
              <span className={`font-mono text-xs font-bold tabular-nums ${col.text}`}>{value}</span>
            </div>
            <div className="h-1.5 w-full rounded-full" style={{ background: '#E5E5E5' }}>
              <motion.div
                className={`h-full rounded-full ${col.bg}`}
                initial={{ width: 0 }}
                animate={{ width: mounted ? `${value}%` : '0%' }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
