import React, { useState, useMemo, ReactElement } from 'react';

interface Coin {
  id: string;
  name: string;
}

interface CoinSelectorProps {
  coins: Coin[];
  selectedCoinId: string;
  onChange: (coinId: string) => void;
  hidePagination?: boolean; // New prop to control built-in pagination visibility
  itemsPerPage?: number;
}

/**
 * CoinSelector component with optional built-in pagination support
 * 
 * @param {Coin[]} coins - Array of coin objects
 * @param {string} selectedCoinId - Currently selected coin ID
 * @param {(coinId: string) => void} onChange - Handler for coin selection change
 * @param {boolean} [hidePagination=false] - Whether to hide built-in pagination controls
 * @param {number} [itemsPerPage=20] - Number of items per page
 * @returns {ReactElement} Coin selector dropdown with optional pagination
 */
export function CoinSelector({
  coins,
  selectedCoinId,
  onChange,
  hidePagination = false,
  itemsPerPage = 20,
}: CoinSelectorProps): ReactElement {
  // Current page state
  const [page, setPage] = useState<number>(1);

  // Calculate total number of pages
  const pageCount = Math.ceil(coins.length / itemsPerPage);

  // Memoize paginated coins slice to avoid unnecessary recalculations
  const paginatedCoins = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return coins.slice(start, start + itemsPerPage);
  }, [coins, page, itemsPerPage]);

  // Handlers for pagination buttons
  const handleNextPage = () => {
    if (page < pageCount) setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <div className="w-full">
      {/* Coin selection dropdown */}
      <select
        className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        value={selectedCoinId}
        onChange={e => onChange(e.target.value)}
      >
        {paginatedCoins.map(coin => (
          <option key={coin.id} value={coin.id}>
            {coin.name}
          </option>
        ))}
      </select>

      {/* Built-in pagination controls (hidden when hidePagination is true) */}
      {!hidePagination && pageCount > 1 && (
        <div className="flex items-center justify-between mt-3 text-sm text-gray-600">
          <span>
            Showing {paginatedCoins.length} of {coins.length} coins
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              &lt;
            </button>
            <span className="px-2">
              {page}/{pageCount}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page === pageCount}
              className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}