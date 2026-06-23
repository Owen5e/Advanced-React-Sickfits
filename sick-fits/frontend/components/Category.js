import Link from 'next/link';
import PropTypes from 'prop-types';

export default function Category({ category }) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="inline-flex items-center gap-2 px-4 py-2 bg-[#f5f1ea] border border-[#dad4c6] rounded-full hover:border-1 hover:border-[#16140f] transition-colors text-sm"
    >
      <span className="uppercase font-medium text-neutral-800">{category.name}</span>
      <span className="text-neutral-400">({category.products?.length || 0})</span>
    </Link>
  );
}

Category.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    products: PropTypes.array
  }).isRequired
};
