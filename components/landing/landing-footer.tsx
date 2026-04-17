'use client';

import { motion } from 'framer-motion';

export function LandingFooter() {
  return (
    <motion.footer
      className="mt-12 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7, duration: 0.4 }}
    >
      <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
        Powered by Gemini 2.5 Flash &middot; Results are never stored
      </p>
    </motion.footer>
  );
}
