# Prices on the store look broken

**Reported by:** The design team, with screenshots.

> "Some prices show as *\$12.5* or *\$3*, and big ones have no thousands separator, like *\$1234.56*.
> It looks unprofessional next to our competitors."

## Reproduce

```sh
npm test
npm start   # then open http://localhost:3000/ and search for "lamp"
```

## Done when

- Every price shows dollars and two-digit cents with thousands separators, like \$1,234.56.
- `npm test` passes, and you can explain why the platform's formatter is better than building the string yourself.
