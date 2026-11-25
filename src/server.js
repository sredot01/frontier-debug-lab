import { createServer } from 'node:http';
import { createApp } from './app.js';
import { catalog, byId } from './catalog.js';

const port = Number(process.env.PORT) || 3000;
createServer(createApp({ products: byId, catalog })).listen(port, () => {
  console.log(`Orders API on http://localhost:${port}`);
  console.log('Try: curl -s localhost:' + port + '/products/search?q=lamp');
});
