import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CoinData, MarketChartData } from '@/types/chartTypes';
import { isCacheValid, getErrorMessage } from '@/utils/cacheUtils';

// Interface for cached data, containing timestamp and the cached data itself
interface CachedData<T> {
  timestamp: number;
  data: T;
}

// Interface defining the shape of the Redux state for crypto data
export interface CryptoState {
  // Cached coins list with timestamp
  coins: CachedData<CoinData[]> | null;

  // Cached market chart data, keyed by coinId
  marketChartData: { [coinId: string]: CachedData<MarketChartData> };

  // Cached top market caps data
  topMarketCaps: CachedData<CoinData[]> | null;

  // Loading state for coins fetching
  loadingCoins: boolean;

  // Loading state for market chart fetching
  loadingChart: boolean;

  // Loading state for top market caps fetching
  loadingTopCaps: boolean;

  // Error message for coins fetching
  error: string | null;

  // Error message for market chart fetching
  chartError: string | null;

  // Error message for top market caps fetching
  topCapsError: string | null;

  currency: string; // Selected fiat currency
}

// Initial state of the crypto slice
const initialState: CryptoState = {
  coins: null,
  marketChartData: {},
  topMarketCaps: null,
  loadingCoins: false,
  loadingChart: false,
  loadingTopCaps: false,
  error: null,
  chartError: null,
  topCapsError: null,
  currency: 'usd', // Default to USD
};

// Async thunk to fetch the list of coins, using cached data if still valid
export const fetchCoins = createAsyncThunk('crypto/fetchCoins', async (_, { getState }) => {
  const state = getState() as { crypto: CryptoState };
  if (state.crypto.coins && isCacheValid(state.crypto.coins.timestamp)) {
    return state.crypto.coins.data;
  }
  try {
    const res = await fetch(`/api/cryptoApi?currency=${state.crypto.currency}`);
    if (!res.ok) {
      let msg = 'Failed to fetch coins.';
      if (res.status === 429) msg = 'You are making requests too quickly. Please wait and try again.';
      else if (res.status >= 500) msg = 'The server is currently unavailable. Please try again later.';
      throw new Error(msg);
    }
    return await res.json();
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, 'Something went wrong. Please try again later.'));
  }
});

// Async thunk to fetch market chart data for a specific coin, using cached data if valid
export const fetchMarketChart = createAsyncThunk(
  'crypto/fetchMarketChart',
  async ({ coinId }: { coinId: string }, { getState }) => {
    const state = getState() as { crypto: CryptoState };
    const cached = state.crypto.marketChartData[coinId];
    if (cached && isCacheValid(cached.timestamp)) {
      return { coinId, data: cached.data };
    }
    try {
      const res = await fetch(`/api/cryptoApi?coinId=${coinId}&currency=${state.crypto.currency}`);
      if (!res.ok) {
        let msg = 'Failed to fetch market chart.';
        if (res.status === 429) msg = 'You are making requests too quickly. Please wait and try again.';
        else if (res.status >= 500) msg = 'The server is currently unavailable. Please try again later.';
        throw new Error(msg);
      }
      const data = await res.json();
      return { coinId, data };
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, 'Something went wrong. Please try again later.'));
    }
  }
);

// Async thunk to fetch top market caps, using cached data if valid
export const fetchTopMarketCaps = createAsyncThunk(
  'crypto/fetchTopMarketCaps',
  async (_, { getState }) => {
    const state = getState() as { crypto: CryptoState };
    if (state.crypto.topMarketCaps && isCacheValid(state.crypto.topMarketCaps.timestamp)) {
      return state.crypto.topMarketCaps.data;
    }
    try {
      const res = await fetch(`/api/cryptoApi?topMarketCaps=true&currency=${state.crypto.currency}`);
      if (!res.ok) {
        let msg = 'Failed to fetch top market caps.';
        if (res.status === 429) msg = 'You are making requests too quickly. Please wait and try again.';
        else if (res.status >= 500) msg = 'The server is currently unavailable. Please try again later.';
        throw new Error(msg);
      }
      return await res.json();
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, 'Something went wrong. Please try again later.'));
    }
  }
);

// Redux slice definition for crypto data
const cryptoSlice = createSlice({
  name: 'crypto',

  // Set the initial state
  initialState,

  // No synchronous reducers here
  reducers: {
    setCurrency(state, action: PayloadAction<string>) {
      state.currency = action.payload;
    },
  },

  // Define async action handlers for the thunks
  extraReducers: builder => {
    builder
      // When fetching coins starts, set loading and clear errors
      .addCase(fetchCoins.pending, state => {
        state.loadingCoins = true;
        state.error = null;
      })

      // When coins fetched successfully, cache data and clear loading
      .addCase(fetchCoins.fulfilled, (state, action: PayloadAction<CoinData[]>) => {
        state.coins = { timestamp: Date.now(), data: action.payload };
        state.loadingCoins = false;
      })

      // When coins fetch failed, clear loading and store error message
      .addCase(fetchCoins.rejected, (state, action) => {
        state.loadingCoins = false;
        state.error = getErrorMessage(action.error);
      })

      // When fetching market chart starts, set loading and clear errors
      .addCase(fetchMarketChart.pending, state => {
        state.loadingChart = true;
        state.chartError = null;
      })

      // When market chart fetched, cache per coin and clear loading
      .addCase(fetchMarketChart.fulfilled, (state, action) => {
        const { coinId, data } = action.payload;
        state.marketChartData[coinId] = { timestamp: Date.now(), data };
        state.loadingChart = false;
      })

      // When market chart fetch failed, clear loading and store error message
      .addCase(fetchMarketChart.rejected, (state, action) => {
        state.loadingChart = false;
        state.chartError = getErrorMessage(action.error);
      })

      // When fetching top market caps starts, set loading and clear errors
      .addCase(fetchTopMarketCaps.pending, state => {
        state.loadingTopCaps = true;
        state.topCapsError = null;
      })

      // When top market caps fetched, cache data and clear loading
      .addCase(fetchTopMarketCaps.fulfilled, (state, action: PayloadAction<CoinData[]>) => {
        state.topMarketCaps = { timestamp: Date.now(), data: action.payload };
        state.loadingTopCaps = false;
      })

      // When top market caps fetch failed, clear loading and store error message
      .addCase(fetchTopMarketCaps.rejected, (state, action) => {
        state.loadingTopCaps = false;
        state.topCapsError = getErrorMessage(action.error);
      });
  },
});

// Export the reducer to be added in the store
export const cryptoReducer = cryptoSlice.reducer;

export const { setCurrency } = cryptoSlice.actions;