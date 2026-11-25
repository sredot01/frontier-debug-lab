import { UpstreamError } from './errors.js';

// A fake inventory service. In production this is an HTTP call; here it is in memory so the lab runs anywhere.
export function createInventory(stock = {}) {
  return {
    calls: 0,
    async check(id) {
      this.calls++;
      if (!(id in stock)) throw new UpstreamError(`No inventory record for ${id}`, 404);
      return stock[id];
    },
  };
}
