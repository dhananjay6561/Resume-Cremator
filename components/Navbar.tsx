'use client';

import Link from 'next/link';

export function Navbar() {
  return (
    <header
      className="sticky top-0 z-30 w-full border-b"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-heading font-bold text-sm tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          Resume<span style={{ color: 'var(--steel)' }}>Cremator</span>
        </Link>
        <Link
          href="/"
          className="text-xs font-semibold px-3 py-1.5 rounded-md border cursor-pointer transition-colors duration-150 hover:bg-slate-50 font-heading"
          style={{ borderColor: 'var(--border-medium)', color: 'var(--text-secondary)' }}
        >
          Scan another
        </Link>
      </div>
    </header>
  );
}
