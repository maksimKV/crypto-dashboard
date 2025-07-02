import { cryptoReducer, fetchCoins, fetchMarketChart, fetchTopMarketCaps } from '@/store/cryptoSlice';
import { CoinData, MarketChartData } from '@/types/chartTypes';

describe('cryptoSlice reducer and async actions', () => {
  // Initial state based on the slice definition
  const initialState = {
    coins: null,
    marketChartData: {},
    topMarketCaps: null,
    loadingCoins: false,
    loadingChart: false,
    loadingTopCaps: false,
    error: null,
    chartError: null,
    topCapsError: null,
    currency: 'usd',
  };

  // Test default case where no action matches
  it('should return the initial state by default', () => {
    expect(cryptoReducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('fetchCoins async thunk cases', () => {
    // Pending case sets loading to true and clears error
    it('should handle fetchCoins.pending', () => {
      const action = { type: fetchCoins.pending.type };
      const state = cryptoReducer(initialState, action);
      expect(state.loadingCoins).toBe(true);
      expect(state.error).toBeNull();
    });

    // Fulfilled case stores fetched coins and sets loading to false
    it('should handle fetchCoins.fulfilled', () => {
      const coinsPayload: CoinData[] = [
        {
          id: 'bitcoin',
          symbol: 'btc',
          name: 'Bitcoin',
          image: '',
          current_price: 0,
          market_cap: 0,
          market_cap_rank: 1,
          total_volume: 0,
          high_24h: 0,
          low_24h: 0,
          price_change_24h: 0,
          price_change_percentage_24h: 0,
          circulating_supply: 0,
          total_supply: null,
        },
      ];
      const action = { type: fetchCoins.fulfilled.type, payload: coinsPayload };
      const state = cryptoReducer(initialState, action);
      expect(state.coins).toHaveProperty('data', coinsPayload);
      expect(state.loadingCoins).toBe(false);
    });

    // Rejected case sets loading to false and stores error message
    it('should handle fetchCoins.rejected', () => {
      const action = { type: fetchCoins.rejected.type, error: { message: 'Failed to fetch' } };
      const state = cryptoReducer(initialState, action);
      expect(state.loadingCoins).toBe(false);
      expect(state.error).toBe('Failed to fetch');
    });
  });

  describe('fetchMarketChart async thunk cases', () => {
    const coinId = 'bitcoin';
    const marketChartPayload: MarketChartData = {
      prices: [[0, 0]],
      market_caps: [[0, 0]],
      total_volumes: [[0, 0]],
    };

    // Pending case for market chart loading state and error clearing
    it('should handle fetchMarketChart.pending', () => {
      const action = { type: fetchMarketChart.pending.type };
      const state = cryptoReducer(initialState, action);
      expect(state.loadingChart).toBe(true);
      expect(state.chartError).toBeNull();
    });

    // Fulfilled case caches market chart data per coin and stops loading
    it('should handle fetchMarketChart.fulfilled', () => {
      const action = { type: fetchMarketChart.fulfilled.type, payload: { coinId, data: marketChartPayload } };
      const state = cryptoReducer(initialState, action);
      expect(state.marketChartData[coinId]).toHaveProperty('data', marketChartPayload);
      expect(state.loadingChart).toBe(false);
    });

    // Rejected case stores error and stops loading
    it('should handle fetchMarketChart.rejected', () => {
      const action = { type: fetchMarketChart.rejected.type, error: { message: 'Failed to fetch chart' } };
      const state = cryptoReducer(initialState, action);
      expect(state.loadingChart).toBe(false);
      expect(state.chartError).toBe('Failed to fetch chart');
    });
  });

  describe('fetchTopMarketCaps async thunk cases', () => {
    const topCapsPayload: CoinData[] = [
      {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        image: '',
        current_price: 0,
        market_cap: 0,
        market_cap_rank: 1,
        total_volume: 0,
        high_24h: 0,
        low_24h: 0,
        price_change_24h: 0,
        price_change_percentage_24h: 0,
        circulating_supply: 0,
        total_supply: null,
      },
    ];

    // Pending case sets loading and clears error for top market caps
    it('should handle fetchTopMarketCaps.pending', () => {
      const action = { type: fetchTopMarketCaps.pending.type };
      const state = cryptoReducer(initialState, action);
      expect(state.loadingTopCaps).toBe(true);
      expect(state.topCapsError).toBeNull();
    });

    // Fulfilled case caches top market caps and stops loading
    it('should handle fetchTopMarketCaps.fulfilled', () => {
      const action = { type: fetchTopMarketCaps.fulfilled.type, payload: topCapsPayload };
      const state = cryptoReducer(initialState, action);
      expect(state.topMarketCaps).toHaveProperty('data', topCapsPayload);
      expect(state.loadingTopCaps).toBe(false);
    });

    // Rejected case stores error and stops loading for top market caps
    it('should handle fetchTopMarketCaps.rejected', () => {
      const action = { type: fetchTopMarketCaps.rejected.type, error: { message: 'Failed to fetch top caps' } };
      const state = cryptoReducer(initialState, action);
      expect(state.loadingTopCaps).toBe(false);
      expect(state.topCapsError).toBe('Failed to fetch top caps');
    });
  });
});

describe('setCurrency reducer', () => {
  it('should update the currency in state', () => {
    const action = { type: 'crypto/setCurrency', payload: 'eur' };
    const state = cryptoReducer(undefined, action);
    expect(state.currency).toBe('eur');
  });
});  