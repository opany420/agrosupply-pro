// Company information — single source of truth for hardcoded values
// Import from here instead of repeating strings across components.

export const COMPANY = {
  name: 'Chicago Agro Supplies Limited',
  shortName: 'Chicago Agro',
  location: 'Ahero, Kisumu County, Kenya',
  address: 'P.O. Box 7, 40101 Ahero, Kisumu County',
  postalFull: 'P.O. Box 7, 40101 Ahero, Kisumu County, Kenya',
  phone: '+254 757 790 379',
  phoneRaw: '254757790379',       // for wa.me links
  email: 'info@chicagoagro.co.ke',
  workingHours: 'Mon - Sat: 8AM - 6PM',
};

export const PAYMENT = {
  paybillNumber: '247247',
  accountNumber: '0790026955',
  accountName: 'Chicago Agro Supplies Limited',
  branch: 'Kakamega',
};

export const WHATSAPP = {
  baseUrl: `https://wa.me/${COMPANY.phoneRaw}`,
  defaultMessage: 'Hello! I am interested in your agricultural products.',
  orderMessage: 'Hello! I want to place an order.',
};

export const CURRENCY = {
  code: 'KES',
  symbol: 'KES',
  locale: 'en-KE',
};
