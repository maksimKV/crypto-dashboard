import React, { useEffect, useMemo, useState } from 'react';
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
  Filler,
} from 'chart.js';

import { transformBarData } from '@/utils/chartHelpers';
import { selectMarketChartData, selectLoadingChart, selectChartError, selectCurrency } from '@/store/selectors';
import { getCurrencyLabel, getErrorMessage } from '@/utils/cacheUtils';

// Register necessary Chart.js components for bar charts
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Filler);

/**
 * CryptoBarChartComponent fetches and displays the trading volume
 * history of a cryptocurrency as a bar chart.
 */
function CryptoBarChartComponent({ coinId }: CryptoChartProps): React.ReactElement {
  const dispatch = useDispatch<AppDispatch>();
  const currency = useSelector(selectCurrency);
  const data = useSelector(selectMarketChartData(coinId));
  const loading = useSelector(selectLoadingChart);
  const error = useSelector(selectChartError);
  const [localError, setLocalError] = useState<string | null>(null);

  // Fetch market chart data if needed
  useEffect(() => {
    if (!coinId || data) return;
    dispatch(fetchMarketChart({ coinId })).unwrap().catch((err: unknown) => {
      setLocalError(getErrorMessage(err));
    });
  }, [dispatch, coinId, data, currency]);

  // Memoize data transformation for performance
  const chartData = useMemo(() => (data ? transformBarData(data, coinId) : null), [data, coinId]);

  if (loading) return <p>Loading...</p>;
  if (error || localError) return <p className="text-red-600">Error: {error || localError}</p>;
  if (!chartData) return <p>No data to display.</p>;

  // Detect mobile screen size for responsive options
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Chart options with mobile responsiveness and tooltip customization
  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: !isMobile,
    plugins: {
      legend: { 
        position: 'top',
        labels: {
          font: {
            size: isMobile ? 10 : 12,
          },
          padding: isMobile ? 10 : 20,
        },
      },
      title: { 
        display: true, 
        text: 'Trading Volume History',
        font: {
          size: isMobile ? 14 : 16,
        },
      },
      tooltip: {
        titleFont: {
          size: isMobile ? 12 : 14,
        },
        bodyFont: {
          size: isMobile ? 11 : 13,
        },
        callbacks: {
          // Custom label to format volume with currency sign and thousands separator
          label: context => {
            const value = context.parsed.y;
            const label = getCurrencyLabel(currency);
            if (currency === 'bgn' || currency === 'chf') {
              return `Volume: ${value.toLocaleString()} ${label}`;
            }
            return `Volume: ${label}${value.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: !isMobile, // Hide x-axis title on mobile to save space
          text: 'Date',
          font: {
            size: isMobile ? 10 : 12,
          },
        },
        ticks: {
          font: {
            size: isMobile ? 8 : 10,
          },
          maxRotation: isMobile ? 45 : 0,
          minRotation: isMobile ? 45 : 0,
          maxTicksLimit: isMobile ? 6 : 10,
        },
      },
      y: {
        title: {
          display: !isMobile, // Hide y-axis title on mobile to save space
          text: `Volume (${getCurrencyLabel(currency)})`,
          font: {
            size: isMobile ? 10 : 12,
          },
        },
        ticks: {
          font: {
            size: isMobile ? 8 : 10,
          },
          // Format Y-axis ticks with currency sign and thousands separator
          callback: val => {
            const value = Number(val);
            const label = getCurrencyLabel(currency);
            
            // Shorter format for mobile
            if (isMobile) {
              if (value >= 1000000000) {
                return `${(value / 1000000000).toFixed(1)}B`;
              } else if (value >= 1000000) {
                return `${(value / 1000000).toFixed(1)}M`;
              } else if (value >= 1000) {
                return `${(value / 1000).toFixed(1)}K`;
              }
            }
            
            if (currency === 'bgn' || currency === 'chf') {
              return `${value.toLocaleString()} ${label}`;
            }
            return `${label}${value.toLocaleString()}`;
          },
          maxTicksLimit: isMobile ? 5 : 8,
        },
      },
    },
  };

  return (
    <div style={{ height: isMobile ? '256px' : '100%', width: '100%' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}

export const CryptoBarChart = React.memo(CryptoBarChartComponent);