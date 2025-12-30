export interface Currency {
  code: string;
  name: string;
  symbol: string;
  symbolPosition: 'before' | 'after';
  decimalSeparator: string;
  thousandsSeparator: string;
  decimals: number;
}

export const CURRENCIES: Currency[] = [
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    decimals: 2,
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    symbolPosition: 'before',
    decimalSeparator: ',',
    thousandsSeparator: '.',
    decimals: 2,
  },
  {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    decimals: 2,
  },
  {
    code: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    decimals: 0,
  },
  {
    code: 'CAD',
    name: 'Canadian Dollar',
    symbol: 'C$',
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    decimals: 2,
  },
  {
    code: 'AUD',
    name: 'Australian Dollar',
    symbol: 'A$',
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    decimals: 2,
  },
  {
    code: 'CHF',
    name: 'Swiss Franc',
    symbol: 'CHF',
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandsSeparator: "'",
    decimals: 2,
  },
  {
    code: 'CNY',
    name: 'Chinese Yuan',
    symbol: '¥',
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    decimals: 2,
  },
  {
    code: 'INR',
    name: 'Indian Rupee',
    symbol: '₹',
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    decimals: 2,
  },
  {
    code: 'KRW',
    name: 'South Korean Won',
    symbol: '₩',
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    decimals: 0,
  },
  {
    code: 'MXN',
    name: 'Mexican Peso',
    symbol: 'MX$',
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    decimals: 2,
  },
  {
    code: 'BRL',
    name: 'Brazilian Real',
    symbol: 'R$',
    symbolPosition: 'before',
    decimalSeparator: ',',
    thousandsSeparator: '.',
    decimals: 2,
  },
  {
    code: 'SGD',
    name: 'Singapore Dollar',
    symbol: 'S$',
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    decimals: 2,
  },
  {
    code: 'HKD',
    name: 'Hong Kong Dollar',
    symbol: 'HK$',
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    decimals: 2,
  },
  {
    code: 'SEK',
    name: 'Swedish Krona',
    symbol: 'kr',
    symbolPosition: 'after',
    decimalSeparator: ',',
    thousandsSeparator: ' ',
    decimals: 2,
  },
  {
    code: 'NOK',
    name: 'Norwegian Krone',
    symbol: 'kr',
    symbolPosition: 'after',
    decimalSeparator: ',',
    thousandsSeparator: ' ',
    decimals: 2,
  },
  {
    code: 'DKK',
    name: 'Danish Krone',
    symbol: 'kr',
    symbolPosition: 'after',
    decimalSeparator: ',',
    thousandsSeparator: '.',
    decimals: 2,
  },
  {
    code: 'NZD',
    name: 'New Zealand Dollar',
    symbol: 'NZ$',
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    decimals: 2,
  },
  {
    code: 'ZAR',
    name: 'South African Rand',
    symbol: 'R',
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    decimals: 2,
  },
  {
    code: 'RUB',
    name: 'Russian Ruble',
    symbol: '₽',
    symbolPosition: 'after',
    decimalSeparator: ',',
    thousandsSeparator: ' ',
    decimals: 2,
  },
  {
    code: 'PLN',
    name: 'Polish Zloty',
    symbol: 'zł',
    symbolPosition: 'after',
    decimalSeparator: ',',
    thousandsSeparator: ' ',
    decimals: 2,
  },
  {
    code: 'TRY',
    name: 'Turkish Lira',
    symbol: '₺',
    symbolPosition: 'before',
    decimalSeparator: ',',
    thousandsSeparator: '.',
    decimals: 2,
  },
  {
    code: 'THB',
    name: 'Thai Baht',
    symbol: '฿',
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    decimals: 2,
  },
  {
    code: 'IDR',
    name: 'Indonesian Rupiah',
    symbol: 'Rp',
    symbolPosition: 'before',
    decimalSeparator: ',',
    thousandsSeparator: '.',
    decimals: 0,
  },
  {
    code: 'MYR',
    name: 'Malaysian Ringgit',
    symbol: 'RM',
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    decimals: 2,
  },
  {
    code: 'PHP',
    name: 'Philippine Peso',
    symbol: '₱',
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    decimals: 2,
  },
  {
    code: 'VND',
    name: 'Vietnamese Dong',
    symbol: '₫',
    symbolPosition: 'after',
    decimalSeparator: ',',
    thousandsSeparator: '.',
    decimals: 0,
  },
  {
    code: 'AED',
    name: 'UAE Dirham',
    symbol: 'د.إ',
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    decimals: 2,
  },
  {
    code: 'SAR',
    name: 'Saudi Riyal',
    symbol: '﷼',
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    decimals: 2,
  },
  {
    code: 'ILS',
    name: 'Israeli Shekel',
    symbol: '₪',
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    decimals: 2,
  },
];

export const DEFAULT_CURRENCY_CODE = 'USD';

export function getCurrency(code: string): Currency {
  return CURRENCIES.find((c) => c.code === code) || CURRENCIES[0];
}

export function formatCurrency(amount: number, currencyCode: string = DEFAULT_CURRENCY_CODE): string {
  const currency = getCurrency(currencyCode);

  const absoluteAmount = Math.abs(amount);
  const isNegative = amount < 0;

  // Format the number with proper decimal places
  const parts = absoluteAmount.toFixed(currency.decimals).split('.');

  // Add thousands separator
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, currency.thousandsSeparator);

  // Join with decimal separator
  const formattedNumber = parts.length > 1
    ? parts.join(currency.decimalSeparator)
    : parts[0];

  // Add currency symbol
  const withSymbol = currency.symbolPosition === 'before'
    ? `${currency.symbol}${formattedNumber}`
    : `${formattedNumber} ${currency.symbol}`;

  return isNegative ? `-${withSymbol}` : withSymbol;
}
