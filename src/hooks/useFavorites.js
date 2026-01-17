import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import supabase from '../utils/supabase';
import { useAuth } from './useAuth';

export const useFavorites = () => {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(authLoading);

  useEffect(() => {
    setLoading(authLoading);
  }, [authLoading]);

  /**
   * @returns {number[]}
   */
  const getLocalFavorites = useCallback(
    () => JSON.parse(localStorage.getItem('favorites') || '[]'),
    []
  );

  /**
   * @returns {Promise<any[]>}
   */
  const getFavorites = useCallback(async () => {
    setLoading(true);
    if (!user) {
      const ids = getLocalFavorites();
      const { data: products } = await supabase
        .from('products')
        .select('*, product_images(*), product_colors(color_id)')
        .in('id', ids);
      setLoading(false);
      return products;
    }
    const { data: products } = await supabase
      .from('favorites')
      .select('products(*, product_images(*), product_colors(color_id))')
      .eq('profile_id', user.id);
    setLoading(false);
    return products.map(fav => fav.products).flat();
  }, [getLocalFavorites, user]);

  /**
   * @param {string | number} productId
   * @returns {Promise<boolean>}
   */
  const isFavorite = useCallback(
    async productId => {
      if (!user) return getLocalFavorites().includes(productId);
      setLoading(true);
      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('profile_id', user.id)
        .eq('product_id', productId)
        .maybeSingle();
      setLoading(false);
      return !!data;
    },
    [getLocalFavorites, user]
  );

  /**
   * @param {number} productId
   */
  const removeFavorite = useCallback(
    async productId => {
      setLoading(true);
      if (!user) {
        const favs = getLocalFavorites();
        const newFavs = favs.filter(id => id !== productId);
        localStorage.setItem('favorites', JSON.stringify(newFavs));
      } else {
        await supabase
          .from('favorites')
          .delete()
          .eq('profile_id', user.id)
          .eq('product_id', productId);
      }
      setLoading(false);
    },
    [getLocalFavorites, user]
  );

  /**
   * @param {number} productId
   */
  const addFavorite = useCallback(
    async productId => {
      setLoading(true);
      if (!user) {
        const favs = getLocalFavorites();
        if (!favs.includes(productId)) {
          const newFavs = [...favs, productId];
          localStorage.setItem('favorites', JSON.stringify(newFavs));
        }
      } else {
        await supabase.from('favorites').insert({ profile_id: user.id, product_id: productId });
      }
      setLoading(false);
    },
    [getLocalFavorites, user]
  );

  /**
   * @param {number} productId
   * @returns {Promise<boolean>}
   */
  const toggleFavorite = useCallback(
    async productId => {
      setLoading(true);
      const isFav = await isFavorite(productId);

      if (isFav) {
        await removeFavorite(productId);
        toast.info(`Removed product from favorites`);
      } else {
        await addFavorite(productId);
        toast.success(`Added product to favorites`);
      }

      setLoading(false);
      return !isFav;
    },
    [addFavorite, isFavorite, removeFavorite]
  );

  return {
    loading,
    getFavorites,
    getLocalFavorites,
    isFavorite,
    removeFavorite,
    addFavorite,
    toggleFavorite,
  };
};
