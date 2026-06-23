import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#16140f] text-[#edeae3] w-full border-t border-[#2a2822]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-[10px] h-[10px] rounded-full bg-[#ff5322]" />
              <Link href="/" className="no-underline uppercase text-[#edeae3] font-extrabold text-lg tracking-widest">
                TrendyFits
              </Link>
            </div>
            <p className="text-[#999387] text-sm leading-relaxed max-w-[280px]">
              Premium streetwear curated for the trend-conscious. New drops every Friday.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-[#edeae3] font-bold text-xs uppercase tracking-widest mb-6">
              Shop
            </h4>
            <ul className="list-none p-0 m-0 space-y-3">
              <li>
                <Link href="/products" className="text-[#999387] no-underline text-sm hover:text-[#ff5322] transition-colors duration-200">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/category/tops" className="text-[#999387] no-underline text-sm hover:text-[#ff5322] transition-colors duration-200">
                  Tops
                </Link>
              </li>
              <li>
                <Link href="/category/bottoms" className="text-[#999387] no-underline text-sm hover:text-[#ff5322] transition-colors duration-200">
                  Bottoms
                </Link>
              </li>
              <li>
                <Link href="/category/accessories" className="text-[#999387] no-underline text-sm hover:text-[#ff5322] transition-colors duration-200">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[#edeae3] font-bold text-xs uppercase tracking-widest mb-6">
              Company
            </h4>
            <ul className="list-none p-0 m-0 space-y-3">
              <li>
                <Link href="/about" className="text-[#999387] no-underline text-sm hover:text-[#ff5322] transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#999387] no-underline text-sm hover:text-[#ff5322] transition-colors duration-200">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-[#999387] no-underline text-sm hover:text-[#ff5322] transition-colors duration-200">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="text-[#999387] no-underline text-sm hover:text-[#ff5322] transition-colors duration-200">
                  Size Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-[#edeae3] font-bold text-xs uppercase tracking-widest mb-6">
              Stay in the Loop
            </h4>
            <p className="text-[#999387] text-sm leading-relaxed mb-6">
              Be the first to know about new drops, restocks, and exclusive offers.
            </p>
            <div className="flex border-b border-[#3a3832]">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-transparent border-none outline-none text-[#edeae3] text-sm py-3 flex-1 placeholder:text-[#6b6963]"
              />
              <button
                type="button"
                className="bg-transparent text-[#ff5322] font-bold text-xs uppercase tracking-widest py-3 hover:text-[#ff7a4a] transition-colors duration-200"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-[#2a2822] flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#6b6963]">
          <span>&copy; {new Date().getFullYear()} TrendyFits. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-[#6b6963] no-underline hover:text-[#edeae3] transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-[#6b6963] no-underline hover:text-[#edeae3] transition-colors duration-200">
              Terms of Service
            </Link>
            <Link href="/shipping" className="text-[#6b6963] no-underline hover:text-[#edeae3] transition-colors duration-200">
              Shipping & Returns
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}