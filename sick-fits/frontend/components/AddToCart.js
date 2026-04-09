import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import { CURRENT_USER_QUERY, useUser } from './User';

const ADD_TO_CART_MUTATION = gql`
  mutation ADD_TO_CART_MUTATION($id: ID!) {
    addToCart(productId: $id) {
      id
      quantity
      product {
        id
        name
        price
        description
        photo {
          image {
            publicUrlTransformed
          }
        }
      }
    }
  }
`;

export default function AddToCart({ id }) {
  const router = useRouter();
  const user = useUser();
  const [addToCart, { loading, error }] = useMutation(ADD_TO_CART_MUTATION, {
    variables: { id },
    refetchQueries: [{ query: CURRENT_USER_QUERY }]
  });

  if (error) {
    console.error('Error adding to cart:', error);
  }

  const handleClick = async () => {
    if (!id) {
      console.error('Cannot add to cart: product id is undefined');
      return;
    }

    // Check if user is logged in
    if (!user) {
      console.log('No user logged in, redirecting to signin');
      router.push({
        pathname: '/signin',
        query: { from: router.asPath }
      });
      return;
    }

    try {
      await addToCart();
      console.log('Product added to cart successfully');
    } catch (err) {
      console.error('Failed to add to cart:', err);
      // Check if error is about authentication
      if (err.message.includes('not authenticated') || err.message.includes('not logged in')) {
        router.push({
          pathname: '/signin',
          query: { from: router.asPath }
        });
      }
    }
  };

  return (
    <button type="button" onClick={handleClick} disabled={loading}>
      Add{loading && 'ing'} to Cart 🛒
    </button>
  );
}
