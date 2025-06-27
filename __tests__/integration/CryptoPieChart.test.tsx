import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cryptoReducer from '@/store/cryptoSlice';
import { CryptoPieChart } from '@/components/CryptoPieChart';
import * as cryptoApi from '@/pages/api/cryptoApi';

// Mock Pie from react-chartjs-2 to avoid canvas errors and allow label queries
jest.mock('react-chartjs-2', () => ({
  Pie: ({ data }: any) => (
    <div data-testid="mock-pie">
      {data.labels && data.labels.map((label: string) => (
        <span key={label}>{label}</span>
      ))}
    </div>
  ),
}));

// Mock the API module to control responses in tests
jest.mock('@/pages/api/cryptoApi');

describe('CryptoPieChart Integration', () => {
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
    {
      id: 'tether',
      symbol: 'usdt',
      name: 'Tether',
      image: '',
      current_price: 1,
      market_cap: 70000000,
      market_cap_rank: 3,
      total_volume: 3000000,
      high_24h: 1.01,
      low_24h: 0.99,
      price_change_24h: 0,
      price_change_percentage_24h: 0,
      price_change_percentage_7d: 0,
      circulating_supply: 70000000,
      total_supply: null,
    },
    {
      id: 'binancecoin',
      symbol: 'bnb',
      name: 'BNB',
      image: '',
      current_price: 600,
      market_cap: 60000000,
      market_cap_rank: 4,
      total_volume: 2000000,
      high_24h: 610,
      low_24h: 590,
      price_change_24h: 10,
      price_change_percentage_24h: 1.7,
      price_change_percentage_7d: 3,
      circulating_supply: 100000000,
      total_supply: 200000000,
    },
    {
      id: 'solana',
      symbol: 'sol',
      name: 'Solana',
      image: '',
      current_price: 150,
      market_cap: 50000000,
      market_cap_rank: 5,
      total_volume: 1000000,
      high_24h: 155,
      low_24h: 145,
      price_change_24h: 5,
      price_change_percentage_24h: 3.5,
      price_change_percentage_7d: 6,
      circulating_supply: 333333333,
      total_supply: 500000000,
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
  function renderPieChart() {
    const store = createTestStore();
    return render(
      <Provider store={store}>
        <CryptoPieChart />
      </Provider>
    );
  }

  it('shows loading state initially', async () => {
    renderPieChart();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());
  });

  it('renders the pie chart after loading', async () => {
    renderPieChart();
    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());
    // Check for the mocked Pie component
    expect(screen.getByTestId('mock-pie')).toBeInTheDocument();
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
        <CryptoPieChart />
      </Provider>
    );
    await waitFor(() => expect(screen.getByText(/error/i)).toBeInTheDocument());
    expect(screen.getByText(/api error/i)).toBeInTheDocument();
  });

  it('shows no data message if API returns empty array', async () => {
    (cryptoApi.getTopMarketCaps as jest.Mock).mockResolvedValueOnce([]);
    const store = createTestStore();
    render(
      <Provider store={store}>
        <CryptoPieChart />
      </Provider>
    );
    await waitFor(() => expect(screen.getByText(/no data to display/i)).toBeInTheDocument());
  });
});
