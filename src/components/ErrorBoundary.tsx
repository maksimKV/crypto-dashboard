import React, { ReactNode, ErrorInfo, ReactElement } from 'react';
import * as Sentry from '@sentry/browser';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * ErrorBoundary component to catch errors in React tree and display fallback UI.
 * Useful for isolating errors from crashing the entire app.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so next render shows fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Log error info to Sentry error reporting service
    Sentry.captureException(error);
    // Also log to console for local debugging
    console.error('ErrorBoundary caught an error', error, info);
  }

  render(): ReactElement {
    if (this.state.hasError) {
      return <p className="text-red-600">Something went wrong.</p>;
    }
    return this.props.children as ReactElement;
  }
}