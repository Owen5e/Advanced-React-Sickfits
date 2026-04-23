import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useCart } from '../lib/cartState';
import CartCount from './CartCount';
import SignOut from './SignOut';
import { useUser } from './User';

export default function Nav() {
  const user = useUser();
  console.log('Nav - Current user:', user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const { openCart } = useCart();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const NavLinks = () => (
    <>
      <Link
        href="/products"
        className="text-white hover:text-primary-light transition-colors font-medium block py-2 px-4 md:py-0 md:px-0"
      >
        Products
      </Link>
      {user && (
        <>
          <Link
            href="/order"
            className="text-white hover:text-primary-light transition-colors font-medium block py-2 px-4 md:py-0 md:px-0"
          >
            Orders
          </Link>
          <Link
            href="/sell"
            className="text-white hover:text-primary-light transition-colors font-medium block py-2 px-4 md:py-0 md:px-0"
          >
            Sell
          </Link>
          <Link
            href="/account"
            className="text-white hover:text-primary-light transition-colors font-medium block py-2 px-4 md:py-0 md:px-0"
          >
            Account
          </Link>
          <div className="block md:py-0 md:px-0">
            <SignOut />
          </div>
          <button
            type="button"
            onClick={openCart}
            className="text-white hover:text-primary-light transition-colors font-medium flex items-center md:py-0 md:px-0"
          >
            <span>My Cart </span>
            <span className="ml-1 pb-0.5">🛒 </span>
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
        <Link
          href="/signin"
          className="text-white hover:text-primary-light transition-colors font-medium block py-2 px-4 md:py-0 md:px-0"
        >
          Sign In
        </Link>
      )}
    </>
  );

  return (
    <div ref={menuRef}>
      {/* Hamburger menu button for mobile */}
      <button
        type="button"
        className="md:hidden text-white focus:outline-none focus:ring-2 focus:ring-primary-light rounded-md p-2"
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
      >
        <div className="w-6 h-6 flex flex-col justify-center items-center">
          <span
            className={`block h-0.5 w-6 bg-white transform transition-transform duration-300 ${
              isMenuOpen ? 'rotate-45 translate-y-1.5' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-white my-1 transition-opacity duration-300 ${
              isMenuOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-white transform transition-transform duration-300 ${
              isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
            }`}
          />
        </div>
      </button>

      {/* Desktop navigation */}
      <nav className="hidden md:flex items-center space-x-6">
        <NavLinks />
      </nav>

      {/* Mobile navigation menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-secondary-dark shadow-lg z-50 transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? 'opacity-100 transform translate-y-0'
            : 'opacity-0 transform -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="flex flex-col py-4 px-4">
          <NavLinks />
        </div>
      </div>
    </div>
  );
}
