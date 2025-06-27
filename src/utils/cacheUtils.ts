// Cache time-to-live: 15 minutes in milliseconds
export const CACHE_TTL = 15 * 60 * 1000;

// Utility function to check if cached data is still valid based on timestamp
export function isCacheValid(timestamp: number) {
  return Date.now() - timestamp < CACHE_TTL;
}

type ErrorWithMessage = { message: string };

function hasMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message?: unknown }).message === 'string'
  );
}

export function getErrorMessage(error: unknown, fallback = 'Unknown error'): string {
  if (typeof error === 'string') return error;
  if (hasMessage(error)) {
    return error.message;
  }
  return fallback;
}

/**
 * Returns the currency symbol or code for a given currency string.
 * @param currency - The currency code (e.g., 'usd', 'eur', etc.)
 * @returns The currency symbol or code.
 */
export function getCurrencyLabel(currency: string): string {
  switch (currency) {
    case 'usd': return '$';
    case 'eur': return '€';
    case 'bgn': return 'лв';
    case 'chf': return 'Fr.';
    case 'aed': return 'د.إ';
    case 'sar': return 'ر.س';
    case 'gbp': return '£';
    default: return currency ? currency.toUpperCase() : '';
  }
} 