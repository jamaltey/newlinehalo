import { ChevronDown, ListFilter } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { DEFAULT_FILTERS, SORT_OPTIONS } from '../constants/products';
import FiltersDialog from './FiltersDialog';
import Loading from './Loading';
import ProductCard from './ProductCard';
import SortDialog from './SortDialog';

const ProductListingPage = ({
  header = null,
  resetKey,
  fetcher,
  renderLeftLabel,
  emptyMessage = 'No products found',
}) => {
  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sortOpen, setSortOpen] = useState(false);
  const [sort, setSort] = useState('recommended');

  useEffect(() => {
    setFilters(DEFAULT_FILTERS);
    setSort('recommended');
  }, [resetKey]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setProducts([]);
    fetcher({ from: 0, to: 31, filters, sort })
      .then(({ items, count }) => {
        if (cancelled) return;
        setProducts(items);
        setTotal(count || 0);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fetcher, resetKey, filters, sort]);

  const loadMore = useCallback(async () => {
    setLoadingMore(true);
    const from = products.length;
    const to = from + 31;
    const { items } = await fetcher({ from, to, filters, sort });
    setProducts(prev => [...prev, ...items]);
    setLoadingMore(false);
  }, [products.length, fetcher, filters, sort]);

  const sortLabel = useMemo(() => SORT_OPTIONS.find(s => s.id === sort)?.label || '', [sort]);

  return (
    <div className={header ? undefined : 'pt-15'}>
      {header}

      {loading ? (
        <div className="relative pt-[50vh]">
          <Loading />
        </div>
      ) : total ? (
        <>
          <div className="text-dark flex justify-between border-b border-[#cbcbcb] p-5 text-[11px] font-bold uppercase">
            <span>{renderLeftLabel ? renderLeftLabel(total) : `${total} products`}</span>
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
              <span className="uppercase">{sortLabel}</span>
              <ChevronDown size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, index) => (
              <ProductCard {...product} key={index} />
            ))}
          </div>
          <div className="space-y-3 p-9 text-center">
            <p className="text-xs font-bold uppercase">
              Showing {products.length} of {total}
            </p>
            {total > products.length && !loadingMore && (
              <button onClick={loadMore} className="btn text-dark [--btn-bg:#fff]">
                Load more ({total - products.length < 32 ? total - products.length : 32})
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
          <h2 className="mb-4 text-4xl font-medium">{emptyMessage}</h2>
          <Link to="/" className="btn text-dark [--btn-bg:#fff]">
            Back to home
          </Link>
        </div>
      )}

      <FiltersDialog
        open={filtersOpen}
        setOpen={setFiltersOpen}
        filters={filters}
        setFilters={setFilters}
        totalCount={total}
      />
      <SortDialog open={sortOpen} setOpen={setSortOpen} sort={sort} setSort={setSort} />
    </div>
  );
};

export default ProductListingPage;
