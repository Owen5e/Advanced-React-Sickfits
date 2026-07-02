import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { HttpLink } from '@apollo/client/link/http';
import { getDataFromTree } from '@apollo/client/react/ssr';
import withApollo from 'next-with-apollo';
import paginationField from './paginationField';

const localEndpoint = 'http://localhost:3000/api/graphql';
const prodEndpoint = 'https://api.owenstack.com/api/graphql';

function getEndpoint() {
  // 1. First check for explicit URL override via env variable
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    return backendUrl.includes('/api/graphql') ? backendUrl : `${backendUrl}/api/graphql`;
  }

  // 2. Allow explicit override via query parameter (useful for testing)
  if (typeof window !== 'undefined' && window.location.search.includes('useLocal=true')) {
    return localEndpoint;
  }

  // 3. In development mode (localhost), default to local
  if (
    typeof window === 'undefined' ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  ) {
    return localEndpoint;
  }

  // 4. Fallback to production endpoint
  return prodEndpoint;
}

function createClient({ headers, initialState }) {
  const endpoint = getEndpoint();
  console.log(`[Apollo Client] Connecting to: ${endpoint}`);

  return new ApolloClient({
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors)
          graphQLErrors.forEach(({ message, locations, path }) =>
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
          );
        if (networkError)
          console.log(`[Network error]: ${networkError}. Backend is unreachable. Is it running?`);
      }),
      // this uses apollo-link-http under the hood, so all the options here come from that package
      new HttpLink({
        uri: endpoint,
        credentials: 'include', // Always include credentials for session persistence
        fetchOptions: {
          credentials: 'include' // Ensure credentials are sent with all requests
        },
        // pass the headers along from this request. This enables SSR with logged in state
        headers
      })
    ]),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            // TODO: We will add this together!
            allProducts: paginationField()
          }
        }
      }
    }).restore(initialState || {})
  });
}

export default withApollo(createClient, { getDataFromTree });
