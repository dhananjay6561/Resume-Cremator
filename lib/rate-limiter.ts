import 'server-only';
import { env } from '@/lib/env';

interface RateLimitRecord {
  count: number;
  expiresAt: number;
}

const store = new Map<string, RateLimitRecord>();

// Purge expired entries every 5 minutes — prevents unbounded map growth
const PURGE_INTERVAL_MS = 5 * 60 * 1000;
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of store) {
    if (now > record.expiresAt) store.delete(key);
  }
}, PURGE_INTERVAL_MS).unref(); // .unref() so this timer doesn't keep the process alive

export interface RateLimitOptions {
  /** Max requests allowed within the window */
  limit: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

function buildKey(key: string): string {
  return `resume-cremator:rate-limit:${key}`;
}

async function checkRemoteRateLimit(
  key: string,
  options: RateLimitOptions
): Promise<{ allowed: boolean } | null> {
  const url = env.upstashRedisRestUrl();
  const token = env.upstashRedisRestToken();

  if (!url || !token) return null;

  const redisKey = buildKey(key);

  try {
    const response = await fetch(`${url}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', redisKey],
        ['PEXPIRE', redisKey, options.windowMs, 'NX'],
      ]),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Upstash rate limit request failed with ${response.status}`);
    }

    const data = (await response.json()) as Array<{ result?: unknown }>;
    const currentCount = Number(data?.[0]?.result);

    if (!Number.isFinite(currentCount)) return null;
    return { allowed: currentCount <= options.limit };
  } catch (error) {
    console.error('[rate-limit] Remote rate limit check failed:', error);
    return null;
  }
}

/**
 * Checks whether the given key (typically an IP address) has exceeded the
 * rate limit. Mutates internal state to record the hit.
 *
 * Returns `{ allowed: true }` if the request may proceed,
 * or `{ allowed: false }` if the limit has been exceeded.
 */
function checkLocalRateLimit(key: string, options: RateLimitOptions): { allowed: boolean } {
  const { limit, windowMs } = options;
  const now = Date.now();
  const record = store.get(key);

  if (!record || now > record.expiresAt) {
    store.set(key, { count: 1, expiresAt: now + windowMs });
    return { allowed: true };
  }

  if (record.count >= limit) {
    return { allowed: false };
  }

  record.count++;
  return { allowed: true };
}

export async function checkRateLimit(
  key: string,
  options: RateLimitOptions
): Promise<{ allowed: boolean }> {
  const remoteResult = await checkRemoteRateLimit(key, options);
  if (remoteResult) return remoteResult;

  return checkLocalRateLimit(key, options);
}
