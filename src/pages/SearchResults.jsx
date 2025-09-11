import { ChevronDown, ListFilter } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import FiltersDialog from '../components/FiltersDialog';
import ProductGrid from '../components/ProductGrid';
import SortDialog from '../components/SortDialog';
import { DEFAULT_FILTERS, PRICE_RANGES, SORT_OPTIONS } from '../constants/products';
import Loading from '../components/Loading';
import supabase from '../utils/supabase';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const q = (searchParams.get('q') || '').trim();

  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sortOpen, setSortOpen] = useState(false);
  const [sort, setSort] = useState('recommended');

  const getProducts = async (from = 0, to = 31) => {
    if (!q) {
      setLoading(false);
      setTotal(0);
      return [];
    }

    let query = supabase
      .from('products')
      .select('*, product_images(*), product_colors(color_id)', { count: 'exact' })
      .in('product_images.type', ['packshot'])
      .ilike('name', `%${q}%`);

    if (filters.priceRanges.length) {
      const selectedExprs = PRICE_RANGES.filter(r => filters.priceRanges.includes(r.id)).map(r => r.expr);
      query = query.or(selectedExprs.join(','));
    }
    if (filters.onSale) {
      query = query.not('price_old', 'is', null);
    }

    if (sort === 'newest') {
      query = query.order('created_at', { ascending: false });
    } else if (sort === 'price_asc') {
      query = query.order('price_current', { ascending: true });
    } else if (sort === 'price_desc') {
      query = query.order('price_current', { ascending: false });
    }

    const { data, error, count } = await query.range(from, to);
    if (error) throw error;
    setTotal(count);
    setLoading(false);
    return data;
  };

  useEffect(() => {
    // reset on query change
    setFilters(DEFAULT_FILTERS);
    setSort('recommended');
  }, [q]);

  useEffect(() => {
    setLoading(true);
    setProducts([]);
    getProducts()
      .then(setProducts)
      .catch(() => setLoading(false));
  }, [q, filters, sort]);

  const loadMore = async () => {
    setLoadingMore(true);
    const from = products.length;
    const to = from + 31;
    const newProducts = await getProducts(from, to);
    setProducts(prev => [...prev, ...newProducts]);
    setLoadingMore(false);
  };

  return (
    <div className="pt-40">
      {!q ? (
        <div className="flex min-h-[70vh] flex-col items-center justify-center">
          <h2 className="mb-4 text-4xl font-medium">Start typing to search</h2>
          <Link to="/" className="btn text-dark [--btn-bg:#fff]">
            Back to home
          </Link>
        </div>
      ) : loading ? (
        <div className="relative pt-[50vh]">
          <Loading />
        </div>
      ) : total ? (
        <>
          <div className="text-dark flex justify-between border-b border-[#cbcbcb] p-5 text-[11px] font-bold uppercase">
            <span>
              {total} result{total === 1 ? '' : 's'} for "{q}"
            </span>
            <button onClick={() => setFiltersOpen(true)} className="hidden items-center gap-px md:flex">
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
          <ProductGrid
            products={products}
            total={total}
            loading={false}
            loadingMore={loadingMore}
            onLoadMore={loadMore}
            emptyMessage="No products found"
          />
        </>
      ) : (
        <div className="flex min-h-[70vh] flex-col items-center justify-center">
          <h2 className="mb-4 text-4xl font-medium">No products found</h2>
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

export default SearchResults;
