import React, { useEffect, useMemo, ReactElement } from 'react';
import { Bar } from 'react-chartjs-2';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store';
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
import { selectMarketChartData, selectLoadingChart, selectChartError } from '@/store/selectors';

// Register necessary Chart.js components for bar charts
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/**
 * CryptoBarChartComponent fetches and displays the trading volume
 * history of a cryptocurrency as a bar chart.
 */
function CryptoBarChartComponent({ coinId }: CryptoChartProps): ReactElement {
  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector(selectMarketChartData(coinId));
  const loading = useSelector(selectLoadingChart);
  const error = useSelector(selectChartError);

  // Fetch market chart data if needed
  useEffect(() => {
    if (!coinId || data) return;
    dispatch(fetchMarketChart({ coinId }));
  }, [dispatch, coinId, data]);

  // Memoize data transformation for performance
  const chartData = useMemo(() => (data ? transformBarData(data, coinId) : null), [data, coinId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!chartData) return <p>No data to display.</p>;

  // Chart options with tooltip customization and axis labels for better UX
  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Trading Volume History' },
      tooltip: {
        callbacks: {
          // Custom label to format volume with USD sign and thousands separator
          label: context => {
            const value = context.parsed.y;
            return `Volume: $${value.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Volume (USD)',
        },
        ticks: {
          // Format Y-axis ticks with dollar sign and thousands separator
          callback: val => `$${Number(val).toLocaleString()}`,
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}

export const CryptoBarChart = React.memo(CryptoBarChartComponent);