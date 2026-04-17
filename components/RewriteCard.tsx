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
      className="flex-shrink-0 inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md border transition-colors duration-150 cursor-pointer select-none font-heading"
      style={copied
        ? { background: 'var(--green-light)', borderColor: 'rgba(21,128,61,0.2)', color: 'var(--green)' }
        : { background: 'transparent', borderColor: 'var(--border-medium)', color: 'var(--text-muted)' }
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: 'easeOut' }}
      className="rounded-xl overflow-hidden"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
    >
      {/* Before */}
      <div className="px-4 pt-4 pb-3 border-b" style={{ borderColor: 'var(--border)', background: 'var(--red-light)' }}>
        <span className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 font-mono" style={{ color: 'var(--red)' }}>BEFORE</span>
        <p className="text-sm leading-relaxed line-through font-body" style={{ color: 'var(--text-muted)' }}>{rewrite.original}</p>
      </div>

      {/* After */}
      <div className="px-4 pt-3 pb-3 border-b" style={{ borderColor: 'var(--border)', background: 'var(--green-light)' }}>
        <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 font-mono" style={{ color: 'var(--green)' }}>AFTER</span>
            <p className="text-sm font-medium leading-relaxed font-body" style={{ color: 'var(--text-primary)' }}>{rewrite.rewritten}</p>
          </div>
          <CopyButton text={rewrite.rewritten} />
        </div>
      </div>

      {/* Why toggle */}
      <button
        onClick={() => setWhyOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-4 py-2.5 text-xs cursor-pointer hover:bg-slate-50 transition-colors duration-150"
        style={{ color: 'var(--text-muted)' }}
      >
        <motion.span
          animate={{ rotate: whyOpen ? 90 : 0 }}
          transition={{ duration: 0.16 }}
          className="inline-block text-[8px]"
        >
          ▶
        </motion.span>
        Why this works
      </button>
      <AnimatePresence>
        {whyOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="px-4 pb-3.5 text-xs leading-relaxed font-body border-t" style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)', paddingTop: '0.625rem', background: '#FAFAFA' }}>
              {rewrite.reason}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
