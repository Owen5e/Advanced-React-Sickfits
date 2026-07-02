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
  padding: 1rem 2rem;
  text-align: center;
  margin-bottom: 3rem;
  border-radius: 0 0 20px 20px;

  h1 {
    font-size: 2rem;
    margin: 0;
  }

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
    margin-bottom: 2rem;

    h1 {
      font-size: 1.5rem;
    }

    img {
      width: 80px !important;
      height: 80px !important;
    }
  }

  @media (max-width: 480px) {
    padding: 1rem;
    margin-bottom: 1.5rem;

    h1 {
      font-size: 1.25rem;
    }

    img {
      width: 64px !important;
      height: 64px !important;
    }
  }
`;

const ProductListStyles = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 1.5rem 0;
  border-radius: 0px;

  & > * {
    height: 350px;
    overflow: hidden;
  }

  & > * img {
    width: 100%;
    padding: 0;
    object-fit: fill;
    height: 250px;
  }

  @media (min-width: 641px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    grid-gap: 0rem;

    & > * {
      height: 500px;
      overflow: hidden;
    }

    & > *:nth-child(4n + 1) img {
      height: 250px;
    }

    & > *:nth-child(4n + 2) img {
      height: 300px;
    }

    & > *:nth-child(4n + 3) img {
      height: 350px;
    }

    & > *:nth-child(4n + 4) img {
      height: 350px;
    }
  }
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
            className="w-32 h-32 object-cover rounded-full mx-auto mb-4 "
          />
        )}
        <h1 className="text-4xl font-bold uppercase ">{category.name}</h1>
      </CategoryHeader>

      <div className="text-center mb-8 px-4">
        <p className="text-gray-600 text-sm md:text-base">
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
