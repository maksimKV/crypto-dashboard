import { NextApiRequest, NextApiResponse } from 'next';
import { CoinData, MarketChartData } from '@/types/chartTypes';
import { LRUCache } from 'lru-cache';
import { CACHE_TTL, getErrorMessage } from '@/utils/cacheUtils';
import { rateLimit } from '@/utils/rateLimiter';
import { SUPPORTED_CURRENCIES } from '@/utils/currencies';

// Use environment variable for CoinGecko API base URL, fallback to default if not set
const BASE_URL = process.env.COINGECKO_API_BASE_URL || 'https://api.coingecko.com/api/v3';

// LRU cache for API responses
const apiCache = new LRUCache<string, object>({ max: 100, ttl: CACHE_TTL });

// Simple regex for coinId: lowercase letters, numbers, dashes (CoinGecko style)
const COIN_ID_REGEX = /^[a-z0-9-]+$/;

function sanitizeCurrency(input: unknown): string | null {
  if (typeof input !== 'string') return null;
  const value = input.toLowerCase();
  return SUPPORTED_CURRENCIES.includes(value) ? value : null;
}

function sanitizeCoinId(input: unknown): string | null {
  if (typeof input !== 'string') return null;
  if (!input || input.length > 50) return null;
  return COIN_ID_REGEX.test(input) ? input : null;
}

async function fetchWithCache<T extends object>(url: string): Promise<T> {
  const cached = apiCache.get(url);
  if (cached !== undefined) return cached as T;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch: ${url}`);
  const data: T = await res.json();
  apiCache.set(url, data);
  return data;
}

/**
 * Fetches a list of coins ordered by market cap (descending).
 * Returns top 25 coins with market data in USD.
 * 
 * @param {string} currency - The currency to fetch the data in (default: 'usd')
 * @returns {Promise<CoinData[]>} - Promise resolving to an array of coin data
 * @throws Will throw an error if the network request fails
 */
export async function getCoins(currency: string = 'usd'): Promise<CoinData[]> {
  const url = `${BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=25&page=1`;
  return await fetchWithCache<CoinData[]>(url);
}

/**
 * Fetches the market chart data for a specific coin over the past 30 days.
 * 
 * @param {string} coinId - The coin identifier (e.g. 'bitcoin')
 * @param {string} currency - The currency to fetch the data in (default: 'usd')
 * @returns {Promise<MarketChartData>} - Promise resolving to the market chart data
 * @throws Will throw an error if coinId is missing or the network request fails
 */
export async function getMarketChart(coinId: string, currency: string = 'usd'): Promise<MarketChartData> {
  if (!coinId) throw new Error('Missing coinId');
  const url = `${BASE_URL}/coins/${coinId}/market_chart?vs_currency=${currency}&days=30`;
  return await fetchWithCache<MarketChartData>(url);
}

/**
 * Fetches the top 5 coins by market cap including 24h and 7d price change percentages.
 * 
 * @param {string} currency - The currency to fetch the data in (default: 'usd')
 * @returns {Promise<CoinData[]>} - Promise resolving to an array of top coins data
 * @throws Will throw an error if the network request fails
 */
export async function getTopMarketCaps(currency: string = 'usd'): Promise<CoinData[]> {
  const priceChangeParam = SUPPORTED_CURRENCIES.includes(currency.toLowerCase()) ? '&price_change_percentage=24h,7d' : '';
  const url = `${BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=5&page=1${priceChangeParam}`;
  return await fetchWithCache<CoinData[]>(url);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Apply rate limiting
  if (!(await rateLimit(req))) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  const { coinId, currency = 'usd', topMarketCaps } = req.query;

  // Validate and sanitize currency
  const safeCurrency = sanitizeCurrency(currency);
  if (currency && !safeCurrency) {
    return res.status(400).json({ error: 'Invalid currency code.' });
  }

  // Validate and sanitize coinId if present
  let safeCoinId: string | null = null;
  if (coinId !== undefined) {
    safeCoinId = sanitizeCoinId(coinId);
    if (!safeCoinId) {
      return res.status(400).json({ error: 'Invalid coinId.' });
    }
  }

  try {
    if (topMarketCaps) {
      const data = await getTopMarketCaps(safeCurrency || 'usd');
      return res.status(200).json(data);
    }
    if (safeCoinId) {
      const data = await getMarketChart(safeCoinId, safeCurrency || 'usd');
      return res.status(200).json(data);
    }
    // Default: get coins
    const data = await getCoins(safeCurrency || 'usd');
    return res.status(200).json(data);
  } catch (error: unknown) {
    // Log the error for server-side analysis only in development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', error);
    }
    // Use getErrorMessage utility for consistent error extraction
    const message = getErrorMessage(error, 'Internal server error');
    return res.status(500).json({ error: message });
  }
}