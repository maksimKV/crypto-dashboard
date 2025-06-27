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

// Lazy load chart components with proper TypeScript typing
const CryptoLineChart = React.lazy(() =>
  import('@/components/CryptoLineChart').then(module => ({
    default: module.CryptoLineChart,
  }))
);

const CryptoBarChart = React.lazy(() =>
  import('@/components/CryptoBarChart').then(module => ({
    default: module.CryptoBarChart,
  }))
);

const CryptoPieChart = React.lazy(() =>
  import('@/components/CryptoPieChart').then(module => ({
    default: module.CryptoPieChart,
  }))
);

const CryptoRadarChart = React.lazy(() =>
  import('@/components/CryptoRadarChart').then(module => ({
    default: module.CryptoRadarChart,
  }))
);

const tabs = [
  { name: 'Line Chart', key: 'line' },
  { name: 'Bar Chart', key: 'bar' },
  { name: 'Pie Chart', key: 'pie' },
  { name: 'Radar Chart', key: 'radar' },
];

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
  const itemsPerPage = 20;

  // Calculate total number of pages once to avoid repeated calculations
  const totalPages = Math.ceil(coins.length / itemsPerPage);

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

  const handleCoinChange = useCallback((coinId: string) => {
    setSelectedCoin(coinId);
  }, []);

  const handleTabChange = useCallback((key: string) => {
    setActiveTab(key);
  }, []);

  const handleNextPage = useCallback(() => {
    if (page < totalPages) {
      setPage(p => p + 1);
    }
  }, [page, totalPages]);

  const handlePrevPage = useCallback(() => {
    if (page > 1) {
      setPage(p => p - 1);
    }
  }, [page]);

  const paginatedCoins = coins.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Crypto Dashboard</h1>

      {/* Loading and error states for coins */}
      {loadingCoins && <p>Loading coins...</p>}
      {errorCoins && <p className="text-red-600">Error: {errorCoins}</p>}

      {/* Fallback when no coins are available, no loading, no error */}
      {!loadingCoins && !errorCoins && coins.length === 0 && (
        <p>No coins available at the moment.</p>
      )}

      {/* Main content: coin selector, pagination, tabs, and charts */}
      {!loadingCoins && !errorCoins && coins.length > 0 && selectedCoin && (
        <>
          {/* Combined coin selector and pagination */}
          {(activeTab === 'line' || activeTab === 'bar') && (
            <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="w-full sm:w-auto">
                  {/* CoinSelector with internal pagination hidden, external pagination used */}
                  <CoinSelector
                    coins={paginatedCoins}
                    selectedCoinId={selectedCoin}
                    onChange={handleCoinChange}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Previous page"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={page >= totalPages}
                    className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Next page"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Chart tabs */}
          <Tabs tabs={tabs} activeKey={activeTab} onChange={handleTabChange} />

          {/* Chart container */}
          <div className="bg-white p-6 shadow rounded-lg border border-gray-200 mt-4">
            <ErrorBoundary>
              <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading chart...</div>}>
                {activeTab === 'line' && <CryptoLineChart coinId={selectedCoin} />}
                {activeTab === 'bar' && <CryptoBarChart coinId={selectedCoin} />}
                {activeTab === 'pie' && <CryptoPieChart />}
                {activeTab === 'radar' &&
                  (loadingTopCaps ? (
                    <div className="h-64 flex items-center justify-center">Loading radar data...</div>
                  ) : (
                    <CryptoRadarChart />
                  ))}
              </Suspense>
            </ErrorBoundary>
          </div>
        </>
      )}
    </main>
  );
}