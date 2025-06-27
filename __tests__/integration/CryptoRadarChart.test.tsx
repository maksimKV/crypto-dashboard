import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cryptoReducer from '@/store/cryptoSlice';
import { CryptoRadarChart } from '@/components/CryptoRadarChart';
import * as cryptoApi from '@/pages/api/cryptoApi';

// Mock Radar from react-chartjs-2 to avoid canvas errors and allow label queries
jest.mock('react-chartjs-2', () => ({
  Radar: ({ data }: any) => (
    <div data-testid="mock-radar">
      {data.datasets && data.datasets.map((ds: any) => (
        <span key={ds.label}>{ds.label}</span>
      ))}
    </div>
  ),
}));

// Mock the API module to control responses in tests
jest.mock('@/pages/api/cryptoApi');

describe('CryptoRadarChart Integration', () => {
  // Mock data simulating the structure returned by the real API
  const mockTopMarketCaps = [
    {
      id: 'bitcoin',
      symbol: 'btc',
      name: 'Bitcoin',
      image: '',
      current_price: 50000,
      market_cap: 1000000000,
      market_cap_rank: 1,
      total_volume: 10000000,
      high_24h: 51000,
      low_24h: 49000,
      price_change_24h: 1000,
      price_change_percentage_24h: 2,
      price_change_percentage_7d: 5,
      circulating_supply: 18000000,
      total_supply: 21000000,
    },
    {
      id: 'ethereum',
      symbol: 'eth',
      name: 'Ethereum',
      image: '',
      current_price: 4000,
      market_cap: 500000000,
      market_cap_rank: 2,
      total_volume: 5000000,
      high_24h: 4100,
      low_24h: 3900,
      price_change_24h: 100,
      price_change_percentage_24h: 2.5,
      price_change_percentage_7d: 4,
      circulating_supply: 110000000,
      total_supply: null,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (cryptoApi.getTopMarketCaps as jest.Mock).mockResolvedValue(mockTopMarketCaps);
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
  function renderRadarChart() {
    const store = createTestStore();
    return render(
      <Provider store={store}>
        <CryptoRadarChart />
      </Provider>
    );
  }

  it('shows loading state initially', async () => {
    renderRadarChart();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());
  });

  it('renders the radar chart after loading', async () => {
    renderRadarChart();
    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());
    // Check for the mocked Radar component
    expect(screen.getByTestId('mock-radar')).toBeInTheDocument();
    // Check that all coin names are present as labels
    mockTopMarketCaps.forEach(coin => {
      expect(screen.getByText(coin.name)).toBeInTheDocument();
    });
  });

  it('shows error state if API fails', async () => {
    (cryptoApi.getTopMarketCaps as jest.Mock).mockRejectedValueOnce(new Error('API error'));
    const store = createTestStore();
    render(
      <Provider store={store}>
        <CryptoRadarChart />
      </Provider>
    );
    // Wait for either error or no data message
    await waitFor(() => {
      expect(
        screen.queryByText(/error/i) || screen.queryByText(/no data to display/i)
      ).toBeInTheDocument();
    });
    // If error is present, check its content
    const errorEl = screen.queryByText(/error/i);
    if (errorEl) {
      expect(errorEl).toHaveTextContent(/api error/i);
    }
  });

  it('shows no data message if API returns empty array', async () => {
    (cryptoApi.getTopMarketCaps as jest.Mock).mockResolvedValueOnce([]);
    const store = createTestStore();
    render(
      <Provider store={store}>
        <CryptoRadarChart />
      </Provider>
    );
    await waitFor(() => expect(screen.getByText(/no data to display/i)).toBeInTheDocument());
  });
});
