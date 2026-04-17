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
      style={{ background: 'rgba(4,13,26,0.96)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Scanning line */}
      <div className="absolute inset-x-0 top-0 bottom-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, var(--steel), transparent)' }}
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="relative flex flex-col items-center gap-8 px-6 text-center">
        {/* Pulsing ring */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-full border-2"
            style={{ borderColor: 'var(--steel)' }}
            animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
          />
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,119,181,0.15)', border: '2px solid var(--steel)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--steel)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
        </div>

        {/* Cycling text */}
        <AnimatePresence mode="wait">
          <motion.p
            key={stepKey}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading font-bold text-xl md:text-2xl tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            {STEPS[stepIndex].text}
          </motion.p>
        </AnimatePresence>

        {/* Bouncing dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="bounce-dot w-2 h-2 rounded-full"
              style={{ background: 'var(--steel)', '--delay': `${i * 160}ms` } as React.CSSProperties}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
