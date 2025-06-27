import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CurrencySelector } from '@/components/CoinSelector';
import { CURRENCY_OPTIONS } from '@/utils/currencies';

describe('CurrencySelector', () => {
  const onChangeMock = jest.fn();

  beforeEach(() => {
    onChangeMock.mockClear();
  });

  it('renders all currency options', () => {
    render(<CurrencySelector value="usd" onChange={onChangeMock} />);
    CURRENCY_OPTIONS.forEach(option => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  it('shows USD as default selected', () => {
    render(<CurrencySelector value="usd" onChange={onChangeMock} />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('usd');
  });

  it('calls onChange with the correct value', () => {
    render(<CurrencySelector value="usd" onChange={onChangeMock} />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'eur' } });
    expect(onChangeMock).toHaveBeenCalledWith('eur');
  });
}); 