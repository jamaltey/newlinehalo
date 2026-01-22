import clsx from 'clsx';
import { Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import Loading from '../components/Loading';
import { useAuth } from '../hooks/useAuth';
import { useFavorites } from '../hooks/useFavorites';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const { loading, getFavorites, removeFavorite } = useFavorites();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading) {
      getFavorites().then(items => setFavorites(items ?? []));
    }
  }, [authLoading]);

  const handleRemove = async productId => {
    await removeFavorite(productId);
    const updatedFavorites = (await getFavorites()) ?? [];
    setFavorites(updatedFavorites);
  };

  return (
    <div>
      <h1 className="mb-2 text-center text-2xl font-medium uppercase">My favorites</h1>
      <p className="mb-8 text-center text-sm font-light">
        My Favourites is a great way to keep track of your personal must-haves and their
        availability. And, most importantly, it just takes one click to move an item from the list
        and into your shopping cart.
      </p>
      {loading ? (
        <div className="relative mx-auto h-50">
          <Loading />
        </div>
      ) : (
        <div className="space-y-7">
          {favorites.length ? (
            <div className="pt-8 pb-24">
              <div className="flex items-center justify-between border-b border-[#bfbfbf] py-3">
                <h3 className="text-sm capitalize">
                  You have {favorites.length} products under My Favorites
                </h3>
                {!user && (
                  <Link to="/login" className="btn text-dark [--btn-bg:#fff]">
                    Login and save
                  </Link>
                )}
              </div>
              {favorites.map(product => (
                <div
                  className="flex min-h-70 items-stretch gap-4 border-b border-[#bfbfbf] py-7"
                  key={product.id}
                >
                  <Link to={`/products/${product.slug}`} className="w-full max-w-75 min-w-25">
                    <img
                      className="h-full w-full object-contain"
                      src={product.product_images[0].url}
                      alt={product.name}
                    />
                  </Link>
                  <div className="flex w-full flex-col justify-between">
                    <div className="flex w-full justify-between">
                      <Link to={`/products/${product.slug}`} className="mb-4 text-sm uppercase">
                        {product.name}
                      </Link>
                      <div className="flex flex-col gap-2">
                        <span className={clsx(product.price_old && 'text-[#ff6600]')}>
                          {product.price_current}€
                        </span>
                        {product.price_old && (
                          <span className="text-[#bfbfbf] line-through">{product.price_old} €</span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-row-reverse flex-wrap items-center justify-between gap-2 md:flex-row">
                      <div onClick={() => handleRemove(product.id)}>
                        <button className="hidden underline md:block" type="button">
                          Remove
                        </button>
                        <button
                          className="btn py-3 text-xs [--btn-bg:#d03a3a] md:hidden"
                          type="button"
                        >
                          <Trash />
                        </button>
                      </div>
                      <Link to={`/products/${product.slug}`} className="btn">
                        View details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>This list is empty.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Favorites;
