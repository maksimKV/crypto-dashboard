import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchCoins } from '@/store/cryptoSlice';
import { CryptoLineChart } from '@/components/CryptoLineChart';
import { CryptoBarChart } from '@/components/CryptoBarChart';
import { CryptoPieChart } from '@/components/CryptoPieChart';

const tabs = [
  { name: 'Line Chart', key: 'line' },
  { name: 'Bar Chart', key: 'bar' },
  { name: 'Pie Chart', key: 'pie' },
];

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { coins, loadingCoins, errorCoins } = useSelector((state: RootState) => ({
    coins: state.crypto.coins,
    loadingCoins: state.crypto.loadingCoins,
    errorCoins: state.crypto.error,
  }));

  const [selectedCoin, setSelectedCoin] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('line');

  useEffect(() => {
    if (coins.length === 0) {
      dispatch(fetchCoins());
    } else if (!selectedCoin) {
      setSelectedCoin(coins[0].id);
    }
  }, [coins, selectedCoin, dispatch]);

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

          <div className="bg-white p-4 shadow rounded">
            {activeTab === 'line' && <CryptoLineChart coinId={selectedCoin} />}
            {activeTab === 'bar' && <CryptoBarChart coinId={selectedCoin} />}
            {activeTab === 'pie' && <CryptoPieChart />}
          </div>
        </>
      )}
    </main>
  );
}