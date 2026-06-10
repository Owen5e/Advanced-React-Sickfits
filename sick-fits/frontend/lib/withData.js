import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { HttpLink } from '@apollo/client/link/http';
import { getDataFromTree } from '@apollo/client/react/ssr';
import withApollo from 'next-with-apollo';
import paginationField from './paginationField';

const localEndpoint = 'http://localhost:3000/api/graphql';
const prodEndpoint = 'https://api.owenstack.com/api/graphql';

function getEndpoint() {
  if (typeof window !== 'undefined' && window.location.search.includes('useLocal=true')) {
    return localEndpoint;
  }
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
