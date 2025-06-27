import { createSelector } from 'reselect';
import { RootState } from '@/store';

// Selector to get the crypto slice from the root Redux state
export const selectCryptoState = (state: RootState) => state.crypto;

// Selector to get the list of coins data from the crypto state or empty array if none
export const selectCoins = createSelector(
  selectCryptoState,
  crypto => crypto.coins?.data ?? []
);

// Selector to get the loading state for fetching coins
export const selectLoadingCoins = createSelector(
  selectCryptoState,
  crypto => crypto.loadingCoins
);

// Selector to get the error message related to fetching coins
export const selectErrorCoins = createSelector(
  selectCryptoState,
  crypto => crypto.error
);

// Selector to get the top market caps data or empty array if none
export const selectTopMarketCaps = createSelector(
  selectCryptoState,
  crypto => crypto.topMarketCaps?.data ?? []
);

// Selector to get the loading state for fetching top market caps
export const selectLoadingTopCaps = createSelector(
  selectCryptoState,
  crypto => crypto.loadingTopCaps
);

// Selector factory to get the market chart data for a specific coin by coinId
export const selectMarketChartData = (coinId: string) =>
  createSelector(
    selectCryptoState,
    crypto => crypto.marketChartData[coinId]?.data ?? null
  );

// Selector to get the loading state for fetching market chart data
export const selectLoadingChart = createSelector(
  selectCryptoState,
  crypto => crypto.loadingChart
);

// Selector to get the error message related to fetching market chart data
export const selectChartError = createSelector(
  selectCryptoState,
  crypto => crypto.chartError
);

// Selector to get the error message related to fetching top market caps
export const selectTopCapsError = createSelector(
  selectCryptoState,
  crypto => crypto.topCapsError
);

// Selector to get the selected currency from the crypto state
export const selectCurrency = createSelector(
  selectCryptoState,
  crypto => crypto.currency
);