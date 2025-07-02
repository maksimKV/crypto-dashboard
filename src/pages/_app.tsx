import '@/styles/globals.css'
import { Provider } from 'react-redux';
import { store } from '@/store';
import type { AppProps } from 'next/app';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <Component {...pageProps} />
      </ErrorBoundary>
    </Provider>
  );
}