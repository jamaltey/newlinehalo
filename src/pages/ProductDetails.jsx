import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import clsx from 'clsx';
import { Bookmark, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useParams } from 'react-router';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import Loading from '../components/Loading';
import supabase from '../utils/supabase';
import NotFound from './NotFound';

const ProductDetails = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('products')
        .select('*, product_images(*), colors(*)')
        .eq('slug', slug)
        .single();
      setProduct(data);
      setLoading(false);
      console.log(data);
    })();
  }, [slug]);

  return loading ? (
    <Loading fixed backdrop />
  ) : product ? (
    <div className="flex w-full flex-col overflow-hidden lg:h-screen lg:flex-row">
      <div className="border-[#cbcbcb] pt-25 lg:w-1/2 lg:border-r">
        <div className="relative h-full">
          <button className="absolute z-10 mt-5 ml-8 flex size-10 items-center justify-center rounded-full bg-white duration-150 hover:bg-[#ff6600]">
            <Bookmark size={20} />
          </button>
          <Swiper
            className="group relative h-full cursor-pointer **:h-full"
            modules={[Navigation]}
            navigation={{ prevEl: '.btn-prev', nextEl: '.btn-next', disabledClass: 'btn-disabled' }}
            spaceBetween={10}
          >
            {product.product_images.map(image => (
              <SwiperSlide className="**:w-full **:object-contain" key={image.id}>
                <LazyLoadImage
                  src={`${image.url}?sw=700&sh=930&q=80`}
                  placeholderSrc={`${image.url}?sw=70&sh=93&q=80`}
                  alt={name}
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
      <div className="h-full overflow-auto px-4 pt-5 lg:m-auto lg:w-125 lg:pt-40">
        {(product.price_old || product.tags.length > 0) && (
          <div className="flex items-start gap-2 pb-6 text-[9px] font-bold uppercase lg:text-[11px]">
            {product.price_old && (
              <span className="rounded-xl bg-orange-500 px-2 py-1 text-white">sale</span>
            )}
            {product.tags.map(tag => (
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
        <button className="btn mb-6 text-xs">
          <ShoppingBag size={20} />
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
