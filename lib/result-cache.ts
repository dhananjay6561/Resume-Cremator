import 'server-only';

import { createHash } from 'crypto';
import { ATSResultSchema, type ATSResult } from '@/lib/validators';

interface CacheEntry {
  result: unknown;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();
const TTL_MS     = 60 * 60 * 1000; // 1 hour
const MAX_ENTRIES = 200;            // evict oldest when full (LRU-lite)

// Purge expired entries every 10 minutes — prevents unbounded growth
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of cache) {
    if (now > entry.expiresAt) cache.delete(key);
  }
}, 10 * 60 * 1000).unref();

/** Stable SHA-256 key from resume text */
export function hashResumeText(text: string): string {
  return createHash('sha256').update(text.trim()).digest('hex');
}

export function getCachedResult(hash: string): ATSResult | null {
  const entry = cache.get(hash);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(hash);
    return null;
  }

  const parsed = ATSResultSchema.safeParse(entry.result);
  if (!parsed.success) {
    cache.delete(hash);
    return null;
  }

  return parsed.data;
}

export function setCachedResult(hash: string, result: ATSResult): void {
  // LRU-lite: evict oldest insertion when at capacity
  if (cache.size >= MAX_ENTRIES) {
    const oldest = cache.keys().next().value;
    if (oldest) cache.delete(oldest);
  }
  cache.set(hash, { result, expiresAt: Date.now() + TTL_MS });
}
