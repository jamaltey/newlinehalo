import { Bookmark, Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router';
import Loading from '../components/Loading';
import { useCart } from '../hooks/useCart';

const formatPrice = value => {
  const amount = Number(value) || 0;
  return `${amount.toFixed(2)} €`;
};

const Cart = () => {
  const { items, loading, initialized, count, subtotal, updateQuantity, removeItem } = useCart();

  const isBusy = loading || !initialized;
  const isEmpty = !isBusy && items.length === 0;
  const deliveryPrice = 0;
  const total = subtotal + deliveryPrice;

  const handleDecrease = item => {
    if (item.quantity <= 1) {
      removeItem(item.key).catch(() => {});
      return;
    }
    updateQuantity(item.key, item.quantity - 1).catch(() => {});
  };

  const handleIncrease = item => {
    updateQuantity(item.key, item.quantity + 1).catch(() => {});
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12">
      <Link to="/" className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase">
        <span className="text-lg">←</span> Continue shopping
      </Link>

      <h1 className="mb-2 text-center text-2xl font-bold uppercase">Cart</h1>
      <p className="mb-10 text-center text-sm">
        You have {count} product{count === 1 ? '' : 's'} in your basket
      </p>

      {isBusy ? (
        <div className="relative mx-auto h-50">
          <Loading />
        </div>
      ) : isEmpty ? (
        <div className="rounded-3xl border border-dashed border-[#cbcbcb] p-12 text-center">
          <p className="text-sm">
            Your basket is empty.{' '}
            <Link to="/" className="underline">
              Continue shopping
            </Link>{' '}
            to find something you love.
          </p>
        </div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="space-y-12">
            {items.map(item => {
              const product = item.product;
              const image = product?.product_images?.[0];
              const price = Number(product?.price_current) || 0;
              const itemTotal = price * item.quantity;
              return (
                <div
                  key={item.key}
                  className="border-b border-[#cbcbcb] pb-6 last:border-b-0 last:pb-0"
                >
                  <div className="flex flex-col gap-6 md:flex-row">
                    {image && (
                      <Link
                        to={`/products/${product.slug}`}
                        className="flex h-52 w-full max-w-60 items-center justify-center rounded-3xl border border-[#e1e1e1] bg-[#f6f6f6] p-4"
                      >
                        <img
                          src={`${image.url}?sw=350&sh=465&q=80`}
                          alt={product.name}
                          className="h-full w-full object-contain"
                        />
                      </Link>
                    )}
                    <div className="flex flex-1 flex-col justify-between gap-4">
                      <div className="flex flex-col gap-1">
                        <Link
                          to={`/products/${product.slug}`}
                          className="text-lg font-semibold uppercase"
                        >
                          {product.name}
                        </Link>
                        <p className="text-sm text-[#6a6967]">
                          Size:{' '}
                          <span className="font-semibold text-black">
                            {item.size ?? 'One size'}
                          </span>
                        </p>
                        {item.color && (
                          <p className="text-sm text-[#6a6967]">
                            Color:{' '}
                            <span className="font-semibold text-black">{item.color.name}</span>
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          <button
                            onClick={() => removeItem(item.key).catch(() => {})}
                            className="inline-flex items-center gap-1 underline"
                            type="button"
                          >
                            <Trash2 size={16} />
                            Remove
                          </button>
                          <button
                            className="inline-flex items-center gap-1 underline"
                            type="button"
                          >
                            <Bookmark size={16} />
                            Save for later
                          </button>
                        </div>
                        <div className="flex items-center justify-between gap-6 md:gap-10">
                          <div className="flex items-center gap-3 rounded-3xl border border-[#cbcbcb] px-4 py-2">
                            <button
                              onClick={() => handleDecrease(item)}
                              className="text-lg"
                              type="button"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-6 text-center text-sm font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleIncrease(item)}
                              className="text-lg"
                              type="button"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <span className="text-lg font-semibold">{formatPrice(itemTotal)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-[#cbcbcb] bg-white p-6">
              <h2 className="mb-4 text-center text-lg font-bold uppercase">Summary</h2>
              <div className="flex items-center justify-between text-sm uppercase">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm uppercase">
                <span>Delivery (3-5 business days)</span>
                <span>{deliveryPrice === 0 ? 'Free' : formatPrice(deliveryPrice)}</span>
              </div>
              <div className="mt-4 flex items-center justify-between text-base font-semibold uppercase">
                <span>Total (incl. VAT)</span>
                <span>{formatPrice(total)}</span>
              </div>
              <button className="btn mt-6 w-full justify-center uppercase" type="button">
                Proceed to checkout
              </button>
            </div>

            <div className="rounded-3xl border border-[#cbcbcb] bg-white p-6 text-xs uppercase">
              <div className="flex items-center justify-between">
                <span>Add discount code</span>
                <span className="text-lg">+</span>
              </div>
            </div>

            <div className="rounded-3xl border border-[#cbcbcb] bg-white p-6 text-xs uppercase">
              <p className="mb-4 text-center font-semibold">We accept following payment...</p>
              <div className="flex items-center justify-center gap-3">
                <span className="rounded-md border border-[#cbcbcb] px-3 py-2 text-sm font-semibold">
                  VISA
                </span>
                <span className="rounded-md border border-[#cbcbcb] px-3 py-2 text-sm font-semibold">
                  MasterCard
                </span>
                <span className="rounded-md border border-[#cbcbcb] px-3 py-2 text-sm font-semibold">
                  Maestro
                </span>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Cart;
