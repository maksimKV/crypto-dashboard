import { CoinData } from '@/types/chartTypes';

/**
 * Generic fetch utility for API calls with error handling.
 */
export async function fetchApiData<T>(url: string, errorMsg: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(errorMsg);
  }
  return await response.json();
}

/**
 * fetchApiData is a generic utility for making API requests with error handling.
 * @param url - The API endpoint to fetch
 * @param errorMsg - The error message to throw if the request fails
 * @returns The parsed JSON response
 */

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
  return fetchApiData<CoinData[]>(url, 'Failed to fetch crypto data');
}