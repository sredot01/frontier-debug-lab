# A support agent could open the admin sales report

**Reported by:** Security, from an access review.

> "Accounts with roles like `admin-readonly` and `billing-admin-viewer` can load `/admin/report`.
> Only full admins should. Nobody changed those accounts recently."

## Reproduce

```sh
npm test
curl -s -i localhost:3000/admin/report -H 'x-demo-user: sam;admin-readonly'
```

## Done when

- Only users with the exact `admin` role get the report; everyone else gets 403.
- `npm test` passes, and you can name two ways to stop this class of bug in authorisation code.
