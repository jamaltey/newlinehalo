import clsx from 'clsx';
import { Link } from 'react-router';

/**
 * @param {{ imageSrc: string, label: string, link: string, textBlack?: boolean, showLinkIcon?: boolean , className?: string }} props
 */
const ProductFeatureCard = ({ imageSrc, label, link, textBlack = false, showLinkIcon = true, className = '' }) => {
  return (
    <div className={clsx('relative uppercase', className)}>
      <Link to={link} aria-label={label}>
        <img className="h-full w-full object-cover" src={imageSrc} loading="lazy" alt={label}></img>
        <div className="absolute bottom-0 flex w-full items-end justify-between p-7.5">
          <p className={clsx('text-[13px] font-medium md:text-[15px]', textBlack ? 'text-black' : 'text-white')}>{label}</p>
          {showLinkIcon && (
            <img
              className={clsx('h-10 w-10 cursor-pointer', textBlack && 'invert-100')}
              src="icons/link.svg"
              loading="lazy"
              alt=""
              aria-hidden
            />
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductFeatureCard;
