import { useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchMarketChart } from '@/store/cryptoSlice';
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

export function CryptoBarChart({ coinId }: CryptoChartProps) {
  const dispatch = useDispatch<AppDispatch>();

  const data = useSelector((state: RootState) => state.crypto.marketChartData[coinId]);
  const loading = useSelector((state: RootState) => state.crypto.loadingChart);
  const error = useSelector((state: RootState) => state.crypto.chartError);

  useEffect(() => {
    if (!data) {
      dispatch(fetchMarketChart({ coinId }));
    }
  }, [coinId, dispatch, data]);

  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Пазарна капитализация - бар диаграма' },
    },
  };

  if (loading && !data) return <p>Зареждане...</p>;
  if (error && !data) return <p className="text-red-600">Грешка: {error}</p>;
  if (!data || !data.market_caps) return <p>Няма данни за показване.</p>;

  const labels = data.market_caps.map((p: [number, number]) => {
    const date = new Date(p[0]);
    return `${date.getDate()}.${date.getMonth() + 1}`;
  });

  const marketCaps = data.market_caps.map((p: [number, number]) => p[1] / 1_000_000_000);

  const chartData: ChartData<'bar'> = {
    labels,
    datasets: [
      {
        label: `${coinId} Пазарна капитализация ($ млрд)`,
        data: marketCaps,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  return <Bar data={chartData} options={options} />;
}