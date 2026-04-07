'use client';

import { motion } from 'framer-motion';

export function LandingFooter() {
  return (
    <motion.footer
      className="mt-14 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.5 }}
    >
      <div className="flex items-center justify-center gap-2 mb-2">
        <div className="h-px w-12 bg-[#334155]" />
        <p className="text-xs text-[#475569] font-medium tracking-wide">
          Powered by Gemini 2.5 Flash
        </p>
        <div className="h-px w-12 bg-[#334155]" />
      </div>
      <p className="text-xs text-[#334155]">
        Your resume is never stored. Results vanish when you close the tab.
      </p>
    </motion.footer>
  );
}
