import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yfrbidmoyaynfnhipauni.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_frvEcp1Phjq20akeKhz9Rg_985-N-ra';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);