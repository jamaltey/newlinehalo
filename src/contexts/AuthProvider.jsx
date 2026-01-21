import { useEffect, useState } from 'react';
import { useFavorites } from '../hooks/useFavorites';
import { CART_STORAGE_KEY, readStoredCart } from '../store/cartSlice';
import supabase from '../utils/supabase';
import AuthContext from './AuthContext';

/**
 * Generates a unique key for a cart item based on its product ID, size, and color ID.
 * This key is used to store and retrieve cart items from local storage and Supabase.
 * @param {string | number} productId
 * @param {string} size
 * @param {string | number} colorId
 * @returns {string} A unique key for the cart item in the format ```<product_id>__<size>__<color_id>```
 */
const buildCartKey = (productId, size, colorId) =>
  `${productId ?? 'unknown'}__${size ?? ''}__${colorId ?? ''}`;

const normalizeNumber = value => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const normalizeQuantity = quantity => {
  const num = Number(quantity);
  if (!Number.isFinite(num) || num <= 0) return 1;
  return Math.floor(num);
};

const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getLocalFavorites } = useFavorites();

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signUp = async ({ email, password, firstName, lastName, isSubscribed = false }) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setLoading(false);
      throw error;
    }

    const newUser = data.user;

    if (newUser) {
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: newUser.id,
        first_name: firstName,
        last_name: lastName,
        is_subscribed: isSubscribed,
      });

      if (profileError) {
        setLoading(false);
        throw profileError;
      }
    }

    setSession(data.session);
    setUser(newUser);
    setLoading(false);
    return data;
  };

  const signIn = async ({ email, password }) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setLoading(false);
      throw error;
    }

    setUser(data.user);
    setSession(data.session);

    // Sync guest favorites from localStorage to the user's account on login
    try {
      const localFavs = getLocalFavorites();
      if (Array.isArray(localFavs) && localFavs.length > 0) {
        const userId = data.user.id;
        const rows = localFavs.map(productId => ({ profile_id: userId, product_id: productId }));

        await supabase
          .from('favorites')
          .upsert(rows, { onConflict: 'profile_id,product_id', ignoreDuplicates: true });

        localStorage.removeItem('favorites');
      }
    } catch (favoritesSyncError) {
      console.error('Error syncing favorites on login:', favoritesSyncError);
    }

    // Sync guest cart from localStorage to the user's account on login
    try {
      const localCart = readStoredCart();
      if (Array.isArray(localCart) && localCart.length > 0) {
        const userId = data.user.id;
        const { data: remoteCart, error: remoteError } = await supabase
          .from('cart_items')
          .select('product_id, size, color_id, quantity')
          .eq('profile_id', userId);
        if (remoteError) throw remoteError;

        const remoteMap = new Map(
          (remoteCart ?? []).map(row => [
            buildCartKey(row.product_id, row.size, row.color_id),
            normalizeQuantity(row.quantity),
          ])
        );

        const rows = localCart
          .map(item => {
            const productId = normalizeNumber(item.productId);
            if (productId === null) return null;
            const size =
              typeof item.size === 'string' && item.size.trim() ? item.size.trim() : null;
            const colorId =
              item.colorId === null || item.colorId === undefined
                ? null
                : normalizeNumber(item.colorId);
            const key = buildCartKey(productId, size, colorId);
            const mergedQuantity = normalizeQuantity(item.quantity) + (remoteMap.get(key) ?? 0);
            remoteMap.set(key, mergedQuantity);
            return {
              profile_id: userId,
              product_id: productId,
              size,
              color_id: colorId,
              quantity: mergedQuantity,
            };
          })
          .filter(Boolean);

        if (rows.length > 0) {
          await supabase
            .from('cart_items')
            .upsert(rows, { onConflict: 'profile_id,product_id,size,color_id' });
        }

        localStorage.removeItem(CART_STORAGE_KEY);
      }
    } catch (cartSyncError) {
      console.error('Error syncing cart on login:', cartSyncError);
    }

    setLoading(false);
    return data;
  };

  const signOut = async () => {
    setLoading(true);
    const currentUser = user;

    if (currentUser) {
      try {
        const { data: remoteCart, error: cartError } = await supabase
          .from('cart_items')
          .select('product_id, size, color_id, quantity')
          .eq('profile_id', currentUser.id);
        if (cartError) throw cartError;
        if (Array.isArray(remoteCart) && remoteCart.length > 0) {
          localStorage.setItem(
            CART_STORAGE_KEY,
            JSON.stringify(
              remoteCart.map(item => ({
                productId: item.product_id,
                size: item.size,
                colorId: item.color_id,
                quantity: item.quantity,
              }))
            )
          );
        } else {
          localStorage.removeItem(CART_STORAGE_KEY);
        }
      } catch (cartPersistError) {
        console.error('Error saving cart on sign out:', cartPersistError);
      }
    }

    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext>
  );
};

export default AuthProvider;
