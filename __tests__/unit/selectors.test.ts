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
  } from '@/store/selectors';
  
  describe('crypto selectors', () => {
    // Sample mock state matching the expected RootState shape for crypto slice
    const mockState = {
      crypto: {
        coins: { timestamp: 123, data: [{ id: 'bitcoin', name: 'Bitcoin' }] },
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
      },
    };
  
    it('should select the crypto slice state', () => {
      expect(selectCryptoState(mockState as any)).toEqual(mockState.crypto);
    });
  
    it('should select coins data or empty array', () => {
      expect(selectCoins(mockState as any)).toEqual(mockState.crypto.coins.data);
      // When coins is null, fallback to empty array
      expect(selectCoins({ crypto: { ...mockState.crypto, coins: null } } as any)).toEqual([]);
    });
  
    it('should select loadingCoins boolean', () => {
      expect(selectLoadingCoins(mockState as any)).toBe(true);
    });
  
    it('should select error message for coins', () => {
      expect(selectErrorCoins(mockState as any)).toBe('Error fetching coins');
    });
  
    it('should select top market caps data or empty array', () => {
      expect(selectTopMarketCaps(mockState as any)).toEqual(mockState.crypto.topMarketCaps.data);
      // When topMarketCaps is null fallback to empty array
      expect(selectTopMarketCaps({ crypto: { ...mockState.crypto, topMarketCaps: null } } as any)).toEqual([]);
    });
  
    it('should select loadingTopCaps boolean', () => {
      expect(selectLoadingTopCaps(mockState as any)).toBe(false);
    });
  
    it('should select market chart data for a specific coin or null', () => {
      const selector = selectMarketChartData('bitcoin');
      expect(selector(mockState as any)).toEqual(mockState.crypto.marketChartData.bitcoin.data);
      // When no data for coinId, fallback to null
      const emptyState = { crypto: { ...mockState.crypto, marketChartData: {} } };
      expect(selector(emptyState as any)).toBeNull();
    });
  
    it('should select loadingChart boolean', () => {
      expect(selectLoadingChart(mockState as any)).toBe(true);
    });
  
    it('should select chart error message', () => {
      expect(selectChartError(mockState as any)).toBe('Error fetching chart');
    });
  });  