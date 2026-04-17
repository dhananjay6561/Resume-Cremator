import { LandingHeader } from '@/components/landing/landing-header';
import { LandingFooter } from '@/components/landing/landing-footer';
import { ResumeForm } from '@/components/resume-input/resume-form';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col" style={{ background: 'var(--bg-page)' }}>
      <div className="max-w-[680px] mx-auto w-full px-4 py-10 sm:px-6 sm:py-14 md:py-20 flex flex-col">
        <LandingHeader />
        <ResumeForm />
        <LandingFooter />
      </div>
    </main>
  );
}
