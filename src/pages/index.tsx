import React, { useEffect, useState, useCallback, Suspense, ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store';
import { fetchCoins, fetchMarketChart, fetchTopMarketCaps, setCurrency } from '@/store/cryptoSlice';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import {
  selectCoins,
  selectLoadingCoins,
  selectErrorCoins,
  selectTopMarketCaps,
  selectLoadingTopCaps,
  selectCurrency,
} from '@/store/selectors';
import { Tabs } from '@/components/Tabs';
import { CoinSelector, CurrencySelector } from '@/components/CoinSelector';
import { fetchCryptoData } from '@/utils/fetchData';
import { CoinData } from '@/types/chartTypes';
import { DashboardHeader } from '@/components/DashboardHeader';

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

// Debounce utility
function debounce<F extends (...args: any[]) => void>(func: F, wait: number) {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<F>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default function Home({ initialCoins = [] }: { initialCoins?: CoinData[] }): ReactElement {
  const dispatch = useDispatch<AppDispatch>();
  const coins = useSelector(selectCoins);
  const loadingCoins = useSelector(selectLoadingCoins);
  const errorCoins = useSelector(selectErrorCoins);
  const topMarketCaps = useSelector(selectTopMarketCaps);
  const loadingTopCaps = useSelector(selectLoadingTopCaps);
  const currency = useSelector(selectCurrency);

  const [selectedCoin, setSelectedCoin] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('line');
  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 20;
  const [apiError, setApiError] = useState<string | null>(null);

  // Calculate total number of pages once to avoid repeated calculations
  const totalPages = Math.ceil(coins.length / itemsPerPage);

  // Debounced dispatchers
  const debouncedFetchCoins = debounce(() => dispatch(fetchCoins()).catch(handleApiError), 300);
  const debouncedFetchMarketChart = debounce((coinId: string) => dispatch(fetchMarketChart({ coinId })).catch(handleApiError), 300);
  const debouncedFetchTopMarketCaps = debounce(() => dispatch(fetchTopMarketCaps()).catch(handleApiError), 300);

  function handleApiError(error: any) {
    if (error && error.message && error.message.includes('429')) {
      setApiError('You are making requests too quickly. Please wait a moment and try again.');
    } else if (error && error.message) {
      setApiError(error.message);
    } else {
      setApiError('An unexpected error occurred.');
    }
  }

  // Hydrate Redux store with initialCoins if present
  useEffect(() => {
    if (initialCoins.length > 0 && coins.length === 0) {
      dispatch({ type: 'crypto/fetchCoins/fulfilled', payload: initialCoins });
    }
  }, [initialCoins, coins.length, dispatch]);

  useEffect(() => {
    if (coins.length === 0 && initialCoins.length === 0) {
      debouncedFetchCoins();
    } else if (!selectedCoin && coins.length > 0) {
      setSelectedCoin(coins[0].id);
    }
  }, [coins, selectedCoin, dispatch, currency, initialCoins.length]);

  useEffect(() => {
    if (activeTab === 'radar' && topMarketCaps.length === 0 && !loadingTopCaps) {
      debouncedFetchTopMarketCaps();
    }
  }, [activeTab, topMarketCaps.length, loadingTopCaps, dispatch, currency]);

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

  const handleCurrencyChange = useCallback((currency: string) => {
    dispatch(setCurrency(currency));
  }, [dispatch]);

  const paginatedCoins = coins.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <main className="font-sans p-4 sm:p-8 max-w-6xl mx-auto min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <DashboardHeader
        title="Crypto Dashboard"
        subtitle="Visualize cryptocurrency prices, volumes, and market share with interactive charts."
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* Loading and error states for coins */}
      {loadingCoins && <p>Loading coins...</p>}
      {errorCoins && <p className="text-red-600">Error: {errorCoins}</p>}
      {apiError && <p className="text-red-600 font-semibold">{apiError}</p>}

      {/* Fallback when no coins are available, no loading, no error */}
      {!loadingCoins && !errorCoins && coins.length === 0 && (
        <p>No coins available at the moment.</p>
      )}

      {/* Main content: coin selector, pagination, tabs, and charts */}
      {!loadingCoins && !errorCoins && coins.length > 0 && selectedCoin && (
        <>
          {/* Currency selector */}
          <div className="mb-4 w-full sm:w-64">
            <CurrencySelector value={currency} onChange={handleCurrencyChange} />
          </div>

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

// Add getServerSideProps for SSR
export async function getServerSideProps() {
  try {
    const initialCoins = await fetchCryptoData('usd');
    return { props: { initialCoins } };
  } catch {
    return { props: { initialCoins: [] } };
  }
}