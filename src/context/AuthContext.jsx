import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export function translateAuthError(message) {
  if (!message) return 'Une erreur est survenue.';
  if (message.includes('Invalid login credentials')) return 'Email ou mot de passe incorrect.';
  if (message.includes('User already registered')) return 'Cet email est déjà utilisé.';
  return message;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      try {
        if (supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (mounted && session?.user) {
            setUser(session.user);
            setIsLoggedIn(true);
          }
        }
      } catch (err) {
        console.warn('Supabase auth session non disponible:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    getInitialSession();

    let authListener = null;
    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        if (mounted) {
          if (session?.user) {
            setUser(session.user);
            setIsLoggedIn(true);
          } else {
            setUser(null);
            setIsLoggedIn(false);
          }
          setLoading(false);
        }
      });
      authListener = data?.subscription;
    }

    return () => {
      mounted = false;
      if (authListener) authListener.unsubscribe();
    };
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    if (supabase) {
      try { await supabase.auth.signOut(); } catch (e) {}
    }
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}