import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { CryptoBarChart } from '@/components/CryptoBarChart';
import * as cryptoApi from '@/pages/api/cryptoApi';

// Mock the API module to control responses in tests
jest.mock('@/pages/api/cryptoApi');

describe('CryptoBarChart Integration', () => {
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
    // By default, resolve the API call with mock data
    (cryptoApi.getMarketChart as jest.Mock).mockResolvedValue(mockMarketChartData);
  });

  // Helper to render the component with Redux Provider
  function renderBarChart(coinId = 'bitcoin') {
    return render(
      <Provider store={store}>
        <CryptoBarChart coinId={coinId} />
      </Provider>
    );
  }

  it('shows loading state initially', async () => {
    renderBarChart();
    // Should show loading text before data is loaded
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    // Wait for loading to disappear
    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());
  });

  it('renders the bar chart after loading', async () => {
    renderBarChart();
    // Wait for loading to disappear
    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());
    // Chart.js renders a canvas with role="img"
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('shows error state if API fails', async () => {
    // Simulate API failure for this test
    (cryptoApi.getMarketChart as jest.Mock).mockRejectedValueOnce(new Error('API error'));
    renderBarChart('ethereum');
    // Wait for error message to appear
    await waitFor(() => expect(screen.getByText(/error/i)).toBeInTheDocument());
    expect(screen.getByText(/api error/i)).toBeInTheDocument();
  });
});
