import { useEffect, useState } from 'react';
import { CryptoLineChart } from '@/components/CryptoLineChart';
import { CryptoBarChart } from '@/components/CryptoBarChart';
import { CryptoPieChart } from '@/components/CryptoPieChart';
import { fetchCryptoData } from '@/utils/fetchData';
import { CoinData } from '@/types';

const tabs = [
  { name: 'Line Chart', key: 'line' },
  { name: 'Bar Chart', key: 'bar' },
  { name: 'Pie Chart', key: 'pie' },
];

export default function Home() {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<string>('bitcoin');
  const [activeTab, setActiveTab] = useState<string>('line');
  const [loadingCoins, setLoadingCoins] = useState(true);

  useEffect(() => {
    fetchCryptoData()
      .then(data => {
        setCoins(data);
        if (data.length > 0) setSelectedCoin(data[0].id);
      })
      .finally(() => setLoadingCoins(false));
  }, []);

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Crypto Dashboard</h1>

      {loadingCoins ? (
        <p>Зареждане на монети...</p>
      ) : (
        <>
          <label className="block mb-2 font-medium" htmlFor="coin-select">
            Избери валута:
          </label>
          <select
            id="coin-select"
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
            {activeTab === 'line' && <CryptoLineChart coinId={selectedCoin} />}
            {activeTab === 'bar' && <CryptoBarChart coinId={selectedCoin} />}
            {activeTab === 'pie' && <CryptoPieChart coinId={selectedCoin} />}
          </div>
        </>
      )}
    </main>
  );
}