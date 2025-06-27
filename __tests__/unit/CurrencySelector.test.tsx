import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CurrencySelector } from '@/components/CoinSelector';

describe('CurrencySelector', () => {
  const onChangeMock = jest.fn();
  const options = [
    'US Dollar (USD)',
    'Euro (EUR)',
    'Bulgarian Lev (BGN)',
    'Swiss Franc (CHF)',
    'UAE Dirham (AED)',
    'Saudi Riyal (SAR)',
  ];

  beforeEach(() => {
    onChangeMock.mockClear();
  });

  it('renders all currency options', () => {
    render(<CurrencySelector value="usd" onChange={onChangeMock} />);
    options.forEach(label => {
      expect(screen.getByText(label)).toBeInTheDocument();
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