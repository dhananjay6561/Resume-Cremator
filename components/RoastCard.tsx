'use client';

import { motion } from 'framer-motion';

interface RoastCardProps {
  roast: string;
  verdict: string;
}

export function RoastCard({ roast, verdict }: RoastCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="mb-6 rounded-2xl overflow-hidden border"
      style={{ borderColor: 'var(--border-default)', background: 'var(--navy-800)' }}
    >
      <div className="w-full h-1" style={{ background: 'linear-gradient(90deg, var(--roast-red), var(--roast-orange), transparent)' }} />
      <div className="px-6 pt-5 pb-6">
        <span className="block font-mono text-5xl leading-none mb-3" style={{ color: 'var(--steel)', opacity: 0.5 }}>&ldquo;</span>
        <p className="font-body text-base md:text-lg leading-relaxed italic mb-4" style={{ color: 'var(--text-primary)' }}>
          {roast}
        </p>
        <p className="text-sm font-body" style={{ color: 'var(--text-muted)' }}>
          {verdict}
        </p>
      </div>
    </motion.div>
  );
}
