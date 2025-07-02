import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DashboardHeader } from '@/components/DashboardHeader';

describe('DashboardHeader', () => {
  const tabs = [
    { name: 'Tab 1', key: 'tab1' },
    { name: 'Tab 2', key: 'tab2' },
  ];

  it('renders title and subtitle', () => {
    render(
      <DashboardHeader title="Crypto Dashboard" subtitle="Subtitle here" tabs={tabs} activeTab="tab1" onTabChange={() => {}} />
    );
    expect(screen.getByText('Crypto Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Subtitle here')).toBeInTheDocument();
  });

  it('renders without subtitle', () => {
    render(
      <DashboardHeader title="Crypto Dashboard" tabs={tabs} activeTab="tab1" onTabChange={() => {}} />
    );
    expect(screen.getByText('Crypto Dashboard')).toBeInTheDocument();
    // Subtitle should not be present
    expect(screen.queryByText('Subtitle here')).not.toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <DashboardHeader title="Crypto Dashboard" tabs={tabs} activeTab="tab1" onTabChange={() => {}}>
        <div data-testid="child">Child Content</div>
      </DashboardHeader>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('calls onTabChange when a tab is clicked', () => {
    const onTabChange = jest.fn();
    render(
      <DashboardHeader title="Crypto Dashboard" tabs={tabs} activeTab="tab1" onTabChange={onTabChange} />
    );
    fireEvent.click(screen.getByText('Tab 2'));
    expect(onTabChange).toHaveBeenCalledWith('tab2');
  });

  it('applies responsive classes', () => {
    const { container } = render(
      <DashboardHeader title="Crypto Dashboard" tabs={tabs} activeTab="tab1" onTabChange={() => {}} />
    );
    // Check for some Tailwind classes to ensure layout responsiveness
    expect(container.firstChild).toHaveClass('max-w-5xl');
    expect(container.firstChild).toHaveClass('mx-auto');
  });
}); 