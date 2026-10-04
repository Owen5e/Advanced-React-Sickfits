## What
<!-- One or two lines: what does this change? -->

## Why
<!-- The problem it solves, or the issue it closes ("Closes #123"). -->

## Which package
- [ ] `sick-fits/frontend`
- [ ] `sick-fits/backend`
- [ ] repo-level (`.github`, docs, deploy)

## How I checked it
Frontend — `cd sick-fits/frontend`
- [ ] `npm test`
- [ ] `npx next lint`
- [ ] `npm run build`

Backend — `cd sick-fits/backend`
- [ ] `npm ci` (postinstall applies `patches/` — don't skip it)
- [ ] `npm run build`
- [ ] `npx tsc --noEmit` (the known pre-existing errors are fine, see CONTRIBUTING)

- [ ] CI is green on this branch (both jobs)

## Screenshots
<!-- UI change? before/after. Otherwise delete this section. -->

## Notes for the reviewer
<!-- Risky bits, deliberate omissions, follow-ups. -->
