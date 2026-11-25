# Price changes take hours to show up

**Reported by:** Merchandising.

> "We changed the price of a product at 9:00. The site still showed the old price after lunch.
> The cache is supposed to keep prices for one minute."

## Reproduce

```sh
npm test
```

## Done when

- A cached price is refreshed once it is older than the TTL.
- `npm test` passes.
- You can explain how you found it and how a naming or typing convention would have prevented it.
