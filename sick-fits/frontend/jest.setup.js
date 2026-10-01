// jest.setup.js
require('@testing-library/jest-dom');

window.alert = console.log;

// ---------------------------------------------------------------------------
// next/router mock
//
// The pages-router components call useRouter() / the Router singleton. Under
// Jest there is no Next runtime, so useRouter() throws
// "NextRouter was not mounted" and the render dies before any assertion runs.
// A minimal in-memory router is enough for component tests: they only read
// pathname/query and occasionally call push().
// ---------------------------------------------------------------------------
jest.mock('next/router', () => {
  const mockRouter = {
    route: '/',
    pathname: '/',
    asPath: '/',
    basePath: '',
    query: {},
    isReady: true,
    isFallback: false,
    isPreview: false,
    isLocaleDomain: false,
    push: jest.fn(() => Promise.resolve(true)),
    replace: jest.fn(() => Promise.resolve(true)),
    prefetch: jest.fn(() => Promise.resolve()),
    back: jest.fn(),
    forward: jest.fn(),
    reload: jest.fn(),
    beforePopState: jest.fn(),
    events: { on: jest.fn(), off: jest.fn(), emit: jest.fn() }
  };

  const Router = {
    ...mockRouter,
    push: jest.fn(() => Promise.resolve(true)),
    replace: jest.fn(() => Promise.resolve(true)),
    prefetch: jest.fn(() => Promise.resolve()),
    router: mockRouter,
    events: { on: jest.fn(), off: jest.fn(), emit: jest.fn() }
  };

  return {
    __esModule: true,
    default: Router,
    useRouter: () => mockRouter,
    withRouter: (Component) => Component,
    Router
  };
});

// Search.js and Checkout.js import the internal module path directly.
jest.mock('next/dist/client/router', () => require('next/router'));
