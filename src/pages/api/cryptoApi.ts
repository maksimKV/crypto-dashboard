import { NextApiRequest, NextApiResponse } from 'next';
import { CoinData, MarketChartData } from '@/types/chartTypes';
import { LRUCache } from 'lru-cache';
import { CACHE_TTL } from '@/utils/cacheUtils';

// Base URL for CoinGecko API endpoints
const BASE_URL = 'https://api.coingecko.com/api/v3';

// LRU cache for API responses
const apiCache = new LRUCache<string, object>({ max: 100, ttl: CACHE_TTL });

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
  const supported = [
    'usd','eur','gbp','jpy','aud','cad','chf','sek','nzd','mxn','sgd','hkd','btc','eth','bnb','idr','inr','rub','zar','try','brl','pln','thb','krw','myr','twd','dkk','czk','huf','ils','clp','php','aed','sar','vnd','ngn','uah','cop','pen','ars','isk','ron','hrk'
  ];
  const priceChangeParam = supported.includes(currency.toLowerCase()) ? '&price_change_percentage=24h,7d' : '';
  const url = `${BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=5&page=1${priceChangeParam}`;
  return await fetchWithCache<CoinData[]>(url);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { coinId, currency = 'usd', topMarketCaps } = req.query;
  try {
    if (topMarketCaps) {
      const data = await getTopMarketCaps(currency as string);
      return res.status(200).json(data);
    }
    if (coinId) {
      const data = await getMarketChart(coinId as string, currency as string);
      return res.status(200).json(data);
    }
    // Default: get coins
    const data = await getCoins(currency as string);
    return res.status(200).json(data);
  } catch (error: unknown) {
    let message = 'Internal server error';
    if (typeof error === 'object' && error && 'message' in error && typeof (error as { message?: unknown }).message === 'string') {
      message = (error as { message: string }).message;
    }
    return res.status(500).json({ error: message });
  }
}