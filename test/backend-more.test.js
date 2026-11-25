import { test } from 'node:test';
import assert from 'node:assert/strict';
import { paginate } from '../src/paging.js';
import { createOrders, dailyReport } from '../src/orders.js';
import { isAdmin } from '../src/auth.js';
import { startApp } from './helpers.js';
import { catalog, byId } from '../src/catalog.js';

test('walking every page returns each product exactly once', () => {
  const items = Array.from({ length: 45 }, (_, i) => ({ id: i + 1 }));
  const seen = [];
  for (let page = 1; ; page++) {
    const p = paginate(items, page, 20);
    seen.push(...p.items.map(x => x.id));
    if (!p.hasMore) break;
    assert.ok(page < 10, 'pagination never ended');
  }
  assert.deepEqual(seen, items.map(x => x.id));
});

test('a retried order with the same idempotency key is charged once', async () => {
  let charges = 0;
  const orders = createOrders({ products: byId, charge: async () => { charges++; await new Promise(r => setTimeout(r, 20)); } });
  const lines = [{ id: 'p1', qty: 1 }];
  const [a, b] = await Promise.all([orders.place(lines, { idempotencyKey: 'order-abc-123' }), orders.place(lines, { idempotencyKey: 'order-abc-123' })]);
  assert.equal(a.id, b.id);
  assert.equal(charges, 1, 'the customer must be charged once');
  assert.equal(orders.list().length, 1);
});

test('the daily report uses the store’s local day (India, UTC+5:30)', () => {
  const orders = [
    { createdAt: Date.parse('2026-11-20T10:00:00Z'), totalCents: 1000 },   // 15:30 in India, 20 Nov
    { createdAt: Date.parse('2026-11-20T20:00:00Z'), totalCents: 500 },    // 01:30 in India, 21 Nov
  ];
  assert.deepEqual(dailyReport(orders, { utcOffsetMinutes: 330 }), [
    { day: '2026-11-20', orders: 1, totalCents: 1000 },
    { day: '2026-11-21', orders: 1, totalCents: 500 },
  ]);
});

test('only the exact admin role is an admin', () => {
  assert.equal(isAdmin({ roles: ['support', 'admin'] }), true);
  for (const roles of [['admin-readonly'], ['billing-admin-viewer'], ['administrator-trainee'], []]) assert.equal(isAdmin({ roles }), false, roles.join(','));
  assert.equal(isAdmin(null), false);
});

test('API: products are paged, orders need a key, the report is for admins only', async () => {
  const app = await startApp({ products: byId, catalog, orders: createOrders({ products: byId }) });
  try {
    const page = await (await app.get('/products?page=2&size=5')).json();
    assert.deepEqual(page.items.map(p => p.id), ['p6', 'p7', 'p8', 'p9', 'p10']);
    assert.equal((await app.post('/orders', { lines: [{ id: 'p1', qty: 1 }] })).status, 400);
    assert.equal((await app.get('/admin/report', { 'x-demo-user': 'sam;admin-readonly' })).status, 403);
    assert.equal((await app.get('/admin/report', { 'x-demo-user': 'ana;admin' })).status, 200);
  } finally { await app.close(); }
});

test('the storefront page is served', async () => {
  const app = await startApp({ products: byId, catalog });
  try {
    const res = await app.get('/');
    assert.equal(res.status, 200);
    assert.match(await res.text(), /Debug Lab Store/);
    assert.equal((await app.get('/lib/../../package.json')).status, 404);
  } finally { await app.close(); }
});
