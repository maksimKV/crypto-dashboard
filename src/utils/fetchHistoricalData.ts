/**
 * Fetches historical market chart data for a specific cryptocurrency from CoinGecko API.
 * 
 * @param {string} coinId - The unique identifier of the cryptocurrency (e.g. 'bitcoin').
 * @param {string} currency - The currency to fetch the data in (default: 'usd').
 * @returns {Promise<any>} - A promise that resolves to the historical market data.
 * 
 * Requests market data for the last 30 days in USD.
 * Throws an error if the network request fails.
 */
export async function fetchHistoricalData(coinId: string, currency: string = 'usd') {
  const url = `/api/cryptoApi?coinId=${coinId}&currency=${currency}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch historical data');
  }
  const data = await response.json();
  return data;
}
