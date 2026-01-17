import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addToCartThunk,
  clearCartThunk,
  fetchCart,
  removeCartItemThunk,
  resetCart,
  selectCartCount,
  selectCartError,
  selectCartItems,
  selectCartLastFetchedFor,
  selectCartLoading,
  selectCartSubtotal,
  updateCartQuantityThunk,
} from '../store/cartSlice';
import { useAuth } from './useAuth';

export const useCart = () => {
  const dispatch = useDispatch();
  const { user, loading: authLoading } = useAuth();
  const items = useSelector(selectCartItems);
  const loading = useSelector(selectCartLoading);
  const error = useSelector(selectCartError);
  const count = useSelector(selectCartCount);
  const subtotal = useSelector(selectCartSubtotal);
  const lastFetchedFor = useSelector(selectCartLastFetchedFor);

  const userId = user?.id ?? null;
  const userKey = userId ?? 'guest';
  const initialized = lastFetchedFor === userKey;

  useEffect(() => {
    if (authLoading) return;
    if (lastFetchedFor && lastFetchedFor !== userKey) {
      dispatch(resetCart());
    }
  }, [authLoading, dispatch, lastFetchedFor, userKey]);

  useEffect(() => {
    if (authLoading) return;
    if (!initialized && !loading) {
      dispatch(fetchCart({ userId }));
    }
  }, [authLoading, dispatch, initialized, loading, userId]);

  const refresh = useCallback(() => dispatch(fetchCart({ userId })), [dispatch, userId]);

  const addItem = useCallback(
    (product, { size = null, colorId = null, quantity = 1 } = {}) => {
      if (!product?.id) throw new Error('Product information is required');
      return dispatch(
        addToCartThunk({
          userId,
          productId: product.id,
          size,
          colorId,
          quantity,
          product,
        })
      );
    },
    [dispatch, userId]
  );

  const updateQuantity = useCallback(
    (key, quantity) => dispatch(updateCartQuantityThunk({ userId, key, quantity })),
    [dispatch, userId]
  );

  const removeItem = useCallback(
    key => dispatch(removeCartItemThunk({ userId, key })),
    [dispatch, userId]
  );

  const clearCart = useCallback(() => dispatch(clearCartThunk({ userId })), [dispatch, userId]);

  return {
    items,
    loading,
    error,
    initialized,
    count,
    subtotal,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    refresh,
  };
};

export default useCart;
