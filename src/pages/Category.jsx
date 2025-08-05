import { ChevronDown, ListFilter } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useRouteLoaderData } from 'react-router';
import Loading from '../components/Loading';
import ProductCard from '../components/ProductCard';
import supabase from '../utils/supabase';
import NotFound from './NotFound';

const Category = () => {
  const [totalProductCount, setTotalProductCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const imageTypes = [id.match(/men|women/)?.[0], 'packshot'].filter(Boolean);
    const getProducts = async () => {
      try {
        const {
          data: products,
          error,
          count,
        } = await supabase
          .from('products')
          .select('*, product_images(*), product_colors(color_id)', { count: 'exact' })
          .in('product_images.type', imageTypes)
          .or(`category_id.eq.${id}, subcategory_id.eq.${id}`)
          .range(0, 31);
        if (error) throw error;
        setTotalProductCount(count);
        setProducts(products);
      } catch (err) {
        console.error('Error loading products:', err.message);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, [id]);

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
            <button className="hidden items-center gap-px md:flex">
              <span className="leading-snug">FILTERS</span>
              <ListFilter size={16} />
            </button>
            <button className="flex items-center gap-1">
              <span className="uppercase">We recommend</span>
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
            {totalProductCount > products.length && (
              <button className="btn text-dark [--btn-bg:#fff]">
                Load more (
                {totalProductCount - products.length < 32
                  ? totalProductCount - products.length
                  : 32}
                )
              </button>
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
    </div>
  );
};

export default Category;
