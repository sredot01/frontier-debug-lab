import { createServer } from 'node:http';
import { createApp } from './app.js';
import { catalog, byId } from './catalog.js';
import { createOrders } from './orders.js';

const port = Number(process.env.PORT) || 3000;
createServer(createApp({ products: byId, catalog, orders: createOrders({ products: byId }) })).listen(port, () => {
  console.log(`Orders API on http://localhost:${port}`);
  console.log('Open the storefront at http://localhost:' + port + '/  ·  API: /products/search?q=lamp');
});
