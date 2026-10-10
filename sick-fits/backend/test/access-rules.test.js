#!/usr/bin/env node
'use strict';

/**
 * Access-control tests for the sick-fits backend — the executable half of
 * docs/ACCESS-AUDIT.md.
 *
 * WHAT IT CHECKS
 * Every rule in `sick-fits/backend/access.ts` and every list's access config is
 * exercised against the four caller classes that matter:
 *
 *   1. anonymous            (no session)
 *   2. signed in, no rights (a normal customer)
 *   3. signed in, owning    (a normal customer acting on their own rows)
 *   4. permission holder    (admin)
 *
 * The assertions encode the audit's promise: an anonymous or non-owning caller
 * must never receive `true` from a management rule, and may only ever receive a
 * FILTER that scopes them to their own rows. The single exception is
 * `canReadProducts`, which deliberately hands anonymous callers the filter
 * `{ status: 'Available' }` — and the test proves it is a filter, not `true`,
 * because `true` there would publish Draft and Unavailable products.
 *
 * HOW IT LOADS TYPESCRIPT
 * `access.ts` and `schemas/fields.ts` are compiled in-process with the project's
 * own `typescript` devDependency (`ts.transpileModule`) and evaluated with a
 * small `require` shim. That means the tests run against the REAL rule source,
 * not a copy of it — if someone edits the rules, these assertions change
 * behaviour immediately. Only the two leaf imports are shimmed:
 *
 *   '@keystone-next/fields'  -> { checkbox: () => ({}) }   (field factory)
 *   './types'                -> {}                          (types only)
 *
 * DELIBERATE TRIPWIRES
 * Section 4 of the audit lists findings F1, F2, F3, F4 and F6. Those are NOT yet
 * fixed. The tests pin their CURRENT behaviour with a comment naming the finding,
 * so the day someone fixes one, this file fails loudly and forces the audit doc to
 * be updated in the same commit. If you are fixing F1/F2/F3/F4/F6: change the
 * assertion here AND the corresponding section of docs/ACCESS-AUDIT.md together.
 *
 * RUN
 *   npm run test:access
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const BACKEND = path.resolve(__dirname, '..');
const ACCESS_TS = path.join(BACKEND, 'access.ts');
const FIELDS_TS = path.join(BACKEND, 'schemas', 'fields.ts');
const SCHEMAS = path.join(BACKEND, 'schemas');

let failures = 0;
let checks = 0;

function check(label, fn) {
  checks++;
  try {
    fn();
    console.log(`  ok  ${label}`);
  } catch (err) {
    failures++;
    console.error(`  FAIL ${label}`);
    console.error(`       ${err.message}`);
  }
}

function loadTs(file, shim) {
  const ts = require('typescript');
  const source = fs.readFileSync(file, 'utf8');
  const js = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2019,
      esModuleInterop: true,
    },
    fileName: file,
  }).outputText;
  const mod = { exports: {} };
  const req = (id) => {
    if (Object.prototype.hasOwnProperty.call(shim, id)) return shim[id];
    throw new Error(`unexpected require(${id}) while loading ${path.basename(file)}`);
  };
  // eslint-disable-next-line no-new-func
  new Function('require', 'module', 'exports', js)(req, mod, mod.exports);
  return mod.exports;
}

// ---------------------------------------------------------------- load source
const fields = loadTs(FIELDS_TS, { '@keystone-next/fields': { checkbox: () => ({}) } });
const permissionsList = fields.permissionsList;
assert(Array.isArray(permissionsList) && permissionsList.length > 0,
  'schemas/fields.ts did not export a non-empty permissionsList');

const access = loadTs(ACCESS_TS, {
  './schemas/fields': fields,
  './types': {},
});
const { rules, permissions } = access;
assert(rules && permissions, 'access.ts did not export both rules and permissions');

// ---------------------------------------------------------------- caller fixtures
const OWNER = 'user-1';
const OTHER = 'user-2';

function sessionFor(id, granted = {}, name = 'Ada') {
  const role = {};
  permissionsList.forEach((p) => { role[p] = Boolean(granted[p]); });
  return { session: { itemId: id, data: { name, role } } };
}

const ANON = { session: null };
const NO_RIGHTS = sessionFor(OWNER);
const CART_RIGHTS = sessionFor(OWNER, { canManageCart: true });
const PRODUCT_RIGHTS = sessionFor(OWNER, { canManageProducts: true });
const USER_RIGHTS = sessionFor(OWNER, { canManageUsers: true });
const CATEGORY_RIGHTS = sessionFor(OWNER, { canManageCategories: true });
const AWESOME = sessionFor(OWNER, {}, 'Owen Olabode');

console.log('\nAnonymous callers are denied every management rule');
['canManageProducts', 'canOrder', 'canManageOrderItems', 'canManageUsers', 'canManageCategories']
  .forEach((rule) => {
    check(`rules.${rule}(anonymous) === false`, () => {
      assert.strictEqual(rules[rule](ANON), false);
    });
  });

check('rules.canReadProducts(anonymous) is a FILTER, never true', () => {
  const result = rules.canReadProducts(ANON);
  assert.notStrictEqual(result, true,
    'canReadProducts returned true for an anonymous caller — that publishes Draft and Unavailable products');
  assert.deepStrictEqual(result, { status: 'Available' });
});

console.log('\nA permission holder is unrestricted');
check('rules.canManageProducts(with permission) === true', () => {
  assert.strictEqual(rules.canManageProducts(PRODUCT_RIGHTS), true);
});
check('rules.canOrder(with canManageCart) === true', () => {
  assert.strictEqual(rules.canOrder(CART_RIGHTS), true);
});
check('rules.canManageOrderItems(with canManageCart) === true', () => {
  assert.strictEqual(rules.canManageOrderItems(CART_RIGHTS), true);
});
check('rules.canManageUsers(with permission) === true', () => {
  assert.strictEqual(rules.canManageUsers(USER_RIGHTS), true);
});
check('rules.canManageCategories(with permission) === true', () => {
  assert.strictEqual(rules.canManageCategories(CATEGORY_RIGHTS), true);
});
check('rules.canReadProducts(with canManageProducts) === true', () => {
  assert.strictEqual(rules.canReadProducts(PRODUCT_RIGHTS), true);
});

console.log('\nA signed-in user with no rights is scoped to their own rows');
check('canManageProducts -> own products only', () => {
  assert.deepStrictEqual(rules.canManageProducts(NO_RIGHTS), { user: { id: OWNER } });
});
check('canOrder -> own cart items only', () => {
  assert.deepStrictEqual(rules.canOrder(NO_RIGHTS), { user: { id: OWNER } });
});
check('canManageOrderItems -> items of own orders only', () => {
  assert.deepStrictEqual(rules.canManageOrderItems(NO_RIGHTS), { order: { user: { id: OWNER } } });
});
check('canManageUsers -> self only', () => {
  assert.deepStrictEqual(rules.canManageUsers(NO_RIGHTS), { id: OWNER });
});
check('a non-owner cannot reach another user\'s rows', () => {
  const other = sessionFor(OTHER);
  assert.deepStrictEqual(rules.canManageProducts(other), { user: { id: OTHER } });
  assert.notDeepStrictEqual(rules.canManageProducts(other), { user: { id: OWNER } });
});

console.log('\nPermission checks read the role from the session');
check('permissions.* deny an anonymous caller', () => {
  permissionsList.forEach((p) => assert.strictEqual(permissions[p](ANON), false, `${p} allowed anon`));
});
check('permissions.* return true when the role grants them', () => {
  permissionsList.forEach((p) => {
    const granted = sessionFor(OWNER, { [p]: true });
    assert.strictEqual(permissions[p](granted), true, `${p} ignored its own grant`);
  });
});
check('every permission declared in fields.ts has a callable checker', () => {
  permissionsList.forEach((p) => {
    assert.strictEqual(typeof permissions[p], 'function', `${p} has no checker in access.ts`);
  });
});
check('isAwesome is name-based (documented, currently unenforced)', () => {
  assert.strictEqual(permissions.isAwesome(AWESOME), true);
  assert.strictEqual(permissions.isAwesome(sessionFor(OWNER, {}, 'Ada')), false);
});

console.log('\nTRIPWIRES on the findings in docs/ACCESS-AUDIT.md');
console.log('(these pin CURRENT behaviour — update the test AND the doc together when fixing)');

check('F6: a session without `data` throws instead of denying (OPEN)', () => {
  const partial = { session: { itemId: OWNER } };
  assert.throws(
    () => permissions.canManageProducts(partial),
    TypeError,
    'F6 appears fixed: the generated permissions now survive a session without `data`. ' +
      'Update this assertion and section 4/F6 of docs/ACCESS-AUDIT.md.'
  );
});

check('F1/F2: ProductImage is still read:true and permission-only for writes (OPEN)', () => {
  const src = fs.readFileSync(path.join(SCHEMAS, 'ProductImage.ts'), 'utf8');
  assert.match(src, /read:\s*true/,
    'F1 appears fixed: ProductImage is no longer world-readable. Update the doc.');
  assert.match(src, /permissions\.canManageProducts/,
    'F2 appears fixed: ProductImage writes no longer use the permission-only rule. Update the doc.');
  const product = fs.readFileSync(path.join(SCHEMAS, 'Product.ts'), 'utf8');
  assert.match(product, /rules\.canManageProducts/,
    'Product no longer uses the ownership-aware rule — F2 comparison is stale.');
});

check('F3: Category still borrows the product rule it cannot satisfy (OPEN)', () => {
  const src = fs.readFileSync(path.join(SCHEMAS, 'Category.ts'), 'utf8');
  assert.match(src, /rules\.canManageProducts/,
    'F3 appears fixed: Category no longer uses the product rule. Update the doc.');
});

check('F4: isAwesome / canSeeOtherUsers / canManageOrders remain unenforced (OPEN)', () => {
  const read = (f) => fs.readFileSync(path.join(SCHEMAS, f), 'utf8');
  const schemaFiles = fs.readdirSync(SCHEMAS).filter((f) => f.endsWith('.ts') && f !== 'fields.ts');
  const schemaText = schemaFiles.map(read).join('\n');
  const accessText = fs.readFileSync(ACCESS_TS, 'utf8');

  ['canSeeOtherUsers', 'canManageOrders'].forEach((p) => {
    assert.ok(!schemaText.includes(p),
      `F4 appears fixed: ${p} is now used by a schema. Update the doc.`);
  });
  assert.strictEqual(
    (accessText.match(/isAwesome/g) || []).length, 2,
    'F4 appears fixed: isAwesome is referenced somewhere beyond its declaration and type. Update the doc.');
});

console.log('\nAll access rules in every list are accounted for');
check('each list declares an access block with all four operations', () => {
  const lists = fs.readdirSync(SCHEMAS)
    .filter((f) => f.endsWith('.ts') && f !== 'fields.ts');
  assert.ok(lists.length >= 8, `expected the 8 audited lists, found ${lists.length}`);
  lists.forEach((file) => {
    const src = fs.readFileSync(path.join(SCHEMAS, file), 'utf8');
    assert.match(src, /access:\s*\{/, `${file} has no access block`);
    ['create', 'read', 'update', 'delete'].forEach((op) => {
      assert.match(src, new RegExp(`${op}\\s*:`), `${file} does not declare an access.${op} rule`);
    });
  });
});

console.log(`\n${checks - failures}/${checks} checks passed`);
if (failures > 0) {
  console.error(`FAIL: ${failures} access-control check(s) failed`);
  process.exit(1);
}
console.log('PASS: access rules deny anonymous and non-owning callers as documented in docs/ACCESS-AUDIT.md');
