import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { rateLimit } from '@/utils/rateLimiter';
import { z } from 'zod';  // Импортираме zod

/**
 * Schema validation for coinId query param.
 * coinId must be a nonempty string matching allowed chars (e.g. alphanumeric and dashes)
 */
const querySchema = z.object({
  coinId: z.string().regex(/^[a-z0-9-]+$/i).optional(), // Optional coinId with allowed chars
});

/**
 * API route handler that proxies requests to the CoinGecko API,
 * with rate limiting and input validation to prevent abuse.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Rate limiting check
  if (!rateLimit(req)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  // Validate and sanitize query parameters
  const parseResult = querySchema.safeParse(req.query);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Invalid query parameters', details: parseResult.error.errors });
  }
  const { coinId } = parseResult.data;

  try {
    // Build API URL based on validated coinId presence
    const url = coinId
      ? `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=30`
      : 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false';

    const response = await axios.get(url);

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch crypto data', details: error });
  }
}