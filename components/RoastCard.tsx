'use client';

import { motion } from 'framer-motion';

interface RoastCardProps {
  roast: string;
  verdict: string;
}

export function RoastCard({ roast, verdict }: RoastCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="mb-5 rounded-xl overflow-hidden"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}
    >
      <div className="w-full h-0.5" style={{ background: 'var(--steel)' }} />
      <div className="px-5 pt-4 pb-5">
        <span className="block font-mono text-4xl leading-none mb-2.5" style={{ color: 'var(--steel)', opacity: 0.35 }}>&ldquo;</span>
        <p className="font-body text-base leading-relaxed italic mb-3" style={{ color: 'var(--text-primary)' }}>
          {roast}
        </p>
        <p className="text-xs font-body" style={{ color: 'var(--text-muted)' }}>
          {verdict}
        </p>
      </div>
    </motion.div>
  );
}
