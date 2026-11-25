import { ValidationError } from './errors.js';

// Volume discounts by total item count. Every count maps to exactly one tier.
export const TIERS = [
  { min: 0, rate: 0 },
  { min: 10, rate: 0.05 },
  { min: 25, rate: 0.10 },
  { min: 50, rate: 0.15 },
];
export const TAX_RATE = 0.08;

// Tiers above 10 items step every 25, so the tier can be picked directly instead of scanning the list.
export function tierFor(itemCount) {
  if (itemCount < 10) return TIERS[0];
  return TIERS[Math.min(1 + Math.floor(itemCount / 25), TIERS.length)];
}

// Quote a cart: [{ id, qty }] -> amounts in integer cents, so money never drifts.
export function quote(lines, products) {
  if (!Array.isArray(lines) || lines.length === 0) throw new ValidationError('The cart is empty.');
  let subtotal = 0;
  let items = 0;
  for (const line of lines) {
    if (!Number.isInteger(line?.qty) || line.qty < 1 || line.qty > 999) throw new ValidationError(`Quantity for ${line?.id ?? 'an item'} must be a whole number from 1 to 999.`);
    const product = products.get(line.id);
    if (!product) throw new ValidationError(`Unknown product: ${line.id}`);
    subtotal += product.priceCents * line.qty;
    items += line.qty;
  }
  const tier = tierFor(items);
  const discount = Math.round(subtotal * tier.rate);
  const tax = Math.round((subtotal - discount) * TAX_RATE);
  return { items, subtotalCents: subtotal, discountCents: discount, taxCents: tax, totalCents: subtotal - discount + tax, discountRate: tier.rate };
}
