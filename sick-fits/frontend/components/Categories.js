import { gql, useQuery } from '@apollo/client';
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

export default function Categories() {
  const { data, error, loading } = useQuery(ALL_CATEGORIES_QUERY);

  if (loading) return null;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className=" max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-0 py-4 flex flex-wrap gap-3">
      {data.allCategories.map(category => (
        <Category key={category.id} category={category} />
      ))}
    </div>
  );
}
