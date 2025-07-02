import { fetchCryptoData } from '@/utils/fetchData';
import { CoinData } from '@/types/chartTypes';

// Unit tests for fetchCryptoData utility function

describe('fetchCryptoData', () => {
  // Mock CoinData array to simulate API response
  const mockCoinData: CoinData[] = [
    {
      id: 'bitcoin',
      symbol: 'btc',
      name: 'Bitcoin',
      image: 'https://example.com/bitcoin.png',
      current_price: 50000,
      market_cap: 1000000000,
      market_cap_rank: 1,
      total_volume: 50000000,
      high_24h: 51000,
      low_24h: 49000,
      price_change_24h: 1000,
      price_change_percentage_24h: 2,
      circulating_supply: 19000000,
      total_supply: 21000000,
    },
  ];

  // Restore all mocks after each test to avoid test pollution
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('fetches and returns crypto data successfully', async () => {
    // Mock the global fetch function to simulate a successful API response
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockCoinData,
    } as Response);

    // Call the function and check that it returns the expected data
    const data = await fetchCryptoData('usd');
    expect(fetch).toHaveBeenCalledWith('/api/cryptoApi?currency=usd');
    expect(data).toEqual(mockCoinData);
  });

  it('throws an error if fetch response is not ok', async () => {
    // Mock the global fetch function to simulate a failed API response
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({}),
    } as Response);

    // The function should throw an error when response.ok is false
    await expect(fetchCryptoData('usd')).rejects.toThrow('Failed to fetch crypto data');
  });
});

describe('fetchCryptoData input validation', () => {
  it('throws an error if called with an invalid currency that results in an invalid URL', async () => {
    // This should still produce a valid relative URL, so to test fetchApiData directly:
    const { fetchApiData } = await import('@/utils/fetchData');
    await expect(fetchApiData('ftp://malicious.com', 'Error')).rejects.toThrow('Invalid URL provided to fetchApiData');
    await expect(fetchApiData('not-a-url', 'Error')).rejects.toThrow('Invalid URL provided to fetchApiData');
  });

  it('throws an error if errorMsg is empty', async () => {
    const { fetchApiData } = await import('@/utils/fetchData');
    await expect(fetchApiData('/api/cryptoApi?currency=usd', '')).rejects.toThrow('Invalid error message provided to fetchApiData');
    await expect(fetchApiData('/api/cryptoApi?currency=usd', '   ')).rejects.toThrow('Invalid error message provided to fetchApiData');
  });
});