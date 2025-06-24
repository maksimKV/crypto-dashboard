import React from 'react';
import { Radar } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
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

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const metrics = ['market_cap', 'total_volume', 'price_change_percentage_24h'];

export function CryptoRadarChart() {
  const coins = useSelector((state: RootState) => state.crypto.topMarketCaps?.data ?? []);

  if (coins.length === 0) return <p>Няма данни за показване.</p>;

  const labels = metrics.map(m => m.replace(/_/g, ' ').toUpperCase());

  const datasets = coins.slice(0, 5).map((coin, idx) => ({
    label: coin.name,
    data: [
      coin.market_cap,
      coin.total_volume,
      coin.price_change_percentage_24h,
    ],
    fill: true,
    backgroundColor: `rgba(${50 * idx}, ${100 + 30 * idx}, ${150 + 20 * idx}, 0.2)`,
    borderColor: `rgba(${50 * idx}, ${100 + 30 * idx}, ${150 + 20 * idx}, 1)`,
    pointBackgroundColor: `rgba(${50 * idx}, ${100 + 30 * idx}, ${150 + 20 * idx}, 1)`,
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: `rgba(${50 * idx}, ${100 + 30 * idx}, ${150 + 20 * idx}, 1)`,
  }));

  const data = { labels, datasets };

  const options: ChartOptions<'radar'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Сравнение на топ криптовалути по метрики' },
    },
    scales: {
      r: {
        angleLines: { display: false },
        suggestedMin: 0,
      },
    },
  };

  return <Radar data={data} options={options} />;
}