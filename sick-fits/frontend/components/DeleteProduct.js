import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

const DELETE_PRODUCT_MUTAATION = gql`
  mutation DELETE_PRODUCT_MUTATION($id: ID!) {
    deleteProduct(id: $id) {
      id
      name
    }
  }
`;

function update(cache, payload) {
  // this is a way to remove the item from the cache
  console.log(payload);
  console.log('running the update function after delete');
  cache.evict(cache.identify(payload.data.deleteProduct));
}

export default function DeleteProduct({ id, children }) {
  const [deleteProduct, { loading }] = useMutation(DELETE_PRODUCT_MUTAATION, {
    variables: { id },
    update,
  });
  return (
    <button
      type="button"
      disabled={loading}
      onClick={() => {
        if (confirm(`Confirm delete? ${id}`)) {
          console.log('DELETING ITEM', id);
          deleteProduct().catch((err) => alert(err.message));
        }
      }}
    >
      {children}
    </button>
  );
}
