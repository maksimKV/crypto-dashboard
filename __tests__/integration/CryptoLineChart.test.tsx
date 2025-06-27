import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cryptoReducer from '@/store/cryptoSlice';
import { CryptoLineChart } from '@/components/CryptoLineChart';
import * as cryptoApi from '@/pages/api/cryptoApi';

// Mock Line from react-chartjs-2 to avoid canvas errors and allow label queries
jest.mock('react-chartjs-2', () => ({
  Line: ({ data }: any) => (
    <div data-testid="mock-line">
      {data && data.datasets && data.datasets[0] && (
        <span>{data.datasets[0].label}</span>
      )}
    </div>
  ),
}));

// Mock the API module to control responses in tests
jest.mock('@/pages/api/cryptoApi');

describe('CryptoLineChart Integration', () => {
  // Mock data simulating the structure returned by the real API
  const mockMarketChartData = {
    prices: [
      [Date.now() - 86400000, 48000],
      [Date.now(), 50000],
    ],
    market_caps: [
      [Date.now() - 86400000, 900000000],
      [Date.now(), 1000000000],
    ],
    total_volumes: [
      [Date.now() - 86400000, 9000000],
      [Date.now(), 10000000],
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (cryptoApi.getMarketChart as jest.Mock).mockResolvedValue(mockMarketChartData);
  });

  // Helper to create a fresh Redux store for each test
  function createTestStore() {
    return configureStore({
      reducer: {
        crypto: cryptoReducer,
      },
    });
  }

  // Helper to render the component with Redux Provider and a fresh store
  function renderLineChart(coinId = 'bitcoin') {
    const store = createTestStore();
    return render(
      <Provider store={store}>
        <CryptoLineChart coinId={coinId} />
      </Provider>
    );
  }

  it('shows loading state initially', async () => {
    renderLineChart();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());
  });

  it('renders the line chart after loading', async () => {
    renderLineChart();
    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());
    // Check for the mocked Line component
    expect(screen.getByTestId('mock-line')).toBeInTheDocument();
    // Check that the dataset label is present
    expect(screen.getByText('Price of bitcoin')).toBeInTheDocument();
  });

  it('shows error state if API fails', async () => {
    (cryptoApi.getMarketChart as jest.Mock).mockRejectedValueOnce(new Error('API error'));
    const store = createTestStore();
    render(
      <Provider store={store}>
        <CryptoLineChart coinId="ethereum" />
      </Provider>
    );
    await waitFor(() => expect(screen.getByText(/error/i)).toBeInTheDocument());
    expect(screen.getByText(/api error/i)).toBeInTheDocument();
  });

  it('shows no data message if API returns empty data', async () => {
    (cryptoApi.getMarketChart as jest.Mock).mockResolvedValueOnce({ prices: [], market_caps: [], total_volumes: [] });
    const store = createTestStore();
    render(
      <Provider store={store}>
        <CryptoLineChart coinId="emptycoin" />
      </Provider>
    );
    await waitFor(() => expect(screen.getByTestId('mock-line')).toBeInTheDocument());
    // Should still render the chart with the correct label, but no data points
    expect(screen.getByText('Price of emptycoin')).toBeInTheDocument();
  });
});
