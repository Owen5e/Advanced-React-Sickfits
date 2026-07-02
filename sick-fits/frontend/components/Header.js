import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState } from 'react';
import styled from 'styled-components';
import Nav from './Nav';
import Search from './Search';

const Cart = dynamic(() => import('./Cart'), { ssr: false });

const Logo = styled.h1`
  display: flex;
  align-items: center;
  font-family: 'Archivo', Gadget, sans-serif;
  font-size: 2.3rem;
  position: relative;
  margin-left: 1rem;
  z-index: 2;

  .logo-ball {
    border-radius: 50%;
    width: 10px;
    height: 10px;
    background-color: #ff5322;
  }

  a {
    text-decoration: none;
    padding: 0.5rem 1rem;
    text-transform: uppercase;
    color: #16140f;
    font-weight: 800;
    letter-spacing: 0.8px;
  }
`;

const HeaderStyles = styled.header`
  background-color: #f5f1ea;
  color: #16140f;
  width: 100%;
  position: relative;
  border-bottom: 1px solid #dad4c6;

  .marquee {
    overflow: hidden;
    white-space: nowrap;
    background-color: #16140f;
  }
  .marquee-header {
    animation: marquee 80s linear infinite;
    padding-block: 0.4rem;

    > text {
      font-size: 0.9rem;
      display: inline-block;
      padding-inline: 6rem;
      border-left: 2px solid #ff5322;
      transform: skewX(-15deg);
      color: #edeae3;
    }

    @keyframes marquee {
      from {
        transform: translateX(100vw);
      }
      to {
        transform: translateX(-100%);
      }
    }
  }

  .bar {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;
    gap: 2rem;
    padding: 1rem 2rem;
    max-width: 1400px;
    margin: 0 auto;
    position: relative;
  }

  .nav-wrap {
    grid-column: 2 / 4;
    width: 100%;
  }

  .sub-bar {
    margin: 0 auto;
    max-width: 1400px;
    overflow: hidden;
    align-items: center;
    padding-inline: 0.5rem;
    border-top: 1px solid #dad4c6;
    max-height: 0;
    opacity: 0;
    transform: translateY(-6px);
    transition: max-height 0.25s ease, opacity 0.2s ease, transform 0.2s ease;
  }

  .sub-bar.open {
    max-height: 150px;
    opacity: 1;
    overflow: visible;

    transform: translateY(0);
  }

  @media (max-width: 768px) {
    .bar {
      display: flex;
      padding: 1rem;
      gap: 1rem;
    }

    .nav-wrap {
      position: static;
      transform: none;
      flex: 1;
      display: block;
    }

    .sub-bar {
      padding: 0.5rem 1rem;
    }
  }
`;

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <HeaderStyles>
      <div className="marquee">
        <div className="marquee-header">
          <text>30-DAYS RETURN, NO QUESTIONS</text>
          <text>NEW DROPS EVERY FRIDAY</text>
          <text>MEMBERS GET EARLY ACCESS</text>
          <text>FREE EXPRESS SHIPPING OVER $500</text>
          <text>30-DAYS RETURN, NO QUESTIONS</text>
          <text>NEW DROPS EVERY FRIDAY</text>
          <text>MEMBERS GET EARLY ACCESS</text>
          <text>FREE EXPRESS SHIPPING OVER $500</text>
        </div>
      </div>
      <div className="bar">
        <Logo>
          <span className="logo-ball"></span>
          <Link href="/products">TrendyFits</Link>
        </Logo>
        <div className="nav-wrap">
          <Nav onToggleSearch={() => setIsSearchOpen(prev => !prev)} isSearchOpen={isSearchOpen} />
        </div>
      </div>
      <div id="header-search" className={`sub-bar ${isSearchOpen ? 'open' : ''}`}>
        <Search />
      </div>
      <Cart />
    </HeaderStyles>
  );
}
