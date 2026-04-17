'use client';

import Link from 'next/link';

export function Navbar() {
  return (
    <header
      className="sticky top-0 z-30 w-full border-b backdrop-blur-md"
      style={{ borderColor: 'var(--border-subtle)', background: 'rgba(4,13,26,0.85)' }}
    >
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-mono font-bold text-sm tracking-wide" style={{ color: 'var(--text-primary)' }}>
          💀 Resume Cremator
        </Link>
        <Link
          href="/"
          className="text-xs font-semibold px-3 py-1.5 rounded-lg border cursor-pointer transition-opacity hover:opacity-80 font-heading"
          style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
        >
          Scan Another
        </Link>
      </div>
    </header>
  );
}
