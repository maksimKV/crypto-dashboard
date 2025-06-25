import React from 'react';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

describe('ErrorBoundary', () => {
  // Helper component that throws an error when rendered, to simulate error
  const ProblemChild = () => {
    throw new Error('Test error');
  };

  it('renders children normally when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>Safe content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Safe content')).toBeInTheDocument();
  });

  it('renders fallback UI when a child component throws an error', () => {
    // Suppress the error log in the console for cleaner test output
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // Render ErrorBoundary with ProblemChild which throws error during render
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    // Check that fallback UI is shown instead of ProblemChild
    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();

    // Restore console.error after test
    (console.error as jest.Mock).mockRestore();
  });
});