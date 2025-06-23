import { CoinData } from '@/types';

export async function fetchCryptoData(): Promise<CoinData[]> {
  const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false';
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch crypto data');
  }
  const data: CoinData[] = await response.json();
  return data;
}