import { Bookmark, BookmarkCheck, Loader2, Minus, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useFavorites } from '../hooks/useFavorites';

const CartItem = ({ item, onDecrease, onIncrease, onRemove, formatPrice }) => {
  const { toggleFavorite, isFavorite, loading: favoritesLoading } = useFavorites();
  const [productIsFavorite, setProductIsFavorite] = useState(false);

  const product = item.product;

  useEffect(() => {
    (async () => {
      const result = await isFavorite(product.id);
      setProductIsFavorite(result);
    })();
  }, [product.id, isFavorite]);

  const image = product?.product_images?.[0];
  const price = Number(product?.price_current) || 0;
  const itemTotal = price * item.quantity;

  const handleToggleFavorite = () => {
    if (!product) return;
    toggleFavorite(product.id).then(setProductIsFavorite);
  };

  return (
    <div className="border-b border-[#cbcbcb] pb-6 last:border-b-0 last:pb-0">
      <div className="mx-auto flex max-w-[90%] flex-col gap-6 md:max-w-screen md:flex-row">
        {image && (
          <Link
            to={`/products/${product.slug}`}
            className="flex h-52 w-full items-center justify-center rounded-3xl border border-[#e1e1e1] bg-[#f6f6f6] p-4 md:max-w-60"
          >
            <img
              src={`${image.url}?sw=350&sh=465&q=80`}
              alt={product.name}
              className="h-full w-full object-contain"
            />
          </Link>
        )}
        <div className="flex w-fit flex-1 flex-col items-start justify-between gap-4 pl-1 md:items-stretch md:pl-0">
          <div className="flex flex-col gap-1">
            <Link to={`/products/${product.slug}`} className="text-lg font-semibold uppercase">
              {product.name}
            </Link>
            <p className="text-sm text-[#6a6967]">
              Size: <span className="font-semibold text-black">{item.size ?? 'One size'}</span>
            </p>
            {item.color && (
              <p className="text-sm text-[#6a6967]">
                Color: <span className="font-semibold text-black">{item.color.name}</span>
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between xl:gap-0">
            <div className="flex items-center gap-4 text-sm">
              <button
                onClick={() => onRemove(item.key)}
                className="inline-flex items-center gap-1 underline"
                type="button"
              >
                <Trash2 size={16} />
                Remove
              </button>
              <button
                onClick={handleToggleFavorite}
                className="inline-flex items-center gap-1 underline"
                type="button"
              >
                {favoritesLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : productIsFavorite ? (
                  <>
                    <BookmarkCheck size={20} />
                    Saved to wishlist
                  </>
                ) : (
                  <>
                    <Bookmark size={20} />
                    Save for later
                  </>
                )}
              </button>
            </div>
            <div className="flex items-center gap-6 lg:max-xl:justify-between xl:gap-10">
              <span className="text-lg font-semibold">{formatPrice(itemTotal)}</span>
              <div className="flex items-center gap-3 rounded-3xl border border-[#cbcbcb] px-4 py-2">
                <button onClick={() => onDecrease(item)} className="text-lg" type="button">
                  <Minus size={16} />
                </button>
                <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                <button onClick={() => onIncrease(item)} className="text-lg" type="button">
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
