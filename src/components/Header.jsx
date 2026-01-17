import { Transition } from '@headlessui/react';
import clsx from 'clsx';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { Bookmark, Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { Fragment, useEffect, useState } from 'react';
import Marquee from 'react-fast-marquee';
import { Link, useLocation, useNavigate, useRouteLoaderData } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import SearchDialog from './SearchDialog';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isSearchInputVisible, setIsSearchInputVisible] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pageHasHero, setPageHasHero] = useState(false);
  const [openedDropdown, setOpenedDropdown] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { categories } = useRouteLoaderData('root');
  const { user, signOut } = useAuth();

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setPageHasHero(!!document.querySelector('#hero'));
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    setPageHasHero(!!document.querySelector('#hero'));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearchSubmit = e => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const q = (fd.get('search') || '').toString().trim();
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput.trim()), 500);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    if (!debouncedSearch) return;
    const currentQ = new URLSearchParams(location.search).get('q') || '';
    if (location.pathname === '/search' && currentQ === debouncedSearch) return;
    navigate(`/search?q=${encodeURIComponent(debouncedSearch)}`);
  }, [debouncedSearch]);

  const isBgCream = !pageHasHero || openedDropdown || scrolled;
  const isTextDark = isBgCream || mobileOpen;

  return (
    <LayoutGroup>
      <Transition
        show={!!openedDropdown}
        className="z-50 duration-150 ease-in-out data-closed:opacity-0"
      >
        <div className="fixed inset-0 bg-black opacity-50"></div>
      </Transition>
      <motion.header
        layout
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={clsx(
          'top-0 z-50 w-full transition-colors duration-150',
          pageHasHero ? 'fixed' : 'sticky',
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
                'border border-[#cbcbcb] py-2 text-[11px] font-bold uppercase',
                pageHasHero && isTextDark ? 'text-dark' : 'text-white',
                !pageHasHero && 'bg-dark'
              )}
            >
              <Marquee autoFill>
                <div className="ml-10 size-[.5em] bg-current"></div>
                <span className="mx-8">Free shipping on orders over 50 EUR</span>
                <div className="mr-10 size-[.5em] bg-current"></div>
                <div className="ml-10 size-[.5em] bg-current"></div>
                <span className="mx-8">Delivery within 3-6 business days</span>
                <div className="mr-10 size-[.5em] bg-current"></div>
              </Marquee>
            </motion.div>
          )}

          {/* Navbar */}
          <motion.div
            key="navbar"
            layout
            className={clsx(
              'flex items-center justify-between border-b border-[#cbcbcb] px-7',
              isBgCream ? 'bg-cream' : 'bg-transparent'
            )}
          >
            {/* Logo */}
            <Link to="/" className="mx-4 py-4 text-xl leading-tight font-bold">
              <img
                className={clsx('duration-150', !isTextDark && 'invert')}
                src="/icons/logo.svg"
                alt="HALO"
              />
            </Link>

            {/* Navigation */}
            <nav
              className={clsx(
                'hidden h-full space-x-3.5 text-[13px] font-semibold uppercase lg:flex',
                openedDropdown && 'text-dark/50 *:transition-colors *:duration-250 *:ease-in-out'
              )}
            >
              {categories.map(({ title, uri, subcategories }, index) => (
                <Fragment key={index}>
                  <div
                    className={openedDropdown === title ? 'text-dark' : undefined}
                    onMouseOver={() => setOpenedDropdown(title)}
                    onMouseLeave={() => setOpenedDropdown('')}
                    to={uri}
                  >
                    <Link className="block py-6" to={uri}>
                      {title}
                    </Link>
                    <Transition
                      show={openedDropdown === title}
                      className="transition duration-150 ease-in-out data-closed:opacity-0"
                    >
                      <div className="bg-cream text-dark absolute inset-x-0 top-full min-h-[50vh] px-9 py-7">
                        <ul className="grid grid-cols-2 gap-4">
                          {subcategories.map(({ title, id }, index) => (
                            <li key={index}>
                              <Link className="hover:text-dark" to={`/${id}`}>
                                {title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Transition>
                  </div>
                  {index !== categories.length - 1 && <span className="py-6">/</span>}
                </Fragment>
              ))}
            </nav>

            {/* Icons */}
            <div className="relative flex items-center space-x-4 py-4">
              <form
                onSubmit={handleSearchSubmit}
                className="absolute right-full hidden lg:flex"
                onMouseOver={() => setIsSearchInputVisible(true)}
              >
                <button type="submit">
                  <Search size={18} />
                </button>
                {isSearchInputVisible && (
                  <input
                    className="pl-4 text-xs placeholder:text-inherit focus:outline-0 focus:placeholder:opacity-0"
                    type="search"
                    name="search"
                    placeholder="SEARCH"
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                  />
                )}
              </form>
              <button className="lg:hidden" type="button" onClick={() => setSearchDialogOpen(true)}>
                <Search size={18} />
              </button>
              <div className="group -ml-2 *:px-2">
                <Link to="/favorites" className="group-hover:*:opacity-50 hover:*:opacity-100">
                  <Bookmark className="inline-block transition-opacity duration-250" size={18} />
                </Link>
                <span className="group/profile">
                  <Link
                    to={user ? '/profile' : '/login'}
                    className="group-hover:*:opacity-50 group-hover/profile:*:opacity-100"
                  >
                    <User className="inline-block transition-opacity duration-250" size={18} />
                  </Link>
                  {user && (
                    <div className="absolute top-9 -right-5 hidden pt-10 lg:group-hover/profile:block">
                      <div className="flex min-w-50 flex-col rounded-[10px] bg-white px-6 py-5">
                        <Link
                          to="/profile"
                          className="hover:bg-dark text-dark block px-4 py-2.5 text-sm hover:text-white"
                        >
                          My Account
                        </Link>
                        <Link
                          to="/orders"
                          className="hover:bg-dark text-dark block px-4 py-2.5 text-sm hover:text-white"
                        >
                          My Purchases
                        </Link>
                        <button
                          onClick={signOut}
                          className="hover:bg-dark text-dark block px-4 py-2.5 text-start text-sm hover:text-white"
                          type="button"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </span>
                <Link to="/cart" className="group-hover:*:opacity-50 hover:*:opacity-100">
                  <ShoppingBag className="inline-block transition-opacity duration-250" size={18} />
                </Link>
              </div>
              <button
                className="lg:hidden"
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.header>
      {/* Mobile */}
      <SearchDialog open={searchDialogOpen} setOpen={setSearchDialogOpen} />
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.2 }}
            className="bg-cream text-dark fixed inset-0 z-10 flex h-[150vh] lg:hidden"
          >
            <div className="w-64 p-6 pt-20">
              <nav className="mt-8 flex flex-col space-y-4">
                {categories.map(({ title, uri }, index) => (
                  <Link key={index} to={uri} className="text-2xl font-bold uppercase">
                    {title}
                  </Link>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
};

export default Header;
