import { createContext } from 'react';

/**
 * @typedef {import('@supabase/supabase-js').User} User
 * @typedef {import('@supabase/supabase-js').Session} Session
 *
 * @typedef {Object} AuthContextValue
 * @property {User|null} user - The currently authenticated Supabase user or null if not logged in.
 * @property {Session|null} session - The current Supabase session or null.
 * @property {boolean} loading - Whether the authentication state is being loaded.
 * @property {(params: { email: string, password: string, firstName: string, lastName: string, isSubscribed?: boolean }) => Promise<{ user: User, session: Session }>} signUp - Function to sign up a new user.
 * @property {(params: { email: string, password: string, rememberMe?: boolean }) => Promise<{ user: User, session: Session }>} signIn - Function to sign in an existing user.
 * @property {() => Promise<void>} signOut - Function to sign out the current user.
 *
 */

/** @type {React.Context<AuthContextValue>} */
const AuthContext = createContext({
  user: null,
  session: null,
  loading: true,
  signUp: () => {},
  signIn: () => {},
  signOut: () => {},
});

export default AuthContext;
