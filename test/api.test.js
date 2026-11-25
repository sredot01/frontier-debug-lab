import { test } from 'node:test';
import assert from 'node:assert/strict';
import { startApp } from './helpers.js';
import { catalog, byId } from '../src/catalog.js';

test('GET /health', async () => {
  const app = await startApp({ products: byId, catalog });
  try { assert.equal((await app.get('/health')).status, 200); } finally { await app.close(); }
});

test('POST /orders/quote works for a large cart (60 items)', async () => {
  const app = await startApp({ products: byId, catalog });
  try {
    const res = await app.post('/orders/quote', { lines: [{ id: 'p1', qty: 40 }, { id: 'p2', qty: 20 }] });
    assert.equal(res.status, 200, `expected 200, got ${res.status}: ${await res.clone().text()}`);
    assert.equal((await res.json()).discountRate, 0.15);
  } finally { await app.close(); }
});

test('an invalid quantity is a 400 with a clear message, logged as a warning', async () => {
  const app = await startApp({ products: byId, catalog });
  try {
    const res = await app.post('/orders/quote', { lines: [{ id: 'p1', qty: 0 }] });
    assert.equal(res.status, 400);
    assert.match((await res.json()).error, /Quantity/);
    assert.equal(app.logs.filter(([level]) => level === 'error').length, 0, 'validation errors must not be logged as errors');
    assert.ok(!app.logs.some(([, message]) => /inventory|timeout/i.test(message)), 'logs must describe what actually happened');
  } finally { await app.close(); }
});

test('search finds products by name and tag, case-insensitively', async () => {
  const app = await startApp({ products: byId, catalog });
  try {
    const { results } = await (await app.get('/products/search?q=LAMP')).json();
    assert.ok(results.length > 0);
    assert.ok(results.every(p => /lamp/i.test(p.name)));
    assert.equal(new Set(results.map(p => p.id)).size, results.length, 'no duplicates');
  } finally { await app.close(); }
});
