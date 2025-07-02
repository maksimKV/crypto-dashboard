import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Home } from '@/pages/index';
import * as cryptoApi from '@/pages/api/cryptoApi';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { cryptoReducer } from '@/store/cryptoSlice';
import { CurrencySelector } from '@/components/CoinSelector';
import { setCurrency } from '@/store/cryptoSlice';
import { CoinData } from '@/types/chartTypes';

jest.mock('@/pages/api/cryptoApi');

describe('Home Page Integration', () => {
  const mockCoins = [
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
      circulating_supply: 110000000,
      total_supply: null,
    },
  ];

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

  const mockTopMarketCaps = mockCoins;

  beforeEach(() => {
    jest.clearAllMocks();
    (cryptoApi.getCoins as jest.Mock).mockResolvedValue(mockCoins);
    (cryptoApi.getMarketChart as jest.Mock).mockResolvedValue(mockMarketChartData);
    (cryptoApi.getTopMarketCaps as jest.Mock).mockResolvedValue(mockTopMarketCaps);

    // Mock fetch to simulate API responses for different endpoints
    jest.spyOn(global, 'fetch').mockImplementation((url) => {
      if (typeof url === 'string' && url.includes('/api/cryptoApi')) {
        if (url.includes('topMarketCaps=true')) {
          return Promise.resolve({
            ok: true,
            json: async () => mockTopMarketCaps,
          } as Response);
        }
        if (url.includes('coinId=')) {
          return Promise.resolve({
            ok: true,
            json: async () => mockMarketChartData,
          } as Response);
        }
        return Promise.resolve({
          ok: true,
          json: async () => mockCoins,
        } as Response);
      }
      return Promise.resolve({ ok: false, json: async () => ({}) } as Response);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  function createTestStore(preloadedState = {}) {
    return configureStore({
      reducer: { crypto: cryptoReducer },
      preloadedState,
    });
  }

  function renderHome() {
    const store = createTestStore();
    return render(
      <Provider store={store}>
        <Home />
      </Provider>
    );
  }

  function renderWithCoins(mockCoins: CoinData[]) {
    const store = configureStore({
      reducer: { crypto: cryptoReducer },
      preloadedState: {
        crypto: {
          coins: { timestamp: Date.now(), data: mockCoins },
          marketChartData: {},
          topMarketCaps: null,
          loadingCoins: false,
          loadingChart: false,
          loadingTopCaps: false,
          error: null,
          chartError: null,
          topCapsError: null,
          currency: 'usd',
        }
      }
    });
    return render(
      <Provider store={store}>
        <Home />
      </Provider>
    );
  }

  it('renders loading state and then displays coins', async () => {
    // Mock getCoins to resolve after a short delay
    (cryptoApi.getCoins as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(mockCoins), 50))
    );
    renderHome();
    await screen.findByText(/loading coins\.\.\./i);
    await waitFor(() => expect(screen.getByText('Bitcoin')).toBeInTheDocument());
    expect(screen.getByText('Ethereum')).toBeInTheDocument();
  });

  it('changes selected coin and updates chart', async () => {
    renderHome();
    await waitFor(() => expect(screen.getByText('Bitcoin')).toBeInTheDocument());
    const selects = screen.getAllByRole('combobox');
    // The second select is the coin selector
    const coinSelect = selects[1];
    fireEvent.change(coinSelect, { target: { value: 'ethereum' } });
    expect((coinSelect as HTMLSelectElement).value).toBe('ethereum');
    // Chart will show loading, then data
    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('switches chart tabs', async () => {
    renderHome();
    await waitFor(() => expect(screen.getByText('Bitcoin')).toBeInTheDocument());
    // Switch to Bar Chart
    fireEvent.click(screen.getByText('Bar Chart'));
    // Switch to Pie Chart
    fireEvent.click(screen.getByText('Pie Chart'));
    // Switch to Radar Chart (should trigger top market caps fetch)
    fireEvent.click(screen.getByText('Radar Chart'));
    // Wait for the radar chart to render (look for canvas)
    await waitFor(() => expect(screen.getByRole('img')).toBeInTheDocument());
  });

  it('renders CurrencySelector and changes currency', () => {
    const mockDispatch = jest.fn();
    render(<CurrencySelector value="usd" onChange={mockDispatch} />);
    const select = screen.getByLabelText('Select currency');
    expect(select).toHaveValue('usd');
    fireEvent.change(select, { target: { value: 'eur' } });
    expect(mockDispatch).toHaveBeenCalledWith('eur');
  });

  it('paginates coins and disables buttons at boundaries', async () => {
    // Create 40 mock coins for two pages
    const manyCoins = Array.from({ length: 40 }, (_, i) => ({
      id: `coin${i + 1}`,
      symbol: `c${i + 1}`,
      name: `Coin ${i + 1}`,
      image: '',
      current_price: 100 + i,
      market_cap: 1000 + i,
      market_cap_rank: i + 1,
      total_volume: 10000 + i,
      high_24h: 200 + i,
      low_24h: 50 + i,
      price_change_24h: 1 + i,
      price_change_percentage_24h: 0.1 * i,
      circulating_supply: 1000000 + i,
      total_supply: 2000000 + i,
    }));
    renderWithCoins(manyCoins);
    // Wait for first page to load
    await waitFor(() => {
      const options = screen.getAllByRole('option');
      expect(options.some(opt => opt.textContent?.includes('Coin 1'))).toBe(true);
    });
    // Should show Coin 1 and Coin 20, but not Coin 21 (pagination boundary)
    const options = screen.getAllByRole('option');
    expect(options.some(opt => opt.textContent?.includes('Coin 1'))).toBe(true);
    expect(options.some(opt => opt.textContent?.includes('Coin 20'))).toBe(true);
    expect(options.some(opt => opt.textContent?.includes('Coin 21'))).toBe(false);
    // Prev button should be disabled on first page
    const prevBtn = screen.getByRole('button', { name: /previous/i });
    expect(prevBtn).toBeDisabled();
    // Next button should be enabled
    const nextBtn = screen.getByRole('button', { name: /next/i });
    expect(nextBtn).not.toBeDisabled();
    // Go to next page
    nextBtn.click();
    await waitFor(() => {
      const options = screen.getAllByRole('option');
      expect(options.some(opt => opt.textContent?.includes('Coin 21'))).toBe(true);
    });
    const options2 = screen.getAllByRole('option');
    expect(options2.some(opt => opt.textContent?.includes('Coin 40'))).toBe(true);
    expect(options2.some(opt => opt.textContent?.includes('Coin 1'))).toBe(false);
    // Next button should now be disabled on last page
    expect(nextBtn).toBeDisabled();
    // Prev button should be enabled
    expect(prevBtn).not.toBeDisabled();
    // Go back to previous page
    prevBtn.click();
    await waitFor(() => {
      const options = screen.getAllByRole('option');
      expect(options.some(opt => opt.textContent?.includes('Coin 1'))).toBe(true);
    });
    const options3 = screen.getAllByRole('option');
    expect(options3.some(opt => opt.textContent?.includes('Coin 20'))).toBe(true);
  });

  it('full user flow: landing, select coin, change currency, switch charts, paginate', async () => {
    // Create 40 mock coins for two pages
    const manyCoins = Array.from({ length: 40 }, (_, i) => ({
      id: `coin${i + 1}`,
      symbol: `c${i + 1}`,
      name: `Coin ${i + 1}`,
      image: '',
      current_price: 100 + i,
      market_cap: 1000 + i,
      market_cap_rank: i + 1,
      total_volume: 10000 + i,
      high_24h: 200 + i,
      low_24h: 50 + i,
      price_change_24h: 1 + i,
      price_change_percentage_24h: 0.1 * i,
      circulating_supply: 1000000 + i,
      total_supply: 2000000 + i,
    }));
    renderWithCoins(manyCoins);
    // Wait for first page to load
    await waitFor(() => {
      const options = screen.getAllByRole('option');
      expect(options.some(opt => opt.textContent?.includes('Coin 1'))).toBe(true);
    });
    // Select a coin
    const selects = screen.getAllByRole('combobox');
    const coinSelect = selects[1];
    fireEvent.change(coinSelect, { target: { value: 'coin5' } });
    expect((coinSelect as HTMLSelectElement).value).toBe('coin5');
    // Change currency
    const currencySelect = selects[0];
    fireEvent.change(currencySelect, { target: { value: 'eur' } });
    expect((currencySelect as HTMLSelectElement).value).toBe('eur');
    // Switch chart types
    fireEvent.click(screen.getByText('Bar Chart'));
    fireEvent.click(screen.getByText('Pie Chart'));
    fireEvent.click(screen.getByText('Radar Chart'));
    fireEvent.click(screen.getByText('Line Chart'));
    // Paginate to next page
    const nextBtn = screen.getByRole('button', { name: /next/i });
    nextBtn.click();
    await waitFor(() => {
      const options = screen.getAllByRole('option');
      expect(options.some(opt => opt.textContent?.includes('Coin 21'))).toBe(true);
    });
    // Paginate back to previous page
    const prevBtn = screen.getByRole('button', { name: /previous/i });
    prevBtn.click();
    await waitFor(() => {
      const options = screen.getAllByRole('option');
      expect(options.some(opt => opt.textContent?.includes('Coin 1'))).toBe(true);
    });
  });

  it('shows user-friendly error on API/network failure and recovers', async () => {
    jest.spyOn(global, 'fetch').mockImplementation((url) => {
      if (typeof url === 'string' && url.includes('/api/cryptoApi')) {
        return Promise.reject(new Error('Network error'));
      }
      return Promise.resolve(new Response(JSON.stringify({})));
    });
    renderHome();
    await waitFor(
      () => expect(screen.getByText((content) => content.includes('Network error'))).toBeInTheDocument(),
      { timeout: 2000 }
    );
    // Simulate retry with successful response
    (global.fetch as jest.Mock).mockImplementation((url) => {
      if (typeof url === 'string' && url.includes('/api/cryptoApi')) {
        return Promise.resolve(
          new Response(
            JSON.stringify([
              { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', image: '', current_price: 50000, market_cap: 1000000000, market_cap_rank: 1, total_volume: 10000000, high_24h: 51000, low_24h: 49000, price_change_24h: 1000, price_change_percentage_24h: 2, circulating_supply: 18000000, total_supply: 21000000 }
            ])
          )
        );
      }
      return Promise.resolve(new Response(JSON.stringify({})));
    });
    renderHome();
    await waitFor(() => expect(screen.getByText('Bitcoin')).toBeInTheDocument());
  });

  it('shows rate limit error (429) and recovers after retry', async () => {
    jest.spyOn(global, 'fetch').mockImplementation((url) => {
      if (typeof url === 'string' && url.includes('/api/cryptoApi')) {
        return Promise.reject(new Error('429'));
      }
      return Promise.resolve(new Response(JSON.stringify({})));
    });
    renderHome();
    await waitFor(
      () => expect(screen.getByText((content) => content.includes('Error: 429'))).toBeInTheDocument(),
      { timeout: 2000 }
    );
    // Simulate retry with successful response
    (global.fetch as jest.Mock).mockImplementation((url) => {
      if (typeof url === 'string' && url.includes('/api/cryptoApi')) {
        return Promise.resolve(
          new Response(
            JSON.stringify([
              { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', image: '', current_price: 50000, market_cap: 1000000000, market_cap_rank: 1, total_volume: 10000000, high_24h: 51000, low_24h: 49000, price_change_24h: 1000, price_change_percentage_24h: 2, circulating_supply: 18000000, total_supply: 21000000 }
            ])
          )
        );
      }
      return Promise.resolve(new Response(JSON.stringify({})));
    });
    renderHome();
    await waitFor(() => expect(screen.getByText('Bitcoin')).toBeInTheDocument());
  });
});
