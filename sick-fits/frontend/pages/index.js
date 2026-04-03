import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useState } from "react";
import styled from "styled-components";
import AISearch from "../components/AISearch";
import Pagination from "../components/Pagination";
import Product from "../components/Product";
import { ALL_PRODUCTS_QUERY } from "../components/Products";
import { perPage } from "../config";

const ProductListStyles = styled.div`
  // Copy from Products.js for consistency
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
`;

export default function Home() {
  const { query } = useRouter();
  const page = parseInt(query.page) || 1;

  // Store AI filters
  const [filters, setFilters] = useState({});

  // Build where dynamically
  const where = {};
  const andConditions = [];

  if (filters.keyword) {
    andConditions.push({
      OR: [
        { name_contains_i: filters.keyword },
        { description_contains_i: filters.keyword },
      ],
    });
  }

  if (filters.maxPrice) {
    andConditions.push({ price_lte: filters.maxPrice * 100 });
  }

  if (filters.minPrice) {
    andConditions.push({ price_gte: filters.minPrice * 100 });
  }

  if (andConditions.length > 0) {
    where.AND = andConditions;
  }

  // Fetch products using filters
  const { data, loading, error } = useQuery(ALL_PRODUCTS_QUERY, {
    variables: {
      where,
      skip: page * perPage - perPage,
      first: perPage,
    },
  });

  return (
    <div>
      {/* AI Search Component */}
      <AISearch onResults={setFilters} />

      {/* Debug (optional) */}
      {/* <pre>{JSON.stringify(filters, null, 2)}</pre> */}

      {/* Products */}
      {loading && <p>Loading...</p>}
      {error && <p>Error loading products</p>}

      <Pagination page={page} />

      <ProductListStyles>
        {data?.allProducts?.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </ProductListStyles>

      <Pagination page={page} />
    </div>
  );
}
