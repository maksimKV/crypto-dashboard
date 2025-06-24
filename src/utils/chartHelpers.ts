import { MarketChartData } from '@/types/chartTypes';
import { ChartData } from 'chart.js';

export function transformLineData(data: MarketChartData, coinId: string): ChartData<'line'> {
  return {
    labels: data.prices.map(p => {
      const date = new Date(p[0]);
      return date.toLocaleDateString();
    }),
    datasets: [
      {
        label: `Цена на ${coinId}`,
        data: data.prices.map(p => p[1]),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
        tension: 0.3,
      },
    ],
  };
}

export function transformBarData(data: MarketChartData, coinId: string): ChartData<'bar'> {
  return {
    labels: data.total_volumes.map(p => {
      const date = new Date(p[0]);
      return date.toLocaleDateString();
    }),
    datasets: [
      {
        label: `Обем на ${coinId}`,
        data: data.total_volumes.map(p => p[1]),
        backgroundColor: 'rgba(153,102,255,0.6)',
      },
    ],
  };
}