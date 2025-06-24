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
        className="mb-2 p-2 border rounded w-full"
        value={selectedCoinId}
        onChange={e => onChange(e.target.value)}
      >
        {paginatedCoins.map(coin => (
          <option key={coin.id} value={coin.id}>
            {coin.name}
          </option>
        ))}
      </select>

      <div className="flex gap-2 items-center justify-center">
        <button
          onClick={handlePrevPage}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
          type="button"
        >
          Previous Page
        </button>
        <span>
          Page {page} of {pageCount}
        </span>
        <button
          onClick={handleNextPage}
          disabled={page === pageCount}
          className="px-3 py-1 border rounded disabled:opacity-50"
          type="button"
        >
          Next Page
        </button>
      </div>
    </div>
  );
}