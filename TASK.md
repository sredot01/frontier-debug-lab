# The cart badge stops updating

**Reported by:** QA.

> "The cart badge in the header says 0 no matter how many items I add. The cart itself has the items:
> checkout shows them. It started after someone 'simplified' the cart code."

## Reproduce

```sh
npm test
npm start   # then open http://localhost:3000/ and add a few products
```

## Done when

- Every change to the cart reaches its subscribers, so the badge always shows the right count.
- `npm test` passes, and you can explain why UI libraries rely on new objects instead of changed ones.
