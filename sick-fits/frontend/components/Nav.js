import Link from 'next/link';
import { Space_Mono } from 'next/font/google';
import { useEffect, useRef, useState } from 'react';
import { useCart } from '../lib/cartState';
import CartCount from './CartCount';
import SignOut from './SignOut';
import { useUser } from './User';

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap'
});

export default function Nav({ onToggleSearch, isSearchOpen = false }) {
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

  const linkClass =
    'text-[#4a463c] hover:text-black transition-colors font-medium block py-2 px-4 md:py-0 md:px-0';

  const bagCount =
    user?.cart?.reduce(
      (tally, cartItem) => tally + (cartItem?.product ? cartItem.quantity : 0),
      0
    ) || 0;

  const SearchIcon = () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );

  const PrimaryLinks = () => (
    <div className="flex items-center gap-6">
      <Link
        href="/products"
        className="text-[#4a463c] hover:text-black transition-colors font-normal block py-2 px-4 md:py-0 md:px-0"
      >
        SHOP ALL
      </Link>
      {user && (
        <Link href="/order" className={linkClass}>
          Orders
        </Link>
      )}
      {user && (
        <Link href="/sell" className={linkClass}>
          Sell
        </Link>
      )}
      {user && (
        <div className="block md:py-0 md:px-0">
          <SignOut />
        </div>
      )}
    </div>
  );

  const DesktopNavLinks = () => (
    <div className={`${spaceMono.className} hidden md:grid w-full grid-cols-2 items-center`}>
      <div className="flex items-center gap-6 justify-self-center">
        <PrimaryLinks />
      </div>

      <div className="flex items-center gap-6 justify-self-end">
        <button
          type="button"
          onClick={onToggleSearch}
          className="text-[#4a463c] hover:text-black transition-colors font-medium flex items-center"
          aria-label="Toggle search"
          aria-expanded={isSearchOpen}
          aria-controls="header-search"
        >
          <SearchIcon />
        </button>
        {!user && (
          <Link href="/signin" className={linkClass}>
            Sign In
          </Link>
        )}
        {user && (
          <Link href="/account" className={linkClass}>
            Account
          </Link>
        )}

        {user && (
          <button
            type="button"
            onClick={openCart}
            className="text-[#4a463c] hover:text-black transition-colors font-medium flex items-center md:py-0 md:px-0"
          >
            <span className="ml-1 pb-0.5">🛒 </span>
            <span>Bag </span>
            <CartCount count={bagCount} />
          </button>
        )}
      </div>
    </div>
  );

  const MobileNavLinks = () => (
    <div className={`${spaceMono.className} flex flex-col gap-2`}>
      <button type="button" onClick={onToggleSearch} className={`${linkClass} text-left`}>
        Search
      </button>
      {!user && (
        <Link href="/signin" className={linkClass}>
          Sign In
        </Link>
      )}
      <PrimaryLinks />
      {user && (
        <Link href="/account" className={linkClass}>
          Account
        </Link>
      )}
      {user && (
        <button
          type="button"
          onClick={openCart}
          className="text-[#4a463c] hover:text-black transition-colors font-medium flex items-center py-2 px-4"
        >
          <span className="ml-1 pb-0.5">🛒 </span>
          <span>Bag </span>
          <CartCount count={bagCount} />
        </button>
      )}
    </div>
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
      <nav className="w-full">
        <DesktopNavLinks />
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
          <MobileNavLinks />
        </div>
      </div>
    </div>
  );
}
