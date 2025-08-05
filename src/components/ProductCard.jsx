import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link } from 'react-router';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const ProductCard = ({
  id,
  name,
  slug,
  price_current,
  price_old,
  tags,
  product_images,
  product_colors,
}) => {
  return (
    <div
      className="flex flex-col border-r border-b border-[#cbcbcb] font-medium uppercase"
      data-product-slug={slug}
      data-product-id={id}
    >
      <div className="relative h-full border-b border-[#cbcbcb]">
        <div className="absolute top-2 left-2 flex flex-col items-start gap-1 text-[9px] lg:text-[11px]">
          {tags.map(tag => (
            <span className="rounded-xl bg-white px-2 py-1" key={tag}>
              {tag}
            </span>
          ))}
        </div>
        <Swiper
          className="group cursor-pointer"
          modules={[Navigation]}
          navigation={{ prevEl: '.btn-prev', nextEl: '.btn-next', disabledClass: 'btn-disabled' }}
          spaceBetween={10}
        >
          {product_images.map(image => (
            <SwiperSlide key={image.id}>
              <LazyLoadImage
                className="h-full w-full object-contain"
                src={`${image.url}?sw=700&sh=930&q=80`}
                placeholderSrc={`${image.url}?sw=70&sh=93&q=80`}
                alt={name}
              />
            </SwiperSlide>
          ))}
          <div className="btn-prev btn-disabled text-dark absolute top-1/2 left-2 z-10 hidden -translate-y-1/2 group-hover:not-[.btn-disabled]:block">
            <ChevronLeft size={16} />
          </div>
          <div className="btn-next text-dark absolute top-1/2 right-2 z-10 hidden -translate-y-1/2 group-hover:not-[.btn-disabled]:block">
            <ChevronRight size={16} />
          </div>
        </Swiper>
        <div className="text-dark/40 absolute right-2 bottom-2 text-xs">
          {product_colors.length} colors
        </div>
      </div>
      <div className="p-5">
        <Link className="text-sm">{name}</Link>
        <div className="flex gap-1 text-xs leading-1">
          {price_old && <span className="line-through">{price_old} €</span>}
          <span>{price_current} €</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
