import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { CoinData } from '@/types/chartTypes';

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const metrics: (keyof CoinData)[] = [
  'market_cap_rank',
  'market_cap',
  'total_volume',
  'price_change_percentage_24h',
  'price_change_percentage_7d',
];

function normalize(values: number[]): number[] {
  const max = Math.max(...values);
  const min = Math.min(...values);
  if (max === min) return values.map(() => 1);
  return values.map(v => (v - min) / (max - min));
}

export function CryptoRadarChart() {
  const coins = useSelector((state: RootState) => state.crypto.topMarketCaps);

  if (coins.length === 0) return <p>Няма данни за показване.</p>;

  const labels = metrics.map(m => m.replace(/_/g, ' ').toUpperCase());

  const datasets = coins.map((coin, i) => {
    const rawValues = metrics.map(metric => coin[metric] ?? 0) as number[];
    const normalizedValues = normalize(rawValues);

    const colorOpacity = 0.2 + i * 0.15;
    const borderOpacity = 0.5 + i * 0.25;

    return {
      label: coin.name,
      data: normalizedValues,
      fill: true,
      backgroundColor: `rgba(54, 162, 235, ${colorOpacity})`,
      borderColor: `rgba(54, 162, 235, ${borderOpacity})`,
      pointBackgroundColor: `rgba(54, 162, 235, 1)`,
      borderWidth: 2,
      tension: 0.3,
    };
  });

  const data: ChartData<'radar'> = {
    labels,
    datasets,
  };

  const options: ChartOptions<'radar'> = {
    responsive: true,
    scales: {
      r: {
        ticks: { display: false },
        pointLabels: {
          font: { size: 14 },
          color: '#334155',
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#334155', font: { size: 14 } },
      },
      tooltip: {
        callbacks: {
          label: ctx => {
            const metric = metrics[ctx.dataIndex];
            const value = coins[ctx.datasetIndex ?? 0][metric];
            return `${ctx.dataset.label}: ${metric.replace(/_/g, ' ')} = ${value}`;
          },
        },
      },
    },
  };

  return <Radar data={data} options={options} />;
}