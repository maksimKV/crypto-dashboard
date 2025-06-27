import { LRUCache } from 'lru-cache';
import { NextApiRequest } from 'next';
import requestIp from 'request-ip';

const rateLimitWindowMs = 60 * 1000; // Time window for rate limiting (1 minute)
const maxRequestsPerWindow = 10;     // Max allowed requests per IP per time window

// Initialize an LRU cache to track requests per IP
const rateLimiterCache = new LRUCache<string, { count: number; timestamp: number }>({
  max: 500, // Maximum number of IP entries in the cache
});

export function rateLimit(req: NextApiRequest): boolean {
  // Use request-ip to extract client IP securely
  const ip = requestIp.getClientIp(req) || 'unknown';

  const now = Date.now();
  const entry = rateLimiterCache.get(ip);

  // If no entry for this IP, initialize count and timestamp
  if (!entry) {
    rateLimiterCache.set(ip, { count: 1, timestamp: now });
    return true; // Allow request
  }

  // Calculate elapsed time since first request in current window
  const elapsed = now - entry.timestamp;

  // If time window has passed, reset count and timestamp
  if (elapsed > rateLimitWindowMs) {
    rateLimiterCache.set(ip, { count: 1, timestamp: now });
    return true; // Allow request
  }

  // If max requests exceeded in current window, reject request
  if (entry.count >= maxRequestsPerWindow) {
    return false; // Deny request
  }

  // Otherwise, increment request count and update cache
  entry.count++;
  rateLimiterCache.set(ip, entry);
  return true; // Allow request
}