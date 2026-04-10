import Link from 'next/link';
import { useCart } from '../lib/cartState';
import CartCount from './CartCount';
import SignOut from './SignOut';
import { useUser } from './User';

export default function Nav() {
  const user = useUser();
  console.log('Nav - Current user:', user);

  const { openCart } = useCart();

  return (
    <ul className="m-0 p-0 flex items-center justify-self-end text-2xl md:text-xl sm:text-lg gap-2">
      <Link
        href="/products"
        className="px-12 py-4 flex items-center relative uppercase font-black text-base bg-none border-0 cursor-pointer hover:after:w-[calc(100%-60px)] focus:after:w-[calc(100%-60px)] before:content-[''] before:w-0.5 before:bg-gray-200 before:h-full before:left-0 before:absolute before:-skew-x-5 before:top-0 before:bottom-0 after:content-[''] after:h-0.5 after:bg-red after:w-0 after:absolute after:-translate-x-1/2 after:transition-all after:duration-400 after:ease-custom after:left-1/2 after:mt-8"
      >
        Products
      </Link>
      {user && (
        <>
          <Link
            href="/order"
            className="px-12 py-4 flex items-center relative uppercase font-black text-base bg-none border-0 cursor-pointer hover:after:w-[calc(100%-60px)] focus:after:w-[calc(100%-60px)] before:content-[''] before:w-0.5 before:bg-gray-200 before:h-full before:left-0 before:absolute before:-skew-x-5 before:top-0 before:bottom-0 after:content-[''] after:h-0.5 after:bg-red after:w-0 after:absolute after:-translate-x-1/2 after:transition-all after:duration-400 after:ease-custom after:left-1/2 after:mt-8"
          >
            Orders
          </Link>
          <Link
            href="/sell"
            className="px-12 py-4 flex items-center relative uppercase font-black text-base bg-none border-0 cursor-pointer hover:after:w-[calc(100%-60px)] focus:after:w-[calc(100%-60px)] before:content-[''] before:w-0.5 before:bg-gray-200 before:h-full before:left-0 before:absolute before:-skew-x-5 before:top-0 before:bottom-0 after:content-[''] after:h-0.5 after:bg-red after:w-0 after:absolute after:-translate-x-1/2 after:transition-all after:duration-400 after:ease-custom after:left-1/2 after:mt-8"
          >
            Sell
          </Link>
          <Link
            href="/account"
            className="px-12 py-4 flex items-center relative uppercase font-black text-base bg-none border-0 cursor-pointer hover:after:w-[calc(100%-60px)] focus:after:w-[calc(100%-60px)] before:content-[''] before:w-0.5 before:bg-gray-200 before:h-full before:left-0 before:absolute before:-skew-x-5 before:top-0 before:bottom-0 after:content-[''] after:h-0.5 after:bg-red after:w-0 after:absolute after:-translate-x-1/2 after:transition-all after:duration-400 after:ease-custom after:left-1/2 after:mt-8"
          >
            Account
          </Link>
          <SignOut />
          <button
            type="button"
            onClick={openCart}
            className="px-12 py-4 flex items-center relative uppercase font-black text-base bg-none border-0 cursor-pointer hover:after:w-[calc(100%-60px)] focus:after:w-[calc(100%-60px)] before:content-[''] before:w-0.5 before:bg-gray-200 before:h-full before:left-0 before:absolute before:-skew-x-5 before:top-0 before:bottom-0 after:content-[''] after:h-0.5 after:bg-red after:w-0 after:absolute after:-translate-x-1/2 after:transition-all after:duration-400 after:ease-custom after:left-1/2 after:mt-8"
          >
            My Cart
            <CartCount
              count={
                user.cart?.reduce(
                  (tally, cartItem) => tally + (cartItem?.product ? cartItem.quantity : 0),
                  0
                ) || 0
              }
            />
          </button>
        </>
      )}
      {!user && (
        <>
          <Link
            href="/signin"
            className="px-12 py-4 flex items-center relative uppercase font-black text-base bg-none border-0 cursor-pointer hover:after:w-[calc(100%-60px)] focus:after:w-[calc(100%-60px)] before:content-[''] before:w-0.5 before:bg-gray-200 before:h-full before:left-0 before:absolute before:-skew-x-5 before:top-0 before:bottom-0 after:content-[''] after:h-0.5 after:bg-red after:w-0 after:absolute after:-translate-x-1/2 after:transition-all after:duration-400 after:ease-custom after:left-1/2 after:mt-8"
          >
            Sign In
          </Link>
        </>
      )}
    </ul>
  );
}
