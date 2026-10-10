# Access-control audit — `sick-fits/backend`

**Date:** 2026-10-10
**Scope:** every Keystone list in `sick-fits/backend/schemas/` and every access function in
`sick-fits/backend/access.ts`
**Method:** read the source of all 8 lists plus the rule vocabulary, then encode what was read as
executable tests (`test/access-rules.test.js`) so the audit cannot silently drift from the code.

---

## 1. How Keystone access actually behaves

This matters before reading the tables, because two very different things are returned by the same
kind of function:

| Return value | Meaning |
|---|---|
| `true` | the operation is allowed, unrestricted |
| `false` | the operation is denied |
| **an object** | the operation is **filtered** — allowed, but only for rows matching the filter |

That third case is where most of the subtlety lives. `{ user: { id: session.itemId } }` does not
mean "yes"; it means "yes, but only your own rows".

## 2. The rule vocabulary (`access.ts`)

| Rule | Anonymous | Signed-in, no permission | With the relevant permission |
|---|---|---|---|
| `canManageProducts` | `false` | `{ user: { id } }` — own products only | `true` |
| `canOrder` | `false` | `{ user: { id } }` — own cart items | `true` |
| `canManageOrderItems` | `false` | `{ order: { user: { id } } }` — items of own orders | `true` |
| `canReadProducts` | `{ status: 'Available' }` | `{ status: 'Available' }` | `true` |
| `canManageUsers` | `false` | `{ id }` — self only | `true` |
| `canManageCategories` | `false` | `false` | `true` |

`permissions.*` (generated from `permissionFields`) are pure yes/no checks against
`session.data.role[...]`. `canReadProducts` is the only rule that hands anonymous users a filter
rather than a denial — and it is the correct shape, because it restricts them to `Available` rows.

## 3. Every list, as configured

| List | create | read | update | delete |
|---|---|---|---|---|
| `User` | `true` | `rules.canManageUsers` | `rules.canManageUsers` | `permissions.canManageUsers` |
| `Role` | `permissions.canManageRoles` | `permissions.canManageRoles` | `permissions.canManageRoles` | `permissions.canManageRoles` |
| `Product` | `isSignedIn` | `rules.canReadProducts` | `rules.canManageProducts` | `rules.canManageProducts` |
| `ProductImage` | `isSignedIn` | **`true`** | `permissions.canManageProducts` | `permissions.canManageProducts` |
| `Category` | `isSignedIn` | `true` | `rules.canManageProducts` | `rules.canManageProducts` |
| `CartItem` | `isSignedIn` | `rules.canOrder` | `rules.canOrder` | `rules.canOrder` |
| `Order` | `isSignedIn` | `rules.canOrder` | `() => false` | `() => false` |
| `OrderItem` | `isSignedIn` | `rules.canManageOrderItems` | `() => false` | `() => false` |

Field-level access: `User.role` — `create` and `update` both require
`permissions.canManageUsers`, which is what stops a normal user from promoting themselves.

## 4. Findings

### F1 — `ProductImage.read: true` exposes images of unpublished products (information disclosure)

`schemas/ProductImage.ts:17` returns `true`, while the product it hangs off is filtered to
`status: 'Available'` (`schemas/Product.ts:8` → `rules.canReadProducts`).

A `Draft` or `Unavailable` product's row is hidden, but its `ProductImage` rows — image + `altText`
— are readable by anyone, including anonymous users. An unauthenticated caller can enumerate
`allProductImages` and see assets for products that were deliberately not published.

**Recommendation:** replace `true` with a filter that follows the product's status, or deny
anonymous reads outright.

### F2 — owners cannot manage their own `ProductImage` (inconsistent rule shape)

`ProductImage.update` / `.delete` use `permissions.canManageProducts` (permission *only*), whereas
`Product` uses `rules.canManageProducts` (permission **or** ownership) — `ProductImage.ts:18-19` vs
`Product.ts:9-10`.

Consequence: a signed-in user who created a product can edit the product but **not** the image
attached to it. The same permission-or-ownership semantics should apply to both, or the asymmetry
should be deliberate and written down.

### F3 — `Category` update/delete use a rule that filters on a field `Category` does not have

