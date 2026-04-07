'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface ResultNavProps {
  onStartOver: () => void;
  onCopyAll: () => void;
}

export function ResultNav({ onStartOver, onCopyAll }: ResultNavProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    onCopyAll();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.header
      className="mb-10 flex items-center justify-between"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <button
        onClick={onStartOver}
        className="flex items-center gap-1.5 text-sm text-[#475569] hover:text-[#F8FAFC] transition-colors duration-200 cursor-pointer group font-body"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15" height="15"
          viewBox="0 0 24 24"
          fill="none" stroke="currentColor"
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          className="group-hover:-translate-x-0.5 transition-transform duration-200"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Start over
      </button>

      <span className="font-heading font-bold text-xl text-[#F8FAFC]">
        Resume<span className="text-gradient-fire">Cremator</span>
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className="hidden md:inline-flex gap-1.5 text-xs"
      >
        {copied ? (
          <>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="text-[#22C55E]">Copied!</span>
          </>
        ) : (
          'Copy all tips'
        )}
      </Button>
    </motion.header>
  );
}
