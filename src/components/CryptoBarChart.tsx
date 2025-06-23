import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { CryptoChartProps } from '@/types/chartTypes';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface MarketChartData {
  market_caps: [number, number][];
}

export function CryptoBarChart({ coinId }: CryptoChartProps) {
  const [chartData, setChartData] = useState<ChartData<'bar'>>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!coinId) return;

    async function fetchMarketCap() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=30`
        );

        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

        const data: MarketChartData = await res.json();

        const labels = data.market_caps.map(p => {
          const date = new Date(p[0]);
          return `${date.getDate()}.${date.getMonth() + 1}`;
        });
        const marketCaps = data.market_caps.map(p => p[1] / 1_000_000_000); // милиарди $

        const formattedData: ChartData<'bar'> = {
          labels,
          datasets: [
            {
              label: `${coinId} Пазарна капитализация ($ млрд)`,
              data: marketCaps,
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
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

    fetchMarketCap();
  }, [coinId]);

  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Пазарна капитализация - бар диаграма' },
    },
  };

  if (loading) return <p>Зареждане...</p>;
  if (error) return <p className="text-red-600">Грешка: {error}</p>;
  if (!chartData) return <p>Няма данни за показване.</p>;

  return <Bar data={chartData} options={options} />;
}