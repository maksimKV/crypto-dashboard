export async function fetchHistoricalData(coinId: string) {
    const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=30`;
  
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch historical data');
    }
    const data = await response.json();
    return data;
  }