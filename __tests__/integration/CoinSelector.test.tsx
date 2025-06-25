import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CoinSelector } from '@/components/CoinSelector';

describe('CoinSelector', () => {
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

    for (let i = 1; i <= 10; i++) {
      expect(screen.getByText(`Coin ${i}`)).toBeInTheDocument();
    }
    expect(screen.queryByText('Coin 11')).toBeNull();

    expect(screen.getByLabelText('Next page')).toBeInTheDocument();
    expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
  });

  it('calls onChange callback with selected coin id when selection changes', () => {
    render(
      <CoinSelector coins={coins} selectedCoinId="coin1" onChange={onChangeMock} />
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'coin3' } });

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

    expect(screen.queryByLabelText('Next page')).toBeNull();
    expect(screen.queryByLabelText('Previous page')).toBeNull();
  });

  it('pagination buttons change page and update visible options', () => {
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

    const select = screen.getByRole('combobox');
    const nextButton = screen.getByLabelText('Next page');
    const prevButton = screen.getByLabelText('Previous page');

    expect(screen.getByText('Coin 1')).toBeInTheDocument();
    expect(screen.queryByText('Coin 11')).toBeNull();
    expect(select.value).toBe('coin1');

    fireEvent.click(nextButton);

    expect(screen.getByText('Coin 11')).toBeInTheDocument();
    expect(screen.queryByText('Coin 1')).toBeNull();
    expect(select.value).toBe('coin11');

    fireEvent.change(select, { target: { value: 'coin15' } });
    expect(select.value).toBe('coin15');

    expect(prevButton).not.toBeDisabled();

    fireEvent.click(prevButton);

    expect(screen.getByText('Coin 1')).toBeInTheDocument();
    expect(select.value).toBe('coin1');
  });

  it('disables prev button on first page and next button on last page', () => {
    render(
      <CoinSelector coins={coins} selectedCoinId="coin1" onChange={onChangeMock} itemsPerPage={10} />
    );

    const nextButton = screen.getByLabelText('Next page');
    const prevButton = screen.getByLabelText('Previous page');

    expect(prevButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();

    fireEvent.click(nextButton);
    fireEvent.click(nextButton);

    expect(nextButton).toBeDisabled();
    expect(prevButton).not.toBeDisabled();
  });
});