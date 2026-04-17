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

function optionalCsv(key: string): string[] {
  const raw = process.env[key];
  if (!raw) return [];

  return raw
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
}

function optionalString(key: string): string | null {
  const value = process.env[key]?.trim();
  return value ? value : null;
}

export const env = {
  // ── AI ────────────────────────────────────────────────────
  /** Google AI Studio API key — required */
  geminiApiKey: () => require('GEMINI_API_KEY'),

  /** Gemini model to use — optional, defaults to gemini-2.5-flash */
  geminiModel: () => process.env.GEMINI_MODEL ?? 'gemini-2.5-flash',

  /** Optional fallback Gemini models, comma-separated */
  geminiFallbackModels: () => optionalCsv('GEMINI_FALLBACK_MODELS'),

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

  /** Maximum time to spend parsing a PDF before aborting the request */
  pdfParseTimeoutMs: () => optionalInt('PDF_PARSE_TIMEOUT_MS', 10000),

  /** Maximum accepted JSON request size in bytes for analysis requests */
  analyzeMaxBodyBytes: () => optionalInt('ANALYZE_MAX_BODY_BYTES', 32 * 1024),

  /** Optional Upstash Redis REST URL for shared rate limiting */
  upstashRedisRestUrl: () => optionalString('UPSTASH_REDIS_REST_URL'),

  /** Optional Upstash Redis REST token for shared rate limiting */
  upstashRedisRestToken: () => optionalString('UPSTASH_REDIS_REST_TOKEN'),

  /** How long analyzed resume results may stay in the in-memory server cache */
  resultCacheTtlMs: () => optionalInt('RESULT_CACHE_TTL_MS', 30 * 60 * 1000),
} as const;
