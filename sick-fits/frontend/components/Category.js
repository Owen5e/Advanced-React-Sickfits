import Link from 'next/link';
import PropTypes from 'prop-types';

export default function Category({ category }) {
  return (
    <div className="bg-white border border-neutral-200 shadow-subtle rounded-lg overflow-hidden hover:shadow-elevated transition-shadow flex h-40">
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold mb-1">
            <Link
              href={`/category/${category.slug}`}
              className="text-secondary-DEFAULT hover:text-primary-DEFAULT transition-colors"
            >
              {category.name}
            </Link>
          </h3>
          <div className="text-sm text-neutral-500">{category.products?.length || 0} products</div>
        </div>
        <div className="mt-2">
          <Link
            href={`/category/${category.slug}`}
            className="bg-primary-DEFAULT hover:bg-primary-dark text-white px-3 py-1.5 rounded transition-colors text-sm"
          >
            Browse
          </Link>
        </div>
      </div>
      {category.image?.image?.publicUrlTransformed && (
        <div className="w-2/5 flex-shrink-0 pr-2 ">
          <img
            src={category.image.image.publicUrlTransformed}
            alt={category.image.altText || category.name}
            className="w-full h-full object-fill"
          />
        </div>
      )}
    </div>
  );
}

Category.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    slug: PropTypes.string.isRequired,
    products: PropTypes.array,
    image: PropTypes.shape({
      image: PropTypes.shape({
        publicUrlTransformed: PropTypes.string
      }),
      altText: PropTypes.string
    })
  }).isRequired
};
