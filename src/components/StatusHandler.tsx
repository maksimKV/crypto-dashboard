import React, { ReactNode } from 'react';

interface StatusHandlerProps {
  loading: boolean;
  error: string | null;
  children: ReactNode;
  loadingMessage?: string;
  errorMessagePrefix?: string;
}

export function StatusHandler({
  loading,
  error,
  children,
  loadingMessage = 'Зареждане...',
  errorMessagePrefix = 'Грешка:',
}: StatusHandlerProps) {
  if (loading) return <p>{loadingMessage}</p>;
  if (error) return <p className="text-red-600">{errorMessagePrefix} {error}</p>;
  return <>{children}</>;
}