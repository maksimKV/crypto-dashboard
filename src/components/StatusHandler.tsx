import React, { ReactNode, ReactElement } from 'react';

interface StatusHandlerProps {
  loading: boolean;
  error: string | null;
  children: ReactNode;
  loadingMessage?: string;
  errorMessagePrefix?: string;
}

/**
 * StatusHandler component simplifies displaying loading and error states.
 * Shows loading or error messages when appropriate, otherwise renders children.
 */
export function StatusHandler({
  loading,
  error,
  children,
  loadingMessage = 'Loading...',
  errorMessagePrefix = 'Error:',
}: StatusHandlerProps): ReactElement {
  if (loading) return <p>{loadingMessage}</p>;
  if (error) return <p className="text-red-600">{errorMessagePrefix} {error}</p>;
  return <>{children}</>;
}