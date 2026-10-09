# Backend tests

There is no test framework in this package — the scripts here are plain Node,
run directly, so they need no new dependency and no install step.

## `npm run test:admin-ui-import`

`admin-ui-api-import.test.js` — regression test for **BUG-1** (see
`../../docs/STATUS.md`).

Keystone generates `.keystone/admin/pages/api/__keystone_api_build.js`, which
re-exports the project's Keystone config as

```js
export { default as config } from '<path to backend/keystone>';
```

`@keystone-next/admin-ui` 8.0.2 builds that path with `Path.relative()`, which
returns **backslashes** on Windows, and interpolates it into the import without
normalising the separators. JavaScript reads `..\..\..\..\keystone` as a string
with escape sequences, so the module id compiled is `........keystone` and the
admin UI build fails with `Module not found: Can't resolve '........keystone'`.

The fix is `patches/@keystone-next+admin-ui+8.0.2.patch`, applied automatically
by `patch-package` from the package's `postinstall` script — so `npm ci` is all
anyone needs to do.

**Precondition.** The file under test is generated, not committed. Generate it
with `npm run dev` (it is written a couple of minutes in, *before* the slow
admin-UI compile — the server can be killed as soon as the file appears) or with
`npm run build`.

**Result on 2026-10-09 (Windows, Node 16.20.2):**

```
before the patch   FAIL: the generated import specifier is "........keystone", …
after  the patch   PASS: __keystone_api_build.js imports '../../../../keystone' -> …\backend\keystone.ts
```

The end-to-end gate is the same bug seen from further away: `npm run build`
fails with `Module not found: Can't resolve '........keystone'` before the patch
and completes after it. CI cannot catch this — the backend job runs on
`ubuntu-latest`, where `Path.relative()` already returns forward slashes.
