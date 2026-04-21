import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`;

function update(cache, payload) {
  cache.evict(cache.identify(payload.data.removeFromCart));
}

export default function RemoveFromCart({ id }) {
  const [removeFromCart, { loading }] = useMutation(REMOVE_FROM_CART_MUTATION, {
    variables: { id },
    update
  });
  return (
    <button
      onClick={removeFromCart}
      disabled={loading}
      type="button"
      title="Remove item from cart"
      className="w-10 h-10 flex items-center justify-center text-2xl md:text-3xl text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      &times;
    </button>
  );
}
