import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { HttpLink } from '@apollo/client/link/http';
import { getDataFromTree } from '@apollo/client/react/ssr';
import withApollo from 'next-with-apollo';
import paginationField from './paginationField';

const localEndpoint = 'http://localhost:3000/api/graphql';
const prodEndpoint = 'https://advanced-react-sickfits-production.up.railway.app/api/graphql';

function getEndpoint() {
  // Check environment variable first
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    // If the env var already includes the full path, use it as-is
    if (process.env.NEXT_PUBLIC_BACKEND_URL.includes('/api/graphql')) {
      return process.env.NEXT_PUBLIC_BACKEND_URL;
    }
    // Otherwise append the GraphQL path
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/graphql`;
  }

  // On client-side, check for query parameter
  if (typeof window !== 'undefined' && window.location.search.includes('useLocal=true')) {
    return localEndpoint;
  }

  // Default to production
  return prodEndpoint;
}

function createClient({ headers, initialState }) {
  const endpoint = getEndpoint();

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
