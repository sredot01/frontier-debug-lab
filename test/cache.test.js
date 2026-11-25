import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createCache } from '../src/cache.js';

test('cached prices expire after the TTL', async () => {
  let clock = 1_700_000_000_000;
  let price = 100;
  const cache = createCache({ ttlMs: 60_000, now: () => clock });
  assert.equal(await cache.get('p1', async () => price), 100);
  price = 120;
  clock += 30_000;
  assert.equal(await cache.get('p1', async () => price), 100, 'still fresh after 30 s');
  clock += 31_000;
  assert.equal(await cache.get('p1', async () => price), 120, 'a price change must show up once the entry is older than the TTL');
});

test('the cache stores the loaded value, not a pending promise', async () => {
  const cache = createCache({ ttlMs: 60_000 });
  const first = await cache.get('k', async () => ({ price: 5 }));
  const second = await cache.get('k', async () => ({ price: 999 }));
  assert.deepEqual(second, first);
  assert.equal(typeof second.then, 'undefined');
});
