import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export function translateAuthError(message) {
  if (!message) return 'Une erreur est survenue.';
  if (message.includes('Invalid login credentials')) return 'Email ou mot de passe incorrect.';
  if (message.includes('User already registered')) return 'Cet email est déjà utilisé.';
  if (message.includes('Email not confirmed')) return '⚠️ Votre adresse e-mail n\'a pas encore été confirmée. Veuillez cliquer sur le lien reçu par e-mail avant de vous connecter.';
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

  // 1. CONNEXION SUPABASE
  const login = async (email, password) => {
    if (!supabase) return;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      throw new Error(translateAuthError(error.message));
    }

    if (data?.session?.user) {
      setUser(data.session.user);
      setIsLoggedIn(true);
    }
  };

  // 2. INSCRIPTION SUPABASE
  const signup = async (email, password) => {
    if (!supabase) return { needsEmailConfirmation: false };
    
    // Inscription avec l'URL de redirection explicite vers votre site Vercel
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/espace-pro`,
      },
    });

    if (error) {
      throw new Error(translateAuthError(error.message));
    }
    
    // Si la confirmation d'e-mail est active, l'utilisateur est créé sans session immediate
    const needsEmailConfirmation = data?.user && !data?.session;

    if (data?.session?.user) {
      setUser(data.session.user);
      setIsLoggedIn(true);
    }
    
    return { needsEmailConfirmation };
  };

  // 3. RÉINITIALISATION DU MOT DE PASSE
  const resetPassword = async (email) => {
    if (!supabase) return;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw new Error(translateAuthError(error.message));
  };

  // 4. DÉCONNEXION
  const logout = async () => {
    if (supabase) {
      try { await supabase.auth.signOut(); } catch (e) {}
    }
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, loading, login, signup, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}