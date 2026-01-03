import { useRouter } from 'next/router';
import Pagination from '../../components/Pagination';
import Products from '../../components/Products';

export default function ProductsPage() {
  const router = useRouter();
  const { page } = router.query;
  const pageNumber = parseInt(page) || 1;

  return (
    <div>
      <Pagination page={pageNumber} />
      <Products page={pageNumber} />
      <Pagination page={pageNumber} />
    </div>
  );
}
