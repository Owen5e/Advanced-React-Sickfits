import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Product from '../../components/Product';
import { perPage } from '../../config';

const CATEGORY_PRODUCTS_QUERY = gql`
  query CATEGORY_PRODUCTS_QUERY($slug: String!, $skip: Int = 0, $first: Int = ${perPage}) {
    allCategories(where: { slug: $slug }) {
      id
      name
      description
      slug
      image {
        image {
          publicUrlTransformed
        }
        altText
      }
      products(first: $first, skip: $skip) {
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
  }
`;

const CategoryHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 2rem;
  text-align: center;
  margin-bottom: 3rem;
  border-radius: 0 0 20px 20px;
`;

const ProductListStyles = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: var(--maxWidth);
  margin: 0 auto;
  padding: 2rem;
`;

export default function CategoryPage() {
  const router = useRouter();
  const { slug } = router.query;
  const page = parseInt(router.query.page) || 1;

  const { data, error, loading } = useQuery(CATEGORY_PRODUCTS_QUERY, {
    variables: {
      slug,
      skip: page * perPage - perPage,
      first: perPage
    },
    skip: !slug
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const category = data?.allCategories[0];
  if (!category) {
    return <p>Category not found</p>;
  }

  return (
    <div>
      <CategoryHeader>
        {category.image?.image?.publicUrlTransformed && (
          <img
            src={category.image.image.publicUrlTransformed}
            alt={category.image.altText || category.name}
            className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
          />
        )}
        <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
        {category.description && (
          <p className="text-xl opacity-90 max-w-2xl mx-auto">{category.description}</p>
        )}
      </CategoryHeader>

      <div className="text-center mb-8">
        <p className="text-gray-600">
          Showing {category.products.length} products in this category
        </p>
      </div>

      <ProductListStyles>
        {category.products.map(product => (
          <Product key={product.id} product={product} />
        ))}
      </ProductListStyles>

      {/* TODO: Add pagination for category products */}
    </div>
  );
}
