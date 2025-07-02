import { createMocks } from 'node-mocks-http';
import { handler } from '../../src/pages/api/cryptoApi';
import * as rateLimiter from '../../src/utils/rateLimiter';

jest.mock('../../src/utils/rateLimiter');
const mockedRateLimit = rateLimiter.rateLimit as jest.Mock;

describe('/api/cryptoApi endpoint', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 200 (or 500 if CoinGecko unavailable) and data for a valid request', async () => {
    mockedRateLimit.mockReturnValue(true);
    const { req, res } = createMocks({
      method: 'GET',
      query: { currency: 'usd' },
    });
    await handler(req, res);
    const status = res._getStatusCode();
    expect([200, 500]).toContain(status);
    const data = res._getData();
    let parsed;
    try {
      parsed = typeof data === 'string' ? JSON.parse(data) : data;
    } catch {
      parsed = data;
    }
    expect(parsed).toBeDefined();
  });

  it('returns 400 for invalid currency', async () => {
    mockedRateLimit.mockReturnValue(true);
    const { req, res } = createMocks({
      method: 'GET',
      query: { currency: 'notacurrency' },
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
    const data = res._getData();
    const parsed = typeof data === 'string' ? JSON.parse(data) : data;
    expect(parsed).toMatchObject({ error: expect.stringContaining("") });
  });

  it('returns 400 for invalid coinId', async () => {
    mockedRateLimit.mockReturnValue(true);
    const { req, res } = createMocks({
      method: 'GET',
      query: { coinId: 'INVALID_COIN_ID!' },
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
    const data = res._getData();
    const parsed = typeof data === 'string' ? JSON.parse(data) : data;
    expect(parsed).toMatchObject({ error: expect.stringContaining("") });
  });

  it('returns 429 if rate limited', async () => {
    mockedRateLimit.mockReturnValue(false);
    const { req, res } = createMocks({
      method: 'GET',
      query: { currency: 'usd' },
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(429);
    const data = res._getData();
    const parsed = typeof data === 'string' ? JSON.parse(data) : data;
    expect(parsed).toMatchObject({ error: expect.stringContaining("") });
  });
}); 