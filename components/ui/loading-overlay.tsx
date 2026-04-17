'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = [
  { text: 'Feeding your resume to the AI...', duration: 800 },
  { text: 'Finding all the red flags...', duration: 1200 },
  { text: 'Calculating how unemployable you are...', duration: 1200 },
  { text: 'Generating your roast...', duration: Infinity },
];

export function LoadingOverlay() {
  const [stepIndex, setStepIndex] = React.useState(0);
  const [stepKey, setStepKey] = React.useState(0);

  React.useEffect(() => {
    let idx = 0;
    function advance() {
      if (idx >= STEPS.length - 1) return;
      const { duration } = STEPS[idx];
      if (duration === Infinity) return;
      setTimeout(() => {
        idx += 1;
        setStepIndex(idx);
        setStepKey((k) => k + 1);
        advance();
      }, duration);
    }
    advance();
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(4px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex flex-col items-center gap-7 px-6 text-center">
        {/* Pulsing ring */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-full border-2"
            style={{ borderColor: 'var(--steel)' }}
            animate={{ scale: [1, 1.5], opacity: [0.4, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
          />
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'var(--steel-light)', border: '2px solid var(--steel)' }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--steel)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
        </div>

        {/* Cycling text */}
        <AnimatePresence mode="wait">
          <motion.p
            key={stepKey}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="font-heading font-semibold text-lg tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            {STEPS[stepIndex].text}
          </motion.p>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="bounce-dot w-1.5 h-1.5 rounded-full"
              style={{ background: 'var(--steel)', '--delay': `${i * 160}ms` } as React.CSSProperties}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
