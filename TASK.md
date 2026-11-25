# Some customers were charged twice for one order

**Reported by:** Payments, after chargebacks from customers on slow mobile networks.

> "The app retries a checkout request if it does not get an answer within a few seconds, always with the same
> Idempotency-Key. Most retries are fine, but some customers got two charges and two orders seconds apart."

## Reproduce

```sh
npm test
```

## Done when

- Two requests with the same key, even at the same moment, produce one charge and one order.
- `npm test` passes, and you can explain the race and how you would make it safe across several servers.
