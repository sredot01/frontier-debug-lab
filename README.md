# Frontier Debug Lab

A small orders API for practising **debugging with AI** in mock interviews on [Frontier](https://deepak.live/interviews).
It has no dependencies: plain Node.js, so it runs the same in GitHub Codespaces, VS Code and StackBlitz.

`main` is healthy and every test passes. Each `bug/*` branch plants one realistic production bug, described the way
an on-call engineer would first hear about it, in that branch's `TASK.md`.

## Start

```sh
npm test        # run the tests (Node 18.18 or newer)
npm start       # start the API and the storefront on http://localhost:3000
```

Open http://localhost:3000/ for the storefront (search, product cards, cart). Its logic lives in `public/lib/` as plain
modules, so the same code runs in the browser and in `npm test`.

| Endpoint | What it does |
|---|---|
| `GET /health` | Liveness check |
| `GET /products/search?q=lamp` | Case-insensitive search on name and tags |
| `POST /orders/quote` | Body `{"lines":[{"id":"p1","qty":2}]}`, returns subtotal, discount, tax and total in cents |
| `GET /products?page=2&size=20` | Paged product feed |
| `POST /orders` | Places an order. Needs an `Idempotency-Key` header, so a retried request is never charged twice |
| `GET /admin/report` | Daily sales in the store's time zone. Header `x-demo-user: ana;admin` (demo auth) |

```sh
curl -s -X POST localhost:3000/orders/quote -H 'Content-Type: application/json' -d '{"lines":[{"id":"p1","qty":2}]}'
```

## Scenarios

### Backend

| Branch | What users report |
|---|---|
| `bug/large-cart` | Big orders fail at checkout |
| `bug/wrong-total` | Some totals are a cent off from the finance report |
| `bug/slow-search` | Search got slow after the catalog grew |
| `bug/error-503s` | Customers see "try again later" and the logs blame the inventory service |
| `bug/inventory-overload` | During an inventory incident we hammered the service |
| `bug/stale-prices` | Price changes take hours to show up |
| `bug/duplicate-feed` | The product feed shows some products twice and never shows others |
| `bug/report-dates` | Late-evening orders land on the wrong day in the sales report |
| `bug/double-orders` | Some customers were charged twice for one order |
| `bug/admin-access` | A support agent could open the admin sales report |

### Frontend

| Branch | What users report |
|---|---|
| `bug/ui-prices` | Prices on the store look broken, like $12.5 |
| `bug/ui-quantity` | Adding 2 and then 2 more puts 22 in the cart |
| `bug/ui-search-flicker` | Search results sometimes jump back to an older search |
| `bug/ui-security-report` | A security researcher ran script on the store through a product name |
| `bug/ui-cart-badge` | The cart badge stops updating after the first item |

```sh
git switch bug/large-cart && cat TASK.md && npm test
```

## How to work in an interview

1. Reproduce the problem first: run the tests or call the endpoint.
2. Use GitHub Copilot like you would at work. In VS Code, open Copilot Chat (`Ctrl+Alt+I`, or `Ctrl+Cmd+I` on a Mac) and try
   `/explain` on the failing code, `/fix` on the bug, and `/tests` for the regression test you add.
3. Say out loud what you accept from Copilot and why, and what you check yourself. The interviewer cares more about your
   judgement than about speed.
4. Finish with a fix, a test that would have caught it, and one sentence on how you would stop it happening again.

## Open it

- **GitHub Codespaces:** Code → Codespaces → Create codespace. The dev container installs Node and recommends Copilot.
- **VS Code desktop:** clone the repo, open the folder, run `npm test`.
- **StackBlitz:** `https://stackblitz.com/github/<owner>/frontier-debug-lab`

MIT licence. Built for practice; do not use this code in production.
