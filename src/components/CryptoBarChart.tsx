import React, { useEffect, useMemo } from 'react';
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
  ChartOptions,
} from 'chart.js';

import { transformBarData } from '@/utils/chartHelpers';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function CryptoBarChartComponent({ coinId }: CryptoChartProps) {
  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector((state: RootState) => state.crypto.marketChartData[coinId]?.data);
  const loading = useSelector((state: RootState) => state.crypto.loadingChart);
  const error = useSelector((state: RootState) => state.crypto.chartError);

  useEffect(() => {
    if (!coinId || data) return;
    dispatch(fetchMarketChart({ coinId }));
  }, [dispatch, coinId, data]);

  const chartData = useMemo(() => (data ? transformBarData(data, coinId) : null), [data, coinId]);

  if (loading) return <p>Зареждане...</p>;
  if (error) return <p className="text-red-600">Грешка: {error}</p>;
  if (!chartData) return <p>Няма данни за показване.</p>;

  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Пазарна капитализация - бар диаграма' },
    },
  };

  return <Bar data={chartData} options={options} />;
}

export const CryptoBarChart = React.memo(CryptoBarChartComponent);