import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeCatalog, search } from '../src/catalog.js';

test('search stays fast on a 20,000-product catalog', () => {
  const big = makeCatalog(20_000);
  search(big, 'mug');   // warm up
  const started = performance.now();
  for (const q of ['mug', 'lamp', 'pro', 'desk', 'charger']) search(big, q, 50);
  const ms = performance.now() - started;
  assert.ok(ms < 400, `5 searches took ${ms.toFixed(0)} ms; the budget is 400 ms`);
});
