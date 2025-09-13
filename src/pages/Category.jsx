import { useCallback, useMemo } from 'react';
import { useParams, useRouteLoaderData } from 'react-router';
import ProductListingPage from '../components/ProductListingPage';
import { applyFiltersAndSort } from '../utils/products';
import supabase from '../utils/supabase';
import NotFound from './NotFound';

const Category = () => {
  const { id } = useParams();
  const { categories } = useRouteLoaderData('root');

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

  const fetcher = useCallback(
    async ({ from, to, filters, sort }) => {
      const query = applyFiltersAndSort(
        supabase
          .from('products')
          .select('*, product_images(*), product_colors(color_id)', { count: 'exact' })
          .in('product_images.type', imageTypes)
          .or(`category_id.eq.${id}, subcategory_id.eq.${id}`),
        filters,
        sort
      );

      const { data, error, count } = await query.range(from, to);
      if (error) throw error;
      return { items: data || [], count: count || 0 };
    },
    [id]
  );

  if (!category) return <NotFound />;

  return (
    <ProductListingPage
      resetKey={id}
      header={
        category.image ? (
          <img
            className="h-[50vh] w-full object-cover brightness-75"
            src={category.image}
            alt={category.title}
            id="hero"
          />
        ) : null
      }
      fetcher={fetcher}
      renderLeftLabel={total => `${total} products`}
    />
  );
};

export default Category;
