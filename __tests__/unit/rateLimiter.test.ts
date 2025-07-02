import requestIp from 'request-ip';

jest.mock('request-ip');

// Mock Redis for unit tests
jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    multi: () => ({
      incr: jest.fn(),
      pexpire: jest.fn(),
      exec: jest.fn().mockResolvedValue([[null, 1]]),
    }),
    on: jest.fn(),
    quit: jest.fn(),
  }));
});

describe('rateLimit', () => {
  let now = 1000000;
  const mockGetClientIp = requestIp.getClientIp as jest.Mock;
  const mockReq = {} as any;

  beforeEach(() => {
    // Reset mocks and time before each test to ensure isolation
    jest.clearAllMocks();
    jest.resetModules();
    now = 1000000;
    jest.spyOn(Date, 'now').mockImplementation(() => now);
  });

  afterEach(() => {
    // Restore Date.now after each test
    jest.restoreAllMocks();
  });

  it('allows the first request from a new IP', async () => {
    // Should allow the very first request from a new IP
    mockGetClientIp.mockReturnValue('1.2.3.4');
    const { rateLimit } = require('../../src/utils/rateLimiter');
    await expect(rateLimit(mockReq)).resolves.toBe(true);
  });

  it('allows up to 60 requests within the window', async () => {
    // Should allow up to the maximum allowed requests per window
    mockGetClientIp.mockReturnValue('5.6.7.8');
    const { rateLimit } = require('../../src/utils/rateLimiter');
    for (let i = 0; i < 60; i++) {
      await expect(rateLimit(mockReq)).resolves.toBe(true);
    }
  });

  it('blocks the 61st request within the window', async () => {
    // Should block requests that exceed the limit within the time window
    mockGetClientIp.mockReturnValue('9.8.7.6');
    const { rateLimit } = require('../../src/utils/rateLimiter');
    for (let i = 0; i < 60; i++) {
      await expect(rateLimit(mockReq)).resolves.toBe(true);
    }
    await expect(rateLimit(mockReq)).resolves.toBe(false);
  });

  it('resets the count after the window passes', async () => {
    // Should reset the request count after the time window has passed
    mockGetClientIp.mockReturnValue('2.2.2.2');
    const { rateLimit } = require('../../src/utils/rateLimiter');
    for (let i = 0; i < 60; i++) {
      await expect(rateLimit(mockReq)).resolves.toBe(true);
    }
    await expect(rateLimit(mockReq)).resolves.toBe(false);
    // Advance time past the window (60s)
    now += 60 * 1000 + 1;
    await expect(rateLimit(mockReq)).resolves.toBe(true);
  });

  it('tracks requests separately for different IPs', async () => {
    // Requests from different IPs should not interfere with each other's limits
    const { rateLimit } = require('../../src/utils/rateLimiter');
    mockGetClientIp.mockReturnValue('1.1.1.1');
    await expect(rateLimit(mockReq)).resolves.toBe(true);
    mockGetClientIp.mockReturnValue('2.2.2.2');
    await expect(rateLimit(mockReq)).resolves.toBe(true);
    mockGetClientIp.mockReturnValue('1.1.1.1');
    await expect(rateLimit(mockReq)).resolves.toBe(true);
  });

  it('uses "unknown" if getClientIp returns null', async () => {
    // Should use the fallback "unknown" key if no IP is found
    const { rateLimit } = require('../../src/utils/rateLimiter');
    mockGetClientIp.mockReturnValue(null);
    await expect(rateLimit(mockReq)).resolves.toBe(true);
    await expect(rateLimit(mockReq)).resolves.toBe(true);
  });

  it('uses Redis if REDIS_URL is set', async () => {
    process.env.REDIS_URL = 'redis://localhost:6379';
    const { rateLimit } = require('../../src/utils/rateLimiter');
    mockGetClientIp.mockReturnValue('3.3.3.3');
    // Should resolve true for first request (mocked Redis always returns 1)
    await expect(rateLimit(mockReq)).resolves.toBe(true);
    delete process.env.REDIS_URL;
  });

  it('handles Redis throwing an error gracefully', async () => {
    process.env.REDIS_URL = 'redis://localhost:6379';
    const { rateLimit } = require('../../src/utils/rateLimiter');
    mockGetClientIp.mockReturnValue('4.4.4.4');
    // Mock Redis to throw and ensure fallback to in-memory
    jest.doMock('ioredis', () => {
      return jest.fn().mockImplementation(() => { throw new Error('Redis error'); });
    });
    const { rateLimit: rateLimitWithRedisError } = require('../../src/utils/rateLimiter');
    await expect(rateLimitWithRedisError(mockReq)).resolves.toBe(true); // Should fallback to in-memory
    delete process.env.REDIS_URL;
    jest.resetModules();
  });

  it('handles malformed request object', async () => {
    // Should not throw if request is malformed
    const { rateLimit } = require('../../src/utils/rateLimiter');
    mockGetClientIp.mockReturnValue('5.5.5.5');
    const badReq = null;
    await expect(rateLimit(badReq as any)).resolves.toBe(true);
  });

  it('handles missing REDIS_URL env variable', async () => {
    // Should use in-memory fallback if REDIS_URL is not set
    delete process.env.REDIS_URL;
    const { rateLimit } = require('../../src/utils/rateLimiter');
    mockGetClientIp.mockReturnValue('6.6.6.6');
    await expect(rateLimit(mockReq)).resolves.toBe(true);
  });
});