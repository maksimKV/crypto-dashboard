import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CoinSelector } from '@/components/CoinSelector';

describe('CoinSelector', () => {
  // Create a mock list of 30 coins for testing
  const coins = Array.from({ length: 30 }, (_, i) => ({
    id: `coin${i + 1}`,
    name: `Coin ${i + 1}`,
  }));

  const onChangeMock = jest.fn();

  beforeEach(() => {
    onChangeMock.mockClear();
  });

  it('renders dropdown with paginated coins by default', () => {
    // Render CoinSelector with pagination (10 items per page)
    render(
      <CoinSelector
        coins={coins}
        selectedCoinId="coin1"
        onChange={onChangeMock}
        itemsPerPage={10}
      />
    );

    // Should show only the first 10 coins
    for (let i = 1; i <= 10; i++) {
      expect(screen.getByText(`Coin ${i}`)).toBeInTheDocument();
    }
    // Coin 11 should not be visible on the first page
    expect(screen.queryByText('Coin 11')).toBeNull();

    // Pagination controls should be present
    expect(screen.getByLabelText('Next page')).toBeInTheDocument();
    expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
  });

  it('calls onChange callback with selected coin id when selection changes', () => {
    // Render CoinSelector and simulate changing the selected coin
    render(
      <CoinSelector coins={coins} selectedCoinId="coin1" onChange={onChangeMock} />
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'coin3' } });

    // onChange should be called with the new coin id
    expect(onChangeMock).toHaveBeenCalledWith('coin3');
  });

  it('hides pagination controls when hidePagination is true', () => {
    // Render CoinSelector with pagination controls hidden
    render(
      <CoinSelector
        coins={coins}
        selectedCoinId="coin1"
        onChange={onChangeMock}
        hidePagination={true}
        itemsPerPage={10}
      />
    );

    // Pagination controls should not be present
    expect(screen.queryByLabelText('Next page')).toBeNull();
    expect(screen.queryByLabelText('Previous page')).toBeNull();
  });

  it('pagination buttons change page and update visible options', () => {
    // Controlled test component to manage selectedCoinId state
    function ControlledCoinSelectorTest() {
      const [selectedCoinId, setSelectedCoinId] = React.useState('coin1');
      return (
        <CoinSelector
          coins={coins}
          selectedCoinId={selectedCoinId}
          onChange={setSelectedCoinId}
          itemsPerPage={10}
        />
      );
    }

    render(<ControlledCoinSelectorTest />);

    // Cast select to HTMLSelectElement for value access
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    const nextButton = screen.getByLabelText('Next page');
    const prevButton = screen.getByLabelText('Previous page');

    // Initial state: first page, Coin 1 visible, Coin 11 not visible
    expect(screen.getByText('Coin 1')).toBeInTheDocument();
    expect(screen.queryByText('Coin 11')).toBeNull();
    expect(select.value).toBe('coin1');

    // Go to next page
    fireEvent.click(nextButton);

    // Now Coin 11 should be visible, Coin 1 should not
    expect(screen.getByText('Coin 11')).toBeInTheDocument();
    expect(screen.queryByText('Coin 1')).toBeNull();
    expect(select.value).toBe('coin11');

    // Change selection to Coin 15
    fireEvent.change(select, { target: { value: 'coin15' } });
    expect(select.value).toBe('coin15');

    // Previous button should be enabled
    expect(prevButton).not.toBeDisabled();

    // Go back to previous page
    fireEvent.click(prevButton);

    // Coin 1 should be visible again, selection resets to Coin 1
    expect(screen.getByText('Coin 1')).toBeInTheDocument();
    expect(select.value).toBe('coin1');
  });

  it('disables prev button on first page and next button on last page', () => {
    // Render CoinSelector and check pagination button states
    render(
      <CoinSelector coins={coins} selectedCoinId="coin1" onChange={onChangeMock} itemsPerPage={10} />
    );

    const nextButton = screen.getByLabelText('Next page');
    const prevButton = screen.getByLabelText('Previous page');

    // Prev button should be disabled on first page
    expect(prevButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();

    // Click next page twice to reach last page
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);

    // Next button should be disabled on last page
    expect(nextButton).toBeDisabled();
    expect(prevButton).not.toBeDisabled();
  });
});