import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CoinData, MarketChartData } from '@/types/chartTypes';

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
  const res = await fetch(
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&page=1'
  );
  if (!res.ok) throw new Error('Failed to fetch coins');
  return (await res.json()) as CoinData[];
});

export const fetchMarketChart = createAsyncThunk(
  'crypto/fetchMarketChart',
  async ({ coinId }: { coinId: string }) => {
    if (!coinId) throw new Error('Missing coinId');
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=30`
    );
    if (!res.ok) throw new Error(`Failed to fetch market chart for ${coinId}`);
    const data = await res.json();
    return { coinId, data } as { coinId: string; data: MarketChartData };
  }
);

export const fetchTopMarketCaps = createAsyncThunk(
  'crypto/fetchTopMarketCaps',
  async () => {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?' +
      'vs_currency=usd&order=market_cap_desc&per_page=5&page=1&price_change_percentage=24h,7d'
    );
    if (!res.ok) throw new Error('Failed to fetch top market caps');
    return (await res.json()) as CoinData[];
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