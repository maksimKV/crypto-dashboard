// List of supported currency codes (restricted)
export const SUPPORTED_CURRENCIES = [
  'bgn', 'chf', 'usd', 'eur', 'sar', 'aed', 'gbp'
];

// Mapping from currency code to label/symbol (restricted)
export const CURRENCY_LABELS: Record<string, string> = {
  usd: '$',
  eur: '€',
  bgn: 'лв',
  chf: 'Fr.',
  aed: 'د.إ',
  sar: 'ر.س',
  gbp: '£',
};

// Array of { code, label } for dropdowns (restricted)
export const CURRENCY_OPTIONS = SUPPORTED_CURRENCIES.map(code => ({
  code,
  label: `${CURRENCY_LABELS[code] ? CURRENCY_LABELS[code] + ' ' : ''}${code.toUpperCase()}`,
})); 