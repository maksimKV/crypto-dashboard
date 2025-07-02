import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { cryptoReducer } from '@/store/cryptoSlice';
import { CryptoLineChart } from '@/components/CryptoLineChart';

const defaultCryptoState = {
  coins: { timestamp: Date.now(), data: [], severity: null },
  loadingCoins: false,
  errorCoins: null,
  currency: 'usd',
  marketChartData: {},
  loadingChart: false,
  chartError: null,
  topMarketCaps: { timestamp: Date.now(), data: [] },
  loadingTopCaps: false,
  topCapsError: null,
  error: null,
  severity: null,
};

const mockMarketChartData = {
  prices: [ [Date.now() - 86400000, 48000], [Date.now(), 50000] ],
  market_caps: [ [Date.now() - 86400000, 900000000], [Date.now(), 1000000000] ],
  total_volumes: [ [Date.now() - 86400000, 9000000], [Date.now(), 10000000] ],
};

function createTestStore(initialState = {}) {
  return configureStore({
    reducer: { crypto: cryptoReducer },
    preloadedState: { crypto: { ...defaultCryptoState, ...initialState } },
  });
}

function renderLineChart(coinId = 'bitcoin', state = {}) {
  const store = createTestStore(state);
  return render(
    <Provider store={store}>
      <CryptoLineChart coinId={coinId} />
    </Provider>
  );
}

describe('CryptoLineChart Integration', () => {
  it('shows loading state', async () => {
    renderLineChart('bitcoin', { loadingChart: true });
    await waitFor(() => expect(screen.getByText(/loading/i)).toBeInTheDocument());
  });

  it('shows error state', async () => {
    renderLineChart('bitcoin', { loadingChart: false, chartError: 'API error', marketChartData: { bitcoin: { timestamp: Date.now(), data: { prices: [[Date.now(), 50000]], market_caps: [[Date.now(), 1000000000]], total_volumes: [[Date.now(), 10000000]] } } } });
    await waitFor(() => expect(screen.getByText(/error/i)).toBeInTheDocument());
    expect(screen.getByText(/api error/i)).toBeInTheDocument();
  });

  it('shows no data message', async () => {
    renderLineChart('bitcoin', {
      loadingChart: false,
      chartError: null,
      marketChartData: {
        bitcoin: { timestamp: Date.now(), data: { prices: [], market_caps: [], total_volumes: [] } }
      }
    });
    await waitFor(() => expect(screen.getByText(/no data to display/i)).toBeInTheDocument());
  });

  it('renders the line chart when data is present', async () => {
    renderLineChart('bitcoin', { loadingChart: false, chartError: null, marketChartData: { bitcoin: { timestamp: Date.now(), data: { prices: [[Date.now(), 50000]], market_caps: [[Date.now(), 1000000000]], total_volumes: [[Date.now(), 10000000]] } } } });
    await waitFor(() => expect(screen.getByRole('img')).toBeInTheDocument());
  });
});
