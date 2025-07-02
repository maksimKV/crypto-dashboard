import React, { useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store';
import { fetchTopMarketCaps } from '@/store/cryptoSlice';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  Filler,
} from 'chart.js';

import { selectTopMarketCaps, selectLoadingTopCaps, selectTopCapsError, selectCurrency } from '@/store/selectors';
import { getCurrencyLabel } from '@/utils/cacheUtils';

// Register necessary chart.js components for Pie chart
ChartJS.register(ArcElement, Tooltip, Legend, Filler);

function CryptoPieChartComponent(): React.ReactElement {
  const dispatch = useDispatch<AppDispatch>();
  const currency = useSelector(selectCurrency);
  const topCoins = useSelector(selectTopMarketCaps) || [];
  const loading = useSelector(selectLoadingTopCaps);
  const error = useSelector(selectTopCapsError);

  // Fetch top market caps if not loaded
  useEffect(() => {
    if (topCoins.length === 0) {
      dispatch(fetchTopMarketCaps());
    }
  }, [dispatch, topCoins.length]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!topCoins.length) return <p>No data to display.</p>;

  // Calculate total market cap for percentage calculation in tooltip
  const totalMarketCap = topCoins.reduce((sum, coin) => sum + coin.market_cap, 0);

  // Prepare data for Pie chart
  const data = {
    labels: topCoins.map(c => c.name),
    datasets: [
      {
        label: 'Market Share',
        data: topCoins.map(c => c.market_cap),
        backgroundColor: [
          '#ff6384',
          '#36a2eb',
          '#cc65fe',
          '#ffce56',
          '#2ecc71',
          '#e74c3c',
        ],
        hoverOffset: 4,
      },
    ],
  };

  // Chart options with tooltip showing both value and percentage with formatting
  const options: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: { position: 'right' },
      title: { display: true, text: `Market Share of Top 5 Cryptocurrencies` },
      tooltip: {
        callbacks: {
          label: context => {
            const value = context.parsed;
            const percentage = ((value / totalMarketCap) * 100).toFixed(2);
            // Format number with thousands separators
            const formattedValue = value.toLocaleString();
            const label = getCurrencyLabel(currency);
            if (currency === 'bgn' || currency === 'chf') {
              return `${context.label}: ${formattedValue} ${label} (${percentage}%)`;
            }
            return `${context.label}: ${label}${formattedValue} (${percentage}%)`;
          },
        },
      },
    },
  };

  return <Pie data={data} options={options} />;
}

export const CryptoPieChart = React.memo(CryptoPieChartComponent);