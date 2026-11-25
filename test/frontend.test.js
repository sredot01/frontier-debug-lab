import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatMoney } from '../public/lib/format.js';
import { createCart } from '../public/lib/cart.js';
import { renderProducts } from '../public/lib/render.js';
import { createSearch } from '../public/lib/search.js';

test('prices show dollars and two-digit cents', () => {
  assert.equal(formatMoney(1250), '$12.50');
  assert.equal(formatMoney(300), '$3.00');
  assert.equal(formatMoney(5), '$0.05');
  assert.equal(formatMoney(123456), '$1,234.56');
});

test('quantities typed into the cart add up as numbers', () => {
  const cart = createCart();
  cart.add('p1', '2');
  cart.add('p1', '2');
  assert.equal(cart.get().lines[0].qty, 4);
  assert.equal(cart.count(), 4);
});

test('the cart badge is told about every change', () => {
  const cart = createCart();
  const seen = [];
  cart.subscribe((next, prev) => seen.push(next !== prev && next.lines.length));
  cart.add('p1');
  cart.add('p2');
  cart.add('p1');
  assert.deepEqual(seen, [1, 2, 2], 'each change must produce a new state object with the new lines');
});

test('product names from suppliers are shown as text, never run as HTML', () => {
  const html = renderProducts([{ id: 'p9', name: '<img src=x onerror="alert(document.cookie)">Lamp', priceCents: 999 }]);
  assert.ok(!html.includes('<img'), 'the name must not become a real tag');
  assert.match(html, /&lt;img/);
});

test('search shows results for the latest query, even when an older request finishes last', async () => {
  const shown = [];
  const delays = { la: 60, lamp: 5 };
  const search = createSearch({
    fetchResults: q => new Promise(resolve => setTimeout(() => resolve([`results for ${q}`]), delays[q])),
    onResults: q => shown.push(q),
  });
  const a = search.run('la');
  const b = search.run('lamp');
  await Promise.all([a, b]);
  assert.deepEqual(shown, ['lamp'], 'the slow, older "la" response must not replace the "lamp" results');
});
