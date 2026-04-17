'use client';

import Link from 'next/link';

export function Navbar() {
  return (
    <header
      className="sticky top-0 z-30 w-full border-b"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      <div className="max-w-7xl mx-auto h-14 px-4 sm:px-6 flex items-center justify-between gap-3">
        <Link
          href="/"
          className="font-heading font-bold text-sm tracking-tight min-w-0"
          style={{ color: 'var(--text-primary)' }}
        >
          Resume<span style={{ color: 'var(--steel)' }}>Cremator</span>
        </Link>
        <Link
          href="/"
          className="shrink-0 text-[11px] sm:text-xs font-semibold px-2.5 py-1.5 sm:px-3 rounded-md border cursor-pointer transition-colors duration-150 hover:bg-slate-50 font-heading whitespace-nowrap"
          style={{ borderColor: 'var(--border-medium)', color: 'var(--text-secondary)' }}
        >
          Scan another
        </Link>
      </div>
    </header>
  );
}
