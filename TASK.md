# Adding 2 and then 2 more puts 22 in the cart

**Reported by:** A customer, via support chat.

> "I typed 2 in the quantity box and pressed add, then did it again. The cart says 22 of them."

## Reproduce

```sh
npm test
```

The quantity comes straight from an `<input>`, so the cart receives what the browser gives it.

## Done when

- Quantities add up as numbers, whatever type they arrive as, and bad input is ignored.
- `npm test` passes, and you can explain why this happens in JavaScript.
