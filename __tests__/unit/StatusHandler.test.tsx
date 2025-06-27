import React from 'react';
import { render, screen } from '@testing-library/react';
import { StatusHandler } from '@/components/StatusHandler';

// Unit tests for the StatusHandler component

describe('StatusHandler', () => {
  // Test loading state with default loading message
  it('renders loading message when loading is true', () => {
    render(
      <StatusHandler loading={true} error={null}>
        <div>Content</div>
      </StatusHandler>
    );
    // Should show the default loading message
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  // Test loading state with a custom loading message
  it('renders custom loading message if provided', () => {
    render(
      <StatusHandler loading={true} error={null} loadingMessage="Please wait...">
        <div>Content</div>
      </StatusHandler>
    );
    // Should show the custom loading message
    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });

  // Test error state with default error message prefix
  it('renders error message when error is present', () => {
    render(
      <StatusHandler loading={false} error="Something went wrong">
        <div>Content</div>
      </StatusHandler>
    );
    // Should show the error message with default prefix
    expect(screen.getByText('Error: Something went wrong')).toBeInTheDocument();
  });

  // Test error state with a custom error message prefix
  it('renders custom error message prefix if provided', () => {
    render(
      <StatusHandler loading={false} error="Oops!" errorMessagePrefix="CustomError:">
        <div>Content</div>
      </StatusHandler>
    );
    // Should show the error message with custom prefix
    expect(screen.getByText('CustomError: Oops!')).toBeInTheDocument();
  });

  // Test normal rendering of children when not loading and no error
  it('renders children when not loading and no error', () => {
    render(
      <StatusHandler loading={false} error={null}>
        <div>Actual Content</div>
      </StatusHandler>
    );
    // Should render the children content
    expect(screen.getByText('Actual Content')).toBeInTheDocument();
  });
});