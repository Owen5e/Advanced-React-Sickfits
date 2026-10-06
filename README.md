# TrendyFits

Full-stack storefront for **TrendyFits Ltd** — a Next.js + Apollo shopping experience on top of a
Keystone.js GraphQL API: catalogue and category browsing, cart, Stripe checkout, order history,
Cloudinary-hosted product images, email password resets, and a role-gated admin UI.

| | |
| --- | --- |
| **Live store** | https://trendyfits.vercel.app |
| **API** | https://api.owenstack.com/api/graphql — Keystone admin at `/admin` |
| **Stack** | Next.js 13 · React 18 · Apollo Client 3.6 · styled-components 6 · Tailwind CSS 3 · Keystone 5 (GraphQL) · MongoDB (mongoose) · Stripe · Cloudinary · Nodemailer |
| **Node** | **16.x** — required, not a preference (see Prerequisites) |
| **Repo** | https://github.com/Owen5e/TrendyFits |

## What it is

Two independent npm packages side by side under `sick-fits/`: a Next.js storefront and a
Keystone.js backend that serves the GraphQL API and its own admin UI. A shopper lands on
`/products`, browses by category, opens a product, adds it to a cart held in Apollo's local state,
and checks out through Stripe. The backend owns everything durable — users, roles, products,
images, carts, orders — and talks to MongoDB through the mongoose adapter.

The storefront falls back gracefully when the backend is unreachable: the endpoint is resolved at
runtime and every query has an error path, so a stale or sleeping API shows the failure rather than
a white screen.

## Why it exists

This is the codebase that became the TrendyFits Ltd storefront. It began life as the
*Advanced React* course project and has been modernised in place: Next 13 and React 18, Apollo
Client 3.6, styled-components 6, GraphQL 16, a patched Keystone session so cross-domain cookies
actually work between Vercel and the API host, and a CI workflow that lints, tests and builds both
packages. `sick-fits/MODERNIZATION_CHANGES.md` records that migration; `.github/workflows/ci.yml`
is the contract that keeps it honest.

## Repository layout

There is **no root `package.json`** — `sick-fits/` is a folder, not a workspace. Every command runs
from inside the package you care about.

```
TrendyFits/
├── .github/
│   ├── workflows/ci.yml        lint + test + build for both packages, Node 16
│   ├── dependabot.yml
│   ├── CODEOWNERS
│   ├── ISSUE_TEMPLATE/{bug_report,feature_request}.md
│   └── pull_request_template.md
├── CONTRIBUTING.md
├── LICENSE
└── sick-fits/
    ├── MODERNIZATION_CHANGES.md
    ├── render.yaml              backend deploy blueprint (Render)
    ├── backend/                 Keystone 5 GraphQL API + admin UI
    │   ├── keystone.ts          schema, session, CORS, mongoose adapter
    │   ├── schemas/             User, Product, ProductImage, CartItem, Order, OrderItem, Role, Category
    │   ├── mutations/           custom GraphQL mutations (checkout)
    │   ├── lib/                 mail + stripe helpers
    │   ├── patches/             patch-package patches applied on install
    │   └── seed-data/
    └── frontend/                Next.js 13 storefront
        ├── pages/               products, category, product, order, account, sell, signin, reset, update
        ├── pages/api/ai-search.js   next/serverless search endpoint
        ├── components/          UI
        ├── lib/                 Apollo client, cart state, form + money helpers
        ├── __tests__/           Jest + Testing Library
        └── vercel.json          deploy config for the storefront
```

## Prerequisites

- **Node 16** (`nvm install 16 && nvm use 16`). Both `package.json` files and the CI workflow pin
  it: the Keystone 5 backend runs on Next 10 / webpack 4, whose `md4` hashing was removed in
  OpenSSL 3, so Node 17+ fails the build.
- **npm** (both packages ship `package-lock.json`; install from the lockfile).
- **MongoDB** — a local `mongod` or an Atlas connection string.
- Optional, only for the features that use them: Cloudinary (image uploads), Stripe (checkout),
  SMTP credentials (password-reset email).

## Getting started

### 1. Backend — the API and admin UI

```bash
cd sick-fits/backend
npm ci                       # postinstall runs patch-package; the patches in patches/ must apply
```

Create `sick-fits/backend/.env` (no `.env.example` is committed — see the table below):

```dotenv
DATABASE_URL=mongodb://localhost:27017/trendyfits
COOKIE_SECRET=some-long-random-string
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_KEY=...
CLOUDINARY_SECRET=...
STRIPE_SECRET=sk_test_...
MAIL_HOST=localhost
MAIL_PORT=2525
MAIL_USER=you@example.com
MAIL_PASS=...
FRONTEND_URL=http://localhost:7777
```

```bash
npm run dev                  # keystone-next — GraphQL at http://localhost:3000/api/graphql
npm run seed-data            # optional: load the sample products
```

The Keystone config is evaluated when the command starts, so **every** variable above must exist
or the process exits — the Cloudinary adapter throws outright without credentials, and the session
secret is validated too. On the very first run Keystone creates the initial admin from
`initFirstItem` (`name`, `email`, `password`); sign in at http://localhost:3000/admin.

