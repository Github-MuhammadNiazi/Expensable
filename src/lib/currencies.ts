export interface Currency {
  code: string;
  name: string;
  symbol: string;
  symbolPosition: 'before' | 'after';
  decimalSeparator: string;
  thousandsSeparator: string;
  decimals: number;
}

// Comprehensive list of world currencies sorted alphabetically by code
export const CURRENCIES: Currency[] = [
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'AFN', name: 'Afghan Afghani', symbol: '؋', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'ALL', name: 'Albanian Lek', symbol: 'L', symbolPosition: 'before', decimalSeparator: ',', thousandsSeparator: '.', decimals: 2 },
  { code: 'AMD', name: 'Armenian Dram', symbol: '֏', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'ANG', name: 'Netherlands Antillean Guilder', symbol: 'ƒ', symbolPosition: 'before', decimalSeparator: ',', thousandsSeparator: '.', decimals: 2 },
  { code: 'AOA', name: 'Angolan Kwanza', symbol: 'Kz', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'ARS', name: 'Argentine Peso', symbol: '$', symbolPosition: 'before', decimalSeparator: ',', thousandsSeparator: '.', decimals: 2 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'AWG', name: 'Aruban Florin', symbol: 'ƒ', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'AZN', name: 'Azerbaijani Manat', symbol: '₼', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'BAM', name: 'Bosnia-Herzegovina Convertible Mark', symbol: 'KM', symbolPosition: 'before', decimalSeparator: ',', thousandsSeparator: '.', decimals: 2 },
  { code: 'BBD', name: 'Barbadian Dollar', symbol: '$', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'BGN', name: 'Bulgarian Lev', symbol: 'лв', symbolPosition: 'after', decimalSeparator: ',', thousandsSeparator: ' ', decimals: 2 },
  { code: 'BHD', name: 'Bahraini Dinar', symbol: '.د.ب', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 3 },
  { code: 'BIF', name: 'Burundian Franc', symbol: 'FBu', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 0 },
  { code: 'BMD', name: 'Bermudan Dollar', symbol: '$', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'BND', name: 'Brunei Dollar', symbol: '$', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'BOB', name: 'Bolivian Boliviano', symbol: 'Bs.', symbolPosition: 'before', decimalSeparator: ',', thousandsSeparator: '.', decimals: 2 },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', symbolPosition: 'before', decimalSeparator: ',', thousandsSeparator: '.', decimals: 2 },
  { code: 'BSD', name: 'Bahamian Dollar', symbol: '$', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'BTN', name: 'Bhutanese Ngultrum', symbol: 'Nu.', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'BWP', name: 'Botswanan Pula', symbol: 'P', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'BYN', name: 'Belarusian Ruble', symbol: 'Br', symbolPosition: 'before', decimalSeparator: ',', thousandsSeparator: ' ', decimals: 2 },
  { code: 'BZD', name: 'Belize Dollar', symbol: 'BZ$', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'CDF', name: 'Congolese Franc', symbol: 'FC', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: "'", decimals: 2 },
  { code: 'CLP', name: 'Chilean Peso', symbol: '$', symbolPosition: 'before', decimalSeparator: ',', thousandsSeparator: '.', decimals: 0 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'COP', name: 'Colombian Peso', symbol: '$', symbolPosition: 'before', decimalSeparator: ',', thousandsSeparator: '.', decimals: 2 },
  { code: 'CRC', name: 'Costa Rican Colón', symbol: '₡', symbolPosition: 'before', decimalSeparator: ',', thousandsSeparator: '.', decimals: 2 },
  { code: 'CUP', name: 'Cuban Peso', symbol: '₱', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'CVE', name: 'Cape Verdean Escudo', symbol: '$', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', symbolPosition: 'after', decimalSeparator: ',', thousandsSeparator: ' ', decimals: 2 },
  { code: 'DJF', name: 'Djiboutian Franc', symbol: 'Fdj', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 0 },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', symbolPosition: 'after', decimalSeparator: ',', thousandsSeparator: '.', decimals: 2 },
  { code: 'DOP', name: 'Dominican Peso', symbol: 'RD$', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'DZD', name: 'Algerian Dinar', symbol: 'د.ج', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'ERN', name: 'Eritrean Nakfa', symbol: 'Nfk', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'ETB', name: 'Ethiopian Birr', symbol: 'Br', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'EUR', name: 'Euro', symbol: '€', symbolPosition: 'before', decimalSeparator: ',', thousandsSeparator: '.', decimals: 2 },
  { code: 'FJD', name: 'Fijian Dollar', symbol: 'FJ$', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'FKP', name: 'Falkland Islands Pound', symbol: '£', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'GBP', name: 'British Pound', symbol: '£', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'GEL', name: 'Georgian Lari', symbol: '₾', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'GIP', name: 'Gibraltar Pound', symbol: '£', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'GMD', name: 'Gambian Dalasi', symbol: 'D', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'GNF', name: 'Guinean Franc', symbol: 'FG', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 0 },
  { code: 'GTQ', name: 'Guatemalan Quetzal', symbol: 'Q', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'GYD', name: 'Guyanaese Dollar', symbol: '$', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'HNL', name: 'Honduran Lempira', symbol: 'L', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'HRK', name: 'Croatian Kuna', symbol: 'kn', symbolPosition: 'after', decimalSeparator: ',', thousandsSeparator: '.', decimals: 2 },
  { code: 'HTG', name: 'Haitian Gourde', symbol: 'G', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', symbolPosition: 'after', decimalSeparator: ',', thousandsSeparator: ' ', decimals: 2 },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', symbolPosition: 'before', decimalSeparator: ',', thousandsSeparator: '.', decimals: 0 },
  { code: 'ILS', name: 'Israeli Shekel', symbol: '₪', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'IQD', name: 'Iraqi Dinar', symbol: 'ع.د', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 3 },
  { code: 'IRR', name: 'Iranian Rial', symbol: '﷼', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'ISK', name: 'Icelandic Króna', symbol: 'kr', symbolPosition: 'after', decimalSeparator: ',', thousandsSeparator: '.', decimals: 0 },
  { code: 'JMD', name: 'Jamaican Dollar', symbol: 'J$', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'JOD', name: 'Jordanian Dinar', symbol: 'د.ا', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 3 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 0 },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'KGS', name: 'Kyrgystani Som', symbol: 'лв', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'KHR', name: 'Cambodian Riel', symbol: '៛', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'KMF', name: 'Comorian Franc', symbol: 'CF', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 0 },
  { code: 'KPW', name: 'North Korean Won', symbol: '₩', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 0 },
  { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'د.ك', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 3 },
  { code: 'KYD', name: 'Cayman Islands Dollar', symbol: '$', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'KZT', name: 'Kazakhstani Tenge', symbol: '₸', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'LAK', name: 'Laotian Kip', symbol: '₭', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'LBP', name: 'Lebanese Pound', symbol: 'ل.ل', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'Rs', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'LRD', name: 'Liberian Dollar', symbol: '$', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'LSL', name: 'Lesotho Loti', symbol: 'L', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'LYD', name: 'Libyan Dinar', symbol: 'ل.د', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 3 },
  { code: 'MAD', name: 'Moroccan Dirham', symbol: 'د.م.', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'MDL', name: 'Moldovan Leu', symbol: 'L', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'MGA', name: 'Malagasy Ariary', symbol: 'Ar', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'MKD', name: 'Macedonian Denar', symbol: 'ден', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'MMK', name: 'Myanmar Kyat', symbol: 'K', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'MNT', name: 'Mongolian Tugrik', symbol: '₮', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'MOP', name: 'Macanese Pataca', symbol: 'MOP$', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'MRU', name: 'Mauritanian Ouguiya', symbol: 'UM', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'MUR', name: 'Mauritian Rupee', symbol: '₨', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'MVR', name: 'Maldivian Rufiyaa', symbol: 'Rf', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'MWK', name: 'Malawian Kwacha', symbol: 'MK', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'MZN', name: 'Mozambican Metical', symbol: 'MT', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'NAD', name: 'Namibian Dollar', symbol: '$', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'NIO', name: 'Nicaraguan Córdoba', symbol: 'C$', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', symbolPosition: 'after', decimalSeparator: ',', thousandsSeparator: ' ', decimals: 2 },
  { code: 'NPR', name: 'Nepalese Rupee', symbol: '₨', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'OMR', name: 'Omani Rial', symbol: 'ر.ع.', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 3 },
  { code: 'PAB', name: 'Panamanian Balboa', symbol: 'B/.', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'PGK', name: 'Papua New Guinean Kina', symbol: 'K', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', symbolPosition: 'after', decimalSeparator: ',', thousandsSeparator: ' ', decimals: 2 },
  { code: 'PYG', name: 'Paraguayan Guarani', symbol: '₲', symbolPosition: 'before', decimalSeparator: ',', thousandsSeparator: '.', decimals: 0 },
  { code: 'QAR', name: 'Qatari Rial', symbol: 'ر.ق', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'RON', name: 'Romanian Leu', symbol: 'lei', symbolPosition: 'after', decimalSeparator: ',', thousandsSeparator: '.', decimals: 2 },
  { code: 'RSD', name: 'Serbian Dinar', symbol: 'дин.', symbolPosition: 'after', decimalSeparator: ',', thousandsSeparator: '.', decimals: 2 },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', symbolPosition: 'after', decimalSeparator: ',', thousandsSeparator: ' ', decimals: 2 },
  { code: 'RWF', name: 'Rwandan Franc', symbol: 'FRw', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 0 },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'ر.س', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'SBD', name: 'Solomon Islands Dollar', symbol: '$', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'SCR', name: 'Seychellois Rupee', symbol: '₨', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'SDG', name: 'Sudanese Pound', symbol: 'ج.س.', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', symbolPosition: 'after', decimalSeparator: ',', thousandsSeparator: ' ', decimals: 2 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'SHP', name: 'Saint Helena Pound', symbol: '£', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'SLL', name: 'Sierra Leonean Leone', symbol: 'Le', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'SOS', name: 'Somali Shilling', symbol: 'S', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'SRD', name: 'Surinamese Dollar', symbol: '$', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'SSP', name: 'South Sudanese Pound', symbol: '£', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'STN', name: 'São Tomé and Príncipe Dobra', symbol: 'Db', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'SVC', name: 'Salvadoran Colón', symbol: '$', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'SYP', name: 'Syrian Pound', symbol: '£', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'SZL', name: 'Swazi Lilangeni', symbol: 'L', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'TJS', name: 'Tajikistani Somoni', symbol: 'ЅМ', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'TMT', name: 'Turkmenistani Manat', symbol: 'T', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'TND', name: 'Tunisian Dinar', symbol: 'د.ت', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 3 },
  { code: 'TOP', name: 'Tongan Paʻanga', symbol: 'T$', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', symbolPosition: 'before', decimalSeparator: ',', thousandsSeparator: '.', decimals: 2 },
  { code: 'TTD', name: 'Trinidad and Tobago Dollar', symbol: 'TT$', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'TWD', name: 'New Taiwan Dollar', symbol: 'NT$', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'UAH', name: 'Ukrainian Hryvnia', symbol: '₴', symbolPosition: 'before', decimalSeparator: ',', thousandsSeparator: ' ', decimals: 2 },
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 0 },
  { code: 'USD', name: 'US Dollar', symbol: '$', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'UYU', name: 'Uruguayan Peso', symbol: '$U', symbolPosition: 'before', decimalSeparator: ',', thousandsSeparator: '.', decimals: 2 },
  { code: 'UZS', name: 'Uzbekistan Som', symbol: 'лв', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'VES', name: 'Venezuelan Bolívar', symbol: 'Bs.', symbolPosition: 'before', decimalSeparator: ',', thousandsSeparator: '.', decimals: 2 },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', symbolPosition: 'after', decimalSeparator: ',', thousandsSeparator: '.', decimals: 0 },
  { code: 'VUV', name: 'Vanuatu Vatu', symbol: 'VT', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 0 },
  { code: 'WST', name: 'Samoan Tala', symbol: 'WS$', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'XAF', name: 'CFA Franc BEAC', symbol: 'FCFA', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 0 },
  { code: 'XCD', name: 'East Caribbean Dollar', symbol: '$', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'XOF', name: 'CFA Franc BCEAO', symbol: 'CFA', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 0 },
  { code: 'XPF', name: 'CFP Franc', symbol: '₣', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 0 },
  { code: 'YER', name: 'Yemeni Rial', symbol: '﷼', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'ZMW', name: 'Zambian Kwacha', symbol: 'ZK', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
  { code: 'ZWL', name: 'Zimbabwean Dollar', symbol: '$', symbolPosition: 'before', decimalSeparator: '.', thousandsSeparator: ',', decimals: 2 },
];

export const DEFAULT_CURRENCY_CODE = 'USD';

export function getCurrency(code: string): Currency {
  return CURRENCIES.find((c) => c.code === code) || CURRENCIES.find((c) => c.code === 'USD')!;
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

// Search currencies by code or name
export function searchCurrencies(query: string): Currency[] {
  const lowerQuery = query.toLowerCase();
  return CURRENCIES.filter(
    (c) =>
      c.code.toLowerCase().includes(lowerQuery) ||
      c.name.toLowerCase().includes(lowerQuery)
  );
}
