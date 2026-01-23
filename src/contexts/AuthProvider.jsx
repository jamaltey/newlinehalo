import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useFavorites } from '../hooks/useFavorites';
import { handleUserChange } from '../store/cartSlice';
import supabase from '../utils/supabase';
import AuthContext from './AuthContext';

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
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

    // Dispatch Redux thunk to handle cart sync on login
    dispatch(handleUserChange({ oldUserId: null, newUserId: data.user.id })).catch(syncError => {
      console.error('Error syncing cart on login:', syncError);
    });

    setLoading(false);
    return data;
  };

  const signOut = async () => {
    setLoading(true);
    const currentUser = user;

    // Dispatch Redux thunk to handle cart persistence on logout
    if (currentUser) {
      dispatch(handleUserChange({ oldUserId: currentUser.id, newUserId: null })).catch(
        syncError => {
          console.error('Error syncing cart on logout:', syncError);
        }
      );
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
