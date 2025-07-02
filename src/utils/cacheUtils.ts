import { CURRENCY_LABELS } from '@/utils/currencies';

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
  if (typeof error === 'string') {
    // Only return if it's a short, single-line string (not a stack trace)
    if (error.length < 200 && !error.includes('\n') && !error.toLowerCase().includes('stack')) {
      return error;
    }
    return fallback;
  }
  if (hasMessage(error)) {
    const msg = error.message;
    if (typeof msg === 'string' && msg.length < 200 && !msg.includes('\n') && !msg.toLowerCase().includes('stack')) {
      return msg;
    }
    return fallback;
  }
  return fallback;
}

/**
 * Returns the currency symbol or code for a given currency string.
 * @param currency - The currency code (e.g., 'usd', 'eur', etc.)
 * @returns The currency symbol or code.
 */
export function getCurrencyLabel(currency: string): string {
  return CURRENCY_LABELS[currency] || (currency ? currency.toUpperCase() : '');
} 