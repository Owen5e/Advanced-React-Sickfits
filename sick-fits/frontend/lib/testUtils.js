import casual from 'casual';
import { PAGINATION_QUERY } from '../components/Pagination';

// seed it so we get consistent results
casual.seed(777);

const fakeItem = () => ({
  // __typename: 'Item',
  id: 'abc123',
  price: 5000,
  user: null,
  photo: {
    id: 'abc123',
    altText: 'dogs are best',
    image: {
      publicUrlTransformed: 'dog.jpg'
    }
  },
  name: 'dogs are best',
  description: 'dogs'
});

const fakeUser = overrides => ({
  __typename: 'User',
  id: '4234',
  name: casual.name,
  email: casual.email,
  permissions: ['ADMIN'],
  orders: [],
  cart: [],
  ...overrides
});

const fakeOrderItem = () => ({
  __typename: 'OrderItem',
  id: casual.uuid,
  image: {
    image: `${casual.word}.jpg`
  },
  name: casual.words(),
  price: 4234,
  quantity: 1,
  description: casual.words()
});

const fakeOrder = () => ({
  __typename: 'Order',
  id: 'ord123',
  charge: 'ch_123',
  total: 40000,
  items: [fakeOrderItem(), fakeOrderItem()],
  createdAt: '2022-12-11T20:16:13.797Z',
  user: fakeUser()
});

const fakeCartItem = overrides => ({
  __typename: 'CartItem',
  id: 'omg123',
  quantity: 3,
  product: fakeItem(),
  user: fakeUser(),
  ...overrides
});

// Fake LocalStorage
class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = value.toString();
  }

  removeItem(key) {
    delete this.store[key];
  }
}

function makePaginationMocksFor(length) {
  return [
    {
      request: { query: PAGINATION_QUERY },
      result: {
        data: {
          _allProductsMeta: {
            count: length
          },
          itemsConnection: {
            __typename: 'aggregate',
            aggregate: {
              count: length,
              __typename: 'count'
            }
          }
        }
      }
    }
  ];
}

// styled-components generates class names from build-time inputs that differ
// per platform: the SWC transform hashes the file path using the OS path
// separator, so the same component is `sc-8353ba04-1` on Windows and
// `sc-734fea1b-1` on Linux. Snapshots of the raw DOM therefore can never match
// across machines — they passed locally and failed on the CI runner.
//
// This returns the container's markup with the generated tokens removed, so
// what is snapshotted is the structure, the text and the classes that are
// actually written in the source (Tailwind, react-transition-group state
// classes, ...). No assertion depends on the stripped names.
const generatedClassNames = () => {
  const generated = new Set();
  document.querySelectorAll('style').forEach(style => {
    // styled-components inserts rules through the CSSOM (`insertRule`) when it
    // is in speedy mode, which leaves textContent empty under jsdom, so read
    // the rules too.
    let css = style.textContent || '';
    try {
      css += Array.from(style.sheet ? style.sheet.cssRules : [])
        .map(rule => rule.cssText)
        .join('\n');
    } catch (error) {
      // a cross-origin rule would throw; the text we already have is enough
    }
    css.replace(/\.([A-Za-z_][\w-]*)/g, (match, name) => {
      generated.add(name);
      return match;
    });
  });
  return generated;
};

// A styled component's element carries two generated classes: the rule class
// (which appears in the stylesheet, so the set above catches it) and the
// component id, which appears nowhere in the CSS — with a display name it is
// `Dot-sc-8353ba04-0`, without one `sc-734fea1b-1`.
const SC_COMPONENT_ID = /(?:^|-)sc-[0-9a-z]+(?:-\d+)?$/i;

const snapshotHTML = container => {
  const generated = generatedClassNames();
  const html = container.innerHTML || container.outerHTML || '';
  return html.replace(/ class="([^"]*)"/g, (match, value) => {
    const kept = value
      .split(/\s+/)
      .filter(
        token =>
          token && !generated.has(token) && !SC_COMPONENT_ID.test(token)
      );
    // drop the attribute entirely when nothing is left
    return kept.length ? ` class="${kept.join(' ')}"` : '';
  });
};

export {
  makePaginationMocksFor,
  LocalStorageMock,
  snapshotHTML,
  fakeItem,
  fakeUser,
  fakeCartItem,
  fakeOrder,
  fakeOrderItem
};
