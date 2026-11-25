import { createCart } from './lib/cart.js';
import { createSearch } from './lib/search.js';
import { renderProducts } from './lib/render.js';
import { pluralize } from './lib/format.js';

const results = document.querySelector('[data-results]');
const status = document.querySelector('[data-status]');
const count = document.querySelector('[data-count]');
const cart = createCart();
cart.subscribe(() => { count.textContent = cart.count(); });

const search = createSearch({
  fetchResults: async q => (await (await fetch(`/products/search?q=${encodeURIComponent(q)}`)).json()).results,
  onResults: (q, items) => { status.textContent = q ? `${pluralize(items.length, 'result')} for “${q}”` : ''; results.innerHTML = renderProducts(items); },
});
document.querySelector('[data-search]').addEventListener('input', e => search.type(e.target.value));
results.addEventListener('click', e => { const id = e.target.closest('[data-add]')?.dataset.add; if (id) cart.add(id); });
search.run('lamp');
