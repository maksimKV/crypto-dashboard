import React, { useEffect, useMemo, ReactElement } from 'react';
import { Radar } from 'react-chartjs-2';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store';
import { fetchTopMarketCaps } from '@/store/cryptoSlice';
import {
  selectTopMarketCaps,
  selectLoadingTopCaps,
  selectChartError,
} from '@/store/selectors';
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

// Register necessary Chart.js components for radar charts
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

/**
 * CryptoRadarChartComponent displays a radar chart comparing top cryptocurrencies
 * by market cap, 24h price change, and total volume.
 */
function CryptoRadarChartComponent(): ReactElement {
  const dispatch = useDispatch<AppDispatch>();
  const topCoins = useSelector(selectTopMarketCaps);
  const loading = useSelector(selectLoadingTopCaps);
  const error = useSelector(selectChartError);

  // Fetch top market cap coins on mount if not already available
  useEffect(() => {
    if (topCoins.length === 0) {
      dispatch(fetchTopMarketCaps());
    }
  }, [dispatch, topCoins]);

  // Memoize radar chart data for performance
  const chartData = useMemo(() => {
    if (!topCoins || topCoins.length === 0) return null;

    const labels = ['Market Cap', '24h Change (%)', 'Volume'];
    const datasets = topCoins.map((coin, idx) => ({
      label: coin.name,
      data: [coin.market_cap, coin.price_change_percentage_24h, coin.total_volume],
      backgroundColor: `hsla(${(idx * 72) % 360}, 70%, 60%, 0.3)`,
      borderColor: `hsla(${(idx * 72) % 360}, 70%, 60%, 1)`,
      borderWidth: 1,
    }));

    return { labels, datasets };
  }, [topCoins]);

  if (loading) return <p className="text-center py-10">Loading radar chart...</p>;
  if (error) return <p className="text-red-600 text-center py-10">Error: {error}</p>;
  if (!chartData) return <p className="text-center py-10">No data available.</p>;

  const options: ChartOptions<'radar'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Top 5 Cryptos Comparison' },
    },
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <Radar data={chartData} options={options} />
    </div>
  );
}

export const CryptoRadarChart = React.memo(CryptoRadarChartComponent);