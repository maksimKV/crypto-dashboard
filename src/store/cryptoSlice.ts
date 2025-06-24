import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CoinData, MarketChartData } from '@/types/chartTypes';
import { getCoins, getMarketChart, getTopMarketCaps } from '@/pages/api/cryptoApi';

interface CryptoState {
  coins: CoinData[];
  marketChartData: { [coinId: string]: MarketChartData };
  topMarketCaps: CoinData[];
  loadingCoins: boolean;
  loadingChart: boolean;
  loadingTopCaps: boolean;
  error: string | null;
  chartError: string | null;
  topCapsError: string | null;
}

const initialState: CryptoState = {
  coins: [],
  marketChartData: {},
  topMarketCaps: [],
  loadingCoins: false,
  loadingChart: false,
  loadingTopCaps: false,
  error: null,
  chartError: null,
  topCapsError: null,
};

export const fetchCoins = createAsyncThunk('crypto/fetchCoins', async () => {
  return await getCoins();
});

export const fetchMarketChart = createAsyncThunk(
  'crypto/fetchMarketChart',
  async ({ coinId }: { coinId: string }) => {
    return { coinId, data: await getMarketChart(coinId) };
  }
);

export const fetchTopMarketCaps = createAsyncThunk(
  'crypto/fetchTopMarketCaps',
  async () => {
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
        state.coins = action.payload;
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
        state.marketChartData[coinId] = data;
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
        state.topMarketCaps = action.payload;
        state.loadingTopCaps = false;
      })
      .addCase(fetchTopMarketCaps.rejected, (state, action) => {
        state.loadingTopCaps = false;
        state.topCapsError = action.error.message ?? 'Unknown error';
      });
  },
});

export default cryptoSlice.reducer;