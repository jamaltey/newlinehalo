import { useEffect, useState } from 'react';
import { keysToCamel, keysToSnake } from '../utils/case';
import supabase from '../utils/supabase';
import { useAuth } from './useAuth';

/**
 * @typedef {Object} Profile Profile data in camelCase.
 * @property {string} id
 * @property {string} email
 * @property {string} firstName
 * @property {string} lastName
 * @property {string|null} gender
 * @property {string|null} address
 * @property {string|null} phone
 * @property {boolean} isSubscribed
 *
 * @typedef {import('@supabase/supabase-js').PostgrestError} PostgrestError
 */

/**
 * Hook to fetch profile data for the current user.
 * @returns {{ profile: Profile|null, updateProfile: (updatedFields: Partial<Profile>) => Promise<{ data: Profile, error: PostgrestError|null }>, loading: boolean, error: PostgrestError|null }} The profile data (in camelCase), loading state, and error.
 */
export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) setError(error);
      else setProfile(keysToCamel(data));

      setLoading(false);
    })();
  }, [user]);

  const updateProfile = async updatedFields => {
    setLoading(true);
    updatedFields = keysToSnake(updatedFields);

    const { data, error } = await supabase
      .from('profiles')
      .update(updatedFields)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      setError(error);
    } else {
      setProfile(keysToCamel(data));
      setError(null);
    }

    setLoading(false);
    return { data, error };
  };

  return { profile, updateProfile, loading, error };
};
