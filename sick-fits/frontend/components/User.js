import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

export const CURRENT_USER_QUERY = gql`
  query {
    authenticatedItem {
      ... on User {
        id
        email
        name
        # query the cart items for the current user
        cart {
          id
          quantity
          product {
            id
            price
            name
            description
            photo {
              image {
                publicUrlTransformed
              }
            }
          }
        }
      }
    }
  }
`;

export function useUser() {
  const { data, error, loading } = useQuery(CURRENT_USER_QUERY);

  if (error) {
    console.error('Error fetching user:', error);
  }

  if (loading) {
    console.log('Loading user data...');
  }

  return data?.authenticatedItem;
}
