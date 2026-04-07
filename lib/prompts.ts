import 'server-only';

import { env } from '@/lib/env';

export function getSystemInstruction(): string {
  return env.geminiSystemInstruction();
}

export function buildAnalysisPrompt(resumeText: string): string {
  return env.geminiAnalysisPromptTemplate()
    .replace('{{RESUME_TEXT}}', resumeText)
    .replace('{{MIN_CHARS}}',   String(env.minResumeChars()))
    .replace('{{MAX_CHARS}}',   String(env.maxResumeChars()));
}
