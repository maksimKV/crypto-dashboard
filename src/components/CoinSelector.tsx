import React from 'react';

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

interface CurrencyOption {
  code: string;
  label: string;
}

const currencyOptions: CurrencyOption[] = [
  { code: 'usd', label: 'US Dollar (USD)' },
  { code: 'eur', label: 'Euro (EUR)' },
  { code: 'bgn', label: 'Bulgarian Lev (BGN)' },
  { code: 'chf', label: 'Swiss Franc (CHF)' },
  { code: 'aed', label: 'UAE Dirham (AED)' },
  { code: 'sar', label: 'Saudi Riyal (SAR)' },
  { code: 'gbp', label: 'British Pound Sterling (GBP)' },
];

interface CurrencySelectorProps {
  value: string;
  onChange: (currency: string) => void;
}

export function CurrencySelector({ value, onChange }: CurrencySelectorProps): React.ReactElement {
  return (
    <div className="w-full">
      <select
        className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-label="Select currency"
      >
        {currencyOptions.map(option => (
          <option key={option.code} value={option.code}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}