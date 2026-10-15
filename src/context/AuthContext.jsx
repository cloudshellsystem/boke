import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "../lib/supabaseClient";

/**
 * AUTHENTIFICATION — règles de ce fichier
 * 1. Aucune connexion "locale de secours" : si Supabase répond par une erreur (mauvais mot de
 *    passe, réseau coupé…), on lève une erreur lisible et AUCUNE session n'est créée.
 * 2. Le rôle et l'offre (plan) viennent de la table `profiles` côté serveur. Le navigateur
 *    ne peut pas les modifier. Ici on ne fait que les LIRE pour adapter l'affichage.
 * 3. `loading` reste vrai tant que la session ET le profil ne sont pas résolus.
 */

const AuthContext = createContext(null);

const PROFILE_COLUMNS = "*";

export function translateAuthError(err) {
  const raw = String(err?.message || err || "");
  const code = String(err?.code || "");
  const status = err?.status;
  const name = String(err?.name || "");

  if (code === "auth_timeout") {
    return "Le serveur d'authentification ne répond pas. Réessayez dans un instant.";
  }
  if (
    (typeof status === "number" && status >= 500) ||
    /database error|querying schema|internal server error/i.test(raw)
  ) {
    return "Erreur côté serveur d'authentification (500). Le compte est probablement mal initialisé dans Supabase : voir les Auth Logs.";
  }
  if (code === "invalid_credentials" || /invalid login credentials/i.test(raw)) {
    return "E-mail ou mot de passe incorrect.";
  }
  if (code === "email_not_confirmed" || /email not confirmed/i.test(raw)) {
    return "E-mail non confirmé. Cliquez sur le lien reçu par e-mail, puis reconnectez-vous.";
  }
  if (code === "user_already_exists" || /already registered|already been registered/i.test(raw)) {
    return "Un compte existe déjà avec cet e-mail. Connectez-vous ou réinitialisez votre mot de passe.";
  }
  if (code === "weak_password" || /password should be at least|weak password/i.test(raw)) {
    return "Mot de passe trop faible (6 caractères minimum).";
  }
  if (/valid email|invalid email|email address .* invalid/i.test(raw)) {
    return "Adresse e-mail invalide.";
  }
  if (status === 429 || /rate limit|too many/i.test(raw) || code.includes("rate_limit") || /email rate limit exceeded/i.test(raw)) {
    return "Trop de demandes d'e-mails envoyées. Veuillez patienter quelques minutes.";
  }
  if (/email provider not enabled|smtp/i.test(raw)) {
    return "Le service d'envoi d'e-mails n'est pas configuré correctement sur le serveur.";
  }
  if (/not found|user not found|email address not found/i.test(raw)) {
    return "Aucun compte associé à cette adresse e-mail.";
  }
  if (
    name === "AuthRetryableFetchError" ||
    /failed to fetch|networkerror|network request failed|load failed|fetch failed/i.test(raw)
  ) {
    return "Impossible de joindre le serveur. Vérifiez votre connexion internet (ou désactivez un bloqueur de publicités) puis réessayez.";
  }
  if (/signups? not allowed|signup is disabled/i.test(raw)) {
    return "Les inscriptions sont momentanément fermées.";
  }
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

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
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
      console.error("[auth] login (exception) :", { name: err?.name, code: err?.code, status: err?.status, message: err?.message });
      throw Object.assign(new Error(translateAuthError(err)), { code: err?.code, status: err?.status });
    }
    if (result?.error) {
      const e = result.error;
      console.error("[auth] login (refusé) :", { name: e.name, code: e.code, status: e.status, message: e.message });
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
          emailRedirectTo: window.location.origin,
        },
      });
    } catch (err) {
      console.error("[auth] signup (exception) :", { name: err?.name, code: err?.code, status: err?.status, message: err?.message });
      throw Object.assign(new Error(translateAuthError(err)), { code: err?.code, status: err?.status });
    }
    if (result.error) {
      const e = result.error;
      console.error("[auth] signup (refusé) :", { name: e.name, code: e.code, status: e.status, message: e.message });
      throw Object.assign(new Error(translateAuthError(e)), { code: e.code, status: e.status });
    }

    if (result.data.user && Array.isArray(result.data.user.identities) && result.data.user.identities.length === 0) {
      throw new Error("Un compte existe déjà avec cet e-mail. Connectez-vous ou réinitialisez votre mot de passe.");
    }
    return {
      needsEmailConfirmation: !result.data.session,
    };
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

  const resetPassword = useCallback(async (email) => {
    try {
      const trimmedEmail = email.trim();
      console.log("[auth] Tentative de réinitialisation pour :", trimmedEmail);

      const { data, error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
        redirectTo: window.location.origin,
      });

      if (error) {
        console.error("[auth] Erreur détaillée resetPassword Supabase :", error);
        throw error;
      }

      console.log("[auth] E-mail de réinitialisation envoyé avec succès", data);
      return data;
    } catch (err) {
      console.error("[auth] Exception attrapée dans resetPassword :", err);
      throw new Error(translateAuthError(err));
    }
  }, []);

  // Détermination stricte du compte Administrateur
  const currentUserEmail = session?.user?.email?.trim().toLowerCase();
  const isAdminAccount = currentUserEmail === "admin@bokeone.com";

  // Profil effectif sécurisé : par défaut, tout utilisateur non admin est Membre Gratuit (free)
  const effectiveProfile = useMemo(() => {
    if (!session?.user) return null;
    if (isAdminAccount) {
      return {
        ...(profile || {}),
        role: "admin",
        plan: "elite",
        role_abonnement: "elite",
        is_admin: true,
      };
    }
    // Utilisateur standard : forcé à free sauf si la base de données indique un plan payant valide
    return {
      role: "user",
      is_admin: false,
      ...(profile || {}),
      // Sécurité : empêche qu'un profil vide devienne élite par erreur
      plan: profile?.plan === "elite" || profile?.plan === "essentiel" ? profile.plan : "free",
      role_abonnement: profile?.role_abonnement === "elite" || profile?.role_abonnement === "essentiel" ? profile.role_abonnement : "free",
    };
  }, [profile, isAdminAccount, session]);

  const value = useMemo(() => {
    const isElitePlan =
      isAdminAccount ||
      effectiveProfile?.plan === "elite" ||
      effectiveProfile?.role_abonnement === "elite" ||
      effectiveProfile?.role === "admin";

    return {
      session,
      user: session?.user ? { ...session.user, isAdmin: isAdminAccount } : null,
      profile: effectiveProfile,
      isLoggedIn: !!session?.user,
      isAdmin: isAdminAccount,
      isElite: isElitePlan,
      loading,
      login,
      signup,
      logout,
      resetPassword
    };
  }, [session, effectiveProfile, isAdminAccount, loading, login, signup, logout, resetPassword]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
}