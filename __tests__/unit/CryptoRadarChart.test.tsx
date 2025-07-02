import type { ChartProps } from 'react-chartjs-2/dist/types';
jest.mock('react-chartjs-2', () => ({
  Radar: (props: ChartProps<'radar'>) => <div data-testid="mock-radar-chart">Radar Chart Rendered</div>,
}));
import React from 'react';
import { render, screen } from '@testing-library/react';
import { CryptoRadarChart } from '@/components/CryptoRadarChart';

// Mock react-redux hooks
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: () => jest.fn(),
}));

const mockUseSelector = require('react-redux').useSelector;

describe('CryptoRadarChart (unit)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state as no data', () => {
    mockUseSelector.mockImplementation((selector: any) => {
      if (selector.name === 'selectLoadingTopCaps') return true;
      if (selector.name === 'selectTopCapsError') return null;
      if (selector.name === 'selectTopMarketCaps') return null;
      if (selector.name === 'selectCurrency') return 'usd';
      return undefined;
    });
    render(<CryptoRadarChart />);
    expect(screen.getByText(/no data to display/i)).toBeInTheDocument();
  });

  it('renders error state as no data', () => {
    mockUseSelector.mockImplementation((selector: any) => {
      if (selector.name === 'selectLoadingTopCaps') return false;
      if (selector.name === 'selectTopCapsError') return 'API error';
      if (selector.name === 'selectTopMarketCaps') return null;
      if (selector.name === 'selectCurrency') return 'usd';
      return undefined;
    });
    render(<CryptoRadarChart />);
    expect(screen.getByText(/no data to display/i)).toBeInTheDocument();
  });

  it('renders no data state', () => {
    mockUseSelector.mockImplementation((selector: any) => {
      if (selector.name === 'selectLoadingTopCaps') return false;
      if (selector.name === 'selectTopCapsError') return null;
      if (selector.name === 'selectTopMarketCaps') return { length: 0 };
      if (selector.name === 'selectCurrency') return 'usd';
      return undefined;
    });
    render(<CryptoRadarChart />);
    expect(screen.getByText(/no data to display/i)).toBeInTheDocument();
  });

  it('renders the radar chart with valid data', () => {
    mockUseSelector.mockImplementation((selector: any) => {
      if (selector.name === 'selectLoadingTopCaps') return false;
      if (selector.name === 'selectTopCapsError') return null;
      if (selector.name === 'selectCurrency') return 'usd';
      if (typeof selector === 'function' && selector.name === 'memoized') {
        const mockState = {
          crypto: {
            topMarketCaps: {
              data: [
                { id: 'bitcoin', name: 'Bitcoin', market_cap: 1000000000, total_volume: 10000000, price_change_percentage_24h: 2 },
                { id: 'ethereum', name: 'Ethereum', market_cap: 500000000, total_volume: 5000000, price_change_percentage_24h: 2.5 },
                { id: 'tether', name: 'Tether', market_cap: 300000000, total_volume: 3000000, price_change_percentage_24h: 1.2 },
                { id: 'binancecoin', name: 'BNB', market_cap: 200000000, total_volume: 2000000, price_change_percentage_24h: 0.8 },
                { id: 'solana', name: 'Solana', market_cap: 100000000, total_volume: 1000000, price_change_percentage_24h: 3.1 },
              ],
            },
          },
        };
        return selector(mockState);
      }
      return undefined;
    });
    render(<CryptoRadarChart />);
    expect(screen.getByTestId('mock-radar-chart')).toBeInTheDocument();
  });

  it('handles malformed data gracefully', () => {
    // Should not throw or break if data is malformed
    mockUseSelector.mockImplementation((selector: any) => {
      if (selector.name === 'selectLoadingTopCaps') return false;
      if (selector.name === 'selectTopCapsError') return null;
      if (selector.name === 'selectTopMarketCaps') return null;
      if (selector.name === 'selectCurrency') return 'usd';
      return undefined;
    });
    render(<CryptoRadarChart />);
    expect(screen.getByText(/no data to display/i)).toBeInTheDocument();
  });
}); 