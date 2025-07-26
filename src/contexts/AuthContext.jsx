import * as supabaseTypes from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';
import supabase, { initSupabase } from '../utils/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const signIn = async (email, password, rememberMe = true) => {
    const client = initSupabase(rememberMe);
    const { data, error } = await client.auth.signInWithPassword({ email, password });

    if (error) throw error;

    setSession(data.session);
    setUser(data.session.user);
    return data;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signOut }}>{!loading && children}</AuthContext.Provider>
  );
};

/**
 * Custom hook that provides access to the authentication context.
 * @typedef {Object} AuthContextValue
 * @property {supabaseTypes.User|null} user - The currently authenticated Supabase user or null if not logged in.
 * @property {supabaseTypes.Session|null} session - The current Supabase session or null.
 * @property {boolean} loading - Whether the auth state is still being determined.
 * @property {(email: string, password: string, rememberMe?: boolean) => Promise<{user: supabaseTypes.User, session: supabaseTypes.Session, weakPassword: supabaseTypes.WeakPassword}>} signIn - Function to sign in a user.
 * @property {() => Promise<void>} signOut - Function to sign out the current user.

 * @returns {AuthContextValue} The authentication context.
 */
export const useAuth = () => useContext(AuthContext);
