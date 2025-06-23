import { useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchMarketChart } from '@/store/cryptoSlice';
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

export function CryptoLineChart({ coinId }: CryptoChartProps) {
  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector((state: RootState) => state.crypto.marketChartData[coinId]);
  const loading = useSelector((state: RootState) => state.crypto.loadingChart);
  const error = useSelector((state: RootState) => state.crypto.chartError);

  useEffect(() => {
    if (!coinId || data) return;
    dispatch(fetchMarketChart({ coinId }));
  }, [dispatch, coinId, data]);

  if (loading) return <p>Зареждане...</p>;
  if (error) return <p className="text-red-600">Грешка: {error}</p>;
  if (!data) return <p>Няма данни за показване.</p>;

  const labels = data.prices.map(p => {
    const date = new Date(p[0]);
    return `${date.getDate()}.${date.getMonth() + 1}`;
  });
  const prices = data.prices.map(p => p[1]);

  const chartData: ChartData<'line'> = {
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
  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Исторически цени' },
    },
  };

  return <Line data={chartData} options={options} />;
}