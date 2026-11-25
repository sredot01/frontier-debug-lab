import { ValidationError } from './errors.js';
import { quote } from './pricing.js';
import { search } from './catalog.js';
import { paginate } from './paging.js';
import { dailyReport } from './orders.js';
import { isAdmin, userFromHeader } from './auth.js';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const publicDir = fileURLToPath(new URL('../public/', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8' };

const send = (res, status, body) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
};
async function readJson(req) {
  let raw = '';
  for await (const chunk of req) { raw += chunk; if (raw.length > 100_000) throw new ValidationError('The request body is too large.'); }
  try { return JSON.parse(raw || '{}'); } catch { throw new ValidationError('The request body is not valid JSON.'); }
}

// The request handler. Kept separate from server.js so tests can call it without opening a port.
export function createApp({ products, catalog, orders, utcOffsetMinutes = 330, log = console }) {
  return async function handle(req, res) {
    const url = new URL(req.url, 'http://localhost');
    try {
      if (req.method === 'GET' && url.pathname === '/health') return send(res, 200, { ok: true });
      if (req.method === 'GET' && url.pathname === '/products/search') return send(res, 200, { results: search(catalog, url.searchParams.get('q')) });
      if (req.method === 'GET' && url.pathname === '/products') return send(res, 200, paginate(catalog, url.searchParams.get('page') ?? 1, url.searchParams.get('size') ?? 20));
      if (req.method === 'POST' && url.pathname === '/orders' && orders) {
        const body = await readJson(req);
        return send(res, 201, await orders.place(body.lines, { idempotencyKey: req.headers['idempotency-key'] }));
      }
      if (req.method === 'GET' && url.pathname === '/admin/report' && orders) {
        if (!isAdmin(userFromHeader(req.headers['x-demo-user']))) return send(res, 403, { error: 'Admins only.' });
        return send(res, 200, { days: dailyReport(orders.list(), { utcOffsetMinutes }) });
      }
      if (req.method === 'GET' && (url.pathname === '/' || url.pathname.startsWith('/lib/') || url.pathname === '/app.js' || url.pathname === '/styles.css')) {
        const file = normalize(join(publicDir, url.pathname === '/' ? 'index.html' : url.pathname));
        if (!file.startsWith(publicDir)) return send(res, 404, { error: 'Not found' });
        try {
          const body = await readFile(file);
          res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' });
          return res.end(body);
        } catch { return send(res, 404, { error: 'Not found' }); }
      }
      if (req.method === 'POST' && url.pathname === '/orders/quote') {
        const body = await readJson(req);
        return send(res, 200, quote(body.lines, products));
      }
      return send(res, 404, { error: 'Not found' });
    } catch (error) {
      if (error instanceof ValidationError) {
        log.warn(`400 ${req.method} ${url.pathname}: ${error.message}`);
        return send(res, 400, { error: error.message });
      }
      log.error(`500 ${req.method} ${url.pathname}:`, error);
      return send(res, 500, { error: 'Something went wrong.' });
    }
  };
}
