import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styled from 'styled-components';
import AISearch from '../components/AISearch';
import Pagination from '../components/Pagination';
import Product from '../components/Product';
import { ALL_PRODUCTS_QUERY } from '../components/Products';
import { perPage } from '../config';

const ProductListStyles = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 2rem;
  margin: 2rem 0;
`;

export default function Home() {
  const { query } = useRouter();
  const page = parseInt(query.page) || 1;

  // Store AI search results (products array) or use normal pagination
  const [aiResults, setAiResults] = useState([]);

  // Fetch products using pagination (unless AI search is active)
  const where = aiResults.length === 0 ? {} : null;

  const { data, loading, error } = useQuery(ALL_PRODUCTS_QUERY, {
    skip: aiResults.length > 0, // Skip query if AI search is active
    variables: {
      where: where || {},
      skip: page * perPage - perPage,
      first: perPage
    }
  });

  // Use AI results if available, otherwise use paginated results
  const products = aiResults.length > 0 ? aiResults : data?.allProducts || [];

  return (
    <div>
      {/* AI Search Component */}
      <AISearch onResults={setAiResults} />

      {/* Debug (optional) */}
      {/* <pre>{JSON.stringify(aiResults, null, 2)}</pre> */}

      {/* Products */}
      {loading && <p>Loading...</p>}
      {error && <p>Error loading products</p>}

      {aiResults.length === 0 && <Pagination page={page} />}

      <ProductListStyles>
        {products.map(product => (
          <Product key={product.id} product={product} />
        ))}
      </ProductListStyles>

      {aiResults.length === 0 && <Pagination page={page} />}
    </div>
  );
}
