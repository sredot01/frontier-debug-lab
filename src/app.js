import { ValidationError } from './errors.js';
import { quote } from './pricing.js';
import { search } from './catalog.js';

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
export function createApp({ products, catalog, log = console }) {
  return async function handle(req, res) {
    const url = new URL(req.url, 'http://localhost');
    try {
      if (req.method === 'GET' && url.pathname === '/health') return send(res, 200, { ok: true });
      if (req.method === 'GET' && url.pathname === '/products/search') return send(res, 200, { results: search(catalog, url.searchParams.get('q')) });
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
