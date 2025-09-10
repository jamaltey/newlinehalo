import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wlgceajvbwedazkgdwns.supabase.co';
const supabaseKey = 'sb_publishable_d-PGevsRkqESjdFMdKO8zA_Bps7fEpt';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storageKey: 'sb-auth-token',
  },
});

export default supabase;
