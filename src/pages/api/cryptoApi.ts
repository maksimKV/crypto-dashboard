import { CoinData, MarketChartData } from '@/types/chartTypes';

const BASE_URL = 'https://api.coingecko.com/api/v3';

export async function getCoins(): Promise<CoinData[]> {
  const res = await fetch(
    `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&page=1`
  );
  if (!res.ok) throw new Error('Failed to fetch coins');
  return (await res.json()) as CoinData[];
}

export async function getMarketChart(coinId: string): Promise<MarketChartData> {
  if (!coinId) throw new Error('Missing coinId');
  const res = await fetch(
    `${BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=30`
  );
  if (!res.ok) throw new Error(`Failed to fetch market chart for ${coinId}`);
  return (await res.json()) as MarketChartData;
}

export async function getTopMarketCaps(): Promise<CoinData[]> {
  const res = await fetch(
    `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&price_change_percentage=24h,7d`
  );
  if (!res.ok) throw new Error('Failed to fetch top market caps');
  return (await res.json()) as CoinData[];
}