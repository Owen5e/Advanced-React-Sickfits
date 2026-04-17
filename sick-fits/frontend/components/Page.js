import PropTypes from 'prop-types';
import Header from './Header';

export default function Page({ children }) {
  return (
    <div>
      <Header />
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</div>
    </div>
  );
}

Page.propTypes = {
  children: PropTypes.any
};
