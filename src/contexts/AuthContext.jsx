import { createContext, useEffect, useState } from 'react';
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

  const signUp = async ({ email, password, firstName, lastName, isSubscribed = false }) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setLoading(false);
      throw error;
    }

    const user = data.user;

    if (user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: user.id,
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
    setUser(user);
    setLoading(false);
    return data;
  };

  const signIn = async ({ email, password, rememberMe = true }) => {
    setLoading(true);
    const client = initSupabase(rememberMe);
    const { data, error } = await client.auth.signInWithPassword({ email, password });

    if (error) {
      setLoading(false);
      throw error;
    }

    setSession(data.session);
    setUser(data.session.user);
    setLoading(false);
    return data;
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setLoading(false);
  };

  return <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>{children}</AuthContext.Provider>;
};

export default AuthContext;
