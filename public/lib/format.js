// Money and text formatting for the storefront. Amounts arrive from the API in integer cents.
const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
export function formatMoney(cents) {
  if (!Number.isFinite(cents)) return '—';
  return usd.format(cents / 100);
}
export function pluralize(count, word) {
  return `${count} ${word}${count === 1 ? '' : 's'}`;
}
