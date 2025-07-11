import { fetchApiData } from './fetchData';

/**
 * Fetches historical market chart data for a specific cryptocurrency from CoinGecko API.
 * 
 * @param {string} coinId - The unique identifier of the cryptocurrency (e.g. 'bitcoin').
 * @param {string} currency - The currency to fetch the data in (default: 'usd').
 * @returns {Promise<unknown>} - A promise that resolves to the historical market data.
 * 
 * Requests market data for the last 30 days in USD.
 * Throws an error if the network request fails.
 */
export async function fetchHistoricalData(coinId: string, currency: string = 'usd') {
  const url = `/api/cryptoApi?coinId=${coinId}&currency=${currency}`;
  return fetchApiData(url, 'Failed to fetch historical data');
}
