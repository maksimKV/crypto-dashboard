import { CoinData } from '@/types/chartTypes';

// Helper to validate URLs (allow only http(s) and safe relative URLs)
export function isValidUrl(url: string): boolean {
  try {
    // Disallow dangerous protocols
    if (/^(javascript:|data:|vbscript:|file:)/i.test(url)) return false;
    // Allow only safe relative URLs (must start with / and not //)
    if (url.startsWith('/') && !url.startsWith('//')) return true;
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Generic fetch utility for API calls with error handling and input validation.
 */
export async function fetchApiData<T>(url: string, errorMsg: string): Promise<T> {
  if (!isValidUrl(url)) {
    throw new Error('Invalid URL provided to fetchApiData');
  }
  if (typeof errorMsg !== 'string' || errorMsg.trim().length === 0) {
    throw new Error('Invalid error message provided to fetchApiData');
  }
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