import React from 'react';
import { CURRENCY_OPTIONS } from '@/utils/currencies';

interface Coin {
  id: string;
  name: string;
}

interface CoinSelectorProps {
  coins: Coin[];
  selectedCoinId: string;
  onChange: (coinId: string) => void;
}

/**
 * CoinSelector component (stateless, no pagination)
 * @param {Coin[]} coins - Array of coin objects (already paginated if needed)
 * @param {string} selectedCoinId - Currently selected coin ID
 * @param {(coinId: string) => void} onChange - Handler for coin selection change
 * @returns {ReactElement} Coin selector dropdown
 */
export function CoinSelector({
  coins,
  selectedCoinId,
  onChange,
}: CoinSelectorProps): React.ReactElement {
  return (
    <div className="w-full">
      {/* Coin selection dropdown */}
      <select
        className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        value={selectedCoinId}
        onChange={e => onChange(e.target.value)}
      >
        {coins.map(coin => (
          <option key={coin.id} value={coin.id}>
            {coin.name}
          </option>
        ))}
      </select>
    </div>
  );
}

// --- CurrencySelector ---

interface CurrencySelectorProps {
  value: string;
  onChange: (currency: string) => void;
}

/**
 * CurrencySelector component for selecting a currency.
 * Options are sourced from the shared CURRENCY_OPTIONS utility.
 */
export function CurrencySelector({ value, onChange }: CurrencySelectorProps): React.ReactElement {
  return (
    <div className="w-full relative overflow-hidden rounded-xl border border-gray-300 bg-white">
      <select
        className="w-full p-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-base bg-white appearance-none"
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-label="Select currency"
      >
        {CURRENCY_OPTIONS.map(option => (
          <option key={option.code} value={option.code}>
            {option.label}
          </option>
        ))}
      </select>
      {/* Custom dropdown arrow */}
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}