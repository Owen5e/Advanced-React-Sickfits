import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import Link from 'next/link';
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
    _allProductsMeta {
      count
    }
  }
`;

export default function Categories() {
  const { data, error, loading } = useQuery(ALL_CATEGORIES_QUERY);
  const router = useRouter();

  // Determine active state based on current route
  const isAllActive = router.pathname === '/' || router.pathname === '/products';
  const activeSlug = router.query?.slug || null;

  if (loading) return null;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-0 py-2 border-t border-b flex flex-wrap gap-2">
      <Link
        href="/products"
        className={`inline-flex items-center gap-1 px-2 py-2 rounded-3xl transition-colors text-sm ${
          isAllActive
            ? 'bg-[#16140f] text-white'
            : 'bg-[#f5f1ea] border border-[#dad4c6] hover:border-1 hover:border-[#16140f]'
        }`}
      >
        <span
          className={`uppercase font-medium ${isAllActive ? 'text-white' : 'text-neutral-800'}`}
        >
          All
        </span>
        <span className={isAllActive ? 'text-neutral-300' : 'text-neutral-400'}>
          ({data._allProductsMeta?.count || 0})
        </span>
      </Link>
      {data.allCategories.map(category => (
        <Category key={category.id} category={category} isActive={category.slug === activeSlug} />
      ))}
    </div>
  );
}
