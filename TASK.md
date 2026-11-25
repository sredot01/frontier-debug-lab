# Search got slow after the catalog grew

**Reported by:** The on-call engineer, from the latency dashboard.

> "p99 for `GET /products/search` went from 20 ms to several seconds after we imported the new suppliers
> (the catalog went from 2,000 to about 20,000 products). Short, common words like *pro* are the worst."

## Reproduce

```sh
npm test
```

## Done when

- Five searches on a 20,000-product catalog finish well inside the test's budget.
- Results are the same as before: same products, same order, no duplicates.
- You can state the time complexity before and after your change.
