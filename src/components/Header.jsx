import clsx from 'clsx';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { Bookmark, Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { Fragment, useEffect, useState } from 'react';
import Marquee from 'react-fast-marquee';
import { Link } from 'react-router';
import SearchDialog from './SearchDialog';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [searchInputShown, setSearchInputShown] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { name: 'Men', link: '#' },
    { name: 'Women', link: '#' },
    { name: 'Accessories', link: '#' },
    { name: 'Sale', link: '#' },
  ];

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
    <LayoutGroup>
      <motion.header
        layout
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={clsx(
          'fixed top-0 z-50 w-full transition-colors duration-100',
          scrolled ? 'bg-cream' : 'bg-transparent',
          scrolled || mobileOpen ? 'text-[#1e1e1e]' : 'text-white'
        )}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {!scrolled && !mobileOpen && (
            <motion.div
              key="marquee"
              layout
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              exit={{ y: -50 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="border border-[#cbcbcb] py-2 text-[11px] font-bold uppercase"
            >
              <Marquee autoFill>
                <div className="ml-10 h-[.5em] w-[.5em] bg-white"></div>
                <span className="mx-8">Free shipping on orders over 50 EUR</span>
                <div className="mr-10 h-[.5em] w-[.5em] bg-white"></div>
              </Marquee>
            </motion.div>
          )}

          <motion.div
            key="navbar"
            layout
            className={clsx(
              'flex items-center justify-between border-b border-[#cbcbcb] px-7 py-4',
              scrolled ? 'bg-cream' : 'bg-transparent'
            )}
          >
            {/* Logo */}
            <Link to="/" className="mx-4 text-xl leading-tight font-bold">
              <img className={scrolled || mobileOpen ? undefined : 'invert'} src="icons/logo.svg" alt="HALO" />
            </Link>

            {/* Navigation */}
            <nav className="hidden space-x-4 text-sm font-semibold uppercase lg:flex">
              {menuItems.map(({ name, link }, index) => (
                <Fragment key={index}>
                  <Link to={link}>{name}</Link>
                  {index !== menuItems.length - 1 && <span>/</span>}
                </Fragment>
              ))}
            </nav>

            <form onSubmit={search} className="relative flex items-center space-x-4">
              <div className="absolute right-full hidden lg:flex" onMouseOver={() => setSearchInputShown(true)}>
                <button type="submit">
                  <Search size={18} />
                </button>
                {searchInputShown && (
                  <input
                    className="pl-4 text-xs placeholder:text-inherit focus:outline-0 focus:placeholder:opacity-0"
                    type="search"
                    name="search"
                    placeholder="SEARCH"
                  />
                )}
              </div>
              <button className="lg:hidden" type="button" onClick={() => setSearchDialogOpen(true)}>
                <Search size={18} />
              </button>
              <Bookmark size={18} />
              <User size={18} />
              <ShoppingBag size={18} />
              <button className="lg:hidden" type="button" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </form>
          </motion.div>
        </AnimatePresence>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="bg-cream absolute top-0 left-0 -z-10 flex h-screen w-full text-[#1e1e1e] lg:hidden"
            >
              <div className="w-64 p-6 pt-20">
                <nav className="mt-8 flex flex-col space-y-4">
                  {menuItems.map(({ name, link }, index) => (
                    <Link key={index} to={link} className="text-2xl font-bold uppercase" onClick={() => setMobileOpen(false)}>
                      {name}
                    </Link>
                  ))}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <SearchDialog open={searchDialogOpen} setOpen={setSearchDialogOpen} />
      </motion.header>
    </LayoutGroup>
  );
};

export default Header;
