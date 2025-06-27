import { fetchHistoricalData } from '@/utils/fetchHistoricalData';

// Mock the global fetch function before each test to isolate network calls
beforeEach(() => {
  global.fetch = jest.fn();
});

// Reset all mocks after each test to avoid test pollution
afterEach(() => {
  jest.resetAllMocks();
});

describe('fetchHistoricalData', () => {
  it('should fetch historical data and return the result when response is ok', async () => {
    // Arrange: Set up fetch to return a successful response with mock data
    const mockData = { prices: [[1, 100]], market_caps: [[1, 200]], total_volumes: [[1, 300]] };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });

    // Act: Call the function with specific coinId and currency
    const result = await fetchHistoricalData('bitcoin', 'usd');

    // Assert: fetch should be called with the correct URL and return the mock data
    expect(global.fetch).toHaveBeenCalledWith('/api/cryptoApi?coinId=bitcoin&currency=usd');
    expect(result).toEqual(mockData);
  });

  it('should throw an error if response is not ok', async () => {
    // Arrange: Set up fetch to return a failed response (ok: false)
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: jest.fn(),
    });

    // Act & Assert: The function should throw an error when response.ok is false
    await expect(fetchHistoricalData('bitcoin', 'usd')).rejects.toThrow('Failed to fetch historical data');
  });

  it('should use default currency if not provided', async () => {
    // Arrange: Set up fetch to return a successful response
    const mockData = { prices: [[1, 100]] };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });

    // Act: Call the function without specifying currency (should default to 'usd')
    await fetchHistoricalData('ethereum');

    // Assert: fetch should be called with the default currency in the URL
    expect(global.fetch).toHaveBeenCalledWith('/api/cryptoApi?coinId=ethereum&currency=usd');
  });
});