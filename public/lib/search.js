// Search-as-you-type. Requests can finish in any order, so only the response for the latest query is shown.
export function createSearch({ fetchResults, onResults, delayMs = 200 }) {
  let timer = null;
  let latest = 0;
  return {
    type(query) {
      clearTimeout(timer);
      timer = setTimeout(() => this.run(query), delayMs);
    },
    async run(query) {
      const results = await fetchResults(query);
      onResults(query, results);
    },
  };
}
