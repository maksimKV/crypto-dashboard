import React, { useState, useMemo, ReactElement } from 'react';

interface Coin {
  id: string;
  name: string;
}

interface CoinSelectorProps {
  coins: Coin[];
  selectedCoinId: string;
  onChange: (coinId: string) => void;
  itemsPerPage?: number;
}

// CoinSelector component with pagination support
export function CoinSelector({
  coins,
  selectedCoinId,
  onChange,
  itemsPerPage = 20,
}: CoinSelectorProps): ReactElement {
  // Current page state
  const [page, setPage] = useState<number>(1);

  // Total number of pages calculated from coins count
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
    <div className="mb-4">
      <select
        className="mb-2 p-2 border rounded w-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={selectedCoinId}
        onChange={e => onChange(e.target.value)}
      >
        {paginatedCoins.map(coin => (
          <option key={coin.id} value={coin.id}>
            {coin.name}
          </option>
        ))}
      </select>

      <div className="flex justify-center items-center gap-2">
        <button
          onClick={handlePrevPage}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50 bg-gray-100 hover:bg-gray-200"
          type="button"
        >
          Previous
        </button>
        <span className="text-sm">
          Page {page} of {pageCount}
        </span>
        <button
          onClick={handleNextPage}
          disabled={page === pageCount}
          className="px-3 py-1 border rounded disabled:opacity-50 bg-gray-100 hover:bg-gray-200"
          type="button"
        >
          Next
        </button>
      </div>
    </div>
  );
}