import { NextRequest, NextResponse } from 'next/server';
import { parsePdf } from '@/lib/pdf';
import { checkRateLimit } from '@/lib/rate-limiter';
import { env } from '@/lib/env';
const NO_STORE_HEADERS = { 'Cache-Control': 'no-store' } as const;

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    '127.0.0.1'
  );
}

function hasPdfSignature(buffer: Buffer): boolean {
  return buffer.subarray(0, 5).toString('utf8') === '%PDF-';
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
      { status: 429, headers: NO_STORE_HEADERS }
    );
  }

  // ── Parse & validate upload ───────────────────────────────
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data.' }, { status: 400, headers: NO_STORE_HEADERS });
  }

  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided.' }, { status: 400, headers: NO_STORE_HEADERS });
  }

  if (file.type !== 'application/pdf') {
    return NextResponse.json(
      { error: 'Invalid file type. Only PDF files are accepted.' },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  const maxBytes = env.maxPdfMb() * 1024 * 1024;
  if (file.size > maxBytes) {
    return NextResponse.json(
      { error: `File size exceeds the ${env.maxPdfMb()} MB limit.` },
      { status: 413, headers: NO_STORE_HEADERS }
    );
  }

  // ── Extract text ──────────────────────────────────────────
  let text: string;
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    if (!hasPdfSignature(buffer)) {
      return NextResponse.json(
        { error: 'Invalid PDF file signature.' },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    text = await parsePdf(buffer);
  } catch (err: unknown) {
    console.error('[parse-pdf] Extraction failed:', err);
    return NextResponse.json(
      { error: 'Failed to extract text from the PDF. Ensure the file is not encrypted or image-only.' },
      { status: 422, headers: NO_STORE_HEADERS }
    );
  }

  const minChars = env.minResumeChars();
  const maxChars = env.maxResumeChars();

  if (!text || text.trim().length < minChars) {
    return NextResponse.json(
      { error: `Extracted text is too short. At least ${minChars} characters are required.` },
      { status: 422, headers: NO_STORE_HEADERS }
    );
  }

  return NextResponse.json({ text: text.slice(0, maxChars) }, { headers: NO_STORE_HEADERS });
}
