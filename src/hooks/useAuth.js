import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

/**
 * @typedef {import('@supabase/supabase-js').User} User
 * @typedef {import('@supabase/supabase-js').Session} Session
 */

/**
 * Custom hook that provides access to the authentication context.
 * @typedef {Object} AuthContextValue
 * @property {User|null} user - The currently authenticated Supabase user or null if not logged in.
 * @property {Session|null} session - The current Supabase session or null.
 * @property {boolean} loading - Whether the auth state is still being determined.
 * @property {(params: { email: string, password: string, firstName: string, lastName: string, isSubscribed?: boolean }) => Promise<{ user: User, session: Session }>} signUp - Function to sign up a new user.
 * @property {(params: { email: string, password: string, rememberMe?: boolean }) => Promise<{ user: User, session: Session }>} signIn
 * @property {() => Promise<void>} signOut - Function to sign out the current user.
 * @returns {AuthContextValue}
 */
export const useAuth = () => useContext(AuthContext);
