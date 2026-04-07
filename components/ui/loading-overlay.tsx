'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LOADING_STEPS: { title: string; subtitle: string }[] = [
  {
    title: 'Incinerating your resume...',
    subtitle: 'Our brutally honest recruiter is reading every line.',
  },
  {
    title: 'Counting your buzzwords...',
    subtitle: '"Synergized cross-functional deliverables" — really?',
  },
  {
    title: 'Measuring the damage...',
    subtitle: 'Compiling your feedback. Brace yourself.',
  },
];

const SPARKS = [
  { left: '44%', '--drift': '-10px', '--dur': '1.3s',  '--delay': '0s'    },
  { left: '54%', '--drift':  '12px', '--dur': '1.6s',  '--delay': '0.3s'  },
  { left: '36%', '--drift':  '-6px', '--dur': '1.1s',  '--delay': '0.55s' },
  { left: '62%', '--drift':   '8px', '--dur': '1.45s', '--delay': '0.9s'  },
  { left: '49%', '--drift': '-14px', '--dur': '1.25s', '--delay': '1.2s'  },
  { left: '57%', '--drift':   '5px', '--dur': '1.7s',  '--delay': '0.15s' },
];

export function LoadingOverlay() {
  const [step, setStep] = React.useState(0);
  const [stepKey, setStepKey] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => {
      setStep((s) => (s + 1) % LOADING_STEPS.length);
      setStepKey((k) => k + 1);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  const { title, subtitle } = LOADING_STEPS[step];

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-[#0F172A]/95 backdrop-blur-sm flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" aria-hidden="true" />

      <div className="relative flex flex-col items-center gap-8">
        {/* Animated flame */}
        <div className="relative w-28 h-36">
          {SPARKS.map((s, i) => (
            <div
              key={i}
              className="spark absolute bottom-10 w-1.5 h-1.5 rounded-full bg-[#FBBF24]"
              style={s as React.CSSProperties}
            />
          ))}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-8 bg-[#E5451F]/25 blur-2xl rounded-full" />
          <svg viewBox="0 0 60 80" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path
              className="flame-outer"
              d="M30 78 C10 78 4 62 4 50 C4 34 14 23 20 13 C22 24 27 27 27 27 C27 18 30 4 30 4 C30 4 56 30 56 50 C56 64 48 78 30 78Z"
              fill="#E5451F"
            />
            <path
              className="flame-inner"
              d="M30 70 C17 70 13 59 13 50 C13 40 19 33 24 26 C25 35 30 38 30 38 C30 29 33 20 36 14 C42 26 47 40 47 50 C47 61 41 70 30 70Z"
              fill="#F97316"
              opacity="0.8"
            />
            <path
              className="flame-core"
              d="M30 62 C23 62 20 55 20 50 C20 44 25 39 28 34 C29 41 33 44 33 44 C33 37 35 30 37 26 C41 34 40 44 40 50 C40 57 36 62 30 62Z"
              fill="#FDE68A"
              opacity="0.7"
            />
          </svg>
        </div>

        {/* Cycling text */}
        <AnimatePresence mode="wait">
          <motion.div
            key={stepKey}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <p className="font-heading font-bold text-2xl md:text-3xl text-[#F8FAFC] mb-2 tracking-tight">
              {title}
            </p>
            <p className="text-sm font-body text-[#64748B] max-w-[280px] mx-auto leading-relaxed">
              {subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Bouncing dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="bounce-dot w-2.5 h-2.5 rounded-full bg-[#E5451F]"
              style={{ '--delay': `${i * 160}ms` } as React.CSSProperties}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
