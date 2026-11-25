import { createServer } from 'node:http';
import { createApp } from '../src/app.js';

// Start the app on a free port and return a small client. Logs are captured instead of printed.
export async function startApp({ products, catalog }) {
  const logs = [];
  const log = { warn: (...a) => logs.push(['warn', a.join(' ')]), error: (...a) => logs.push(['error', a.map(String).join(' ')]) };
  const server = createServer(createApp({ products, catalog, log }));
  await new Promise(resolve => server.listen(0, resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  return {
    logs,
    get: path => fetch(base + path),
    post: (path, body) => fetch(base + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
    close: () => new Promise(resolve => server.close(resolve)),
  };
}
