/**
 * Client-safe environment variables (NEXT_PUBLIC_ prefix).
 * Safe to import in both client components and server code.
 *
 * These are inlined at build time by Next.js — do NOT put secrets here.
 */
export const clientEnv = {
  /** Minimum resume characters — used for client-side form validation */
  minResumeChars: parseInt(process.env.NEXT_PUBLIC_MIN_RESUME_CHARS ?? '200', 10),

  /** Maximum resume characters — used for client-side form validation */
  maxResumeChars: parseInt(process.env.NEXT_PUBLIC_MAX_RESUME_CHARS ?? '12000', 10),

  /** Max PDF upload size in MB — used for client-side file validation */
  maxPdfMb: parseFloat(process.env.NEXT_PUBLIC_MAX_PDF_MB ?? '5'),

  /** Display name of the app */
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? 'ResumeCremator',
} as const;
