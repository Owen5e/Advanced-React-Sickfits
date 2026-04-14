/* eslint-disable */

import Link from 'next/link';
import formatMoney from '../lib/formatMoney';
import AddToCart from './AddToCart';
import DeleteProduct from './DeleteProduct';

export default function Product({ product }) {
  return (
    <div className="bg-white border border-offWhite shadow-custom relative">
      <img
        src={product?.photo?.image?.publicUrlTransformed}
        alt={product.name}
        className="w-full h-[400px] object-cover"
      />
      <h3 className="text-2xl font-bold p-4">
        <Link href={`/product/${product.id}`} className="text-black hover:underline">
          {product.name}
        </Link>
      </h3>
      <div className="bg-red text-white text-lg font-bold py-1 px-3 inline-block transform -skew-x-6 -rotate-2 absolute top-0 right-0">
        {formatMoney(product.price)}
      </div>
      <p className="leading-8 font-light p-0 px-12 text-base">{product.description}</p>

      {/* Display categories if they exist */}
      {product.categories && product.categories.length > 0 && (
        <div className="px-4 py-2">
          <div className="flex flex-wrap gap-2">
            {product.categories.map(category => (
              <span
                key={category.id}
                className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
              >
                {category.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Add buttons to edit and delete items */}
      <div className="buttonList grid w-full border-t border-lightGrey grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-px bg-lightGrey">
        <Link
          href={{ pathname: '/update', query: { id: product.id } }}
          className="bg-white border-0 text-sm p-4 text-center"
        >
          Edit
        </Link>
        <AddToCart id={product.id} />
        <DeleteProduct id={product.id}>Delete</DeleteProduct>
      </div>
    </div>
  );
}
