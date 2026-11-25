import { quote } from './pricing.js';
import { ValidationError } from './errors.js';

// Orders with idempotency keys: a client that retries a timed-out request with the same key must get the
// same order back, never a second charge. `charge` stands in for the payment provider and is async.
export function createOrders({ products, charge = async () => ({ ok: true }), now = () => Date.now() }) {
  const orders = [];
  const byKey = new Map();   // idempotency key -> Promise<order>
  async function place(lines, { idempotencyKey } = {}) {
    if (!idempotencyKey || !/^[A-Za-z0-9-]{8,64}$/.test(idempotencyKey)) throw new ValidationError('An Idempotency-Key header (8 to 64 letters, digits or dashes) is required.');
    if (byKey.has(idempotencyKey)) return byKey.get(idempotencyKey);
    const pending = (async () => {
      const q = quote(lines, products);
      await charge(q.totalCents);
      const order = { id: `o${orders.length + 1}`, createdAt: now(), totalCents: q.totalCents, items: q.items };
      orders.push(order);
      return order;
    })();
    byKey.set(idempotencyKey, pending);
    pending.catch(() => byKey.delete(idempotencyKey));   // a failed attempt may be retried with the same key
    return pending;
  }
  return { place, list: () => orders.slice() };
}

// Daily sales for a store in a given UTC offset (minutes; India is +330). Days are the store's local days.
export function dailyReport(orders, { utcOffsetMinutes = 0 } = {}) {
  const days = new Map();
  for (const order of orders) {
    const local = new Date(order.createdAt + utcOffsetMinutes * 60_000);
    const day = local.toISOString().slice(0, 10);
    const row = days.get(day) || { day, orders: 0, totalCents: 0 };
    row.orders += 1; row.totalCents += order.totalCents;
    days.set(day, row);
  }
  return [...days.values()].sort((a, b) => a.day.localeCompare(b.day));
}
