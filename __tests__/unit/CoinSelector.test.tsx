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

  it('renders dropdown with all provided coins', () => {
    render(
      <CoinSelector
        coins={coins}
        selectedCoinId="coin1"
        onChange={onChangeMock}
      />
    );

    // All coins should be visible in the dropdown
    coins.forEach(coin => {
      expect(screen.getByText(coin.name)).toBeInTheDocument();
    });
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
});