import Link from 'next/link';
import styled from 'styled-components';
import Cart from './Cart';
import Nav from './Nav';
import Search from './Search';

const Logo = styled.h1`
  font-size: 2rem;
  background-color: #374151;
  position: relative;
  transform: skew(-7deg);
  margin-left: 1rem;
  z-index: 2;

  a {
    text-decoration: none;
    padding: 0.5rem 1rem;
    text-transform: uppercase;
    color: white;
    font-weight: bold;
  }
`;

const HeaderStyles = styled.header`
  background-color: #1f2937;
  color: white;
  width: 100%;
  position: relative;

  .bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    max-width: 1400px;
    margin: 0 auto;
    position: relative;
  }

  .sub-bar {
    margin: 0 auto;
    max-width: 1400px;
    align-items: center;
    padding: 0.5rem 2rem;
    border-bottom: 1px solid #374151;
  }

  @media (max-width: 768px) {
    .bar {
      padding: 1rem;
    }

    .sub-bar {
      padding: 0.5rem 1rem;
    }
  }
`;

export default function Header() {
  return (
    <HeaderStyles>
      <div className="bar">
        <Logo>
          <Link href="/">Trendy Fits</Link>
        </Logo>
        <Nav />
      </div>
      <div className="sub-bar">
        <Search />
      </div>
      <Cart />
    </HeaderStyles>
  );
}
