import { NextRequest, NextResponse } from 'next/server';
import { analyzeRequestSchema } from '@/lib/validators';
import { getGeminiModel } from '@/lib/gemini';
import { buildAnalysisPrompt } from '@/lib/prompts';
import { checkRateLimit } from '@/lib/rate-limiter';
import { env } from '@/lib/env';
import { hashResumeText, getCachedResult, setCachedResult } from '@/lib/result-cache';

const MAX_GEMINI_RETRIES_PER_MODEL = 2;
const BASE_BACKOFF_MS = 600;

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    '127.0.0.1'
  );
}

function stripMarkdownFences(raw: string): string {
  return raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getGeminiStatusCode(err: unknown): number | null {
  if (!err || typeof err !== 'object') return null;

  const maybeStatus = (err as { status?: unknown }).status;
  if (typeof maybeStatus === 'number') return maybeStatus;

  const message = (err as { message?: unknown }).message;
  if (typeof message !== 'string') return null;

  const match = message.match(/\[(\d{3})\s+/);
  return match ? Number(match[1]) : null;
}

function isRetryableGeminiError(err: unknown): boolean {
  const status = getGeminiStatusCode(err);
  return status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
}

async function generateWithRetry(prompt: string): Promise<string> {
  const modelCandidates = [env.geminiModel(), ...env.geminiFallbackModels()];
  const uniqueModelCandidates = [...new Set(modelCandidates)];
  let lastError: unknown;

  for (const modelName of uniqueModelCandidates) {
    for (let attempt = 1; attempt <= MAX_GEMINI_RETRIES_PER_MODEL; attempt += 1) {
      try {
        const geminiStream = await getGeminiModel(modelName).generateContentStream(prompt);
        let accumulated = '';
        for await (const chunk of geminiStream.stream) {
          accumulated += chunk.text();
        }
        return accumulated;
      } catch (err: unknown) {
        lastError = err;

        if (!isRetryableGeminiError(err)) {
          throw err;
        }

        if (attempt < MAX_GEMINI_RETRIES_PER_MODEL) {
          const delay = BASE_BACKOFF_MS * 2 ** (attempt - 1);
          await sleep(delay);
        }
      }
    }
  }

  throw lastError;
}

export async function POST(req: NextRequest) {
  // ── Rate limit ────────────────────────────────────────────
  const { allowed } = checkRateLimit(getClientIp(req), {
    limit: env.rateLimitPerMinute(),
    windowMs: 60 * 1000,
  });
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a minute and try again.' },
      { status: 429 }
    );
  }

  // ── Content-Type guard ────────────────────────────────────
  if (!req.headers.get('content-type')?.includes('application/json')) {
    return NextResponse.json({ error: 'Content-Type must be application/json.' }, { status: 415 });
  }

  // ── Parse & validate body ─────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const parseResult = analyzeRequestSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json({ error: parseResult.error.issues[0].message }, { status: 400 });
  }

  const { resumeText } = parseResult.data;

  // ── Cache check — skip Gemini entirely on a hit ───────────
  const cacheKey = hashResumeText(resumeText);
  const cached = getCachedResult(cacheKey);
  if (cached) {
    return NextResponse.json(cached, { headers: { 'X-Cache': 'HIT' } });
  }

  // ── Call Gemini (streaming internally) ────────────────────
  // generateContentStream keeps the connection alive during long generations,
  // preventing gateway timeouts on Vercel/serverless. We accumulate server-side
  // and return a single JSON response so the client stays simple.
  try {
    const prompt = buildAnalysisPrompt(resumeText);
    const accumulated = await generateWithRetry(prompt);

    const jsonString = stripMarkdownFences(accumulated);

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonString);
    } catch {
      console.error('[analyze] Failed to parse Gemini JSON:', jsonString);
      return NextResponse.json(
        { error: 'AI returned an unexpected format. Please try again.' },
        { status: 502 }
      );
    }

    // Non-resume signal
    if (
      parsed !== null &&
      typeof parsed === 'object' &&
      'error' in parsed &&
      (parsed as Record<string, unknown>).error === 'not_a_resume'
    ) {
      const msg = (parsed as Record<string, unknown>).message;
      return NextResponse.json(
        { error: typeof msg === 'string' ? msg : 'The submitted text does not appear to be a resume.' },
        { status: 422 }
      );
    }

    // Store in cache before responding
    setCachedResult(cacheKey, parsed);

    return NextResponse.json(parsed, { headers: { 'X-Cache': 'MISS' } });
  } catch (err: unknown) {
    if (isRetryableGeminiError(err)) {
      console.warn('[analyze] Gemini temporarily unavailable after retries/fallback:', err);
      return NextResponse.json(
        {
          error:
            'The AI service is temporarily busy. Please try again in a few seconds.',
        },
        { status: 503 }
      );
    }

    console.error('[analyze] Unexpected error:', err);

    return NextResponse.json(
      { error: 'An unexpected server error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
