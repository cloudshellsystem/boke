// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "⚠️ [BOké ONE Error] : Les variables d'environnement VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY sont manquantes dans votre fichier .env !"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)