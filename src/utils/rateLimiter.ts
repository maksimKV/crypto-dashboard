import { NextApiRequest } from 'next';
import requestIp from 'request-ip';
import Redis from 'ioredis';
import { LRUCache } from 'lru-cache';
import { z } from 'zod';

const rateLimitWindowMs = 60 * 1000; // 1 minute
const maxRequestsPerWindow = 60;

// Validate REDIS_URL using zod
const envSchema = z.object({
  REDIS_URL: z.string().url().optional(),
});
const parsedEnv = envSchema.safeParse(process.env);
const redisUrl = parsedEnv.success ? parsedEnv.data.REDIS_URL : undefined;

let redis: Redis | null = null;
if (redisUrl) {
  redis = new Redis(redisUrl);
}

// In-memory fallback
const rateLimiterCache = new LRUCache<string, { count: number; timestamp: number }>({
  max: 500,
});

/**
 * Distributed rate limiter using Redis. Falls back to in-memory for local/dev.
 * Returns true if request is allowed, false if rate limited.
 */
export async function rateLimit(req: NextApiRequest): Promise<boolean> {
  const ip = requestIp.getClientIp(req) || 'unknown';
  const now = Date.now();

  if (redis) {
    const key = `ratelimit:${ip}`;
    const tx = redis.multi();
    tx.incr(key);
    tx.pexpire(key, rateLimitWindowMs);
    const [count] = await tx.exec().then(results => [Number(results?.[0][1])]);
    return count <= maxRequestsPerWindow;
  } else {
    // In-memory fallback
    const entry = rateLimiterCache.get(ip);
    if (!entry) {
      rateLimiterCache.set(ip, { count: 1, timestamp: now });
      return true;
    }
    const elapsed = now - entry.timestamp;
    if (elapsed > rateLimitWindowMs) {
      rateLimiterCache.set(ip, { count: 1, timestamp: now });
      return true;
    }
    if (entry.count >= maxRequestsPerWindow) {
      return false;
    }
    entry.count++;
    rateLimiterCache.set(ip, entry);
    return true;
  }
}