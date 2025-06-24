import React, { useEffect, useState, useCallback, Suspense, ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store';
import { fetchCoins, fetchTopMarketCaps } from '@/store/cryptoSlice';
import { ErrorBoundary } from '@/components/ErrorBoundary';

import {
  selectCoins,
  selectLoadingCoins,
  selectErrorCoins,
  selectTopMarketCaps,
  selectLoadingTopCaps,
} from '@/store/selectors';

import { Tabs } from '@/components/Tabs';
import { CoinSelector } from '@/components/CoinSelector';

const CryptoLineChart = React.lazy(() => import('@/components/CryptoLineChart').then(mod => ({ default: mod.CryptoLineChart })));
const CryptoBarChart = React.lazy(() => import('@/components/CryptoBarChart').then(mod => ({ default: mod.CryptoBarChart })));
const CryptoPieChart = React.lazy(() => import('@/components/CryptoPieChart').then(mod => ({ default: mod.CryptoPieChart })));
const CryptoRadarChart = React.lazy(() => import('@/components/CryptoRadarChart').then(mod => ({ default: mod.CryptoRadarChart })));

const tabs = [
  { name: 'Line Chart', key: 'line' },
  { name: 'Bar Chart', key: 'bar' },
  { name: 'Pie Chart', key: 'pie' },
  { name: 'Radar Chart', key: 'radar' },
];

const ITEMS_PER_PAGE = 20;

export default function Home(): ReactElement {
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
    } else if (!selectedCoin && coins.length > 0) {
      setSelectedCoin(coins[0].id);
    }
  }, [coins, selectedCoin, dispatch]);

  useEffect(() => {
    if (activeTab === 'radar' && topMarketCaps.length === 0 && !loadingTopCaps) {
      dispatch(fetchTopMarketCaps());
    }
  }, [activeTab, topMarketCaps.length, loadingTopCaps, dispatch]);

  const paginatedCoins = coins.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleCoinChange = useCallback((coinId: string) => {
    setSelectedCoin(coinId);
  }, []);

  const handleTabChange = useCallback((key: string) => {
    setActiveTab(key);
  }, []);

  const handleNextPage = useCallback(() => {
    if (page * ITEMS_PER_PAGE < coins.length) {
      setPage(page + 1);
    }
  }, [page, coins.length]);

  const handlePrevPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Crypto Dashboard</h1>

      {loadingCoins && <p>Зареждане на монети...</p>}
      {errorCoins && <p className="text-red-600">Грешка: {errorCoins}</p>}

      {!loadingCoins && !errorCoins && coins.length > 0 && selectedCoin && (
        <>
          <CoinSelector coins={paginatedCoins} selectedCoinId={selectedCoin} onChange={handleCoinChange} itemsPerPage={ITEMS_PER_PAGE} />

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

          <Tabs tabs={tabs} activeKey={activeTab} onChange={handleTabChange} />

          <div className="bg-white p-4 shadow rounded min-h-[300px]">
            <ErrorBoundary>
              <Suspense fallback={<p>Зареждане на график...</p>}>
                {activeTab === 'line' && <CryptoLineChart coinId={selectedCoin} />}
                {activeTab === 'bar' && <CryptoBarChart coinId={selectedCoin} />}
                {activeTab === 'pie' && <CryptoPieChart />}
                {activeTab === 'radar' && (loadingTopCaps ? <p>Зареждане на данни за Radar Chart...</p> : <CryptoRadarChart />)}
              </Suspense>
            </ErrorBoundary>
          </div>
        </>
      )}
    </main>
  );
}