import React, { ReactElement } from 'react';

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
}: CoinSelectorProps): ReactElement {
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