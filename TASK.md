# The product feed shows some products twice and skips others

**Reported by:** The mobile team.

> "With infinite scroll, the first product of each new page is the same one that ended the page before.
> Customers also say a few products never appear at all, even when they scroll to the end."

## Reproduce

```sh
npm test
curl -s 'localhost:3000/products?page=1&size=5'; echo; curl -s 'localhost:3000/products?page=2&size=5'
```

## Done when

- Walking every page returns each product exactly once, in order.
- `npm test` passes, and you can say how you would make paging safe when products are added during scrolling.
