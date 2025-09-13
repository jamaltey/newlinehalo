import { useCallback } from 'react';
import { useSearchParams } from 'react-router';
import ProductListingPage from '../components/ProductListingPage';
import { applyFiltersAndSort } from '../utils/products';
import supabase from '../utils/supabase';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const q = (searchParams.get('q') || '').trim();

  const fetcher = useCallback(
    async ({ from, to, filters, sort }) => {
      const query = applyFiltersAndSort(
        supabase
          .from('products')
          .select('*, product_images(*), product_colors(color_id)', { count: 'exact' })
          .ilike('name', `%${q}%`),
        filters,
        sort
      );

      const { data, error, count } = await query.range(from, to);
      if (error) throw error;
      return { items: data || [], count: count || 0 };
    },
    [q]
  );

  return (
    <ProductListingPage
      resetKey={q}
      fetcher={fetcher}
      renderLeftLabel={total =>
        `${total} ${q ? 'result' : 'product'}${total === 1 ? '' : 's'} ${q ? `for "${q}"` : ''}`
      }
    />
  );
};

export default SearchResults;
