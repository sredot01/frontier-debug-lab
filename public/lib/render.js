import { escapeHtml } from './escape.js';
import { formatMoney } from './format.js';

// Product cards as an HTML string. Every value from the API is escaped.
export function renderProducts(products) {
  if (!products.length) return '<p class="empty">No products match your search.</p>';
  return products.map(p => `<article class="card">
    <h3>${p.name}</h3>
    <p class="price">${formatMoney(p.priceCents)}</p>
    <button type="button" data-add="${escapeHtml(p.id)}">Add to cart</button>
  </article>`).join('');
}
