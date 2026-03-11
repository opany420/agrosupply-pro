import { CURRENCY } from './constants';

export function formatCurrency(amount) {
  return `${CURRENCY.symbol} ${Number(amount).toLocaleString()}`;
}

export function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString(CURRENCY.locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
