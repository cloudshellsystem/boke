import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

// Dictionnaire de traduction fr des erreurs Supabase
export function translateAuthError(message) {
  if (!message) return 'Une erreur est survenue.';
  if (typeof message !== 'string') return 'Une erreur est survenue lors de l\'authentification.';
  
  if (message.includes('Invalid login credentials')) return 'Email ou mot de passe incorrect.';
  if (message.includes('User already registered')) return 'Cet email est déjà utilisé.';
  if (message.includes('Email not confirmed')) return '⚠️ Votre adresse e-mail n\'a pas encore été confirmée. Veuillez cliquer sur le lien reçu par e-mail avant de vous connecter.';
  if (message.includes('Password should be at least')) return 'Le mot de passe doit contenir au moins 6 caractères.';
  
  return message;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fonction pour charger les données additionnelles (role, pseudo, etc.) depuis 'profiles'
  const fetchUserProfile = async (authUser) => {
    if (!authUser || !supabase) return null;
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();
      return data;
    } catch (e) {
      console.warn("Impossible de charger le profil :", e);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      try {
        if (supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (mounted && session?.user) {
            setUser(session.user);
            setIsLoggedIn(true);
            const userProfile = await fetchUserProfile(session.user);
            if (mounted) setProfile(userProfile);
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
      const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (mounted) {
          if (session?.user) {
            setUser(session.user);
            setIsLoggedIn(true);
            const userProfile = await fetchUserProfile(session.user);
            if (mounted) setProfile(userProfile);
          } else {
            setUser(null);
            setProfile(null);
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

  // 1. CONNEXION
  const login = async (email, password) => {
    if (!supabase) return;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error; // On propage l'erreur brute pour qu'AuthForm la traduise

    if (data?.session?.user) {
      setUser(data.session.user);
      setIsLoggedIn(true);
      const userProfile = await fetchUserProfile(data.session.user);
      setProfile(userProfile);
    }
  };

  // 2. INSCRIPTION
  const signup = async (email, password) => {
    if (!supabase) return { needsEmailConfirmation: false };
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/espace-pro`,
      },
    });

    if (error) throw error;
    
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
    if (error) throw error;
  };

  // 4. DÉCONNEXION
  const logout = async () => {
    if (supabase) {
      try { await supabase.auth.signOut(); } catch (e) {}
    }
    setUser(null);
    setProfile(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ user, profile, isLoggedIn, loading, login, signup, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}