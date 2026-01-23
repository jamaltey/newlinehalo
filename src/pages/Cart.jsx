import { Link } from 'react-router';
import CartItem from '../components/CartItem';
import Loading from '../components/Loading';
import { useCart } from '../hooks/useCart';

const formatPrice = value => {
  const amount = Number(value) || 0;
  return `${amount.toFixed(2)} €`;
};

const Cart = () => {
  const { items, loading, count, subtotal, updateQuantity, removeItem } = useCart();

  const isBusy = loading;
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
    <div className="mx-auto w-full max-w-300 px-4 py-12">
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
        <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-6">
          <div className="space-y-12">
            {items.map(item => (
              <CartItem
                key={item.key}
                item={item}
                onDecrease={handleDecrease}
                onIncrease={handleIncrease}
                onRemove={key => removeItem(key).catch(() => {})}
                formatPrice={formatPrice}
              />
            ))}
          </div>

          <aside className="space-y-6 px-4 md:px-8 lg:px-0">
            <div className="rounded-3xl border border-[#cbcbcb] bg-white p-6">
              <h2 className="mb-4 text-center text-lg font-bold uppercase">Summary</h2>
              <div className="flex items-center justify-between text-sm uppercase">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm uppercase">
                <span>Delivery (3-6 business days)</span>
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

            {/* <div className="rounded-3xl border border-[#cbcbcb] bg-white p-6 text-xs uppercase">
              <div className="flex items-center justify-between">
                <span>Add discount code</span>
                <span className="text-lg">+</span>
              </div>
            </div> */}

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
