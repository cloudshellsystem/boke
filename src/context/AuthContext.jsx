import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    // 1. Session initiale
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // 2. Écoute des changements d'auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.warn("Erreur chargement profil :", err.message);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setAuthError("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signup = async (email, password) => {
    setAuthError("");
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  };

  const resetPassword = async (email) => {
    setAuthError("");
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  };

  const logout = async () => {
    setAuthError("");
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  // Calcul direct des accès Pro / Élite
  const plan = profile?.plan || "free";
  const hasProAccess = plan === "pro" || plan === "elite" || profile?.is_admin === true;

  const value = {
    user,
    profile,
    plan,
    hasProAccess,
    isLoggedIn: !!user,
    loading,
    authError,
    login,
    signup,
    register: signup, // ✅ Alias indispensable pour que AuthForm (qui appelle register) fonctionne parfaitement
    resetPassword,
    logout,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

// Fonction utilitaire de traduction des erreurs Supabase
export function translateAuthError(err) {
  const msg = err?.message || "";
  if (msg.includes("Invalid login credentials")) return "E-mail ou mot de passe incorrect.";
  if (msg.includes("User already registered")) return "Un compte existe déjà avec cet e-mail.";
  if (msg.includes("Password should be at least")) return "Le mot de passe doit contenir au moins 6 caractères.";
  return msg || "Une erreur est survenue lors de l'authentification.";
}