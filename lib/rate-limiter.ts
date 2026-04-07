import 'server-only';

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

/**
 * Checks whether the given key (typically an IP address) has exceeded the
 * rate limit. Mutates internal state to record the hit.
 *
 * Returns `{ allowed: true }` if the request may proceed,
 * or `{ allowed: false }` if the limit has been exceeded.
 */
export function checkRateLimit(key: string, options: RateLimitOptions): { allowed: boolean } {
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
