import clsx from 'clsx';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { Bookmark, Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { Fragment, useEffect, useState } from 'react';
import Marquee from 'react-fast-marquee';
import { Link, useLocation, useMatches } from 'react-router';
import SearchDialog from './SearchDialog';

const menuItems = [
  { name: 'Men', link: '/men' },
  { name: 'Women', link: '/women' },
  { name: 'Accessories', link: '/accesories' },
  { name: 'Sale', link: '/sale' },
];

const noDynamicHeaderRoutes = [''];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isSearchInputVisible, setIsSearchInputVisible] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const matches = useMatches();

  const is404 = matches.some(m => m.handle?.is404);
  const noDynamicHeader = is404 || noDynamicHeaderRoutes.includes(location.pathname);
  const isBgCream = noDynamicHeader || scrolled;
  const isTextDark = noDynamicHeader || scrolled || mobileOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname])

  const handleSearchSubmit = e => {
    e.preventDefault();
  };

  return (
    <LayoutGroup>
      <motion.header
        layout
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={clsx(
          'fixed top-0 z-50 w-full transition-colors duration-100',
          isBgCream ? 'bg-cream' : 'bg-transparent',
          isTextDark ? 'text-dark' : 'text-white'
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
              className={clsx(
                'border border-[#cbcbcb] py-2 text-[11px] font-bold text-white uppercase',
                noDynamicHeader && 'bg-dark'
              )}
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
              isBgCream ? 'bg-cream' : 'bg-transparent'
            )}
          >
            {/* Logo */}
            <Link to="/" className="mx-4 text-xl leading-tight font-bold">
              <img className={isTextDark ? undefined : 'invert'} src="icons/logo.svg" alt="HALO" />
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

            <form onSubmit={handleSearchSubmit} className="relative flex items-center space-x-4">
              <div className="absolute right-full hidden lg:flex" onMouseOver={() => setIsSearchInputVisible(true)}>
                <button type="submit">
                  <Search size={18} />
                </button>
                {isSearchInputVisible && (
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
              className="bg-cream text-dark absolute top-0 left-0 -z-10 flex h-[150vh] w-full lg:hidden"
            >
              <div className="w-64 p-6 pt-20">
                <nav className="mt-8 flex flex-col space-y-4">
                  {menuItems.map(({ name, link }, index) => (
                    <Link key={index} to={link} className="text-2xl font-bold uppercase">
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
