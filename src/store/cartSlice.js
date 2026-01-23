import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { buildCartKey, normalizeNumber, normalizeQuantity } from '../utils/cartUtils';
import supabase from '../utils/supabase';

export const CART_STORAGE_KEY = 'cart';

const sanitizeCartEntry = entry => {
  if (!entry) return null;
  const productId = normalizeNumber(entry.productId);
  if (productId === null) return null;
  const size = typeof entry.size === 'string' && entry.size.trim() ? entry.size.trim() : null;
  const colorIdRaw = entry.colorId ?? entry.color_id;
  const colorId =
    colorIdRaw === null || colorIdRaw === undefined ? null : normalizeNumber(colorIdRaw);
  const quantity = normalizeQuantity(entry.quantity ?? 1);
  return { productId, size, colorId, quantity };
};

export const readStoredCart = () => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) || '[]');
    if (!Array.isArray(raw)) return [];
    const sanitized = raw
      .map(sanitizeCartEntry)
      .filter(Boolean)
      .reduce((acc, item) => {
        const key = buildCartKey(item.productId, item.size, item.colorId);
        const existing = acc.get(key);
        if (existing) {
          existing.quantity += item.quantity;
        } else {
          acc.set(key, { ...item });
        }
        return acc;
      }, new Map());
    return Array.from(sanitized.values());
  } catch {
    return [];
  }
};

const writeStoredCart = items => {
  if (typeof window === 'undefined') return;
  const sanitized = Array.isArray(items) ? items.map(sanitizeCartEntry).filter(Boolean) : [];
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(sanitized));
};

const fetchProductById = async productId => {
  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*), colors(*)')
    .eq('id', productId)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
};

const attachProductMetadata = ({ productId, size, colorId, quantity, product, cartItemId }) => {
  if (!product) return null;
  const color =
    colorId !== null && Array.isArray(product.colors)
      ? (product.colors.find(item => item.id === colorId) ?? null)
      : null;
  return {
    key: buildCartKey(productId, size, colorId),
    cartItemId: cartItemId ?? null,
    productId,
    size: size ?? null,
    colorId: colorId ?? null,
    color,
    quantity: normalizeQuantity(quantity),
    product,
  };
};

const initialState = {
  items: [],
  loading: false,
  error: null,
  lastFetchedFor: null,
};

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async ({ userId }, { rejectWithValue }) => {
    try {
      if (!userId) {
        const stored = readStoredCart();
        if (!stored.length) return { items: [] };
        const ids = Array.from(new Set(stored.map(item => item.productId)));
        const { data: products, error } = await supabase
          .from('products')
          .select('*, product_images(*), colors(*)')
          .in('id', ids);
        if (error) throw error;
        const productMap = new Map((products ?? []).map(product => [product.id, product]));
        const items = stored
          .map(entry => {
            const product = productMap.get(entry.productId);
            if (!product) return null;
            return attachProductMetadata({ ...entry, product });
          })
          .filter(Boolean);
        return { items };
      }

      const { data, error } = await supabase
        .from('cart_items')
        .select(
          'id, product_id, size, color_id, quantity, products(*, product_images(*), colors(*))'
        )
        .eq('profile_id', userId);
      if (error) throw error;
      const items = (data ?? [])
        .map(row =>
          attachProductMetadata({
            cartItemId: row.id,
            productId: row.product_id,
            size: row.size,
            colorId: row.color_id,
            quantity: row.quantity,
            product: row.products,
          })
        )
        .filter(Boolean);
      return { items };
    } catch (error) {
      return rejectWithValue(error.message ?? 'Unable to load cart');
    }
  }
);

