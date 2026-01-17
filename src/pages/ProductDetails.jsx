import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import clsx from 'clsx';
import {
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ShoppingBag,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useParams } from 'react-router';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import Loading from '../components/Loading';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useFavorites } from '../hooks/useFavorites';
import supabase from '../utils/supabase';
import NotFound from './NotFound';

const ProductDetails = () => {
  const { slug } = useParams();
  const { loading: authLoading, user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColorId, setSelectedColorId] = useState(null);
  const [productIsFavorite, setProductIsFavorite] = useState(false);
  const [favoriteReady, setFavoriteReady] = useState(false);

  const { loading: favoritesLoading, isFavorite, toggleFavorite } = useFavorites();

  const { loading: cartLoading, addItem: addToCart } = useCart();

  useEffect(() => {
    (async () => {
      if (authLoading) return;
      const { data, error } = await supabase
        .from('products')
        .select('*, product_images(*), colors(*)')
        .eq('slug', slug)
        .maybeSingle();
      if (error) {
        console.error('Error loading product:', error);
        setProduct(null);
      } else {
        console.log(data);
        setProduct(data);
      }
      setLoading(false);
    })();
  }, [slug, authLoading]);

  useEffect(() => {
    if (!product) return;
    if (Array.isArray(product.sizes) && product.sizes.length > 0) {
      setSelectedSize(prev => (prev && product.sizes.includes(prev) ? prev : product.sizes[0]));
    } else {
      setSelectedSize(null);
    }
    if (Array.isArray(product.colors) && product.colors.length > 0) {
      setSelectedColorId(prev => {
        const match = product.colors.find(color => color.id === prev);
        return match ? prev : (product.colors[0]?.id ?? null);
      });
    } else {
      setSelectedColorId(null);
    }
  }, [product]);

  useEffect(() => {
    let cancelled = false;

    if (!product) {
      setFavoriteReady(false);
      setProductIsFavorite(false);
      return undefined;
    }

    setFavoriteReady(false);

    const refreshFavoriteState = async () => {
      try {
        const result = await isFavorite(product.id);
        if (!cancelled) {
          setProductIsFavorite(result);
          setFavoriteReady(true);
        }
      } catch (error) {
        console.error('Error checking favorite state:', error);
        if (!cancelled) {
          setFavoriteReady(true);
        }
      }
    };

    refreshFavoriteState();

    return () => {
      cancelled = true;
    };
  }, [isFavorite, product, user?.id]);

  if (authLoading) return null;

  const favoriteSpinner = favoritesLoading || !favoriteReady;
  const sizeRequired = Array.isArray(product?.sizes) && product.sizes.length > 0;
  const colorRequired = Array.isArray(product?.colors) && product.colors.length > 0;
  const canAddToCart =
    !!product && (!sizeRequired || !!selectedSize) && (!colorRequired || selectedColorId !== null);

  const selectedColor =
    product && selectedColorId !== null
      ? (product.colors?.find(color => color.id === selectedColorId) ?? null)
      : null;

  const handleToggleFavorite = () => {
    if (!product) return;
    toggleFavorite(product.id)
      .then(result => {
        setProductIsFavorite(result);
        setFavoriteReady(true);
      })
      .catch(() => {});
  };

  const handleAddToCart = () => {
    if (!product || !canAddToCart) return;
    addToCart(product, { size: selectedSize, colorId: selectedColorId }).catch(() => {});
  };

  return loading ? (
    <Loading fixed backdrop />
  ) : product ? (
    <div className="flex w-full flex-col overflow-hidden lg:h-screen lg:flex-row">
      <div className="border-[#cbcbcb] lg:w-1/2 lg:border-r">
        <div className="relative h-full">
          <button
            onClick={handleToggleFavorite}
            disabled={favoriteSpinner || !product}
            className="absolute z-10 mt-5 ml-8 flex size-10 items-center justify-center rounded-full bg-white duration-150 hover:bg-[#ff6600] disabled:cursor-not-allowed disabled:opacity-60"
            type="button"
          >
            {favoriteSpinner ? (
              <Loader2 size={20} className="animate-spin" />
            ) : productIsFavorite ? (
              <BookmarkCheck size={20} />
            ) : (
              <Bookmark size={20} />
            )}
          </button>
          <Swiper
            className="group relative h-full cursor-pointer **:h-full"
            modules={[Navigation]}
            navigation={{ prevEl: '.btn-prev', nextEl: '.btn-next', disabledClass: 'btn-disabled' }}
            spaceBetween={10}
          >
            {product.product_images?.map(image => (
              <SwiperSlide className="**:w-full **:object-contain" key={image.id}>
                <LazyLoadImage
                  src={`${image.url}?sw=700&sh=930&q=80`}
                  placeholderSrc={`${image.url}?sw=70&sh=93&q=80`}
                  alt={product.name}
                />
              </SwiperSlide>
            ))}
            <div className="btn-prev btn-disabled text-dark absolute top-1/2 left-6 z-10 hidden -translate-y-1/2 group-hover:not-[.btn-disabled]:block">
              <ChevronLeft />
            </div>
            <div className="btn-next text-dark absolute top-1/2 right-6 z-10 hidden -translate-y-1/2 group-hover:not-[.btn-disabled]:block">
              <ChevronRight />
            </div>
          </Swiper>
        </div>
      </div>
      <div className="h-full overflow-auto px-4 pt-15 lg:m-auto lg:w-125">
        {(product.price_old || (product.tags ?? []).length > 0) && (
          <div className="flex items-start gap-2 pb-6 text-[9px] font-bold uppercase lg:text-[11px]">
            {product.price_old && (
              <span className="rounded-xl bg-orange-500 px-2 py-1 text-white">sale</span>
            )}
            {(product.tags ?? []).map(tag => (
              <span className="rounded-xl bg-white px-2 py-1" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        )}
        <h1 className="mb-2 text-2xl font-bold tracking-tight uppercase">{product.name}</h1>
        <h2 className="flex gap-2 font-bold">
          <span>{product.price_current} EUR</span>
          {product.price_old && (
            <span className="text-[#6a6967] line-through">{product.price_old} EUR</span>
          )}
        </h2>

        <div className="py-6 uppercase">
          <p className="text-dark/63 mb-2.5 text-[9px]">Show on model</p>
          <div className="flex items-center gap-2.5 text-xs font-bold">
            <div className="bg-dark rounded-3xl border border-[#6a6967] px-4 py-2 text-white">
              Men
            </div>
            <span>/</span>
            <div className="rounded-3xl border border-[#6a6967] px-4 py-2 duration-300 hover:bg-[#6a6967] hover:text-white">
              Women
            </div>
          </div>
        </div>

        {sizeRequired && (
          <div className="mb-6">
            <p className="mb-2 text-xs font-bold uppercase">Select size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={clsx(
                    'rounded-3xl border px-4 py-2 text-xs uppercase duration-150',
                    selectedSize === size
                      ? 'border-black bg-black text-white'
                      : 'border-[#dad9d7] bg-white text-black hover:border-black'
                  )}
                  type="button"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {colorRequired && (
          <div className="mb-6">
            <p className="mb-2 text-xs font-bold uppercase">Select color</p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map(color => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColorId(color.id)}
                  className={clsx(
                    'rounded-3xl border px-4 py-2 text-xs capitalize duration-150',
                    selectedColorId === color.id
                      ? 'border-black bg-black text-white'
                      : 'border-[#dad9d7] bg-white text-black hover:border-black'
                  )}
                  type="button"
                >
                  {color.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedColor && (
          <p className="mb-4 text-xs text-[#6a6967] uppercase">
            Selected color: <span className="font-semibold text-black">{selectedColor.name}</span>
          </p>
        )}

        <button
          className="btn mb-6 text-xs disabled:cursor-not-allowed disabled:opacity-70"
          onClick={handleAddToCart}
          disabled={!canAddToCart || cartLoading}
          type="button"
        >
          {cartLoading ? <Loader2 size={20} className="animate-spin" /> : <ShoppingBag size={20} />}
          Add to basket
        </button>

        <TabGroup>
          <TabList
            className={clsx(
              'mb-4 flex text-xs font-bold',
              '*:border *:border-[#dad9d7] *:px-2 *:py-1 *:text-[#848380] *:uppercase *:focus:outline-0',
              '*:data-selected:text-dark *:data-selected:border-[#cbcbcb] *:data-selected:bg-[#d8d4c8]'
            )}
          >
            <Tab>Description</Tab>
            <Tab>Shipping & Returns</Tab>
            <Tab>Washing & Materials</Tab>
          </TabList>
          <TabPanels className="h-45 overflow-auto">
            <TabPanel>{product.description}</TabPanel>
            <TabPanel>
              <ul className="list-inside list-disc">
                <li>Free shipping on all orders over 50 EUR</li>
                <li>
                  <a href="https://www.newlinehalo.com/returns">Easy returns</a>
                </li>
              </ul>
            </TabPanel>
            <TabPanel>
              <div className="flex items-end gap-2">
                <img
                  className="size-[30px]"
                  title="Machine wash at 40 degrees"
                  src="https://www.newlinehalo.com/on/demandware.static/Sites-halo-Site/-/default/dwc10a19cf/images/careguides/A-W40.png"
                  alt="Machine wash at 40 degrees"
                />
                <p>Machine wash at 40 degrees</p>
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  ) : (
    <NotFound />
  );
};

export default ProductDetails;
