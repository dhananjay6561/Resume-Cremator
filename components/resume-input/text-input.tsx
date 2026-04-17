'use client';

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function TextInput({ value, onChange, error }: TextInputProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const charCount = value.length;
  const MAX = 12000;
  const MIN = 200;

  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 560)}px`;
    }
  }, [value]);

  const countColor =
    charCount > 0 && charCount < MIN
      ? 'var(--red)'
      : charCount >= MAX * 0.9
      ? 'var(--amber)'
      : 'var(--text-muted)';

  return (
    <div className="w-full space-y-2">
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={MAX}
          placeholder="Paste your resume here. Don't be shy — we've seen worse."
          className={`w-full min-h-[280px] resize-none rounded-xl border px-4 py-3.5 text-sm font-body focus:outline-none focus:ring-2 transition-all duration-200 pb-10 leading-relaxed`}
          style={{
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            borderColor: error ? 'var(--red)' : 'var(--border-medium)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            ...(error
              ? { '--tw-ring-color': 'rgba(185,28,28,0.15)' } as React.CSSProperties
              : { '--tw-ring-color': 'rgba(10,102,194,0.15)' } as React.CSSProperties
            ),
          }}
        />
        <div className="absolute bottom-3 right-4 text-[11px] font-mono" style={{ color: countColor }}>
          {charCount.toLocaleString()} / {MAX.toLocaleString()}
        </div>
        {charCount > 0 && charCount < MIN && (
          <div className="absolute bottom-3 left-4 text-[11px] font-medium" style={{ color: 'var(--red)' }}>
            {MIN - charCount} more chars needed
          </div>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-sm font-medium flex items-center gap-1.5"
            style={{ color: 'var(--red)' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
