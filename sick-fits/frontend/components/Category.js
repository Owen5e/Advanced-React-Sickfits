import Link from 'next/link';
import PropTypes from 'prop-types';

export default function Category({ category, isActive = false }) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className={`inline-flex items-center gap-1 px-2 py-2 rounded-3xl transition-colors text-sm ${
        isActive
          ? 'bg-[#16140f] text-white'
          : 'bg-[#f5f1ea] border border-[#dad4c6] hover:border-1 hover:border-[#16140f]'
      }`}
    >
      <span className={`uppercase font-medium ${isActive ? 'text-white' : 'text-neutral-800'}`}>
        {category.name}
      </span>
      <span className={isActive ? 'text-neutral-300' : 'text-neutral-400'}>
        ({category.products?.length || 0})
      </span>
    </Link>
  );
}

Category.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    products: PropTypes.array
  }).isRequired,
  isActive: PropTypes.bool
};
