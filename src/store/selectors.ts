import { createSelector } from 'reselect';
import { RootState } from '@/store';

export const selectCryptoState = (state: RootState) => state.crypto;

export const selectCoins = createSelector(
  selectCryptoState,
  crypto => crypto.coins?.data ?? []
);

export const selectLoadingCoins = createSelector(
  selectCryptoState,
  crypto => crypto.loadingCoins
);

export const selectErrorCoins = createSelector(
  selectCryptoState,
  crypto => crypto.error
);

export const selectTopMarketCaps = createSelector(
  selectCryptoState,
  crypto => crypto.topMarketCaps?.data ?? []
);

export const selectLoadingTopCaps = createSelector(
  selectCryptoState,
  crypto => crypto.loadingTopCaps
);

export const selectMarketChartData = (coinId: string) =>
  createSelector(
    selectCryptoState,
    crypto => crypto.marketChartData[coinId]?.data ?? null
  );

export const selectLoadingChart = createSelector(
  selectCryptoState,
  crypto => crypto.loadingChart
);

export const selectChartError = createSelector(
  selectCryptoState,
  crypto => crypto.chartError
);