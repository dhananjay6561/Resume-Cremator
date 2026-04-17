'use client';

import { motion, type Variants } from 'framer-motion';

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

export function LandingHeader() {
  return (
    <motion.header className="mb-10 text-center" variants={container} initial="hidden" animate="show">
      <motion.div variants={item} className="flex justify-center mb-5">
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide font-heading"
          style={{ background: 'var(--steel-light)', color: 'var(--steel)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block" style={{ background: 'var(--steel)' }} />
          AI-Powered ATS Scanner
        </span>
      </motion.div>

      <motion.h1
        variants={item}
        className="font-heading font-bold tracking-tight leading-[1.15] mb-4"
        style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--text-primary)' }}
      >
        Your resume is probably terrible.
      </motion.h1>

      <motion.p
        variants={item}
        className="font-body text-base md:text-lg max-w-[400px] mx-auto leading-relaxed"
        style={{ color: 'var(--text-secondary)' }}
      >
        Find out exactly why. Get roasted. Get hired.
      </motion.p>
    </motion.header>
  );
}
