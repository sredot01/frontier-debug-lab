# Customers see "try again later", and the logs blame inventory

**Reported by:** Support and the inventory team, who both think it is the other team's problem.

> Support: "Customers who type a quantity of 0 or 1000 get *The service is busy. Please try again later.*
> They retry and get the same thing."
>
> Inventory: "Your logs say *inventory service timeout*, but our service had zero errors all week."

## Reproduce

```sh
npm test
curl -s -i -X POST localhost:3000/orders/quote -H 'Content-Type: application/json' -d '{"lines":[{"id":"p1","qty":0}]}'
```

## Done when

- Bad input gets a 400 with a message the customer can act on, and real failures still get a 500.
- Logs describe what actually happened, at the right level.
- `npm test` passes, and you can explain why the misleading log line cost the teams time.
