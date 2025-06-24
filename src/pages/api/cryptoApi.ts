import { CoinData, MarketChartData } from '@/types/chartTypes';

// Base URL for CoinGecko API endpoints
const BASE_URL = 'https://api.coingecko.com/api/v3';

/**
 * Fetches a list of coins ordered by market cap (descending).
 * Returns top 25 coins with market data in USD.
 * 
 * @returns {Promise<CoinData[]>} - Promise resolving to an array of coin data
 * @throws Will throw an error if the network request fails
 */
export async function getCoins(): Promise<CoinData[]> {
  const res = await fetch(
    `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&page=1`
  );
  if (!res.ok) throw new Error('Failed to fetch coins');
  return (await res.json()) as CoinData[];
}

/**
 * Fetches the market chart data for a specific coin over the past 30 days.
 * 
 * @param {string} coinId - The coin identifier (e.g. 'bitcoin')
 * @returns {Promise<MarketChartData>} - Promise resolving to the market chart data
 * @throws Will throw an error if coinId is missing or the network request fails
 */
export async function getMarketChart(coinId: string): Promise<MarketChartData> {
  if (!coinId) throw new Error('Missing coinId');
  const res = await fetch(
    `${BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=30`
  );
  if (!res.ok) throw new Error(`Failed to fetch market chart for ${coinId}`);
  return (await res.json()) as MarketChartData;
}

/**
 * Fetches the top 5 coins by market cap including 24h and 7d price change percentages.
 * 
 * @returns {Promise<CoinData[]>} - Promise resolving to an array of top coins data
 * @throws Will throw an error if the network request fails
 */
export async function getTopMarketCaps(): Promise<CoinData[]> {
  const res = await fetch(
    `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&price_change_percentage=24h,7d`
  );
  if (!res.ok) throw new Error('Failed to fetch top market caps');
  return (await res.json()) as CoinData[];
}