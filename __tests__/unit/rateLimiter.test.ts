import { rateLimit } from '../../src/utils/rateLimiter';
import requestIp from 'request-ip';

jest.mock('request-ip');

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

  it('allows the first request from a new IP', () => {
    // Should allow the very first request from a new IP
    mockGetClientIp.mockReturnValue('1.2.3.4');
    expect(rateLimit(mockReq)).toBe(true);
  });

  it('allows up to 10 requests within the window', () => {
    // Should allow up to the maximum allowed requests per window
    mockGetClientIp.mockReturnValue('5.6.7.8');
    for (let i = 0; i < 10; i++) {
      expect(rateLimit(mockReq)).toBe(true);
    }
  });

  it('blocks the 11th request within the window', () => {
    // Should block requests that exceed the limit within the time window
    mockGetClientIp.mockReturnValue('9.8.7.6');
    for (let i = 0; i < 10; i++) {
      expect(rateLimit(mockReq)).toBe(true);
    }
    expect(rateLimit(mockReq)).toBe(false);
  });

  it('resets the count after the window passes', () => {
    // Should reset the request count after the time window has passed
    mockGetClientIp.mockReturnValue('2.2.2.2');
    for (let i = 0; i < 10; i++) {
      expect(rateLimit(mockReq)).toBe(true);
    }
    expect(rateLimit(mockReq)).toBe(false);
    // Advance time past the window (60s)
    now += 60 * 1000 + 1;
    expect(rateLimit(mockReq)).toBe(true);
  });

  it('tracks requests separately for different IPs', () => {
    // Requests from different IPs should not interfere with each other's limits
    mockGetClientIp.mockReturnValue('1.1.1.1');
    expect(rateLimit(mockReq)).toBe(true);
    mockGetClientIp.mockReturnValue('2.2.2.2');
    expect(rateLimit(mockReq)).toBe(true);
    mockGetClientIp.mockReturnValue('1.1.1.1');
    expect(rateLimit(mockReq)).toBe(true);
  });

  it('uses "unknown" if getClientIp returns null', () => {
    // Should use the fallback "unknown" key if no IP is found
    mockGetClientIp.mockReturnValue(null);
    expect(rateLimit(mockReq)).toBe(true);
    expect(rateLimit(mockReq)).toBe(true);
  });
});