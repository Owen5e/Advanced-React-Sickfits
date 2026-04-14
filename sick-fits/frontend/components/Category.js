import Link from 'next/link';
import PropTypes from 'prop-types';

export default function Category({ category }) {
  return (
    <div className="bg-white border border-offWhite shadow-custom rounded-lg overflow-hidden">
      {category.image?.image?.publicUrlTransformed && (
        <img
          src={category.image.image.publicUrlTransformed}
          alt={category.image.altText || category.name}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2">
          <Link href={`/category/${category.slug}`} className="text-black hover:underline">
            {category.name}
          </Link>
        </h3>
        {category.description && <p className="text-gray-600 mb-4">{category.description}</p>}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{category.products?.length || 0} products</span>
          <Link
            href={`/category/${category.slug}`}
            className="bg-red text-white px-4 py-2 rounded hover:bg-red-dark transition-colors"
          >
            Browse
          </Link>
        </div>
      </div>
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
