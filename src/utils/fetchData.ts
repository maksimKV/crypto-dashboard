import { CoinData } from '@/types/chartTypes';

/**
 * Fetches cryptocurrency market data from the CoinGecko API.
 * 
 * @returns {Promise<CoinData[]>} - A promise that resolves to an array of CoinData objects.
 * 
 * Fetches top 10 cryptocurrencies by market cap in USD.
 * Throws an error if the network request fails.
 */
export async function fetchCryptoData(currency: string = 'usd'): Promise<CoinData[]> {
  const url = `/api/cryptoApi?currency=${currency}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch crypto data');
  }
  const data: CoinData[] = await response.json();
  return data;
}