import { gql, useQuery } from '@apollo/client';
import styled from 'styled-components';
import Category from './Category';

export const ALL_CATEGORIES_QUERY = gql`
  query ALL_CATEGORIES_QUERY {
    allCategories {
      id
      name
      description
      slug
      products {
        id
        name
      }
      image {
        image {
          publicUrlTransformed
        }
        altText
      }
    }
  }
`;

const CategoryListStyles = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 30px;
  margin: 2rem 0;
`;

export default function Categories() {
  const { data, error, loading } = useQuery(ALL_CATEGORIES_QUERY);

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Product Categories</h2>
      <CategoryListStyles>
        {data.allCategories.map(category => (
          <Category key={category.id} category={category} />
        ))}
      </CategoryListStyles>
    </div>
  );
}

Categories.propTypes = {
  // Add any prop types if needed
};
