import Head from 'next/head';
import Link from 'next/link';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import PaginationStyles from './styles/PaginationStyles';
import DisplayError from './ErrorMessage';
import { perPage } from '../config';

export const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    _allProductsMeta {
      count
    }
  }
`;

export default function Pagination({ page }) {
  const { error, loading, data } = useQuery(PAGINATION_QUERY);
  if (loading) return <p>Loading...</p>;
  if (error) return <DisplayError error={error} />;
  const { count } = data._allProductsMeta;
  //  code to get page count
  const pageCount = Math.ceil(count / perPage);

  return (
    <PaginationStyles data-testid="pagination">
      <Head>
        <title>
          Sick fits - page {page} of {pageCount}
        </title>
      </Head>
      <Link href={`/products/${page - 1}`}>
        <a aria-disabled={page <= 1}> -- Prev</a>
      </Link>
      <p>
        page {page} of <span data-testid="pageCount">{pageCount}</span>
      </p>
      <p> {count} Items Total</p>
      <Link href={`/products/${page + 1}`}>
        <a aria-disabled={page >= pageCount}>Next -- </a>
      </Link>
    </PaginationStyles>
  );
}
