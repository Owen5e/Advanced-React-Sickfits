import { useRouter } from 'next/dist/client/router';
import Pagination from '../components/Pagination';
import Products from '../components/Products';
import Categories from '../components/Categories';

export default function HomePage() {
  const { query } = useRouter();
  const page = parseInt(query.page);
  return (
    <div>
      <Categories />
      <Products page={page || 1} />
      <Pagination page={page || 1} />
    </div>
  );
}
