import { useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchTopMarketCaps } from '@/store/cryptoSlice';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  ChartData,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export function CryptoPieChart() {
  const dispatch = useDispatch<AppDispatch>();

  const topCoins = useSelector((state: RootState) => state.crypto.topMarketCaps);
  const loading = useSelector((state: RootState) => state.crypto.loadingTopCaps);
  const error = useSelector((state: RootState) => state.crypto.topCapsError);

  useEffect(() => {
    if (topCoins.length === 0) {
      dispatch(fetchTopMarketCaps());
    }
  }, [dispatch, topCoins.length]);

  if (loading) return <p>Зареждане...</p>;
  if (error) return <p className="text-red-600">Грешка: {error}</p>;
  if (!topCoins || topCoins.length === 0) return <p>Няма данни за показване.</p>;

  const labels = topCoins.map(coin => coin.name);
  const marketCaps = topCoins.map(coin => coin.market_cap);
  const totalCap = marketCaps.reduce((a, b) => a + b, 0);
  const percentages = marketCaps.map(cap => (cap / totalCap) * 100);

  const backgroundColors = [
    'rgba(255, 99, 132, 0.7)',
    'rgba(54, 162, 235, 0.7)',
    'rgba(255, 206, 86, 0.7)',
    'rgba(75, 192, 192, 0.7)',
    'rgba(153, 102, 255, 0.7)',
  ];

  const borderColors = backgroundColors.map(c => c.replace('0.7', '1'));

  const chartData: ChartData<'pie'> = {
    labels,
    datasets: [
      {
        label: 'Пазарен дял (%)',
        data: percentages,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'right' as const },
      title: { display: true, text: 'Пазарен дял на топ 5 криптовалути' },
    },
  };

  return <Pie data={chartData} options={options} />;
}