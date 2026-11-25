# Search results sometimes jump back to an older search

**Reported by:** QA, on a throttled mobile connection.

> "I type *lamp* quickly. The results for *lamp* appear, and then a second later they are replaced by results
> for *la*. The search box still says lamp."

## Reproduce

```sh
npm test
```

In Chrome DevTools you can see it live: Network → throttle to Slow 3G, then type quickly on http://localhost:3000/.

## Done when

- Only the response for the latest query is ever shown.
- `npm test` passes, and you can name two ways to fix this kind of race in a UI.
