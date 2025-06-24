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
} from 'chart.js';

import { selectTopMarketCaps, selectLoadingTopCaps } from '@/store/selectors';

ChartJS.register(ArcElement, Tooltip, Legend);

function CryptoPieChartComponent() {
  const dispatch = useDispatch<AppDispatch>();
  const topCoins = useSelector(selectTopMarketCaps);
  const loading = useSelector(selectLoadingTopCaps);

  useEffect(() => {
    if (topCoins.length === 0) {
      dispatch(fetchTopMarketCaps());
    }
  }, [dispatch, topCoins.length]);

  if (loading) return <p>Зареждане...</p>;
  if (!topCoins.length) return <p>Няма данни за показване.</p>;

  const data = {
    labels: topCoins.map(c => c.name),
    datasets: [
      {
        label: 'Пазарен дял',
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

  const options: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: { position: 'right' },
      title: { display: true, text: 'Пазарен дял на топ 5 криптовалути' },
    },
  };

  return <Pie data={data} options={options} />;
}

export const CryptoPieChart = React.memo(CryptoPieChartComponent);