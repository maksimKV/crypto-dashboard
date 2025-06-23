import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { CryptoChartProps } from '@/types/chartTypes';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  ChartData,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface CoinMarketCap {
  id: string;
  name: string;
  market_cap: number;
}

export function CryptoPieChart({ coinId }: CryptoChartProps) {
  const [chartData, setChartData] = useState<ChartData<'pie'>>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMarketShare() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1`
        );

        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

        const data: CoinMarketCap[] = await res.json();

        const labels = data.map(coin => coin.name);
        const marketCaps = data.map(coin => coin.market_cap);

        const totalCap = marketCaps.reduce((a, b) => a + b, 0);
        const percentages = marketCaps.map(cap => (cap / totalCap) * 100);

        const backgroundColors = [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ];

        const borderColors = [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ];

        const formattedData: ChartData<'pie'> = {
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

        setChartData(formattedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchMarketShare();
  }, [coinId]);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'right' as const },
      title: { display: true, text: 'Пазарен дял на топ 5 криптовалути' },
    },
  };

  if (loading) return <p>Зареждане...</p>;
  if (error) return <p className="text-red-600">Грешка: {error}</p>;
  if (!chartData) return <p>Няма данни за показване.</p>;

  return <Pie data={chartData} options={options} />;
}