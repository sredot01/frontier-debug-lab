# A security researcher ran script on the store through a product name

**Reported by:** A researcher, through the bug bounty programme.

> "A supplier feed lets anyone set a product name. I set one to
> `<img src=x onerror="alert(document.cookie)">` and the script ran for every shopper who searched for it."

## Reproduce

```sh
npm test
```

## Done when

- Product names always show as text and can never run as HTML or script.
- `npm test` passes, and you can name one more layer of defence you would add (beyond fixing this line).
