import { ChartData } from 'chart.js';
import { MarketChartData } from '@/types/chartTypes';

export function transformBarData(data: MarketChartData, coinId: string): ChartData<'bar'> {
  const labels = data.market_caps.map(p => {
    const date = new Date(p[0]);
    return `${date.getDate()}.${date.getMonth() + 1}`;
  });
  const caps = data.market_caps.map(p => p[1] / 1e9);

  return {
    labels,
    datasets: [
      {
        label: `${coinId} Пазарна капитализация ($ млрд)`,
        data: caps,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };
}

export function transformLineData(data: MarketChartData, coinId: string): ChartData<'line'> {
  const labels = data.prices.map(p => {
    const date = new Date(p[0]);
    return `${date.getDate()}.${date.getMonth() + 1}`;
  });
  const prices = data.prices.map(p => p[1]);

  return {
    labels,
    datasets: [
      {
        label: `${coinId} Цена (30 дни)`,
        data: prices,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
        tension: 0.3,
      },
    ],
  };
}