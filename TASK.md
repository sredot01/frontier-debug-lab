# We hammered the inventory service during its incident

**Reported by:** The inventory team, in the incident review.

> "While we were degraded, the orders API sent us about three times its normal traffic, all at once, with no gaps.
> It also kept asking for products that do not exist in our system, which can never succeed."

## Reproduce

```sh
npm test
```

## Done when

- Permanent errors are not retried, and transient ones are retried with growing waits.
- `npm test` passes.
- You can explain what a retry storm is and name one more safeguard you would add in production.
