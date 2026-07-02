import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full text-[#edeae3] border-t border-[#25231d] bg-gradient-to-b from-[#12110d] via-[#11100c] to-[#0c0b08]">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-[40px] py-14 md:pt-[72px] md:pb-[40px]">
        {/* Top row */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between pb-[44px] border-b border-[#1f1d17]">
          <div className="max-w-[520px]">
            <div className="flex items-center gap-2">
              <span className="w-[10px] h-[10px] rounded-full bg-[#ff5322]" aria-hidden="true" />
              <Link
                href="/products"
                className="no-underline uppercase text-[#edeae3] font-black text-lg md:text-[30px] md:font-[900] tracking-[0]"
              >
                TRENDYFITS
              </Link>
            </div>
            <p className="mt-4 text-[#9b958a] text-sm md:text-[15px] max-w-[332px] leading-relaxed">
              Studio-built fits, shipped on a 7-day cadence from London. New drops every Friday.
            </p>
          </div>

          <div className="w-full max-w-[588px] flex flex-col items-start">
            <p className="text-xs md:text-[11px] font-mono uppercase tracking-[0.28em] text-[#ff5322]">
              Join the list
            </p>
            <form
              className="mt-4 w-full max-md:w-[300px] lg:w-[400px] flex items-stretch border border-[#2b2923] bg-[#0f0e0b]"
              action="#"
            >
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                name="email"
                type="email"
                placeholder="Email address"
                autoComplete="email"
                className="w-full bg-transparent border-none outline-none text-[#edeae3] text-sm md:text-[15px] px-4 py-3 placeholder:text-[#6f6a60]"
              />
              <button
                type="submit"
                aria-label="Join the list"
                className="shrink-0 bg-[#ff5322] text-[#0b0b08] px-4 sm:px-5 hover:bg-[#ff6a40] transition-colors duration-200"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M5 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path
                    d="M13 7L18 12L13 17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </form>
            <p className="mt-3 text-xs md:text-[11px] font-mono text-[#6f6a60]">
              Early access to every drop. No spam, unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* Link grid */}
        <div className="py-[44px] grid grid-cols-2 gap-x-[24px] gap-y-[13px] md:grid-cols-4 border-b border-[#1f1d17]">
          <div className="flex flex-col gap-[13px]">
            <h4 className="text-[#6f6a60] font-semibold text-[11px] uppercase tracking-[0.28em] mb-[3px]">
              Shop
            </h4>
            <ul className="list-none p-0 m-0 text-[15px] text-[#C9C4B8]">
              <li>
                <Link
                  href="/category/hoodies"
                  className="text-[#edeae3] no-underline hover:text-[#ff5322] transition-colors duration-200"
                >
                  Hoodies
                </Link>
              </li>
              <li>
                <Link
                  href="/category/shoes"
                  className="text-[#edeae3] no-underline hover:text-[#ff5322] transition-colors duration-200"
                >
                  Shoes
                </Link>
              </li>
              <li>
                <Link
                  href="/category/trousers"
                  className="text-[#edeae3] no-underline hover:text-[#ff5322] transition-colors duration-200"
                >
                  Trousers
                </Link>
              </li>
              <li>
                <Link
                  href="/category/outerwear"
                  className="text-[#edeae3] no-underline hover:text-[#ff5322] transition-colors duration-200"
                >
                  Outerwear
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-[#edeae3] no-underline hover:text-[#ff5322] transition-colors duration-200"
                >
                  New in
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-[13px]">
            <h4 className="text-[#6f6a60] font-semibold text-[11px] uppercase tracking-[0.28em] mb-[3px]">
              Help
            </h4>
            <ul className="list-none p-0 m-0 text-[15px] text-[#C9C4B8]">
              <li>
                <Link
                  href="/shipping"
                  className="text-[#edeae3] no-underline hover:text-[#ff5322] transition-colors duration-200"
                >
                  Shipping
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-[#edeae3] no-underline hover:text-[#ff5322] transition-colors duration-200"
                >
                  Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/size-guide"
                  className="text-[#edeae3] no-underline hover:text-[#ff5322] transition-colors duration-200"
                >
                  Size guide
                </Link>
              </li>
              <li>
                <Link
                  href="/track"
                  className="text-[#edeae3] no-underline hover:text-[#ff5322] transition-colors duration-200"
                >
                  Track order
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-[#edeae3] no-underline hover:text-[#ff5322] transition-colors duration-200"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-[13px]">
            <h4 className="text-[#6f6a60] font-semibold text-[11px] uppercase tracking-[0.28em] mb-[3px]">
              Studio
            </h4>
            <ul className="list-none p-0 m-0 text-[15px] text-[#C9C4B8]">
              <li>
                <Link
                  href="/about"
                  className="text-[#edeae3] no-underline hover:text-[#ff5322] transition-colors duration-200"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/lookbook"
                  className="text-[#edeae3] no-underline hover:text-[#ff5322] transition-colors duration-200"
                >
                  Lookbook
                </Link>
              </li>
              <li>
                <Link
                  href="/stories"
                  className="text-[#edeae3] no-underline hover:text-[#ff5322] transition-colors duration-200"
                >
                  Stories
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-[#edeae3] no-underline hover:text-[#ff5322] transition-colors duration-200"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-[13px]">
            <h4 className="text-[#6f6a60] font-semibold text-[11px] uppercase tracking-[0.28em] mb-[3px]">
              Social
            </h4>
            <ul className="list-none p-0 m-0 text-[15px] text-[#C9C4B8]">
              {[
                { href: 'https://instagram.com', label: 'Instagram' },
                { href: 'https://tiktok.com', label: 'TikTok' },
                { href: 'https://pinterest.com', label: 'Pinterest' }
              ].map(item => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-[#edeae3] no-underline hover:text-[#ff5322] transition-colors duration-200"
                  >
                    <span>{item.label}</span>
                    <span className="text-[#6f6a60]" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-[28px] flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-[11px] text-[#6f6a60]">
          <span>&copy; {new Date().getFullYear()} Trendy Fits Ltd. — All rights reserved.</span>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 md:justify-end">
            <Link
              href="/privacy"
              className="text-[#6f6a60] no-underline hover:text-[#edeae3] transition-colors duration-200"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-[#6f6a60] no-underline hover:text-[#edeae3] transition-colors duration-200"
            >
              Terms
            </Link>
            <span className="text-[#6f6a60]">Designed &amp; shipped in London</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
