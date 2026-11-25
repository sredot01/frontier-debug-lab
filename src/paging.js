import { ValidationError } from './errors.js';

// Offset pagination over a list that is already in a stable order. Pages start at 1.
export function paginate(items, page = 1, size = 20) {
  page = Number(page); size = Number(size);
  if (!Number.isInteger(page) || page < 1) throw new ValidationError('page must be a whole number from 1.');
  if (!Number.isInteger(size) || size < 1 || size > 100) throw new ValidationError('size must be a whole number from 1 to 100.');
  const start = (page - 1) * size;
  return { page, size, total: items.length, items: items.slice(start, start + size), hasMore: start + size < items.length };
}
