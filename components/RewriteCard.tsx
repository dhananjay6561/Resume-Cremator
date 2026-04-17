'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Rewrite } from '@/types/analysis';

interface RewriteCardProps {
  rewrite: Rewrite;
  index: number;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={handle}
      className="flex-shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer select-none font-heading"
      style={copied
        ? { background: 'rgba(34,197,94,0.1)', borderColor: 'rgba(34,197,94,0.3)', color: '#22c55e' }
        : { background: 'rgba(255,255,255,0.04)', borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }
      }
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  );
}

export function RewriteCard({ rewrite, index }: RewriteCardProps) {
  const [whyOpen, setWhyOpen] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
      className="rounded-xl overflow-hidden border"
      style={{ borderColor: 'var(--border-default)', background: 'var(--navy-800)' }}
    >
      {/* Before */}
      <div className="px-4 pt-4 pb-3 border-b" style={{ borderColor: 'rgba(255,59,48,0.15)', background: 'rgba(255,59,48,0.04)' }}>
        <span className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 font-mono" style={{ color: '#ff3b30' }}>BEFORE</span>
        <p className="text-sm leading-relaxed line-through font-body" style={{ color: 'var(--text-muted)' }}>{rewrite.original}</p>
      </div>

      {/* After */}
      <div className="px-4 pt-3 pb-3 border-b" style={{ borderColor: 'rgba(34,197,94,0.15)', background: 'rgba(34,197,94,0.04)' }}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 font-mono" style={{ color: '#22c55e' }}>AFTER</span>
            <p className="text-sm font-semibold leading-relaxed font-body" style={{ color: 'var(--text-primary)' }}>{rewrite.rewritten}</p>
          </div>
          <CopyButton text={rewrite.rewritten} />
        </div>
      </div>

      {/* Why toggle */}
      <button
        onClick={() => setWhyOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-4 py-2.5 text-xs cursor-pointer hover:opacity-80 transition-opacity"
        style={{ color: 'var(--text-muted)' }}
      >
        <motion.span animate={{ rotate: whyOpen ? 90 : 0 }} transition={{ duration: 0.18 }} className="inline-block">▶</motion.span>
        Why this works
      </button>
      <AnimatePresence>
        {whyOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <p className="px-4 pb-3 text-xs leading-relaxed font-body" style={{ color: 'var(--text-secondary)' }}>{rewrite.reason}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
