/* eslint-disable */

import Link from 'next/link';
import formatMoney from '../lib/formatMoney';
import AddToCart from './AddToCart';

export default function Product({ product }) {
  return (
    <div className="bg-white rounded-lg shadow-subtle overflow-hidden hover:shadow-elevated transition-shadow duration-300 border border-neutral-200 flex flex-col h-full">
      {/* Product Image */}
      <div className="relative overflow-hidden flex-shrink-0">
        <img
          src={product?.photo?.image?.publicUrlTransformed}
          alt={product.name}
          className="w-full h-48 object-contain  p-2"
        />

        {/* Price Tag */}
        <div className="absolute top-3 right-3 bg-neutral-200 text-black px-3 py-1 rounded-full font-bold text-sm shadow-sm">
          {formatMoney(product.price)}
        </div>
      </div>

      {/* Product Content */}
      <div className="pt-4 px-4 flex flex-col flex-grow bg-neutral-50">
        <h3 className="text-lg font-bold mb-2">
          <Link
            href={`/product/${product.id}`}
            className="text-secondary-DEFAULT hover:text-primary-DEFAULT transition-colors"
          >
            {product.name}
          </Link>
        </h3>

        <p className="text-neutral-600 text-sm leading-relaxed mb-3 line-clamp-2 flex-grow">
          {product.description}
        </p>

        {/* Categories */}
        {product.categories && product.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.categories.map(category => (
              <span
                key={category.id}
                className="bg-neutral-100 text-neutral-700 text-xs px-2 py-1 rounded-full"
              >
                {category.name}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons - positioned at bottom */}
        <div className="mt-auto py-1 border-t border-neutral-200">
          <div className="flex gap-2">
            {/* <Link
              href={{ pathname: '/update', query: { id: product.id } }}
              className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-3 py-2 rounded text-center text-sm font-medium transition-colors"
            >
              Edit
            </Link> */}
            <AddToCart id={product.id} />
            {/* <DeleteProduct
              id={product.id}
              className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-3 py-2 rounded text-center text-sm font-medium transition-colors"
            >
              Delete
            </DeleteProduct> */}
          </div>
        </div>
      </div>
    </div>
  );
}
