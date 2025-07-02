import type { ChartProps } from 'react-chartjs-2/dist/types';
jest.mock('react-chartjs-2', () => ({
  Bar: (props: ChartProps<'bar'>) => <div data-testid="mock-bar-chart">Bar Chart Rendered</div>,
}));
import React from 'react';
import { render, screen } from '@testing-library/react';
import { CryptoBarChart } from '@/components/CryptoBarChart';

// Mock react-redux hooks
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: () => jest.fn(),
}));

const mockUseSelector = require('react-redux').useSelector;

describe('CryptoBarChart (unit)', () => {
  const coinId = 'bitcoin';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state as no data', () => {
    mockUseSelector.mockImplementation((selector: unknown) => {
      if (selector.name === 'selectLoadingChart') return true;
      if (selector.name === 'selectChartError') return null;
      if (selector.name === 'selectMarketChartData') return null;
      if (selector.name === 'selectCurrency') return 'usd';
      return undefined;
    });
    render(<CryptoBarChart coinId={coinId} />);
    expect(screen.getByText(/no data to display/i)).toBeInTheDocument();
  });

  it('renders error state as no data', () => {
    mockUseSelector.mockImplementation((selector: unknown) => {
      if (selector.name === 'selectLoadingChart') return false;
      if (selector.name === 'selectChartError') return 'API error';
      if (selector.name === 'selectMarketChartData') return null;
      if (selector.name === 'selectCurrency') return 'usd';
      return undefined;
    });
    render(<CryptoBarChart coinId={coinId} />);
    expect(screen.getByText(/no data to display/i)).toBeInTheDocument();
  });

  it('renders no data state', () => {
    mockUseSelector.mockImplementation((selector: unknown) => {
      if (selector.name === 'selectLoadingChart') return false;
      if (selector.name === 'selectChartError') return null;
      if (selector.name === 'selectMarketChartData') return null;
      if (selector.name === 'selectCurrency') return 'usd';
      return undefined;
    });
    render(<CryptoBarChart coinId={coinId} />);
    expect(screen.getByText(/no data to display/i)).toBeInTheDocument();
  });

  it('renders the bar chart with valid data', () => {
    const coinId = 'bitcoin';
    mockUseSelector.mockImplementation((selector: unknown) => {
      if (selector.name === 'selectLoadingChart') return false;
      if (selector.name === 'selectChartError') return null;
      if (selector.name === 'selectCurrency') return 'usd';
      if (typeof selector === 'function' && selector.name === 'memoized') {
        const now = Date.now();
        const mockState = {
          crypto: {
            marketChartData: {
              [coinId]: {
                data: {
                  prices: [[now, 100], [now + 1000, 200]],
                  market_caps: [[now, 1000], [now + 1000, 2000]],
                  total_volumes: [[now, 500], [now + 1000, 600]],
                },
              },
            },
          },
        };
        return selector(mockState);
      }
      return undefined;
    });
    render(<CryptoBarChart coinId={coinId} />);
    expect(screen.getByTestId('mock-bar-chart')).toBeInTheDocument();
  });

  it('handles malformed data gracefully', () => {
    // Should not throw or break if data is malformed
    mockUseSelector.mockImplementation((selector: unknown) => {
      if (selector.name === 'selectLoadingChart') return false;
      if (selector.name === 'selectChartError') return null;
      if (selector.name === 'selectMarketChartData') return { prices: null, market_caps: null, total_volumes: null };
      if (selector.name === 'selectCurrency') return 'usd';
      return undefined;
    });
    render(<CryptoBarChart coinId={coinId} />);
    expect(screen.getByText(/no data to display/i)).toBeInTheDocument();
  });
}); 