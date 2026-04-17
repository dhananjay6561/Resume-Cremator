import { LandingHeader } from '@/components/landing/landing-header';
import { LandingFooter } from '@/components/landing/landing-footer';
import { ResumeForm } from '@/components/resume-input/resume-form';

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden" style={{ background: 'var(--navy-950)' }}>
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid grid-fade-mask opacity-30 pointer-events-none" aria-hidden="true" />

      {/* Steel glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(0,119,181,0.08) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[720px] mx-auto w-full px-6 py-12 md:py-20 flex flex-col">
        <LandingHeader />
        <ResumeForm />
        <LandingFooter />
      </div>
    </main>
  );
}
