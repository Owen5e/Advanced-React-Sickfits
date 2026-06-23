import { useRouter } from 'next/dist/client/router';
import Pagination from '../../components/Pagination';
import Products from '../../components/Products';
import Categories from '../../components/Categories';

export default function ProductsPage() {
  const { query } = useRouter();
  const page = parseInt(query.page);
  console.log(typeof page);
  return (
    <div>
      <Categories />
      <Products page={page || 1} />
      <Pagination page={page || 1} />
    </div>
  );
}