export const addToCartThunk = createAsyncThunk(
  'cart/addToCart',
  async (
    { userId, productId, size, colorId, quantity = 1, product },
    { getState, rejectWithValue }
  ) => {
    try {
      const normalizedProductId = normalizeNumber(productId);
      if (normalizedProductId === null) throw new Error('Invalid product');
      const normalizedSize = typeof size === 'string' && size.trim() ? size.trim() : null;
      const normalizedColorId =
        colorId === null || colorId === undefined ? null : normalizeNumber(colorId);
      const incrementBy = normalizeQuantity(quantity);
      const key = buildCartKey(normalizedProductId, normalizedSize, normalizedColorId);
      const existing = getState().cart.items.find(item => item.key === key) ?? null;
      const targetQuantity = (existing?.quantity ?? 0) + incrementBy;

      if (userId) {
        const { data, error } = await supabase
          .from('cart_items')
          .upsert(
            {
              profile_id: userId,
              product_id: normalizedProductId,
              size: normalizedSize,
              color_id: normalizedColorId,
              quantity: targetQuantity,
            },
            { onConflict: 'profile_id,product_id,size,color_id' }
          )
          .select('id, quantity')
          .maybeSingle();
        if (error) throw error;

        let productData = product ?? existing?.product ?? null;
        if (!productData) {
          productData = await fetchProductById(normalizedProductId);
        }

        toast.success('Added product to cart');

        return {
          item: attachProductMetadata({
            cartItemId: data?.id ?? existing?.cartItemId ?? null,
            productId: normalizedProductId,
            size: normalizedSize,
            colorId: normalizedColorId,
            quantity: data?.quantity ?? targetQuantity,
            product: productData,
          }),
        };
      }

      const stored = readStoredCart();
      const filtered = stored.filter(
        entry => buildCartKey(entry.productId, entry.size, entry.colorId) !== key
      );
      filtered.push({
        productId: normalizedProductId,
        size: normalizedSize,
        colorId: normalizedColorId,
        quantity: targetQuantity,
      });
      writeStoredCart(filtered);

      let productData = product ?? existing?.product ?? null;
      if (!productData) {
        productData = await fetchProductById(normalizedProductId);
      }

      toast.success('Added product to cart');

      return {
        item: attachProductMetadata({
          productId: normalizedProductId,
          size: normalizedSize,
          colorId: normalizedColorId,
          quantity: targetQuantity,
          product: productData,
        }),
      };
    } catch (error) {
      return rejectWithValue(error.message ?? 'Unable to add to cart');
    }
  }
);

export const updateCartQuantityThunk = createAsyncThunk(
  'cart/updateQuantity',
  async ({ userId, key, quantity }, { getState, rejectWithValue }) => {
    try {
      const sanitizedQuantity = normalizeQuantity(quantity ?? 1);
      const existing = getState().cart.items.find(item => item.key === key);
      if (!existing) throw new Error('Item not found');

      if (userId) {
        const { error } = await supabase.from('cart_items').upsert(
          {
            profile_id: userId,
            product_id: existing.productId,
            size: existing.size,
            color_id: existing.colorId,
            quantity: sanitizedQuantity,
          },
          { onConflict: 'profile_id,product_id,size,color_id' }
        );
        if (error) throw error;
      } else {
        const stored = readStoredCart().map(entry => {
          if (buildCartKey(entry.productId, entry.size, entry.colorId) === key) {
            return { ...entry, quantity: sanitizedQuantity };
          }
          return entry;
        });
        writeStoredCart(stored);
      }

      return { key, quantity: sanitizedQuantity };
    } catch (error) {
      return rejectWithValue(error.message ?? 'Unable to update cart item');
    }
  }
);

export const removeCartItemThunk = createAsyncThunk(
  'cart/removeItem',
  async ({ userId, key }, { getState, rejectWithValue }) => {
    try {
      const existing = getState().cart.items.find(item => item.key === key);
      if (!existing) throw new Error('Item not found');

      if (userId) {
        const query = supabase
          .from('cart_items')
          .delete()
          .eq('profile_id', userId)
          .eq('product_id', existing.productId);
        if (existing.size) query.eq('size', existing.size);
        else query.is('size', null);
        if (existing.colorId !== null) query.eq('color_id', existing.colorId);
        else query.is('color_id', null);
        const { error } = await query;
        if (error) throw error;
      } else {
        const stored = readStoredCart().filter(
          entry => buildCartKey(entry.productId, entry.size, entry.colorId) !== key
        );
        writeStoredCart(stored);
      }

      return { key };
    } catch (error) {
      return rejectWithValue(error.message ?? 'Unable to remove cart item');
    }
  }
);

export const clearCartThunk = createAsyncThunk(
  'cart/clearCart',
  async ({ userId }, { rejectWithValue }) => {
    try {
      if (userId) {
        const { error } = await supabase.from('cart_items').delete().eq('profile_id', userId);
        if (error) throw error;
      } else {
        writeStoredCart([]);
      }
      return {};
    } catch (error) {
      return rejectWithValue(error.message ?? 'Unable to clear cart');
    }
  }
);

