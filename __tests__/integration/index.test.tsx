import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Home from '@/pages/index';
import * as cryptoApi from '@/pages/api/cryptoApi';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { CurrencySelector } from '@/components/CoinSelector';
import { setCurrency } from '@/store/cryptoSlice';

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
  });

  function renderHome() {
    return render(
      <Provider store={store}>
        <Home />
      </Provider>
    );
  }

  it('renders loading state and then displays coins', async () => {
    renderHome();
    expect(screen.getByText(/loading coins/i)).toBeInTheDocument();
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
    await waitFor(() => expect(cryptoApi.getTopMarketCaps).toHaveBeenCalled());
  });

  it('renders CurrencySelector and changes currency', () => {
    const mockDispatch = jest.fn();
    render(<CurrencySelector value="usd" onChange={mockDispatch} />);
    const select = screen.getByLabelText('Select currency');
    expect(select).toHaveValue('usd');
    fireEvent.change(select, { target: { value: 'eur' } });
    expect(mockDispatch).toHaveBeenCalledWith('eur');
  });
});
