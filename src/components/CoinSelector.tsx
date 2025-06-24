import React, { useState, useMemo } from 'react';

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

export function CoinSelector({
  coins,
  selectedCoinId,
  onChange,
  itemsPerPage = 20,
}: CoinSelectorProps) {
  const [page, setPage] = useState(1);

  const pageCount = Math.ceil(coins.length / itemsPerPage);

  const paginatedCoins = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return coins.slice(start, start + itemsPerPage);
  }, [coins, page, itemsPerPage]);

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
        >
          Предишна страница
        </button>
        <span>
          Страница {page} от {pageCount}
        </span>
        <button
          onClick={handleNextPage}
          disabled={page === pageCount}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Следваща страница
        </button>
      </div>
    </div>
  );
}