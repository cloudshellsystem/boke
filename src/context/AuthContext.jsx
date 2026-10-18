import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "../lib/supabaseClient";

/**
 * AUTHENTIFICATION — règles de ce fichier
 * 1. Aucune connexion "locale de secours" : si Supabase répond par une erreur (mauvais mot de
 *    passe, réseau coupé…), on lève une erreur lisible et AUCUNE session n'est créée.
 * 2. Le rôle et l'offre (plan) viennent de la table `profiles` côté serveur. Le navigateur
 *    ne peut pas les modifier (voir supabase_05_unified.sql). Ici on ne fait que les LIRE
 *    pour adapter l'affichage ; la vraie protection est dans les policies RLS et les RPC.
 * 3. `loading` reste vrai tant que la session ET le profil ne sont pas résolus, pour éviter
 *    d'afficher un écran verrouillé (ou pire, déverrouillé) pendant le chargement.
 */

const AuthContext = createContext(null);

// "*" : tolère les différences de colonnes entre bases (plan / role_abonnement). RLS limite la lecture à sa propre ligne.
const PROFILE_COLUMNS = "*";

// Transforme les erreurs techniques Supabase en messages clairs pour l'utilisateur.
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
  if (code === "same_password" || /different from the old password/i.test(raw)) {
    return "Le nouveau mot de passe doit être différent de l'ancien.";
  }
  if (/auth session missing|session.*(expired|not found)|otp_expired|link.*(expired|invalid)/i.test(raw) || code === "otp_expired") {
    return "Le lien a expiré ou a déjà été utilisé. Refaites une demande de réinitialisation.";
  }
  if (/not authorized|email address not authorized/i.test(raw)) {
    return "Envoi d'e-mail impossible : le serveur d'e-mails n'est pas configuré pour cette adresse (SMTP).";
  }
  if (/valid email|invalid email|email address .* invalid/i.test(raw)) {
    return "Adresse e-mail invalide.";
  }
  if (status === 429 || /rate limit|too many/i.test(raw) || code.includes("rate_limit")) {
    return "Trop de tentatives. Patientez quelques minutes avant de réessayer.";
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

// Garantit qu'un appel réseau se termine toujours (l'UI ne reste jamais bloquée sur un 504 / silence serveur).
function withTimeout(promise, ms = 20000) {
  let t;
  const timeout = new Promise((_, reject) => {
    t = setTimeout(() => reject(Object.assign(new Error("timeout"), { code: "auth_timeout" })), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(t));
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  // Vrai quand l'utilisateur arrive depuis le lien « mot de passe oublié » : il doit choisir un nouveau mot de passe.
  const [isRecovery, setIsRecovery] = useState(false);

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
      setProfile(null); // en cas de doute : AUCUN droit supplémentaire
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
        if (active) setLoading(false); // toujours libérer l'affichage
      }
    }
    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!active) return;
      if (event === "PASSWORD_RECOVERY") setIsRecovery(true);
      setSession(nextSession ?? null);
      if (nextSession?.user) {
        // Ne JAMAIS faire un appel Supabase avec await directement dans ce callback
        // (risque de blocage) : on le reporte au tour suivant.
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

  // Connexion. Garanties :
  //  - la promesse se termine TOUJOURS (timeout 20 s) → la modale ne reste jamais bloquée sur "Connexion…"
  //  - l'erreur levée est une vraie Error avec message lisible + code/status conservés (plus de "{}")
  //  - la session est appliquée immédiatement (sans attendre onAuthStateChange)
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
      result = await withTimeout(
        supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: fullName ? { full_name: fullName } : {},
            emailRedirectTo: `${window.location.origin}/espace-pro`,
          },
        }),
        30000
      );
    } catch (err) {
      console.error("[auth] signup (exception) :", { name: err?.name, code: err?.code, status: err?.status, message: err?.message });
      throw new Error(translateAuthError(err));
    }
    if (result.error) {
      console.error("[auth] signup (refusé) :", { name: result.error.name, code: result.error.code, status: result.error.status, message: result.error.message });
      throw new Error(translateAuthError(result.error));
    }

    // Quand la confirmation par e-mail est active, Supabase renvoie un utilisateur sans
    // identités si l'adresse existe déjà (pour ne pas révéler les comptes existants).
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
    // Dans tous les cas, l'état local est vidé.
    setSession(null);
    setProfile(null);
  }, []);

  // Réinitialisation de mot de passe : envoie une demande au propre e-mail de l'utilisateur
  // et force la redirection vers la page /espace-pro de VOTRE site web.
  const resetPassword = useCallback(async (email) => {
    let result;
    try {
      result = await withTimeout(
        supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/espace-pro`,
        })
      );
    } catch (err) {
      console.error("[auth] reset (exception) :", { name: err?.name, code: err?.code, status: err?.status, message: err?.message });
      throw new Error(translateAuthError(err));
    }
    if (result.error) {
      console.error("[auth] reset (refusé) :", { name: result.error.name, code: result.error.code, status: result.error.status, message: result.error.message });
      throw new Error(translateAuthError(result.error));
    }
  }, []);

  // Définit le nouveau mot de passe (session de récupération ouverte par le lien e-mail).
  const updatePassword = useCallback(async (newPassword) => {
    let result;
    try {
      result = await withTimeout(supabase.auth.updateUser({ password: newPassword }));
    } catch (err) {
      throw new Error(translateAuthError(err));
    }
    if (result.error) throw new Error(translateAuthError(result.error));
    setIsRecovery(false);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (session?.user) return loadProfile(session.user.id);
    return null;
  }, [session, loadProfile]);

  const value = useMemo(() => {
    const user = session?.user ?? null;
    const role = profile?.role ?? null;
    // Source de vérité : profiles.role_abonnement (gratuit | essentiel | pro | elite).
    // Normalisé (casse, accents) puis ramené aux codes internes : elite | pro | decouverte | none.
    const rawTier = String(profile?.role_abonnement ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    const plan =
      rawTier === "elite" ? "elite"
      : rawTier === "pro" ? "pro"
      : rawTier === "essentiel" || rawTier === "decouverte" ? "decouverte"
      : "none";
    const isAdmin = role === "admin";
    return {
      session,
      user,
      profile,
      role,
      plan,
      loading,
      isLoggedIn: !!user,
      isAdmin,
      // Miroir d'affichage des droits serveur (la vérité reste côté base de données)
      // Code d'offre pour les badges : 'admin' | 'elite' | 'pro' | 'decouverte' | 'none'
      userRole: isAdmin ? "admin" : plan,
      hasProAccess: isAdmin || plan === "pro" || plan === "elite",
      // Offre Premium / Agence (129 €) : outils CRM et tunnels de vente
      hasPremiumAccess: isAdmin || plan === "elite",
      hasDiscoveryAccess: isAdmin || plan === "decouverte" || plan === "pro" || plan === "elite",
      // Quota de photos (affichage ; la limite réelle est appliquée par le trigger SQL de supabase_10)
      photoQuota: isAdmin || plan === "pro" || plan === "elite" ? Infinity : plan === "decouverte" ? 20 : 3,
      login,
      signup,
      logout,
      resetPassword,
      refreshProfile,
      isRecovery,
      updatePassword,
    };
  }, [session, profile, loading, isRecovery, login, signup, logout, resetPassword, refreshProfile, updatePassword]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans un <AuthProvider>");
  return ctx;
}