export const handleUserChange = createAsyncThunk(
  'cart/handleUserChange',
  async ({ oldUserId, newUserId }, { rejectWithValue }) => {
    try {
      // Logging in: sync guest cart to user account
      if (!oldUserId && newUserId) {
        const guestCart = readStoredCart();
        if (guestCart.length > 0) {
          const { data: remoteCart, error: remoteError } = await supabase
            .from('cart_items')
            .select('product_id, size, color_id, quantity')
            .eq('profile_id', newUserId);
          if (remoteError) throw remoteError;

          const remoteMap = new Map(
            (remoteCart ?? []).map(row => [
              buildCartKey(row.product_id, row.size, row.color_id),
              normalizeQuantity(row.quantity),
            ])
          );

          const rows = guestCart
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
                profile_id: newUserId,
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
          writeStoredCart([]);
        }
      }
      // Logging out: sync user cart to localStorage
      else if (oldUserId && !newUserId) {
        const { data: remoteCart, error: cartError } = await supabase
          .from('cart_items')
          .select('product_id, size, color_id, quantity')
          .eq('profile_id', oldUserId);
        if (cartError) throw cartError;
        if (Array.isArray(remoteCart) && remoteCart.length > 0) {
          writeStoredCart(
            remoteCart.map(item => ({
              productId: item.product_id,
              size: item.size,
              colorId: item.color_id,
              quantity: item.quantity,
            }))
          );
        } else {
          writeStoredCart([]);
        }
      }
      return { userId: newUserId };
    } catch (error) {
      return rejectWithValue(error.message ?? 'Unable to sync cart during user change');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCart: state => {
      state.items = [];
      state.loading = false;
      state.error = null;
      state.lastFetchedFor = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCart.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.items = action.payload.items ?? [];
        state.lastFetchedFor = action.meta.arg?.userId ?? 'guest';
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || 'Unable to load cart';
        state.lastFetchedFor = action.meta.arg?.userId ?? 'guest';
      })
      .addCase(addToCartThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const item = action.payload.item;
        if (!item) return;
        const index = state.items.findIndex(existing => existing.key === item.key);
        if (index >= 0) {
          state.items[index] = item;
        } else {
          state.items.push(item);
        }
      })
      .addCase(addToCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || 'Unable to add to cart';
      })
      .addCase(updateCartQuantityThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartQuantityThunk.fulfilled, (state, action) => {
        state.loading = false;
        const { key, quantity } = action.payload;
        const existing = state.items.find(item => item.key === key);
        if (existing) existing.quantity = quantity;
      })
      .addCase(updateCartQuantityThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || 'Unable to update cart item';
      })
      .addCase(removeCartItemThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCartItemThunk.fulfilled, (state, action) => {
        state.loading = false;
        const { key } = action.payload;
        state.items = state.items.filter(item => item.key !== key);
      })
      .addCase(removeCartItemThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || 'Unable to remove cart item';
      })
      .addCase(clearCartThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCartThunk.fulfilled, state => {
        state.loading = false;
        state.items = [];
      })
      .addCase(clearCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || 'Unable to clear cart';
      })
      .addCase(handleUserChange.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleUserChange.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.lastFetchedFor = action.payload.userId ?? 'guest';
        state.items = [];
      })
      .addCase(handleUserChange.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error?.message || 'Unable to sync cart during user change';
      });
  },
});

export const { resetCart } = cartSlice.actions;

export const selectCartState = state => state.cart;
export const selectCartItems = state => state.cart.items;
export const selectCartLoading = state => state.cart.loading;
export const selectCartError = state => state.cart.error;
export const selectCartLastFetchedFor = state => state.cart.lastFetchedFor;

export const selectCartCount = createSelector(selectCartItems, items =>
  items.reduce((sum, item) => sum + item.quantity, 0)
);

export const selectCartSubtotal = createSelector(selectCartItems, items =>
  items.reduce((sum, item) => sum + item.quantity * (Number(item.product?.price_current) || 0), 0)
);

export default cartSlice.reducer;
