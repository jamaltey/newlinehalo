import clsx from 'clsx';
import { Link } from 'react-router';

/**
 * @param {{ imageSrc: string, link: string, title?: string, label?: string, labelLarge?: boolean , textBlack?: boolean, showLinkIcon?: boolean , className?: string }} props
 */
const ProductFeatureCard = ({
  imageSrc,
  link,
  title = '',
  label = '',
  labelProminent = false,
  textBlack = false,
  showLinkIcon = true,
  className = '',
}) => {
  return (
    <div className={clsx('relative uppercase', textBlack ? 'text-black' : 'text-white', className)}>
      <Link to={link} aria-label={label || title}>
        <img
          className="h-full w-full object-cover"
          src={imageSrc}
          loading="lazy"
          alt={label || title || 'Image'}
        ></img>
        {title && (
          <h4 className="absolute top-1/2 left-1/2 -translate-1/2 text-[2rem] font-bold">
            {title}
          </h4>
        )}
        <div className="absolute bottom-0 flex w-full items-end p-7.5">
          {label && (
            <p
              className={
                labelProminent ? 'text-[2rem] font-bold' : 'text-[13px] font-medium md:text-[15px]'
              }
            >
              {label}
            </p>
          )}
          {showLinkIcon && (
            <img
              className={clsx('ml-auto size-10 cursor-pointer', textBlack && 'invert-100')}
              src="/icons/link.svg"
              loading="lazy"
              alt=""
              aria-hidden="true"
            />
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductFeatureCard;
