# Some totals are a cent off

**Reported by:** Finance, during month-end reconciliation.

> "About a third of orders differ from our ledger by exactly one cent, always in the customer's favour.
> Small amounts, but auditors flag every mismatch, and it adds up over a month."

## Reproduce

```sh
npm test
curl -s -X POST localhost:3000/orders/quote -H 'Content-Type: application/json' -d '{"lines":[{"id":"p1","qty":5}]}'
```

Finance computes every amount in whole cents and rounds the discount and the tax once each.

## Done when

- Quotes match the finance rule to the cent for every cart in the tests.
- `npm test` passes, and you can say why this class of bug happens and how to avoid it everywhere money is handled.
