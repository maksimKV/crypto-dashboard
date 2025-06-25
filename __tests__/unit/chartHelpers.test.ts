import { transformLineData, transformBarData } from '@/utils/chartHelpers';
import { MarketChartData } from '@/types/chartTypes';

describe('chartHelpers', () => {
  // Sample mock data matching MarketChartData structure
  const mockData: MarketChartData = {
    prices: [
      [1672531200000, 100], // Jan 1, 2023
      [1672617600000, 105], // Jan 2, 2023
    ],
    market_caps: [
      [1672531200000, 1000],
      [1672617600000, 1100],
    ],
    total_volumes: [
      [1672531200000, 500],
      [1672617600000, 550],
    ],
  };

  describe('transformLineData', () => {
    it('transforms MarketChartData into Chart.js line chart data format', () => {
      const coinId = 'bitcoin';
      const result = transformLineData(mockData, coinId);

      // Labels should be date strings converted from timestamps
      expect(result.labels).toEqual(
        mockData.prices.map(p => new Date(p[0]).toLocaleDateString())
      );

      // There should be exactly one dataset for price
      expect(result.datasets).toHaveLength(1);

      // Dataset label includes coinId
      expect(result.datasets[0].label).toBe(`Price of ${coinId}`);

      // Dataset data matches prices values
      expect(result.datasets[0].data).toEqual(mockData.prices.map(p => p[1]));

      // Check some styling properties (borderColor, fill, tension)
      expect(result.datasets[0].borderColor).toBe('rgba(75,192,192,1)');
      expect(result.datasets[0].fill).toBe(true);
      expect(result.datasets[0].tension).toBe(0.3);
    });
  });

  describe('transformBarData', () => {
    it('transforms MarketChartData into Chart.js bar chart data format', () => {
      const coinId = 'ethereum';
      const result = transformBarData(mockData, coinId);

      // Labels should be date strings converted from timestamps for total_volumes
      expect(result.labels).toEqual(
        mockData.total_volumes.map(p => new Date(p[0]).toLocaleDateString())
      );

      // One dataset for volume
      expect(result.datasets).toHaveLength(1);

      // Dataset label includes coinId
      expect(result.datasets[0].label).toBe(`Volume of ${coinId}`);

      // Dataset data matches total_volumes values
      expect(result.datasets[0].data).toEqual(mockData.total_volumes.map(p => p[1]));

      // Check backgroundColor styling property
      expect(result.datasets[0].backgroundColor).toBe('rgba(153,102,255,0.6)');
    });
  });
});