`schemas/Category.ts:10-11` uses `rules.canManageProducts`, whose owner branch returns
`{ user: { id: session.itemId } }`. `Category` has no `user` field (it has `name`, `slug`,
`products`), so for a signed-in user without the permission the returned filter references a column
that does not exist.

Practical effect: the intended "use the same rules as product management" (per the inline comment)
does not hold. Either the filter is rejected or it matches nothing — in both cases the real
behaviour is *only admins can manage categories*, which is not what the code says it does.

**Recommendation:** give `Category` its own rule returning `false` for non-admins (which is the
effective behaviour today), or add an owner field if ownership is genuinely wanted.

### F4 — three permissions are declared but never enforced

`isAwesome` is defined in `permissions` (`access.ts:29`) and referenced nowhere else in the backend.
`canSeeOtherUsers` and `canManageOrders` exist in `permissionFields`
(`schemas/fields.ts:8`, `:24`) and are likewise referenced by no access rule — `canManageUsers`
covers reading other users, and orders are read via `rules.canOrder`.

Because the Role admin UI renders every checkbox in `permissionFields`, an operator can grant these
permissions and see no behaviour change at all. That is a misleading security surface: the UI
promises capability the code never grants.

**Recommendation:** delete `isAwesome`; either implement `canSeeOtherUsers` /
`canManageOrders` or remove them from `permissionFields` so the Role screen only lists permissions
that do something.

### F5 — `Order` and `OrderItem` cannot be updated or deleted by anyone

`Order.ts:16-17` and `OrderItems.ts:9-10` return `() => false` for both `update` and `delete`.
This is a defensible immutability stance for order history, but it is absolute: a genuine data
correction (a mis-charged order, a duplicated line item) is impossible through the API for every
role, including administrators, and would require direct database access.

**Recommendation:** decide explicitly. If immutable-by-design, say so in this doc and keep the test
that asserts it. If admins need corrections, gate `update` on a new `canManageOrders` permission —
which already exists (see F4) and currently does nothing.

### F6 — a session without `data` throws instead of denying

`access.ts:21` is `return !!session?.data.role?.[permission];`. The optional chain protects
`session` but not `session.data`: a session object that exists without a `data` property raises
`TypeError: Cannot read properties of undefined (reading 'role')` rather than returning `false`.

Failing loudly is not a security hole here (an exception denies the request — it does not allow
it), but an access predicate is the wrong place to throw. `isAwesome` uses
`session?.data?.name` and is safe; the generated permissions should match it.

**Recommendation:** `session?.data?.role?.[permission]`. Until then, this audit records the current
behaviour as a known hazard, and the test pins it so the fix is visible in the diff.

### Observations (not findings)

- `CartItem.product` uses `ref: 'Product'` and `OrderItem.photo` uses `ref: 'ProductImage'` —
  bare list names with no back-reference field. These are one-way relationships; legitimate, but
  they mean there is no `Product.cartItems` or `ProductImage.orderItems` to query from the other
  side. Worth confirming that is intended.
- `User.create: true` allows anonymous user creation, which Keystone's own signup flow requires.
  It is safe **only** because `User.role` is separately gated on `permissions.canManageUsers`;
  a self-registered user cannot assign themselves a role. That dependency is now covered by a test
  so it cannot be broken without failing the suite.

## 5. What the tests prove

`test/access-rules.test.js` loads the real `access.ts` (transpiled with the project's own
`typescript`) and asserts, for every rule and every caller class:

- anonymous callers are denied all six management rules;
- anonymous callers get a **filter**, never `true`, from `canReadProducts`;
- a signed-in user with no permissions is scoped to their own rows, and cannot reach a role or
  another user's products, cart, orders or order items;
- a permission holder gets unrestricted access;
- every permission declared in `permissionFields` has a working checker;
- the F1, F2, F4 and F6 behaviours above are pinned as regression tripwires, each commented with
  the finding it protects.

Run it with `npm run test:access` from `sick-fits/backend`.

## 6. Open decisions for the owner

1. F1 — should anonymous users see any product images at all?
2. F2 — should image management mirror product ownership, or stay permission-only?
3. F3 — should `Category` have an owner at all?
4. F4 — implement or delete `canSeeOtherUsers` / `canManageOrders` / `isAwesome`?
5. F5 — should administrators be able to correct an order?
