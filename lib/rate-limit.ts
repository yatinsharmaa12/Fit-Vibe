import { getRedisClient } from '@/lib/redis';
import { logWarn } from '@/lib/logger';

type RateLimitOptions = {
  limit: number;
  windowSeconds: number;
  failClosed?: boolean;
};

const memoryLimits = new Map<string, { count: number; resetAt: number }>();

function checkMemoryLimit(key: string, limit: number, windowSeconds: number): boolean {
  const now = Date.now();
  const existing = memoryLimits.get(key);

  if (!existing || existing.resetAt <= now) {
    memoryLimits.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return true;
  }

  existing.count += 1;
  return existing.count <= limit;
}

function pruneMemoryLimits() {
  const now = Date.now();
  for (const [key, value] of memoryLimits.entries()) {
    if (value.resetAt <= now) memoryLimits.delete(key);
  }
}

export async function isRateLimited(
  identifier: string,
  { limit, windowSeconds, failClosed = false }: RateLimitOptions
): Promise<boolean> {
  const bucket = Math.floor(Date.now() / (windowSeconds * 1000));
  const key = `rate:${identifier}:${bucket}`;

  try {
    const client = await getRedisClient();
    const current = await client.incr(key);
    if (current === 1) {
      await client.expire(key, windowSeconds);
    }
    return current > limit;
  } catch (error) {
    logWarn('Rate limiter unavailable', {
      error: error instanceof Error ? error.message : String(error),
      failClosed,
    });

    if (!failClosed) {
      return false;
    }

    pruneMemoryLimits();
    return !checkMemoryLimit(key, limit, windowSeconds);
  }
}
