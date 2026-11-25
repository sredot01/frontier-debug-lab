# Big orders fail at checkout

**Reported by:** Support, after two wholesale customers complained this morning.

> "Anything over about 70 items fails at checkout with *Something went wrong*. Smaller orders are fine.
> It started after last week's pricing release."

## Reproduce

```sh
npm test
curl -s -X POST localhost:3000/orders/quote -H 'Content-Type: application/json' -d '{"lines":[{"id":"p1","qty":80}]}'
```

## Done when

- Carts of any size get a quote, with the right discount tier.
- `npm test` passes, and you added or kept a test that would have caught this.
- You can explain the root cause in one or two sentences.
