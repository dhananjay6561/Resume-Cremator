import { z } from 'zod';

/**
 * Resume text constraints — read from NEXT_PUBLIC_ env vars so they are
 * consistent between client-side form validation and server-side enforcement.
 * Defaults are used only if the variables are not set.
 */
const MIN_CHARS = parseInt(process.env.NEXT_PUBLIC_MIN_RESUME_CHARS ?? '200',   10);
const MAX_CHARS = parseInt(process.env.NEXT_PUBLIC_MAX_RESUME_CHARS ?? '12000', 10);

export const analyzeRequestSchema = z.object({
  resumeText: z
    .string()
    .min(MIN_CHARS, `Resume text must be at least ${MIN_CHARS} characters.`)
    .max(MAX_CHARS, `Resume text must not exceed ${MAX_CHARS} characters.`),
});

export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;
