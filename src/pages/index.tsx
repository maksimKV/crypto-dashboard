import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store';
import { fetchCoins, fetchTopMarketCaps } from '@/store/cryptoSlice';
import { CryptoLineChart } from '@/components/CryptoLineChart';
import { CryptoBarChart } from '@/components/CryptoBarChart';
import { CryptoPieChart } from '@/components/CryptoPieChart';
import { CryptoRadarChart } from '@/components/CryptoRadarChart';
import { ErrorBoundary } from '@/components/ErrorBoundary';

import {
  selectCoins,
  selectLoadingCoins,
  selectErrorCoins,
  selectTopMarketCaps,
  selectLoadingTopCaps,
} from '@/store/selectors';

const tabs = [
  { name: 'Line Chart', key: 'line' },
  { name: 'Bar Chart', key: 'bar' },
  { name: 'Pie Chart', key: 'pie' },
  { name: 'Radar Chart', key: 'radar' },
];

const ITEMS_PER_PAGE = 20;

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const coins = useSelector(selectCoins);
  const loadingCoins = useSelector(selectLoadingCoins);
  const errorCoins = useSelector(selectErrorCoins);
  const topMarketCaps = useSelector(selectTopMarketCaps);
  const loadingTopCaps = useSelector(selectLoadingTopCaps);

  const [selectedCoin, setSelectedCoin] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('line');
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    if (coins.length === 0) {
      dispatch(fetchCoins());
    } else if (!selectedCoin) {
      setSelectedCoin(coins[0].id);
    }
  }, [coins, selectedCoin, dispatch]);

  useEffect(() => {
    if (activeTab === 'radar' && topMarketCaps.length === 0 && !loadingTopCaps) {
      dispatch(fetchTopMarketCaps());
    }
  }, [activeTab, topMarketCaps.length, loadingTopCaps, dispatch]);

  // Пагинирани монети
  const paginatedCoins = coins.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleCoinChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCoin(e.target.value);
  }, []);

  const handleTabChange = useCallback((key: string) => {
    setActiveTab(key);
  }, []);

  const handleNextPage = () => {
    if (page * ITEMS_PER_PAGE < coins.length) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Crypto Dashboard</h1>

      {loadingCoins && <p>Зареждане на монети...</p>}
      {errorCoins && <p className="text-red-600">Грешка: {errorCoins}</p>}

      {!loadingCoins && !errorCoins && coins.length > 0 && selectedCoin && (
        <>
          <select
            className="mb-2 p-2 border rounded"
            value={selectedCoin}
            onChange={handleCoinChange}
          >
            {paginatedCoins.map(coin => (
              <option key={coin.id} value={coin.id}>
                {coin.name}
              </option>
            ))}
          </select>

          <div className="mb-4 flex gap-2 items-center">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Предишна страница
            </button>
            <span>Страница {page} от {Math.ceil(coins.length / ITEMS_PER_PAGE)}</span>
            <button
              onClick={handleNextPage}
              disabled={page * ITEMS_PER_PAGE >= coins.length}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Следваща страница
            </button>
          </div>

          <nav className="flex gap-4 mb-6">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`px-4 py-2 border rounded ${
                  activeTab === tab.key ? 'bg-blue-600 text-white' : 'bg-gray-100'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>

          <div className="bg-white p-4 shadow rounded">
            <ErrorBoundary>
              {activeTab === 'line' && <CryptoLineChart coinId={selectedCoin} />}
            </ErrorBoundary>

            <ErrorBoundary>
              {activeTab === 'bar' && <CryptoBarChart coinId={selectedCoin} />}
            </ErrorBoundary>

            <ErrorBoundary>
              {activeTab === 'pie' && <CryptoPieChart />}
            </ErrorBoundary>

            <ErrorBoundary>
              {activeTab === 'radar' &&
                (loadingTopCaps ? <p>Зареждане на данни за Radar Chart...</p> : <CryptoRadarChart />)}
            </ErrorBoundary>
          </div>
        </>
      )}
    </main>
  );
}