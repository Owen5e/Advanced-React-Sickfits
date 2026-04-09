import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { HttpLink } from '@apollo/client/link/http';
import { getDataFromTree } from '@apollo/client/react/ssr';
import withApollo from 'next-with-apollo';
import paginationField from './paginationField';
import { endpoint } from '../config';

function createClient({ headers, initialState }) {
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
        fetchOptions: {
          credentials: typeof window !== 'undefined' ? 'include' : 'omit'
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
