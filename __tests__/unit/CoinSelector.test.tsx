import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CoinSelector } from '@/components/CoinSelector';

describe('CoinSelector', () => {
  // Sample coins data for testing
  const coins = Array.from({ length: 30 }, (_, i) => ({
    id: `coin${i + 1}`,
    name: `Coin ${i + 1}`,
  }));

  const onChangeMock = jest.fn();

  beforeEach(() => {
    onChangeMock.mockClear();
  });

  it('renders dropdown with paginated coins by default', () => {
    render(
      <CoinSelector
        coins={coins}
        selectedCoinId="coin1"
        onChange={onChangeMock}
        itemsPerPage={10}
      />
    );

    // Initially first 10 coins should be visible in options
    for (let i = 1; i <= 10; i++) {
      expect(screen.getByText(`Coin ${i}`)).toBeInTheDocument();
    }
    // The 11th coin should not be visible initially
    expect(screen.queryByText('Coin 11')).toBeNull();

    // Pagination controls should be visible
    expect(screen.getByLabelText('Next page')).toBeInTheDocument();
    expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
  });

  it('calls onChange callback with selected coin id when selection changes', () => {
    render(
      <CoinSelector coins={coins} selectedCoinId="coin1" onChange={onChangeMock} />
    );

    const select = screen.getByRole('combobox');
    // Simulate user selecting coin3
    fireEvent.change(select, { target: { value: 'coin3' } });

    // onChange should be called with new coin id
    expect(onChangeMock).toHaveBeenCalledWith('coin3');
  });

  it('hides pagination controls when hidePagination is true', () => {
    render(
      <CoinSelector
        coins={coins}
        selectedCoinId="coin1"
        onChange={onChangeMock}
        hidePagination={true}
        itemsPerPage={10}
      />
    );

    // Pagination controls should not be rendered
    expect(screen.queryByLabelText('Next page')).toBeNull();
    expect(screen.queryByLabelText('Previous page')).toBeNull();
  });

  it('pagination buttons change page and update visible options', () => {
    render(
      <CoinSelector
        coins={coins}
        selectedCoinId="coin1"
        onChange={onChangeMock}
        itemsPerPage={10}
      />
    );

    const nextButton = screen.getByLabelText('Next page');
    const prevButton = screen.getByLabelText('Previous page');

    // Initially, first page: Coin 1 to Coin 10 visible
    expect(screen.getByText('Coin 1')).toBeInTheDocument();
    expect(screen.queryByText('Coin 11')).toBeNull();

    // Click next page button
    fireEvent.click(nextButton);

    // Now second page coins should be visible
    expect(screen.getByText('Coin 11')).toBeInTheDocument();
    expect(screen.queryByText('Coin 1')).toBeNull();

    // Previous page button should now be enabled
    expect(prevButton).not.toBeDisabled();

    // Click previous page button to go back
    fireEvent.click(prevButton);

    // Back to first page coins visible again
    expect(screen.getByText('Coin 1')).toBeInTheDocument();
  });

  it('disables prev button on first page and next button on last page', () => {
    render(
      <CoinSelector coins={coins} selectedCoinId="coin1" onChange={onChangeMock} itemsPerPage={10} />
    );

    const nextButton = screen.getByLabelText('Next page');
    const prevButton = screen.getByLabelText('Previous page');

    // Prev button disabled on first page
    expect(prevButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();

    // Click next page twice to get to last page
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);

    // Now on last page, next button should be disabled
    expect(nextButton).toBeDisabled();
    expect(prevButton).not.toBeDisabled();
  });
});