import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext(null);

// 🔄 Dictionnaire de traduction officiel des erreurs Supabase
export function translateAuthError(message) {
  if (!message) return "Une erreur est survenue.";
  const msgStr = String(message);
  if (msgStr.includes("Invalid login credentials")) return "Email ou mot de passe incorrect.";
  if (msgStr.includes("User already registered")) return "Cet e-mail est déjà utilisé.";
  if (msgStr.includes("Email not confirmed")) return "Veuillez confirmer votre e-mail avant de vous connecter.";
  if (msgStr.includes("Password should be at least")) return "Le mot de passe doit contenir au moins 6 caractères.";
  return msgStr;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔍 1. Vérifier la session initiale réelle de Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Définir les privilèges SuperAdmin si c'est l'adresse officielle
        const isAdmin = session.user.email?.toLowerCase() === "admin@bokeone.com";
        setUser({ ...session.user, isAdmin });
        setIsLoggedIn(true);
      }
      setLoading(false);
    });

    // 📡 2. Écouter les changements de connexion/déconnexion en direct
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const isAdmin = session.user.email?.toLowerCase() === "admin@bokeone.com";
        setUser({ ...session.user, isAdmin });
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 🔑 MÉTHODE DE CONNEXION RÉELLE
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  // 📝 MÉTHODE D'INSCRIPTION RÉELLE
  const signup = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/espace-pro`,
      }
    });
    if (error) throw error;
    const needsEmailConfirmation = data?.user && !data?.session;
    return { needsEmailConfirmation };
  };

  // ✉️ MÉTHODE DE RÉINITIALISATION RÉELLE
  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/espace-pro`,
    });
    if (error) throw error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
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
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth doit être utilisé dans un AuthProvider");
  return context;
}
