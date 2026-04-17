'use client';

import * as React from "react";
import { motion } from "framer-motion";

interface InputToggleProps {
  value: 'text' | 'pdf';
  onChange: (value: 'text' | 'pdf') => void;
}

export function InputToggle({ value, onChange }: InputToggleProps) {
  return (
    <div className="flex p-1 gap-1 rounded-full w-full max-w-[280px] mx-auto mb-7 relative" style={{ background: 'var(--navy-900)', border: '1px solid var(--border-default)' }}>
      {(['text', 'pdf'] as const).map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => onChange(type)}
          className={`relative flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 cursor-pointer z-10`}
          style={{ color: value === type ? 'var(--text-primary)' : 'var(--text-muted)' }}
        >
          {value === type && (
            <motion.span
              layoutId="toggle-pill"
              className="absolute inset-0 rounded-full shadow-sm z-[-1]"
              style={{ background: 'var(--navy-700)', border: '1px solid var(--border-default)' }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          {type === 'text' ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              Paste Text
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Upload PDF
            </>
          )}
        </button>
      ))}
    </div>
  );
}
