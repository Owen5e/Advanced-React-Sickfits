import PropTypes from 'prop-types';
import Header from './Header';

export default function Page({ children }) {
  return (
    <div>
      <Header />
      <div className="max-w-1000 mx-auto p-8">{children}</div>
    </div>
  );
}

Page.propTypes = {
  children: PropTypes.any
};
