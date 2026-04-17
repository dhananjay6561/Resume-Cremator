import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Navbar } from '@/components/Navbar';
import { PageTransition } from '@/components/PageTransition';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  display: 'swap',
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ResumeCremator — Brutally Honest AI Resume Analysis',
  description: 'Get your resume roasted and rewritten by a brutally honest AI recruiter. No sugarcoating.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-body antialiased min-h-screen" style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}>
        <Navbar />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
