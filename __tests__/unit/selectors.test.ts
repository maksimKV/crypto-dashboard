import {
    selectCryptoState,
    selectCoins,
    selectLoadingCoins,
    selectErrorCoins,
    selectTopMarketCaps,
    selectLoadingTopCaps,
    selectMarketChartData,
    selectLoadingChart,
    selectChartError,
    selectCurrency,
  } from '@/store/selectors';
  import type { CryptoState } from '../../src/store/cryptoSlice';
  
  describe('crypto selectors', () => {
    // Sample mock state matching the expected RootState shape for crypto slice
    const mockState: { crypto: CryptoState } = {
      crypto: {
        coins: { timestamp: 123, data: [{ id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', image: '', current_price: 1, market_cap: 1, market_cap_rank: 1, total_volume: 1, high_24h: 1, low_24h: 1, price_change_24h: 1, price_change_percentage_24h: 1, circulating_supply: 1, total_supply: 1 }] },
        loadingCoins: true,
        error: 'Error fetching coins',
        topMarketCaps: { timestamp: 456, data: [{ id: 'ethereum', name: 'Ethereum' }] },
        loadingTopCaps: false,
        marketChartData: {
          bitcoin: {
            timestamp: 789,
            data: { prices: [[1, 100]], market_caps: [], total_volumes: [] },
          },
        },
        loadingChart: true,
        chartError: 'Error fetching chart',
        currency: 'bgn',
      },
    };
  
    it('should select the crypto slice state', () => {
      expect(selectCryptoState(mockState)).toEqual(mockState.crypto);
    });
  
    it('should select coins data or empty array', () => {
      expect(selectCoins(mockState)).toEqual(mockState.crypto.coins.data);
      // When coins is null, fallback to empty array
      expect(selectCoins({ crypto: { ...mockState.crypto, coins: null } })).toEqual([]);
    });
  
    it('should select loadingCoins boolean', () => {
      expect(selectLoadingCoins(mockState)).toBe(true);
    });
  
    it('should select error message for coins', () => {
      expect(selectErrorCoins(mockState)).toBe('Error fetching coins');
    });
  
    it('should select top market caps data or empty array', () => {
      expect(selectTopMarketCaps(mockState)).toEqual(mockState.crypto.topMarketCaps.data);
      // When topMarketCaps is null fallback to empty array
      expect(selectTopMarketCaps({ crypto: { ...mockState.crypto, topMarketCaps: null } })).toEqual([]);
    });
  
    it('should select loadingTopCaps boolean', () => {
      expect(selectLoadingTopCaps(mockState)).toBe(false);
    });
  
    it('should select market chart data for a specific coin or null', () => {
      const selector = selectMarketChartData('bitcoin');
      expect(selector(mockState)).toEqual(mockState.crypto.marketChartData.bitcoin.data);
      // When no data for coinId, fallback to null
      const emptyState = { crypto: { ...mockState.crypto, marketChartData: {} } };
      expect(selector(emptyState)).toBeNull();
    });
  
    it('should select loadingChart boolean', () => {
      expect(selectLoadingChart(mockState)).toBe(true);
    });
  
    it('should select chart error message', () => {
      expect(selectChartError(mockState)).toBe('Error fetching chart');
    });
  
    it('selectCurrency returns the correct currency', () => {
      const state = {
        crypto: {
          coins: { timestamp: 0, data: [] },
          loadingCoins: false,
          error: null,
          topMarketCaps: { timestamp: 0, data: [] },
          loadingTopCaps: false,
          marketChartData: {},
          loadingChart: false,
          chartError: null,
          topCapsError: null,
          currency: 'bgn',
        },
      };
      expect(selectCurrency(state)).toBe('bgn');
    });
  });  