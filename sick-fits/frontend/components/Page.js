import PropTypes from 'prop-types';
import { Space_Mono } from 'next/font/google';
import Header from './Header';

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
        <div>
          <span className={`${spaceMono.className} pr-2`}>SS26</span>
          <span className={`${spaceMono.className} pr-2 text-[#ff4a17]`}>/</span>
          <span className={`${spaceMono.className}`}>THE TRENDY VIBE</span>
          <p className="text-7xl w-[300px] md:text-9xl md:w-[600px] font-bold  ">
            WEAR THE <span className="text-[#ff4a17] italic ">BUILD</span>.
          </p>
        </div>
        <div className="text-[#999387]  flex flex-col h-full justify-end">
          <div>
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
    </div>
  );
}

Page.propTypes = {
  children: PropTypes.any
};