| Backend script | What it does |
| --- | --- |
| `npm run dev` | Keystone dev server (`keystone-next`) |
| `npm run build` | `keystone-next build` — compiles the admin UI and schema |
| `npm start` | `build` then `keystone-next start` (production) |
| `npm run seed-data` | `keystone-next --seed-data`, runs `seed-data/` against the connected DB |

### 2. Frontend — the storefront

```bash
cd sick-fits/frontend
npm ci
npm run dev                  # next -p 7777 → http://localhost:7777
```

`/` permanently redirects to `/products`. In development the Apollo client points at
`http://localhost:3000/api/graphql` automatically, so the backend above has to be running.

| Frontend script | What it does |
| --- | --- |
| `npm run dev` | Next dev server on port **7777** |
| `npm run build` | `next build` |
| `npm start` | `next start -p 7777` (serve a build) |
| `npm test` | Jest in CI mode (`jest --ci`) |
| `npm run test:watch` | Jest in watch mode |

```bash
npm test                     # 100% of the suite must pass; snapshots are not rewritten in CI
```

### Which API does the frontend talk to?

`sick-fits/frontend/lib/withData.js` resolves it at runtime, in this order:

1. `NEXT_PUBLIC_BACKEND_URL`, if set — `/api/graphql` is appended unless it is already in the value.
2. `?useLocal=true` in the URL (handy for pointing the deployed site at a local API).
3. `http://localhost:3000/api/graphql` when the page is served from `localhost` / `127.0.0.1`.
4. Otherwise `https://api.owenstack.com/api/graphql`.

## Environment variables

**Backend** (`sick-fits/backend/.env`) — all read when the Keystone config loads:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | MongoDB connection string (defaults to `mongodb://localhost/keystone-sick-fits-tutorial`) |
| `COOKIE_SECRET` | Session signing secret |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_KEY` / `CLOUDINARY_SECRET` | Product image storage |
| `STRIPE_SECRET` | Checkout charges |
| `MAIL_HOST` / `MAIL_PORT` / `MAIL_USER` / `MAIL_PASS` | Password-reset email |
| `FRONTEND_URL` | Extra allowed CORS origin (the live Vercel URL is allowed in code) |

**Frontend** (optional):

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_BACKEND_URL` | Overrides the API base; resolved as described above. The committed `vercel.json` sets it to `https://api.owenstack.com` for builds |

Never commit real values. `sick-fits/backend/.gitignore` and `sick-fits/frontend/.gitignore` both
ignore `.env`.

## Deploy

- **Storefront → Vercel.** `sick-fits/frontend/vercel.json` sets the framework to `nextjs`, runs
  `npm run build`, and pins `NEXT_PUBLIC_BACKEND_URL=https://api.owenstack.com` for both the build
  and runtime env. The Vercel project's root directory must be `sick-fits/frontend`.
- **API → Render.** `sick-fits/render.yaml` describes one web service (`sick-fits-backend`):
  `cd backend && npm install && npm run build`, then `cd backend && npm start`, with
  `DATABASE_URL`, `COOKIE_SECRET`, `FRONTEND_URL`, `CLOUDINARY_*`, `STRIPE_SECRET` and `MAIL_*`
  supplied as project-scoped env vars.
- **Cross-domain cookies need the patch.** `keystone.ts` sets `sameSite: 'none'` and `secure: true`
  so the Vercel frontend can hold a session against the API host; the patched `statelessSessions`
  in `patches/` is what makes those top-level options take effect. Keep `patch-package` running on
  install, and serve the API over HTTPS.

The backend also answers CORS for `http://localhost:7777`, the Vercel preview URL and
`https://trendyfits.vercel.app`. Add your own origin to `keystone.ts` if you deploy the frontend
somewhere else.

## Continuous integration

`.github/workflows/ci.yml` runs on every push to `main`, every PR, and on demand:

| Job | Steps |
| --- | --- |
| Frontend | `npm ci` → `npx next lint` → `npm test` (Jest, CI mode) → `npm run build` |
| Backend | `npm ci` → `npm run build` (keystone-next) → `npx tsc --noEmit` |

Each job cds into its own package (`defaults.run.working-directory`), Node 16, npm cache keyed on
that package's lockfile, and a `concurrency` guard so an older run cannot race a newer one.

The backend's `tsc --noEmit` step is deliberately **non-blocking**: it reports pre-existing type
errors in `lib/mail.ts`, `lib/stripe.ts`, `mutations/checkout.ts`, `schemas/ProductImage.ts` and
`seed-data/index.ts`. It is kept visible so the debt stays on the table rather than painting the
repo red for work that has not been scheduled yet.

## Known gaps

- Those five files still carry type errors — the typecheck step is informational until they are fixed.
- No root `package.json`, so there is no repo-level `npm install` or task runner. It is two packages
  and a `cd` each, on purpose.
- `sick-fits/frontend/` has build logs and a `cookies.txt` committed; they are local artefacts and
  should be removed (and ignored) rather than kept.
- `package.json` still credits the upstream author and points at the original course repository in
  `sick-fits/backend/repository` — cosmetic, but worth aligning with the brand.
