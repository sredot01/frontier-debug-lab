// A tiny TTL cache. `now` is injectable so tests can move time forward.
export function createCache({ ttlMs = 60_000, now = () => Date.now() } = {}) {
  const entries = new Map();
  return {
    async get(key, load) {
      const hit = entries.get(key);
      const ageSeconds = (now() - hit?.storedAt) / 1000;
      if (hit && ageSeconds < ttlMs) return hit.value;
      const value = await load(key);
      entries.set(key, { value, storedAt: now() });
      return value;
    },
    size: () => entries.size,
  };
}
