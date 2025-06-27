import React, { useEffect, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store';
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
  ChartOptions,
} from 'chart.js';

import { transformLineData } from '@/utils/chartHelpers';
import { selectMarketChartData, selectLoadingChart, selectChartError, selectCurrency } from '@/store/selectors';
import { getCurrencyLabel } from '@/utils/cacheUtils';

// Register necessary Chart.js components for line charts
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

/**
 * CryptoLineChartComponent fetches and displays the price history
 * of a cryptocurrency as a line chart.
 */
function CryptoLineChartComponent({ coinId }: CryptoChartProps): React.ReactElement {
  const dispatch = useDispatch<AppDispatch>();
  const currency = useSelector(selectCurrency);
  const data = useSelector(selectMarketChartData(coinId));
  const loading = useSelector(selectLoadingChart);
  const error = useSelector(selectChartError);

  // Fetch market chart data when component mounts or coinId/currency changes
  useEffect(() => {
    if (!coinId || data) return;
    dispatch(fetchMarketChart({ coinId }));
  }, [dispatch, coinId, data, currency]);

  // Memoize chart data transformation for performance
  const chartData = useMemo(() => (data ? transformLineData(data, coinId) : null), [data, coinId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!chartData) return <p>No data to display.</p>;

  // Chart options with tooltip customization and axis labels for better UX
  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: `Historical Prices` },
      tooltip: {
        callbacks: {
          // Custom label to format price with 2 decimal places and currency sign
          label: context => {
            const value = context.parsed.y;
            const label = getCurrencyLabel(currency);
            if (currency === 'bgn' || currency === 'chf') {
              return `Price: ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${label}`;
            }
            return `Price: ${label}${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
          text: `Price (${getCurrencyLabel(currency)})`,
        },
        ticks: {
          // Format Y-axis ticks with currency sign and thousands separator
          callback: val => {
            const label = getCurrencyLabel(currency);
            if (currency === 'bgn' || currency === 'chf') {
              return `${Number(val).toLocaleString()} ${label}`;
            }
            return `${label}${Number(val).toLocaleString()}`;
          },
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
}

export const CryptoLineChart = React.memo(CryptoLineChartComponent);