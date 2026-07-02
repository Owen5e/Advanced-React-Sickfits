import PropTypes from 'prop-types';
import { Space_Mono } from 'next/font/google';
import Header from './Header';
import Categories from './Categories';
import Footer from './Footer';
import AISearch from './AISearch';

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap'
});

export default function Page({ children }) {
  return (
    <div>
      <Header />
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-4 px-4 sm:px-6 lg:px-8 py-4">
        <div className=" ">
          <p className="flex text-[#ff4a17] ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-minus-icon lucide-minus"
            >
              <path d="M5 12h14" />
            </svg>
            <span className={`${spaceMono.className} pr-2`}>SS26</span>
            <span className={`${spaceMono.className} pr-2 text-[#ff4a17]`}>/</span>
            <span className={`${spaceMono.className}`}>THE TRENDY VIBE</span>
          </p>
          <p className="text-7xl w-[300px] md:text-9xl md:w-[600px] font-black ">
            WEAR THE <span className="text-[#ff4a17] italic ">BUILD</span>.
          </p>
        </div>
        <div className="text-[#999387]  flex flex-col h-full justify-end ">
          <div className=" md:flex md:flex-col md:items-end ">
            <p className={`${spaceMono.className}`}>
              <span className="text-[#272520] font-bold ">16</span> styles in rotation
            </p>
            <p className={`${spaceMono.className}`}>
              Restocked <span className="text-[#272520] font-bold ">weekly</span>{' '}
            </p>
            <p className={`${spaceMono.className}`}>
              Shipped from <span className="text-[#272520] font-bold ">London</span>
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</div>
      <Footer />
      <AISearch onResults={() => {}} />
    </div>
  );
}

Page.propTypes = {
  children: PropTypes.any
};
