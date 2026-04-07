import { NextRequest, NextResponse } from 'next/server';
import { analyzeRequestSchema } from '@/lib/validators';
import { getGeminiModel } from '@/lib/gemini';
import { buildAnalysisPrompt, getSystemInstruction } from '@/lib/prompts';
import { checkRateLimit } from '@/lib/rate-limiter';
import { env } from '@/lib/env';
import { hashResumeText, getCachedResult, setCachedResult } from '@/lib/result-cache';

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
    const prompt = `${getSystemInstruction()}\n\n${buildAnalysisPrompt(resumeText)}`;
    const geminiStream = await getGeminiModel().generateContentStream(prompt);

    let accumulated = '';
    for await (const chunk of geminiStream.stream) {
      accumulated += chunk.text();
    }

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
    console.error('[analyze] Unexpected error:', err);
    return NextResponse.json(
      { error: 'An unexpected server error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
