import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wlgceajvbwedazkgdwns.supabase.co';
const supabaseKey = 'sb_publishable_d-PGevsRkqESjdFMdKO8zA_Bps7fEpt';

export const initSupabase = (rememberMe = true) =>
  createClient(supabaseUrl, supabaseKey, {
    auth: {
      storage: rememberMe ? localStorage : sessionStorage,
    },
  });

const supabase = initSupabase();

export default supabase;
