import { Bookmark, Search, ShoppingBag, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import Marquee from 'react-fast-marquee';
import { Link } from 'react-router';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [searchShown, setSearchShown] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const search = e => {
    e.preventDefault();
  };

  return (
    <header className={`${scrolled ? 'bg-cream text-[#1E1E1E' : 'bg-transparent text-white'} duration-100 fixed top-0 z-50 w-full`}>
      {!scrolled && (
        <Marquee className="border border-[#cbcbcb] py-2 text-[11px]" autoFill>
          <span className="mx-8">▪ FREE SHIPPING ON ORDERS OVER 50 EUR ▪</span>
        </Marquee>
      )}

      {/* Navbar */}
      <div className="flex items-center justify-between border-b border-[#cbcbcb] px-7 py-4">
        {/* Logo */}
        <Link to="/" className="mx-4 text-xl leading-tight font-bold">
          <img className={!scrolled && 'invert'} src="icons/logo.svg" alt="HALO" />
        </Link>

        {/* Navigation */}
        <nav className="hidden space-x-4 text-sm font-semibold uppercase md:flex">
          <Link to="/">Men</Link>
          <span>/</span>
          <Link to="/">Women</Link>
          <span>/</span>
          <Link to="/">Accessories</Link>
          <span>/</span>
          <Link to="/">Archive</Link>
        </nav>

        {/* Icons */}
        <div className="relative flex items-center space-x-4">
          <form className="absolute right-full flex" onSubmit={search} onMouseOver={() => setSearchShown(true)} role="search">
            <Search size={18} />
            {searchShown && (
              <input
                className="pl-4 text-xs placeholder:text-inherit focus:outline-0 focus:placeholder:opacity-0"
                type="search"
                name="search"
                placeholder="SEARCH"
              />
            )}
          </form>
          <Bookmark size={18} />
          <User size={18} />
          <ShoppingBag size={18} />
        </div>
      </div>
    </header>
  );
};

export default Header;
