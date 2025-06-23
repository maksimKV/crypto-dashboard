import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { CryptoChartProps } from '@/types/chartTypes';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface HistoricalData {
  prices: [number, number][];
}

export function CryptoLineChart({ coinId }: CryptoChartProps) {
  const [chartData, setChartData] = useState<ChartData<'line'>>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadHistoricalData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=30`
        );

        if (!res.ok) {
          throw new Error(`Network response was not ok: ${res.statusText}`);
        }

        const data: HistoricalData = await res.json();

        const labels = data.prices.map(p => {
          const date = new Date(p[0]);
          return `${date.getDate()}.${date.getMonth() + 1}`;
        });

        const prices = data.prices.map(p => p[1]);

        const formattedData: ChartData<'line'> = {
          labels,
          datasets: [
            {
              label: `${coinId} Цена (30 дни)`,
              data: prices,
              borderColor: 'rgba(75,192,192,1)',
              backgroundColor: 'rgba(75,192,192,0.2)',
              fill: true,
              tension: 0.3,
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

    loadHistoricalData();
  }, [coinId]);

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Исторически цени' },
    },
  };

  if (loading) {
    return <p>Зареждане...</p>;
  }

  if (error) {
    return <p className="text-red-600">Грешка: {error}</p>;
  }

  if (!chartData) {
    return <p>Няма данни за показване.</p>;
  }

  return <Line data={chartData} options={options} />;
}