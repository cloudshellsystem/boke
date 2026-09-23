import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ljtzzzkyahmZqkbomzjwe.supabase.co'
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_AsRjuAKZJGOn6_JyfHVs-g_Say7ADVS'

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)