# Contributing to TrendyFits / Advanced-React-Sickfits

A monorepo in name only: there is **no root `package.json`**. Two independent
packages sit side by side, and every install / lint / test / build happens
*inside* the package you are touching.

| Path | What it is |
| --- | --- |
| `sick-fits/frontend` | The Next.js storefront (React, jest, tailwind) |
| `sick-fits/backend` | The Keystone 5 API (Mongo, Stripe, Cloudinary, nodemailer) |
| `sick-fits/render.yaml` | Render deploy blueprint |
| `.github/workflows/ci.yml` | The CI gate — one job per package |

## Node 16, on purpose

Both packages are pinned to Node 16 in CI and that is not an oversight. The
Keystone 5 backend is built on Next 10 / webpack 4, whose `md4` hashing was
removed in OpenSSL 3 — on Node 17+ the backend build dies with
`error:0308010C:digital envelope routines::unsupported`. Do not "modernise" the
CI node version as drive-by housekeeping; that is its own project with its own
PR.

## Frontend

```bash
cd sick-fits/frontend
npm ci
npm test             # jest in CI mode — a changed snapshot FAILS, it is not rewritten
npx next lint        # reads .eslintrc.json (next/core-web-vitals); warnings OK, errors fail
npm run build
```

## Backend

```bash
cd sick-fits/backend
npm ci               # postinstall runs patch-package and applies patches/ — do not skip it
npm run build        # keystone-next
npx tsc --noEmit     # see the note below
```

The Keystone config is evaluated at **build** time, so every value it reads has
to exist. CI passes placeholders (`CLOUDINARY_*`, `COOKIE_SECRET`,
`DATABASE_URL`, `MAIL_*`, `STRIPE_SECRET`, `FRONTEND_URL`) — none of them are
real, and none are baked into the output. Locally, put what you need in the
package's `.env`. Never commit real credentials.

### Known type debt — `tsc --noEmit` is not a gate yet

`tsc --noEmit` currently reports pre-existing errors in `lib/mail.ts`,
`lib/stripe.ts`, `mutations/checkout.ts`, `schemas/ProductImage.ts` and
`seed-data/index.ts` (recorded in `daily-dev-log` `log/2026-09-29.md`). CI keeps
the step visible but non-blocking so the debt cannot be forgotten.
**Do not fix them blind inside an unrelated PR** — either scope a PR to the debt
itself, or leave them alone. Introducing *new* type errors is not acceptable
either way.

## Branches and commits

- Branch: `feat/…`, `fix/…`, `chore/…`, `docs/…`, `ci/…`, `deps/…`
- Commit subject: imperative, one line, scoped to the package when it helps —
  `fix(frontend): stop the cart cookie being dropped on the API route`
- One concern per PR. Dependabot raises the dependency PRs; review them rather
  than hand-bumping versions.

## Review

CODEOWNERS routes everything to `@Owen5e`. CI must be green — both the frontend
and the backend job.

## License

MIT — see [LICENSE](LICENSE).
