import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CoinData, MarketChartData } from '@/types/chartTypes';
import { getCoins, getMarketChart, getTopMarketCaps } from '@/pages/api/cryptoApi';

interface CachedData<T> {
  timestamp: number;
  data: T;
}

interface CryptoState {
  coins: CachedData<CoinData[]> | null;
  marketChartData: { [coinId: string]: CachedData<MarketChartData> };
  topMarketCaps: CachedData<CoinData[]> | null;
  loadingCoins: boolean;
  loadingChart: boolean;
  loadingTopCaps: boolean;
  error: string | null;
  chartError: string | null;
  topCapsError: string | null;
}

const CACHE_TTL = 15 * 60 * 1000;

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
};

function isCacheValid(timestamp: number) {
  return Date.now() - timestamp < CACHE_TTL;
}

export const fetchCoins = createAsyncThunk('crypto/fetchCoins', async (_, { getState }) => {
  const state = getState() as { crypto: CryptoState };
  if (state.crypto.coins && isCacheValid(state.crypto.coins.timestamp)) {
    return state.crypto.coins.data;
  }
  return await getCoins();
});

export const fetchMarketChart = createAsyncThunk(
  'crypto/fetchMarketChart',
  async ({ coinId }: { coinId: string }, { getState }) => {
    const state = getState() as { crypto: CryptoState };
    const cached = state.crypto.marketChartData[coinId];
    if (cached && isCacheValid(cached.timestamp)) {
      return { coinId, data: cached.data };
    }
    const data = await getMarketChart(coinId);
    return { coinId, data };
  }
);

export const fetchTopMarketCaps = createAsyncThunk(
  'crypto/fetchTopMarketCaps',
  async (_, { getState }) => {
    const state = getState() as { crypto: CryptoState };
    if (state.crypto.topMarketCaps && isCacheValid(state.crypto.topMarketCaps.timestamp)) {
      return state.crypto.topMarketCaps.data;
    }
    return await getTopMarketCaps();
  }
);

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCoins.pending, state => {
        state.loadingCoins = true;
        state.error = null;
      })
      .addCase(fetchCoins.fulfilled, (state, action: PayloadAction<CoinData[]>) => {
        state.coins = { timestamp: Date.now(), data: action.payload };
        state.loadingCoins = false;
      })
      .addCase(fetchCoins.rejected, (state, action) => {
        state.loadingCoins = false;
        state.error = action.error.message ?? 'Unknown error';
      })
      .addCase(fetchMarketChart.pending, state => {
        state.loadingChart = true;
        state.chartError = null;
      })
      .addCase(fetchMarketChart.fulfilled, (state, action) => {
        const { coinId, data } = action.payload;
        state.marketChartData[coinId] = { timestamp: Date.now(), data };
        state.loadingChart = false;
      })
      .addCase(fetchMarketChart.rejected, (state, action) => {
        state.loadingChart = false;
        state.chartError = action.error.message ?? 'Unknown error';
      })
      .addCase(fetchTopMarketCaps.pending, state => {
        state.loadingTopCaps = true;
        state.topCapsError = null;
      })
      .addCase(fetchTopMarketCaps.fulfilled, (state, action: PayloadAction<CoinData[]>) => {
        state.topMarketCaps = { timestamp: Date.now(), data: action.payload };
        state.loadingTopCaps = false;
      })
      .addCase(fetchTopMarketCaps.rejected, (state, action) => {
        state.loadingTopCaps = false;
        state.topCapsError = action.error.message ?? 'Unknown error';
      });
  },
});

export default cryptoSlice.reducer;