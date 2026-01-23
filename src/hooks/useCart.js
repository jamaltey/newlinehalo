import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addToCartThunk,
  clearCartThunk,
  fetchCart,
  removeCartItemThunk,
  selectCartCount,
  selectCartError,
  selectCartItems,
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

  const userId = user?.id ?? null;

  // Fetch cart when user changes (login/logout/initialization)
  useEffect(() => {
    if (authLoading) return;
    dispatch(fetchCart({ userId }));
  }, [authLoading, dispatch, userId]);

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
