import { test } from 'node:test';
import assert from 'node:assert/strict';
import { quote, tierFor } from '../src/pricing.js';

const products = new Map([
  ['a', { id: 'a', priceCents: 1999 }],
  ['b', { id: 'b', priceCents: 10 }],
  ['c', { id: 'c', priceCents: 333 }],
]);

test('a small cart has no discount and 8% tax', () => {
  const q = quote([{ id: 'a', qty: 2 }], products);
  assert.equal(q.subtotalCents, 3998);
  assert.equal(q.discountCents, 0);
  assert.equal(q.taxCents, 320);
  assert.equal(q.totalCents, 4318);
});

test('every item count gets a discount tier, including very large carts', () => {
  for (const count of [0, 9, 10, 24, 25, 49, 50, 60, 120, 999]) {
    assert.ok(tierFor(count), `no tier for ${count} items`);
  }
  assert.equal(tierFor(9).rate, 0);
  assert.equal(tierFor(10).rate, 0.05);
  assert.equal(tierFor(25).rate, 0.10);
  assert.equal(tierFor(50).rate, 0.15);
  assert.equal(tierFor(500).rate, 0.15);
});

test('a 120-item cart gets the top discount', () => {
  const q = quote([{ id: 'b', qty: 120 }], products);
  assert.equal(q.discountRate, 0.15);
  assert.equal(q.totalCents, 1200 - 180 + 82);
});

test('totals match the finance report to the cent', () => {
  // Finance computes in integer cents: discount and tax are each rounded once.
  const cases = [
    [[{ id: 'c', qty: 3 }], 1079],
    [[{ id: 'c', qty: 5 }], 1798],
    [[{ id: 'b', qty: 1 }, { id: 'c', qty: 10 }], 3427],
    [[{ id: 'a', qty: 13 }, { id: 'c', qty: 1 }], 27004],
  ];
  for (const [lines, expected] of cases) assert.equal(quote(lines, products).totalCents, expected, JSON.stringify(lines));
});

test('bad quantities are rejected as validation errors', () => {
  for (const qty of [0, -1, 1.5, 1000, '2']) {
    assert.throws(() => quote([{ id: 'a', qty }], products), { name: 'ValidationError' });
  }
});
