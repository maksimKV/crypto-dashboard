import { CoinData } from '@/types/chartTypes';

/**
 * Fetches cryptocurrency market data from the CoinGecko API.
 * 
 * @returns {Promise<CoinData[]>} - A promise that resolves to an array of CoinData objects.
 * 
 * Fetches top 10 cryptocurrencies by market cap in USD.
 * Throws an error if the network request fails.
 */
export async function fetchCryptoData(): Promise<CoinData[]> {
  // API endpoint to get top 10 coins by market cap in USD, no sparkline data
  const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false';
  
  // Perform the network request
  const response = await fetch(url);
  
  // Check if response is successful (status in the range 200-299)
  if (!response.ok) {
    // Throw an error to be handled by caller
    throw new Error('Failed to fetch crypto data');
  }
  
  // Parse the JSON response body into CoinData[]
  const data: CoinData[] = await response.json();
  
  // Return the parsed data
  return data;
}