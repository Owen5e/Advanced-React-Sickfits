// This is client side config only - don't put anything in here that shouldn't be public!
// Always use the production backend URL since localhost backend might not be running
export const endpoint = process.env.NEXT_PUBLIC_BACKEND_URL
  ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/graphql`
  : 'https://advanced-react-sickfits-production.up.railway.app/api/graphql';
export const prodEndpoint = process.env.NEXT_PUBLIC_BACKEND_URL
  ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/graphql`
  : 'https://advanced-react-sickfits-production.up.railway.app/api/graphql';
export const perPage = 2;
