import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext(null);
const PROFILE_COLUMNS = "*";

export function translateAuthError(err) {
  const raw = String(err?.message || err || "");
  const code = String(err?.code || "");
  const status = err?.status;
  const name = String(err?.name || "");

  if (code === "auth_timeout") return "Le serveur d'authentification ne répond pas. Réessayez dans un instant.";
  if ((typeof status === "number" && status >= 500) || /database error|querying schema|internal server error/i.test(raw)) {
    return "Erreur côté serveur d'authentification (500). Le compte est probablement mal initialisé dans Supabase : voir les Auth Logs.";
  }
  if (code === "invalid_credentials" || /invalid login credentials/i.test(raw)) return "E-mail ou mot de passe incorrect.";
  if (code === "email_not_confirmed" || /email not confirmed/i.test(raw)) return "E-mail non confirmé. Cliquez sur le lien reçu par e-mail, puis reconnectez-vous.";
  if (code === "user_already_exists" || /already registered|already been registered/i.test(raw)) return "Un compte existe déjà avec cet e-mail. Connectez-vous ou réinitialisez votre mot de passe.";
  if (code === "weak_password" || /password should be at least|weak password/i.test(raw)) return "Mot de passe trop faible (6 caractères minimum).";
  if (/valid email|invalid email|email address .* invalid/i.test(raw)) return "Adresse e-mail invalide.";
  if (status === 429 || /rate limit|too many/i.test(raw) || code.includes("rate_limit")) return "Trop de tentatives. Patientez quelques minutes avant de réessayer.";
  if (name === "AuthRetryableFetchError" || /failed to fetch|networkerror|network request failed|load failed|fetch failed/i.test(raw)) {
    return "Impossible de joindre le serveur. Vérifiez votre connexion internet (ou désactivez un bloqueur de publicités) puis réessayez.";
  }
  if (/signups? not allowed|signup is disabled/i.test(raw)) return "Les inscriptions sont momentanément fermées.";
  return "Une erreur est survenue. Réessayez dans un instant.";
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null);
      return null;
    }
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select(PROFILE_COLUMNS)
        .eq("id", userId)
        .maybeSingle();
      if (error) throw error;
      setProfile(data ?? null);
      return data ?? null;
    } catch (err) {
      console.error("Profil illisible :", err?.message || err);
      setProfile(null);
      return null;
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function init() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!active) return;
        setSession(data.session ?? null);
        if (data.session?.user) await loadProfile(data.session.user.id);
      } catch (err) {
        console.error("Session illisible :", err?.message || err);
        if (active) {
          setSession(null);
          setProfile(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      setSession(nextSession ?? null);
      if (nextSession?.user) {
        setTimeout(() => {
          if (active) loadProfile(nextSession.user.id);
        }, 0);
      } else {
        setProfile(null);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  const login = useCallback(async (email, password) => {
    let result;
    try {
      result = await Promise.race([
        supabase.auth.signInWithPassword({ email: email.trim(), password }),
        new Promise((_, reject) =>
          setTimeout(() => reject(Object.assign(new Error("timeout"), { code: "auth_timeout" })), 20000)
        ),
      ]);
    } catch (err) {
      throw Object.assign(new Error(translateAuthError(err)), { code: err?.code, status: err?.status });
    }
    if (result?.error) {
      const e = result.error;
      throw Object.assign(new Error(translateAuthError(e)), { code: e.code, status: e.status });
    }
    const s = result?.data?.session ?? null;
    if (s) {
      setSession(s);
      setTimeout(() => loadProfile(s.user.id), 0);
    }
    return result?.data;
  }, [loadProfile]);

  const signup = useCallback(async (email, password, fullName) => {
    let result;
    try {
      result = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: fullName ? { full_name: fullName } : {},
          emailRedirectTo: `${window.location.origin}/espace-pro`,
        },
      });
    } catch (err) {
      throw new Error(translateAuthError(err));
    }
    if (result.error) throw new Error(translateAuthError(result.error));

    if (result.data.user && Array.isArray(result.data.user.identities) && result.data.user.identities.length === 0) {
      throw new Error("Un compte existe déjà avec cet e-mail. Connectez-vous ou réinitialisez votre mot de passe.");
    }
    return { needsEmailConfirmation: !result.data.session };
  }, []);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("Déconnexion serveur impossible :", err?.message || err);
    }
    setSession(null);
    setProfile(null);
  }, []);

  const value = useMemo(() => ({
    session,
    user: session?.user ?? null,
    profile,
    isLoggedIn: !!session?.user,
    loading,
    login,
    signup,
    logout
  }), [session, profile, loading, login, signup, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth doit être utilisé dans un AuthProvider");
  return context;
}
