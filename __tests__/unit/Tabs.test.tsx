import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tabs } from '@/components/Tabs';

describe('Tabs component', () => {
  // Sample tabs array for testing
  const tabs = [
    { name: 'Tab 1', key: 'tab1' },
    { name: 'Tab 2', key: 'tab2' },
    { name: 'Tab 3', key: 'tab3' },
  ];

  const onChangeMock = jest.fn();

  beforeEach(() => {
    // Clear the mock function before each test
    onChangeMock.mockClear();
  });

  it('renders all tabs with correct names', () => {
    render(<Tabs tabs={tabs} activeKey="tab1" onChange={onChangeMock} />);

    // Check if all tab names are rendered in the document
    tabs.forEach(tab => {
      expect(screen.getByText(tab.name)).toBeInTheDocument();
    });
  });

  it('applies active styles to the tab matching activeKey', () => {
    render(<Tabs tabs={tabs} activeKey="tab2" onChange={onChangeMock} />);

    const activeTab = screen.getByText('Tab 2');
    // The active tab should have blue background and white text
    expect(activeTab).toHaveClass('bg-blue-600');
    expect(activeTab).toHaveClass('text-white');

    const inactiveTab = screen.getByText('Tab 1');
    // Inactive tabs should have gray background and hover effect
    expect(inactiveTab).toHaveClass('bg-gray-100');
  });

  it('calls onChange callback with correct key when a tab is clicked', () => {
    render(<Tabs tabs={tabs} activeKey="tab1" onChange={onChangeMock} />);

    const tabToClick = screen.getByText('Tab 3');
    fireEvent.click(tabToClick);

    // onChange should be called once with the clicked tab's key
    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(onChangeMock).toHaveBeenCalledWith('tab3');
  });
});