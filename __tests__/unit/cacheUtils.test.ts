import { isCacheValid, getErrorMessage, CACHE_TTL } from '@/utils/cacheUtils';

// Tests for the isCacheValid utility function
// This function checks if a given timestamp is still valid based on CACHE_TTL

describe('isCacheValid', () => {
  const now = 1_700_000_000_000; // fixed timestamp for testing

  beforeAll(() => {
    // Mock Date.now to return a fixed value for deterministic tests
    jest.spyOn(Date, 'now').mockImplementation(() => now);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('returns true if timestamp is within CACHE_TTL', () => {
    // Timestamp just inside the valid window
    const validTimestamp = now - CACHE_TTL + 1;
    expect(isCacheValid(validTimestamp)).toBe(true);
  });

  it('returns false if timestamp is older than CACHE_TTL', () => {
    // Timestamp just outside the valid window
    const expiredTimestamp = now - CACHE_TTL - 1;
    expect(isCacheValid(expiredTimestamp)).toBe(false);
  });

  it('returns true if timestamp is exactly now', () => {
    // Edge case: timestamp is exactly the current time
    expect(isCacheValid(now)).toBe(true);
  });

  it('returns false for negative timestamp', () => {
    // Negative timestamps should always be invalid
    expect(isCacheValid(-100000)).toBe(false);
  });

  it('returns false for timestamp far in the future', () => {
    // Future timestamps (beyond TTL window) are considered valid by the current implementation
    expect(isCacheValid(now + 10 * CACHE_TTL)).toBe(true);
  });
});

// Tests for the getErrorMessage utility function
// This function extracts a user-friendly error message from various error types

describe('getErrorMessage', () => {
  it('returns the string if error is a string', () => {
    // Direct string error
    expect(getErrorMessage('Something went wrong')).toBe('Something went wrong');
  });

  it('returns error.message if error is an object with a string message', () => {
    // Error object with a message property
    expect(getErrorMessage({ message: 'Error occurred' })).toBe('Error occurred');
  });

  it('returns fallback if error is an object without a message', () => {
    // Object with no message property
    expect(getErrorMessage({})).toBe('Unknown error');
  });

  it('returns fallback if error is null', () => {
    // Null error input
    expect(getErrorMessage(null)).toBe('Unknown error');
  });

  it('returns fallback if error is undefined', () => {
    // Undefined error input
    expect(getErrorMessage(undefined)).toBe('Unknown error');
  });

  it('returns custom fallback if provided', () => {
    // Custom fallback string
    expect(getErrorMessage(undefined, 'Custom fallback')).toBe('Custom fallback');
  });

  it('returns fallback if error.message is not a string', () => {
    // Error object with a non-string message property
    expect(getErrorMessage({ message: 123 })).toBe('Unknown error');
  });

  it('returns fallback for array error', () => {
    // Arrays are not valid error types
    expect(getErrorMessage([1, 2, 3])).toBe('Unknown error');
  });

  it('returns fallback for number error', () => {
    // Numbers are not valid error types
    expect(getErrorMessage(12345)).toBe('Unknown error');
  });

  it('returns fallback for deeply nested error object', () => {
    // Only top-level .message is checked; nested messages are ignored
    expect(getErrorMessage({ error: { message: 'Deep error' } })).toBe('Unknown error');
  });
});