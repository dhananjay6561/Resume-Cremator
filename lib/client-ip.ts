import type { NextRequest } from 'next/server';

function firstForwardedIp(value: string | null): string | null {
  if (!value) return null;

  const candidate = value.split(',')[0]?.trim();
  return candidate || null;
}

export function getClientIp(req: NextRequest): string {
  return (
    firstForwardedIp(req.headers.get('x-vercel-forwarded-for')) ??
    firstForwardedIp(req.headers.get('x-real-ip')) ??
    firstForwardedIp(req.headers.get('x-forwarded-for')) ??
    '127.0.0.1'
  );
}
