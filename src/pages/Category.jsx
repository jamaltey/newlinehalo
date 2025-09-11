import { CloseButton, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import clsx from 'clsx';
import { ChevronDown, ListFilter, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useRouteLoaderData } from 'react-router';
import Loading from '../components/Loading';
import ProductCard from '../components/ProductCard';
import supabase from '../utils/supabase';
import NotFound from './NotFound';
import {
  DEFAULT_FILTERS,
  PRICE_RANGES,
  SORT_OPTIONS,
  areArraySetsEqual,
  areFiltersEqual,
} from '../constants/products';

const Category = () => {
  const { id } = useParams();
  const { categories } = useRouteLoaderData('root');
  const [totalProductCount, setTotalProductCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sortOpen, setSortOpen] = useState(false);
  const [sort, setSort] = useState('recommended');

  const category = useMemo(
    () =>
      categories.find(cat => cat.id === id) ||
      categories
        .map(cat => cat.subcategories)
        .flat()
        .find(sub => sub.id === id || sub.uri === id),
    [categories, id]
  );

  const imageTypes = [id.match(/men|women/)?.[0], 'packshot'].filter(Boolean);

  const getProducts = async (from = 0, to = 31) => {
    let query = supabase
      .from('products')
      .select('*, product_images(*), product_colors(color_id)', { count: 'exact' })
      .in('product_images.type', imageTypes)
      .or(`category_id.eq.${id}, subcategory_id.eq.${id}`);

    if (filters.priceRanges.length) {
      const selectedExprs = PRICE_RANGES.filter(r => filters.priceRanges.includes(r.id)).map(
        r => r.expr
      );
      query = query.or(selectedExprs.join(','));
    }
    if (filters.onSale) {
      query = query.not('price_old', 'is', null);
    }

    // Apply sorting
    if (sort === 'newest') {
      query = query.order('created_at', { ascending: false });
    } else if (sort === 'price_asc') {
      query = query.order('price_current', { ascending: true });
    } else if (sort === 'price_desc') {
      query = query.order('price_current', { ascending: false });
    }

    const { data: products, error, count } = await query.range(from, to);
    if (error) throw error;
    setTotalProductCount(count);
    setLoading(false);
    return products;
  };

  useEffect(() => {
    // Reset filters when category changes, but only if not already default
    setFilters(prev => (areFiltersEqual(prev, DEFAULT_FILTERS) ? prev : DEFAULT_FILTERS));
    setSort('recommended');
  }, [id]);

  useEffect(() => {
    setLoading(true);
    setProducts([]);
    getProducts()
      .then(setProducts)
      .catch(() => setLoading(false));
  }, [id, filters, sort]);

  const loadMore = async () => {
    setLoadingMore(true);
    const from = products.length;
    const to = from + 31;
    const newProducts = await getProducts(from, to);
    setProducts(prev => [...prev, ...newProducts]);
    setLoadingMore(false);
  };

  if (!category) return <NotFound />;

  return (
    <div className={category.image ? undefined : 'pt-40'}>
      {category.image && (
        <img
          className="h-[50vh] w-full object-cover brightness-75"
          src={category.image}
          alt={category.title}
          id="hero"
        />
      )}
      {loading ? (
        <div className="relative pt-[50vh]">
          <Loading />
        </div>
      ) : totalProductCount ? (
        <>
          <div className="text-dark flex justify-between border-b border-[#cbcbcb] p-5 text-[11px] font-bold uppercase">
            <span>{totalProductCount} products</span>
            <button
              onClick={() => setFiltersOpen(true)}
              className="hidden items-center gap-px md:flex"
            >
              <span className="leading-snug">FILTERS</span>
              <ListFilter size={16} />
            </button>
            <button
              onClick={() => setFiltersOpen(true)}
              className="btn fixed bottom-5 left-1/2 z-50 -translate-x-1/2 gap-1 p-2.5 md:hidden"
            >
              <span className="leading-snug">FILTERS</span>
              <ListFilter size={16} />
            </button>
            <button className="flex items-center gap-1" onClick={() => setSortOpen(true)}>
              <span className="uppercase">{SORT_OPTIONS.find(s => s.id === sort)?.label}</span>
              <ChevronDown size={16} />
            </button>
          </div>
          {products.length ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product, index) => (
                <ProductCard {...product} key={index} />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[70vh] items-center justify-center">
              <h2 className="text-4xl font-medium">No products found</h2>
            </div>
          )}
          <div className="space-y-3 p-9 text-center">
            <p className="text-xs font-bold uppercase">
              Showing {products.length} of {totalProductCount}
            </p>
            {totalProductCount > products.length && !loadingMore && (
              <button onClick={loadMore} className="btn text-dark [--btn-bg:#fff]">
                Load more (
                {totalProductCount - products.length < 32
                  ? totalProductCount - products.length
                  : 32}
                )
              </button>
            )}
            {loadingMore && (
              <div className="relative mx-auto size-12">
                <Loading />
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex min-h-[70vh] flex-col items-center justify-center">
          <h2 className="mb-4 text-4xl font-medium">No products found</h2>
          <Link to="/" className="btn text-dark [--btn-bg:#fff]">
            Back to home
          </Link>
        </div>
      )}
      {/* Filters */}
      <Dialog open={filtersOpen} onClose={() => setFiltersOpen(false)}>
        <DialogBackdrop
          transition
          className={clsx(
            'fixed inset-0 z-50 bg-[#817d734c]',
            'duration-150 data-closed:opacity-0'
          )}
        />
        <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:justify-end">
          <DialogPanel
            transition
            className={clsx(
              'm-4 h-[60vh] w-[95vw] data-closed:m-0 md:h-[95vh] md:w-[40vw] lg:w-[25vw]',
              'duration-300 ease-in-out max-md:data-closed:translate-y-full md:data-closed:translate-x-full',
              'bg-cream flex flex-col rounded-lg p-7.5 uppercase [box-shadow:0_.313em_.938em_#00000080]'
            )}
          >
            <div className="flex justify-between py-4">
              <DialogTitle className="text-[15px] font-bold">Filters</DialogTitle>
              <CloseButton>
                <X size={16} />
              </CloseButton>
            </div>
            <div className="space-y-3 overflow-auto pr-2">
              <h4 className="text-xs font-bold">Price</h4>
              <div className="flex flex-col gap-3 text-xs">
                {PRICE_RANGES.map(range => {
                  const checked = filters.priceRanges.includes(range.id);
                  return (
                    <label
                      key={range.id}
                      className="flex cursor-pointer items-center gap-3 select-none"
                    >
                      <input
                        type="checkbox"
                        className="size-3.5 cursor-pointer appearance-none border border-[#cbcbcb] checked:bg-[#ff6600]"
                        checked={checked}
                        onChange={() => {
                          setFilters(prev => {
                            const has = prev.priceRanges.includes(range.id);
                            const next = has
                              ? prev.priceRanges.filter(id => id !== range.id)
                              : [...prev.priceRanges, range.id];
                            if (areArraySetsEqual(prev.priceRanges, next)) return prev;
                            return { ...prev, priceRanges: next };
                          });
                        }}
                      />
                      <span className="text-dark text-[13px] font-bold">{range.label}</span>
                    </label>
                  );
                })}
              </div>
              <div className="flex items-center gap-3 pt-2">
                <input
                  id="onSale"
                  type="checkbox"
                  className="size-3.5 cursor-pointer appearance-none border border-[#cbcbcb] checked:bg-[#ff6600]"
                  checked={filters.onSale}
                  onChange={e => {
                    const checked = e.target.checked;
                    setFilters(prev =>
                      prev.onSale === checked ? prev : { ...prev, onSale: checked }
                    );
                  }}
                />
                <label htmlFor="onSale" className="cursor-pointer text-xs font-bold">
                  On Sale
                </label>
              </div>
            </div>
            <button
              className="mt-auto mb-5 text-sm font-bold uppercase underline"
              onClick={() => {
                if (!areFiltersEqual(filters, DEFAULT_FILTERS)) {
                  setFilters(DEFAULT_FILTERS);
                }
              }}
            >
              Clear Filters
            </button>
            <CloseButton className="btn text-sm" onClick={() => setFiltersOpen(false)}>
              Show results ({totalProductCount})
            </CloseButton>
          </DialogPanel>
        </div>
      </Dialog>
      {/* Sort dialog */}
      <Dialog open={sortOpen} onClose={() => setSortOpen(false)}>
        <DialogBackdrop
          transition
          className={clsx(
            'fixed inset-0 z-50 bg-[#817d734c]',
            'duration-150 data-closed:opacity-0'
          )}
        />
        <div className="fixed inset-0 z-50 flex items-end justify-center md:items-start md:justify-end">
          <DialogPanel
            transition
            className={clsx(
              'm-4 mt-4! w-[95vw] data-closed:m-0 md:w-[40vw] lg:w-[25vw]',
              'duration-300 ease-in-out max-md:data-closed:translate-y-full md:data-closed:translate-x-full',
              'bg-cream flex flex-col rounded-lg p-7.5 uppercase [box-shadow:0_.313em_.938em_#00000080]'
            )}
          >
            <div className="flex justify-between py-4">
              <DialogTitle className="text-[15px] font-bold">Sort Products</DialogTitle>
              <CloseButton>
                <X size={16} />
              </CloseButton>
            </div>
            <div className="space-y-5 overflow-auto py-5 hover:[&:has(button:hover)]:*:opacity-50">
              {SORT_OPTIONS.map(opt => {
                const selected = sort === opt.id;
                return (
                  <button
                    key={opt.id}
                    className={clsx(
                      'flex w-full items-center gap-3 text-[13px] font-medium uppercase',
                      'duration-200 hover:opacity-100!'
                    )}
                    onClick={() => {
                      setSort(opt.id);
                      setSortOpen(false);
                    }}
                  >
                    <span
                      className={clsx(
                        'inline-block size-3 border border-[#cbcbcb]',
                        selected && 'bg-[#ff6600]'
                      )}
                    />
                    <span>
                      {opt.title} // {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
};

export default Category;
