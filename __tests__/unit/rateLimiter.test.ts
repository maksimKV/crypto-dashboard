import { rateLimit } from '../../src/utils/rateLimiter';
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
    await expect(rateLimit(mockReq)).resolves.toBe(true);
  });

  it('allows up to 10 requests within the window', async () => {
    // Should allow up to the maximum allowed requests per window
    mockGetClientIp.mockReturnValue('5.6.7.8');
    for (let i = 0; i < 10; i++) {
      await expect(rateLimit(mockReq)).resolves.toBe(true);
    }
  });

  it('blocks the 11th request within the window', async () => {
    // Should block requests that exceed the limit within the time window
    mockGetClientIp.mockReturnValue('9.8.7.6');
    for (let i = 0; i < 10; i++) {
      await expect(rateLimit(mockReq)).resolves.toBe(true);
    }
    await expect(rateLimit(mockReq)).resolves.toBe(false);
  });

  it('resets the count after the window passes', async () => {
    // Should reset the request count after the time window has passed
    mockGetClientIp.mockReturnValue('2.2.2.2');
    for (let i = 0; i < 10; i++) {
      await expect(rateLimit(mockReq)).resolves.toBe(true);
    }
    await expect(rateLimit(mockReq)).resolves.toBe(false);
    // Advance time past the window (60s)
    now += 60 * 1000 + 1;
    await expect(rateLimit(mockReq)).resolves.toBe(true);
  });

  it('tracks requests separately for different IPs', async () => {
    // Requests from different IPs should not interfere with each other's limits
    mockGetClientIp.mockReturnValue('1.1.1.1');
    await expect(rateLimit(mockReq)).resolves.toBe(true);
    mockGetClientIp.mockReturnValue('2.2.2.2');
    await expect(rateLimit(mockReq)).resolves.toBe(true);
    mockGetClientIp.mockReturnValue('1.1.1.1');
    await expect(rateLimit(mockReq)).resolves.toBe(true);
  });

  it('uses "unknown" if getClientIp returns null', async () => {
    // Should use the fallback "unknown" key if no IP is found
    mockGetClientIp.mockReturnValue(null);
    await expect(rateLimit(mockReq)).resolves.toBe(true);
    await expect(rateLimit(mockReq)).resolves.toBe(true);
  });

  it('uses Redis if REDIS_URL is set', async () => {
    process.env.REDIS_URL = 'redis://localhost:6379';
    mockGetClientIp.mockReturnValue('3.3.3.3');
    // Should resolve true for first request (mocked Redis always returns 1)
    await expect(rateLimit(mockReq)).resolves.toBe(true);
    delete process.env.REDIS_URL;
  });
});