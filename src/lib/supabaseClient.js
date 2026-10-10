import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yfrbidmoyaynfnhipauni.supabase.co';
const supabaseAnonKey = 'sb_publishable_frvEcp1Phjq20akeKhz9Rg_985-N-ra';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);