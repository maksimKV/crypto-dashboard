import '@/styles/globals.css'
import { Provider } from 'react-redux';
import { store } from '@/store';
import type { AppProps } from 'next/app';

export function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}