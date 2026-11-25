import { test } from 'node:test';
import assert from 'node:assert/strict';
import { withRetry } from '../src/retry.js';
import { UpstreamError } from '../src/errors.js';
import { createInventory } from '../src/inventory.js';

test('a 404 from inventory is not retried', async () => {
  const inventory = createInventory({});
  await assert.rejects(withRetry(() => inventory.check('missing'), { attempts: 3, baseDelayMs: 1 }), { status: 404 });
  assert.equal(inventory.calls, 1, 'a missing record will not appear by asking again');
});

test('a 503 is retried with growing waits, then gives up', async () => {
  let calls = 0;
  const started = performance.now();
  await assert.rejects(withRetry(() => { calls++; throw new UpstreamError('busy', 503); }, { attempts: 3, baseDelayMs: 20 }), { status: 503 });
  const ms = performance.now() - started;
  assert.equal(calls, 3);
  assert.ok(ms >= 55, `retries must wait (20 ms, then 40 ms); they finished in ${ms.toFixed(0)} ms`);
});

test('a transient failure recovers on the next attempt', async () => {
  let calls = 0;
  const value = await withRetry(() => { calls++; if (calls < 2) throw new UpstreamError('blip', 502); return 'ok'; }, { baseDelayMs: 1 });
  assert.equal(value, 'ok');
  assert.equal(calls, 2);
});
