import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchCoins, fetchTopMarketCaps } from '@/store/cryptoSlice';
import { CryptoLineChart } from '@/components/CryptoLineChart';
import { CryptoBarChart } from '@/components/CryptoBarChart';
import { CryptoPieChart } from '@/components/CryptoPieChart';
import { CryptoRadarChart } from '@/components/CryptoRadarChart';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const tabs = [
  { name: 'Line Chart', key: 'line' },
  { name: 'Bar Chart', key: 'bar' },
  { name: 'Pie Chart', key: 'pie' },
  { name: 'Radar Chart', key: 'radar' },
];

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { coins, loadingCoins, errorCoins, topMarketCaps, loadingTopCaps } = useSelector(
    (state: RootState) => ({
      coins: state.crypto.coins?.data ?? [],
      loadingCoins: state.crypto.loadingCoins,
      errorCoins: state.crypto.error,
      topMarketCaps: state.crypto.topMarketCaps?.data ?? [],
      loadingTopCaps: state.crypto.loadingTopCaps,
    })
  );

  const [selectedCoin, setSelectedCoin] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('line');

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

  const handleCoinChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCoin(e.target.value);
  }, []);

  const handleTabChange = useCallback((key: string) => {
    setActiveTab(key);
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Crypto Dashboard</h1>

      {loadingCoins && <p>Зареждане на монети...</p>}
      {errorCoins && <p className="text-red-600">Грешка: {errorCoins}</p>}

      {!loadingCoins && !errorCoins && coins.length > 0 && selectedCoin && (
        <>
          <select
            className="mb-6 p-2 border rounded"
            value={selectedCoin}
            onChange={handleCoinChange}
          >
            {coins.map(coin => (
              <option key={coin.id} value={coin.id}>
                {coin.name}
              </option>
            ))}
          </select>

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