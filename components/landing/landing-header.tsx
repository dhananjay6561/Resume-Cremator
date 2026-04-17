'use client';

import { motion, type Variants } from 'framer-motion';

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export function LandingHeader() {
  return (
    <motion.header className="mb-10 text-center" variants={container} initial="hidden" animate="show">
      {/* ATS Scanner badge */}
      <motion.div variants={item} className="flex justify-center mb-6">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border font-mono text-xs font-bold tracking-widest uppercase" style={{ borderColor: 'var(--border-default)', color: 'var(--steel)', background: 'rgba(0,119,181,0.08)' }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block" style={{ background: 'var(--steel)' }} />
          ATS Scanner
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h1 variants={item} className="font-heading font-bold text-5xl md:text-6xl tracking-tight leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
        Your resume is probably terrible.
      </motion.h1>

      {/* Subheadline */}
      <motion.p variants={item} className="font-body text-lg md:text-xl max-w-[440px] mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        Find out exactly why. Get roasted. Get hired.
      </motion.p>
    </motion.header>
  );
}
