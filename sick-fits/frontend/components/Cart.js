import calcTotalPrice from '../lib/calcTotalPrice';
import { useCart } from '../lib/cartState';
import formatMoney from '../lib/formatMoney';
import { Checkout } from './Checkout';
import RemoveFromCart from './RemoveFromCart';
import { useUser } from './User';

function CartItem({ cartItem }) {
  const { product } = cartItem;
  if (!product) return null;

  return (
    <li className="flex items-center justify-between py-4 border-b border-neutral-200">
      <div className="flex items-center space-x-4 flex-1 min-w-0">
        <img
          src={product.photo?.image?.publicUrlTransformed}
          alt={product.name}
          className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg shadow-sm flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-neutral-800 truncate">{product.name}</h3>
          <div className="mt-1 text-sm text-neutral-600">
            <span className="font-medium">{formatMoney(product.price * cartItem.quantity)}</span>
            <span className="mx-1">-</span>
            <span className="text-neutral-500">
              {cartItem.quantity} × {formatMoney(product.price)} each
            </span>
          </div>
        </div>
      </div>
      <div className="ml-4 flex-shrink-0">
        <RemoveFromCart id={cartItem.id} />
      </div>
    </li>
  );
}

export default function Cart() {
  const me = useUser();
  const { cartOpen, closeCart } = useCart();

  if (!me) {
    return null;
  }

  const cartItems = me.cart || [];
  const isEmpty = cartItems.length === 0;
  const totalPrice = calcTotalPrice(cartItems);

  return (
    <div
      className={`fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-custom ${
        cartOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      style={{ maxWidth: '28rem' }}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">{me.name}'s Cart</h2>
              <p className="text-sm text-neutral-500 mt-1">
                {isEmpty
                  ? 'Your cart is empty'
                  : `${cartItems.length} item${cartItems.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            <button
              onClick={closeCart}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-neutral-700 transition-colors"
              aria-label="Close cart"
            >
              <span className="text-2xl">&times;</span>
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isEmpty ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-24 h-24 mb-6 rounded-full bg-neutral-100 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-700 mb-2">Your cart is empty</h3>
              <p className="text-neutral-500 mb-6">Add some items to get started!</p>
              <button
                onClick={closeCart}
                className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-2">
              {cartItems.map(cartItem => (
                <CartItem key={cartItem.id} cartItem={cartItem} />
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {!isEmpty && (
          <div className="border-t border-neutral-200 px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-neutral-700">Total</span>
              <span className="text-2xl font-bold text-primary">{formatMoney(totalPrice)}</span>
            </div>
            <div className="space-y-3">
              <Checkout />
              <button
                onClick={closeCart}
                className="w-full py-3 border-2 border-neutral-300 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
            <p className="text-xs text-neutral-400 text-center mt-4">
              Free shipping on orders over $50
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
