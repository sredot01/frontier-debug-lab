# Late-evening orders land on the wrong day in the sales report

**Reported by:** The store manager in Bengaluru.

> "Orders placed after midnight here show up under the previous day in the daily sales report, and in the evening
> the numbers for *today* look too small. Our day ends at midnight India time."

## Reproduce

```sh
npm test
```

## Done when

- The report groups orders by the store's local day (UTC+5:30).
- `npm test` passes, and you can explain where time zones should be applied in a system like this.
