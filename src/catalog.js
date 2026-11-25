// Product catalog. Generated deterministically so tests and demos see the same data everywhere.
const ADJECTIVES = ['Classic', 'Smart', 'Eco', 'Pro', 'Mini', 'Ultra', 'Travel', 'Studio', 'Daily', 'Rugged'];
const NOUNS = ['Mug', 'Lamp', 'Backpack', 'Keyboard', 'Bottle', 'Notebook', 'Headphones', 'Chair', 'Desk', 'Charger'];

export function makeCatalog(size = 2000) {
  const products = [];
  for (let i = 0; i < size; i++) {
    const name = `${ADJECTIVES[i % ADJECTIVES.length]} ${NOUNS[Math.floor(i / ADJECTIVES.length) % NOUNS.length]} ${i + 1}`;
    products.push({ id: `p${i + 1}`, name, priceCents: 499 + ((i * 37) % 9500), tags: [NOUNS[Math.floor(i / ADJECTIVES.length) % NOUNS.length].toLowerCase()] });
  }
  return products;
}

export const catalog = makeCatalog();
export const byId = new Map(catalog.map(p => [p.id, p]));

// Case-insensitive search on name and tags. Returns at most `limit` products, each product once.
export function search(products, query, limit = 20) {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return [];
  const seen = new Set();
  const results = [];
  for (const product of products) {
    const haystack = `${product.name} ${product.tags.join(' ')}`.toLowerCase();
    if (haystack.includes(q) && !seen.has(product.id)) {
      seen.add(product.id);
      results.push(product);
    }
  }
  // Keep results in catalog order so pages stay stable between requests.
  const position = product => products.findIndex(p => p.id === product.id);
  results.sort((a, b) => position(a) - position(b));
  return results.slice(0, limit);
}
