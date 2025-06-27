import React, { ErrorInfo, ReactNode, ReactElement } from 'react';
import * as Sentry from '@sentry/browser';

// Track if Sentry warning has been shown in production
let sentryWarned = false;

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
    // Log error info to Sentry error reporting service if available
    const sentryConfigured = typeof Sentry !== 'undefined' && typeof Sentry.captureException === 'function';
    if (sentryConfigured) {
      Sentry.captureException(error);
    } else if (process.env.NODE_ENV === 'production') {
      // Fallback: send error to a custom API endpoint for logging
      fetch('/api/logError', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: error.message,
          stack: error.stack,
          info,
        }),
      });
    }
    // Only log to console in development
    if (process.env.NODE_ENV === 'development') {
      if (!sentryConfigured && !sentryWarned) {
        sentryWarned = true;
        // eslint-disable-next-line no-console
        console.warn('Warning: Sentry is not configured in development. Errors will not be reported to a logging service.');
      }
      console.error('ErrorBoundary caught an error', error, info);
    }
  }

  render(): ReactElement {
    if (this.state.hasError) {
      if (process.env.NODE_ENV === 'development') {
        return (
          <div className="text-red-600">
            <p>Something went wrong.</p>
            {this.state.error && (
              <>
                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                  {this.state.error.message}
                </pre>
                {this.state.error.stack && (
                  <details style={{ marginTop: '1em' }}>
                    <summary>Stack Trace</summary>
                    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{this.state.error.stack}</pre>
                  </details>
                )}
              </>
            )}
          </div>
        );
      }
      return <p className="text-red-600">Something went wrong.</p>;
    }
    return this.props.children as ReactElement;
  }
}