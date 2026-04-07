'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface ResultFooterProps {
  onStartOver: () => void;
  onCopyAll: () => void;
}

export function ResultFooter({ onStartOver, onCopyAll }: ResultFooterProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    onCopyAll();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className="md:hidden fixed bottom-0 left-0 right-0 px-4 py-3 bg-[#0F172A]/90 backdrop-blur-md border-t border-[#334155] flex gap-3 z-10"
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.5, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Button variant="outline" onClick={onStartOver} className="flex-1 text-sm">
        Start over
      </Button>
      <Button variant="default" onClick={handleCopy} className="flex-1 text-sm">
        {copied ? 'Copied!' : 'Copy all tips'}
      </Button>
    </motion.div>
  );
}
