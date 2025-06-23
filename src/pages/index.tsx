import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchCoins, fetchMarketChart } from '@/store/cryptoSlice';
import { CryptoLineChart } from '@/components/CryptoLineChart';
import { CryptoBarChart } from '@/components/CryptoBarChart';
import { CryptoPieChart } from '@/components/CryptoPieChart';

const tabs = [
  { name: 'Line Chart', key: 'line' },
  { name: 'Bar Chart', key: 'bar' },
  { name: 'Pie Chart', key: 'pie' },
];

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const coins = useSelector((state: RootState) => state.crypto.coins);
  const loadingCoins = useSelector((state: RootState) => state.crypto.loadingCoins);
  const marketChartData = useSelector((state: RootState) => state.crypto.marketChartData);
  const loadingChart = useSelector((state: RootState) => state.crypto.loadingChart);
  const chartError = useSelector((state: RootState) => state.crypto.chartError);

  const [selectedCoin, setSelectedCoin] = useState<string>('');
  const [activeTab, setActiveTab] = useState('line');

  useEffect(() => {
    dispatch(fetchCoins());
  }, [dispatch]);

  useEffect(() => {
    if (coins.length > 0 && !selectedCoin) {
      setSelectedCoin(coins[0].id);
    }
  }, [coins, selectedCoin]);

  useEffect(() => {
    if (selectedCoin) {
      dispatch(fetchMarketChart({ coinId: selectedCoin }));
    }
  }, [selectedCoin, activeTab, dispatch]);

  const currentChartData = selectedCoin ? marketChartData[selectedCoin] : null;

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Crypto Dashboard</h1>

      {loadingCoins ? (
        <p>Loading coins...</p>
      ) : (
        <>
          <select
            className="mb-6 p-2 border rounded w-full max-w-xs"
            value={selectedCoin}
            onChange={e => setSelectedCoin(e.target.value)}
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
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 border rounded ${
                  activeTab === tab.key ? 'bg-blue-600 text-white' : 'bg-gray-100'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>

          <div className="bg-white p-4 shadow rounded min-h-[400px]">
            {loadingChart && <p>Loading chart data...</p>}
            {chartError && <p className="text-red-600">Error: {chartError}</p>}

            {!loadingChart && !chartError && (
              <>
                {activeTab === 'line' && currentChartData && (
                  <CryptoLineChart coinId={selectedCoin} data={currentChartData} />
                )}
                {activeTab === 'bar' && currentChartData && (
                  <CryptoBarChart coinId={selectedCoin} data={currentChartData} />
                )}
                {activeTab === 'pie' && currentChartData && (
                  <CryptoPieChart />
                )}
              </>
            )}
          </div>
        </>
      )}
    </main>
  );
}