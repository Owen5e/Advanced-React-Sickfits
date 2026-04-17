import { gql, useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { perPage } from '../config';
import Product from './Product';

export const ALL_PRODUCTS_QUERY = gql`
  query ALL_PRODUCTS_QUERY($where: ProductWhereInput, $skip: Int = 0, $first: Int) {
    allProducts(where: $where, skip: $skip, first: $first) {
      id
      name
      price
      description
      photo {
        image {
          publicUrlTransformed
        }
      }
      categories {
        id
        name
      }
    }
  }
`;

const ProductListStyles = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  grid-gap: 1.5rem;
  margin: 1.5rem 0;
`;

export default function Products({ page, where = {} }) {
  const { data, error, loading } = useQuery(ALL_PRODUCTS_QUERY, {
    variables: {
      where,
      skip: page * perPage - perPage,
      first: perPage
    }
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div>
      <ProductListStyles>
        {data.allProducts.map(product => (
          <Product key={product.id} product={product} />
        ))}
      </ProductListStyles>
    </div>
  );
}

Products.propTypes = {
  page: PropTypes.number,
  where: PropTypes.object
};
