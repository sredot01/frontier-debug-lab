// The cart store. State is replaced, never mutated, so subscribers can tell that something changed
// by comparing the previous and next state objects (the same rule React and most UI libraries rely on).
export function createCart() {
  let state = { lines: [] };
  const listeners = new Set();
  const set = next => { const prev = state; state = next; if (next !== prev) for (const fn of listeners) fn(state, prev); };
  return {
    get: () => state,
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    // `by` may come straight from an <input>, so it can be a string like "2".
    add(id, by = 1) {
      const qty = Number.parseInt(by, 10);
      if (!Number.isInteger(qty) || qty < 1) return;
      const existing = state.lines.find(l => l.id === id);
      if (existing) existing.qty += qty;
      else state.lines.push({ id, qty });
      set(state);
    },
    remove(id) { set({ ...state, lines: state.lines.filter(l => l.id !== id) }); },
    count: () => state.lines.reduce((n, l) => n + l.qty, 0),
  };
}
