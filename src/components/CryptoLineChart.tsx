import React, { useEffect, useMemo, useState } from 'react';
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
  Filler,
} from 'chart.js';

import { transformLineData } from '@/utils/chartHelpers';
import { selectMarketChartData, selectLoadingChart, selectChartError, selectCurrency } from '@/store/selectors';
import { getCurrencyLabel, getErrorMessage } from '@/utils/cacheUtils';

// Register necessary Chart.js components for line charts
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

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
  const [localError, setLocalError] = useState<string | null>(null);

  // Fetch market chart data when component mounts or coinId/currency changes
  useEffect(() => {
    if (!coinId || data) return;
    dispatch(fetchMarketChart({ coinId })).unwrap().catch((err: unknown) => {
      setLocalError(getErrorMessage(err));
    });
  }, [dispatch, coinId, data, currency]);

  // Memoize chart data transformation for performance
  const chartData = useMemo(() => (data ? transformLineData(data, coinId) : null), [data, coinId]);

  if (loading) return <p>Loading...</p>;
  if (error || localError) return <p className="text-red-600">Error: {error || localError}</p>;
  if (!chartData) return <p>No data to display.</p>;

  // Detect mobile screen size for responsive options
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Chart options with mobile-responsive configuration
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
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
        text: `Historical Prices`,
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
          text: `Price (${getCurrencyLabel(currency)})`,
          font: {
            size: isMobile ? 10 : 12,
          },
        },
        ticks: {
          font: {
            size: isMobile ? 8 : 10,
          },
          maxTicksLimit: isMobile ? 6 : 8,
          // Format Y-axis ticks with currency sign and thousands separator
          callback: val => {
            const label = getCurrencyLabel(currency);
            const value = Number(val);
            // Shorter format for mobile
            if (isMobile) {
              if (value >= 1000000) {
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
        },
      },
    },
    elements: {
      point: {
        radius: isMobile ? 2 : 3,
        hoverRadius: isMobile ? 4 : 6,
      },
      line: {
        borderWidth: isMobile ? 1.5 : 2,
      },
    },
  };

  return (
    <div className={`relative ${isMobile ? 'h-64' : 'h-96'}`}>
      <Line data={chartData} options={options} />
    </div>
  );
}

export const CryptoLineChart = React.memo(CryptoLineChartComponent);