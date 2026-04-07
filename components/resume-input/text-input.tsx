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
      ? "text-[#E5451F]"
      : charCount >= MAX * 0.9
      ? "text-[#F97316]"
      : "text-[#475569]";

  return (
    <div className="w-full space-y-2">
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={MAX}
          placeholder="Paste your resume here. Don't be shy — we've seen worse."
          className={`w-full min-h-[300px] resize-none rounded-2xl border bg-[#1E293B] px-5 py-4 text-sm font-body text-[#F8FAFC] placeholder:text-[#334155] focus:outline-none focus:ring-2 transition-all duration-200 pb-10 leading-relaxed ${
            error
              ? 'border-[#E5451F]/60 focus:ring-[#E5451F]/20 focus:border-[#E5451F]'
              : 'border-[#334155] focus:ring-[#E5451F]/20 focus:border-[#475569]'
          }`}
        />
        <div className={`absolute bottom-3 right-4 text-[11px] font-mono ${countColor}`}>
          {charCount.toLocaleString()} / {MAX.toLocaleString()}
        </div>
        {charCount > 0 && charCount < MIN && (
          <div className="absolute bottom-3 left-4 text-[11px] text-[#E5451F] font-medium">
            {MIN - charCount} more chars needed
          </div>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="text-sm text-[#E5451F] font-medium flex items-center gap-1.5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
