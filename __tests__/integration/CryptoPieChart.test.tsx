import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cryptoReducer from '@/store/cryptoSlice';
import { CryptoPieChart } from '@/components/CryptoPieChart';

const defaultCryptoState = {
  coins: { timestamp: Date.now(), data: [], severity: null },
  loadingCoins: false,
  errorCoins: null,
  currency: 'usd',
  topMarketCaps: { timestamp: Date.now(), data: [] },
  loadingTopCaps: false,
  topCapsError: null,
  marketChartData: {},
  loadingChart: false,
  chartError: null,
  error: null,
  severity: null,
};

const mockTopMarketCaps = [
  { id: 'bitcoin', name: 'Bitcoin', market_cap: 1000000000 },
  { id: 'ethereum', name: 'Ethereum', market_cap: 500000000 },
];

function createTestStore(initialState = {}) {
  return configureStore({
    reducer: { crypto: cryptoReducer },
    preloadedState: { crypto: { ...defaultCryptoState, ...initialState } },
  });
}

function renderPieChart(state = {}) {
  const store = createTestStore(state);
  return render(
    <Provider store={store}>
      <CryptoPieChart />
    </Provider>
  );
}

describe('CryptoPieChart Integration', () => {
  it('shows loading state', async () => {
    renderPieChart({ loadingTopCaps: true });
    await waitFor(() => expect(screen.getByText(/loading/i)).toBeInTheDocument());
  });

  it('shows error state', async () => {
    renderPieChart({ loadingTopCaps: false, topCapsError: 'API error', topMarketCaps: { timestamp: Date.now(), data: [{ id: 'bitcoin', name: 'Bitcoin', market_cap: 1000000000 }] } });
    await waitFor(() => expect(screen.getByText(/error/i)).toBeInTheDocument());
    expect(screen.getByText(/api error/i)).toBeInTheDocument();
  });

  it('shows no data message', async () => {
    renderPieChart({ loadingTopCaps: false, topCapsError: null, topMarketCaps: { timestamp: Date.now(), data: [] } });
    await waitFor(() => expect(screen.getByText(/no data to display/i)).toBeInTheDocument());
  });

  it('renders the pie chart when data is present', async () => {
    renderPieChart({ loadingTopCaps: false, topCapsError: null, topMarketCaps: { timestamp: Date.now(), data: [{ id: 'bitcoin', name: 'Bitcoin', market_cap: 1000000000 }] } });
    await waitFor(() => expect(screen.getByRole('img')).toBeInTheDocument());
  });
});
