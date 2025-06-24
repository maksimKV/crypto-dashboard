import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { rateLimit } from '@/utils/rateLimiter';

/**
 * API route handler that proxies requests to the CoinGecko API,
 * with rate limiting applied to prevent abuse.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check if request exceeds rate limit
  if (!rateLimit(req)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  try {
    // Extract coinId from query parameters
    const { coinId } = req.query;

    // Build API URL based on presence of coinId
    const url = coinId
      ? `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=30`
      : 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false';

    // Fetch data from CoinGecko API
    const response = await axios.get(url);

    // Respond with the fetched data
    res.status(200).json(response.data);
  } catch (error) {
    // Handle errors in fetching data
    res.status(500).json({ error: 'Failed to fetch crypto data', details: error });
  }
}