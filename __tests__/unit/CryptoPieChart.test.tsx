import type { ChartProps } from 'react-chartjs-2/dist/types';
jest.mock('react-chartjs-2', () => ({
  Pie: (props: ChartProps<'pie'>) => <div data-testid="mock-pie-chart">Pie Chart Rendered</div>,
}));
import React from 'react';
import { render, screen } from '@testing-library/react';
import { CryptoPieChart } from '@/components/CryptoPieChart';
import { RootState } from '@/store';

// Mock react-redux hooks
type UnwrappablePromise = Promise<void> & { unwrap: () => Promise<void> };

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: () => () => {
    const promise = Promise.resolve() as UnwrappablePromise;
    promise.unwrap = () => Promise.resolve();
    return promise;
  },
}));

const mockUseSelector = require('react-redux').useSelector;

describe('CryptoPieChart (unit)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state as no data', () => {
    mockUseSelector.mockImplementation((selector: (state: RootState) => unknown) => {
      const fn = selector as Function;
      if ('name' in fn && fn.name === 'selectLoadingTopCaps') return true;
      if ('name' in fn && fn.name === 'selectTopCapsError') return null;
      if ('name' in fn && fn.name === 'selectTopMarketCaps') return null;
      if ('name' in fn && fn.name === 'selectCurrency') return 'usd';
      return undefined;
    });
    render(<CryptoPieChart />);
    expect(screen.getByText(/no data to display/i)).toBeInTheDocument();
  });

  it('renders error state as no data', () => {
    mockUseSelector.mockImplementation((selector: (state: RootState) => unknown) => {
      const fn = selector as Function;
      if ('name' in fn && fn.name === 'selectLoadingTopCaps') return false;
      if ('name' in fn && fn.name === 'selectTopCapsError') return 'API error';
      if ('name' in fn && fn.name === 'selectTopMarketCaps') return null;
      if ('name' in fn && fn.name === 'selectCurrency') return 'usd';
      return undefined;
    });
    render(<CryptoPieChart />);
    expect(screen.getByText(/no data to display/i)).toBeInTheDocument();
  });

  it('renders no data state', () => {
    mockUseSelector.mockImplementation((selector: (state: RootState) => unknown) => {
      const fn = selector as Function;
      if ('name' in fn && fn.name === 'selectLoadingTopCaps') return false;
      if ('name' in fn && fn.name === 'selectTopCapsError') return null;
      if ('name' in fn && fn.name === 'selectTopMarketCaps') return { length: 0 };
      if ('name' in fn && fn.name === 'selectCurrency') return 'usd';
      return undefined;
    });
    render(<CryptoPieChart />);
    expect(screen.getByText(/no data to display/i)).toBeInTheDocument();
  });

  it('renders the pie chart with valid data', () => {
    mockUseSelector.mockImplementation((selector: (state: RootState) => unknown) => {
      const fn = selector as Function;
      if ('name' in fn && fn.name === 'selectLoadingTopCaps') return false;
      if ('name' in fn && fn.name === 'selectTopCapsError') return null;
      if ('name' in fn && fn.name === 'selectCurrency') return 'usd';
      if (typeof fn === 'function' && fn.name === 'memoized') {
        const mockState = {
          crypto: {
            topMarketCaps: {
              data: [
                { id: 'bitcoin', name: 'Bitcoin', market_cap: 1000000000 },
                { id: 'ethereum', name: 'Ethereum', market_cap: 500000000 },
                { id: 'tether', name: 'Tether', market_cap: 300000000 },
                { id: 'binancecoin', name: 'BNB', market_cap: 200000000 },
                { id: 'solana', name: 'Solana', market_cap: 100000000 },
              ],
            },
          },
        };
        return fn(mockState);
      }
      return undefined;
    });
    render(<CryptoPieChart />);
    expect(screen.getByTestId('mock-pie-chart')).toBeInTheDocument();
  });

  it('handles malformed data gracefully', () => {
    // Should not throw or break if data is malformed
    mockUseSelector.mockImplementation((selector: (state: RootState) => unknown) => {
      const fn = selector as Function;
      if ('name' in fn && fn.name === 'selectLoadingTopCaps') return false;
      if ('name' in fn && fn.name === 'selectTopCapsError') return null;
      if ('name' in fn && fn.name === 'selectTopMarketCaps') return null;
      if ('name' in fn && fn.name === 'selectCurrency') return 'usd';
      return undefined;
    });
    render(<CryptoPieChart />);
    expect(screen.getByText(/no data to display/i)).toBeInTheDocument();
  });
}); 