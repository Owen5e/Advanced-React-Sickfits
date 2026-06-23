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

  const [addToCart, { loading, error, data }] = useMutation(ADD_TO_CART_MUTATION, {
    variables: { id },
    refetchQueries: [
      {
        query: CURRENT_USER_QUERY,
        fetchPolicy: 'network-only'
      }
    ],
    awaitRefetchQueries: true
  });

  if (error) {
    console.error('Error adding to cart:', error);
  }

  const handleClick = async () => {
    console.log('Add to cart clicked for product:', id);
    console.log('Current user state:', user);
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

    console.log('User is logged in, calling addToCart mutation');
    try {
      const result = await addToCart();
      console.log('Add to cart result:', result);
    } catch (err) {
      console.error('Failed to add to cart:', err);
      // Check if error is about authentication
      if (
        err.message.includes('not authenticated') ||
        err.message.includes('not logged in') ||
        err.message.includes('You must be logged in')
      ) {
        console.log('Authentication error detected, redirecting to signin');
        router.push({
          pathname: '/signin',
          query: { from: router.asPath }
        });
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="flex w-full justify-center items-center bg-[#16140f] hover:bg-[#ff4a17] disabled:bg-neutral-400 text-white px-4 py-2 rounded-md text-center text-[12px] font-mono font-lg transition-colors disabled:cursor-not-allowed"
    >
      + ADD{loading && 'ING'} TO BAG
    </button>
  );
}
