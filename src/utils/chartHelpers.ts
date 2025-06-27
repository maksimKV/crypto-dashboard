import { MarketChartData } from '@/types/chartTypes';
import { ChartData } from 'chart.js';

/**
 * Transforms raw market chart data into Chart.js line chart data.
 * Shows price over time.
 */
export function transformLineData(data: MarketChartData, coinId: string): ChartData<'line'> | null {
  if (
    (!data.prices || data.prices.length === 0) &&
    (!data.market_caps || data.market_caps.length === 0) &&
    (!data.total_volumes || data.total_volumes.length === 0)
  ) {
    return null;
  }
  return {
    labels: data.prices.map(p => {
      const date = new Date(p[0]);
      return date.toLocaleDateString();
    }),
    datasets: [
      {
        label: `Price of ${coinId}`,
        data: data.prices.map(p => p[1]),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
        tension: 0.3,
      },
    ],
  };
}

/**
 * Transforms raw market chart data into Chart.js bar chart data.
 * Shows volume over time.
 */
export function transformBarData(data: MarketChartData, coinId: string): ChartData<'bar'> {
  return {
    labels: data.total_volumes.map(p => {
      const date = new Date(p[0]);
      return date.toLocaleDateString();
    }),
    datasets: [
      {
        label: `Volume of ${coinId}`,
        data: data.total_volumes.map(p => p[1]),
        backgroundColor: 'rgba(153,102,255,0.6)',
      },
    ],
  };
}