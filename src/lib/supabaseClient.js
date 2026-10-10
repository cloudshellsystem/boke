import { createClient } from '@supabase/supabase-js';

// Nettoyage de l'adresse et sécurisation des clés
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yfrbidmoyaynfnhpauni.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmcmJpZG1veWF5bmZuaHBhdW5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwMjM1MDgsImV4cCI6MjEwNTU5OTUwOH0.ohTzPChaJBKRKlhJJXeVQLXbnofmojTsTMBRNkw2uw0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
