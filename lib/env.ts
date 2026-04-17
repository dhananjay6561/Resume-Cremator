import 'server-only';

/**
 * Single source of truth for ALL server-side environment variables.
 * Every access goes through here — no raw process.env calls in app code.
 *
 * Each getter throws at call-time (request time) with a clear message if
 * the variable is missing, so misconfigured deployments fail loudly.
 */

function require(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Required environment variable "${key}" is not set.`);
  return value;
}

function optionalInt(key: string, fallback: number): number {
  const raw = process.env[key];
  if (!raw) return fallback;
  const parsed = parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function optionalFloat(key: string, fallback: number): number {
  const raw = process.env[key];
  if (!raw) return fallback;
  const parsed = parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const env = {
  // ── AI ────────────────────────────────────────────────────
  /** Google AI Studio API key — required */
  geminiApiKey: () => require('GEMINI_API_KEY'),

  /** Gemini model to use — optional, defaults to gemini-2.5-flash */
  geminiModel: () => process.env.GEMINI_MODEL ?? 'gemini-2.5-flash',

  /** Optional system instruction override — prompt is now hardcoded in lib/prompts.ts */
  geminiSystemInstruction: () =>
    (process.env.GEMINI_SYSTEM_INSTRUCTION ?? '').replace(/\\n/g, '\n'),

  // ── Rate limiting ─────────────────────────────────────────
  /** Max requests per IP per minute across all API routes */
  rateLimitPerMinute: () => optionalInt('RATE_LIMIT_PER_MINUTE', 10),

  // ── Upload / text constraints ─────────────────────────────
  /** Max PDF upload size in megabytes */
  maxPdfMb: () => optionalFloat('MAX_PDF_MB', 5),

  /** Minimum resume text length in characters (server validation) */
  minResumeChars: () => optionalInt('MIN_RESUME_CHARS', 200),

  /** Maximum resume text length in characters (server validation) */
  maxResumeChars: () => optionalInt('MAX_RESUME_CHARS', 12000),
} as const;
