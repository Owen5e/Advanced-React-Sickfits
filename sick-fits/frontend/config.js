// This is client side config only - don't put anything in here that shouldn't be public!
export const localEndpoint = 'http://localhost:3000/api/graphql';
export const prodEndpoint = process.env.NEXT_PUBLIC_BACKEND_URL
  ? process.env.NEXT_PUBLIC_BACKEND_URL.includes('/api/graphql')
    ? process.env.NEXT_PUBLIC_BACKEND_URL
    : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/graphql`
  : 'https://api.owenstack.com/api/graphql';
export const perPage = 12;
