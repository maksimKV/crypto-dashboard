import React, { useEffect, ReactElement } from 'react';
import { Radar } from 'react-chartjs-2';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store';
import { fetchTopMarketCaps } from '@/store/cryptoSlice';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';

import { selectTopMarketCaps, selectLoadingTopCaps } from '@/store/selectors';

// Register necessary chart.js components for Radar chart
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

function CryptoRadarChartComponent(): ReactElement {
  const dispatch = useDispatch<AppDispatch>();
  const topCoins = useSelector(selectTopMarketCaps);
  const loading = useSelector(selectLoadingTopCaps);

  // Fetch top market caps if not loaded
  useEffect(() => {
    if (topCoins.length === 0) {
      dispatch(fetchTopMarketCaps());
    }
  }, [dispatch, topCoins.length]);

  if (loading) return <p>Loading...</p>;
  if (!topCoins.length) return <p>No data to display.</p>;

  // Prepare data for Radar chart: comparing market_cap, total_volume, price_change_percentage_24h
  const data = {
    labels: ['Market Cap (USD)', 'Volume (USD)', 'Price Change % (24h)'],
    datasets: topCoins.map((coin, index) => ({
      label: coin.name,
      data: [
        coin.market_cap,
        coin.total_volume,
        coin.price_change_percentage_24h,
      ],
      fill: true,
      backgroundColor: `rgba(${(index * 50) % 255}, ${(index * 80) % 255}, ${(index * 110) % 255}, 0.2)`,
      borderColor: `rgba(${(index * 50) % 255}, ${(index * 80) % 255}, ${(index * 110) % 255}, 1)`,
      pointBackgroundColor: `rgba(${(index * 50) % 255}, ${(index * 80) % 255}, ${(index * 110) % 255}, 1)`,
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: `rgba(${(index * 50) % 255}, ${(index * 80) % 255}, ${(index * 110) % 255}, 1)`,
    })),
  };

  // Chart options with axis description and custom tooltip for better UX
  const options: ChartOptions<'radar'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Comparison of Top Cryptocurrencies' },
      tooltip: {
        callbacks: {
          label: context => {
            const label = context.dataset.label || '';
            const value = context.parsed.r;
            // Format tooltip differently based on axis label
            const axisLabelRaw = context.chart.data.labels?.[context.dataIndex];
            const axisLabel = typeof axisLabelRaw === 'string' ? axisLabelRaw : '';
            if (axisLabel.includes('Price Change')) {
              return `${label}: ${value.toFixed(2)}%`;
            }
            return `${label}: $${value.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      r: {
        angleLines: {
          display: true,
        },
        pointLabels: {
          // Axis labels descriptions for better understanding
          font: {
            size: 14,
            weight: 'bold',
          },
          color: '#333',
        },
        ticks: {
          // Show ticks with dollar formatting except for Price Change %
          callback: val => {
            if (typeof val === 'number') {
              // Check if max tick label or close to it for showing %
              if (val < 10) {
                return val.toString(); // For small numbers, show as is (for %)
              }
              return `$${val.toLocaleString()}`;
            }
            return val;
          },
          color: '#666',
        },
      },
    },
  };

  return <Radar data={data} options={options} />;
}

export const CryptoRadarChart = React.memo(CryptoRadarChartComponent);