'use client';

import { motion, type Variants } from 'framer-motion';

const FlameIcon = () => (
  <svg viewBox="0 0 60 80" className="w-8 h-10" xmlns="http://www.w3.org/2000/svg">
    <path
      className="flame-outer"
      d="M30 78 C10 78 4 62 4 50 C4 34 14 23 20 13 C22 24 27 27 27 27 C27 18 30 4 30 4 C30 4 56 30 56 50 C56 64 48 78 30 78Z"
      fill="#E5451F"
    />
    <path
      className="flame-inner"
      d="M30 70 C17 70 13 59 13 50 C13 40 19 33 24 26 C25 35 30 38 30 38 C30 29 33 20 36 14 C42 26 47 40 47 50 C47 61 41 70 30 70Z"
      fill="#F97316"
      opacity="0.85"
    />
    <path
      className="flame-core"
      d="M30 62 C23 62 20 55 20 50 C20 44 25 39 28 34 C29 41 33 44 33 44 C33 37 35 30 37 26 C41 34 40 44 40 50 C40 57 36 62 30 62Z"
      fill="#FDE68A"
      opacity="0.75"
    />
  </svg>
);

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export function LandingHeader() {
  return (
    <motion.header
      className="mb-12 text-center"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Badge */}
      <motion.div variants={item} className="flex justify-center mb-6">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#E5451F]/30 bg-[#E5451F]/10 text-[#F97316] text-xs font-semibold tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E5451F] animate-pulse inline-block" />
          AI-Powered Resume Roaster
        </span>
      </motion.div>

      {/* Flame + title */}
      <motion.div variants={item} className="flex items-center justify-center gap-3 mb-4">
        <FlameIcon />
        <h1 className="font-heading font-bold text-6xl md:text-7xl tracking-tight leading-none">
          <span className="text-gradient-white">Resume</span>
          <span className="text-gradient-fire">Cremator</span>
        </h1>
        <FlameIcon />
      </motion.div>

      {/* Subtitle */}
      <motion.p
        variants={item}
        className="font-body text-[#94A3B8] text-lg md:text-xl max-w-[480px] mx-auto leading-relaxed"
      >
        Get your resume roasted and rewritten by a{' '}
        <span className="text-[#F8FAFC] font-medium">brutally honest AI recruiter</span>.
        No sugarcoating. No mercy.
      </motion.p>

      {/* Feature pills */}
      <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-3 mt-6">
        {[
          { icon: '⚡', label: 'ATS Score' },
          { icon: '🔥', label: 'Full Roast' },
          { icon: '✍️', label: 'Instant Rewrites' },
        ].map((pill) => (
          <span
            key={pill.label}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E293B] border border-[#334155] text-[#94A3B8] text-xs font-medium"
          >
            <span>{pill.icon}</span>
            {pill.label}
          </span>
        ))}
      </motion.div>
    </motion.header>
  );
}
