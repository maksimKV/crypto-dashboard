/**
 * Fetches historical market chart data for a specific cryptocurrency from CoinGecko API.
 * 
 * @param {string} coinId - The unique identifier of the cryptocurrency (e.g. 'bitcoin').
 * @returns {Promise<any>} - A promise that resolves to the historical market data.
 * 
 * Requests market data for the last 30 days in USD.
 * Throws an error if the network request fails.
 */
export async function fetchHistoricalData(coinId: string) {
  // Construct the API endpoint URL with the specified coinId and 30 days range
  const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=30`;

  // Perform the network request
  const response = await fetch(url);

  // Check if the response status indicates success
  if (!response.ok) {
    // Throw an error to be handled by the caller
    throw new Error('Failed to fetch historical data');
  }

  // Parse the JSON response body
  const data = await response.json();

  // Return the parsed data
  return data;
}
