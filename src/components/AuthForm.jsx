import React, { useState } from "react";
import { useAuth, translateAuthError } from "../context/AuthContext";

export default function AuthForm({ onClose }) {
  const { login, signup, resetPassword } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👁️ État pour afficher/masquer le mot de passe
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // 1. Validation de la longueur du mot de passe côté client (hors réinitialisation)
    if (!isForgotPassword && password.length < 6) {
      setError("⚠️ Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setLoading(true);

    try {
      if (isForgotPassword) {
        // --- Récupération de mot de passe ---
        await resetPassword(email);
        setMessage("Un e-mail de réinitialisation vous a été envoyé !");
      } else if (isSignUp) {
        // --- Inscription ---
        const res = await signup(email, password);
        if (res?.needsEmailConfirmation) {
          setMessage("Compte créé ! Veuillez vérifier votre boîte e-mail pour confirmer votre inscription.");
        } else {
          setMessage("Compte créé avec succès !");
          if (onClose) setTimeout(onClose, 1500);
        }
      } else {
        // --- Connexion ---
        await login(email, password);
        setMessage("Connexion réussie ! Bienvenue sur Boké One.");
        if (onClose) {
          setTimeout(onClose, 800);
        }
      }
    } catch (err) {
      // 2. Traitement strict de l'erreur pour empêcher l'affichage de {} ou []
      let rawError = err;
      if (typeof err === "object" && err !== null) {
        rawError = err.message || err.error_description || JSON.stringify(err);
      }
      
      if (rawError === "{}" || rawError === "[]" || !rawError) {
        rawError = "Une erreur est survenue lors de l'authentification.";
      }

      // Traduction en français clair
      const cleanMessage = translateAuthError ? translateAuthError(rawError) : rawError;
      setError(cleanMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl text-neutral-100">
      
      {/* Onglets de bascule Inscription / Connexion */}
      {!isForgotPassword && (
        <div className="flex bg-neutral-950 p-1 rounded-xl mb-6 border border-neutral-800">
          <button
            type="button"
            onClick={() => { setIsSignUp(false); setError(""); setMessage(""); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
              !isSignUp ? "bg-amber-500 text-neutral-950 shadow" : "text-neutral-400 hover:text-white"
            }`}
          >
            Se connecter
          </button>
          <button
            type="button"
            onClick={() => { setIsSignUp(true); setError(""); setMessage(""); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
              isSignUp ? "bg-amber-500 text-neutral-950 shadow" : "text-neutral-400 hover:text-white"
            }`}
          >
            S'inscrire
          </button>
        </div>
      )}

      {/* Titres dynamiques */}
      <h2 className="text-xl font-black text-center mb-2">
        {isForgotPassword
          ? "Récupération de mot de passe"
          : isSignUp
          ? "Créer un compte Boké One"
          : "Accès Membre Boké One"}
      </h2>
      <p className="text-xs text-neutral-400 text-center mb-6">
        {isForgotPassword
          ? "Entrez votre e-mail pour recevoir un lien de réinitialisation."
          : "Connectez-vous pour retrouver votre panier et vos réservations."}
      </p>

      {/* Zone des messages d'erreur et de succès */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/40 rounded-xl text-red-400 text-xs font-semibold animate-pulse">
          {error}
        </div>
      )}
      {message && (
        <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/40 rounded-xl text-emerald-400 text-xs font-semibold">
          {message}
        </div>
      )}

      {/* Formulaire principal */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold mb-1 text-neutral-300">
            Adresse email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 transition text-white"
          />
        </div>

        {!isForgotPassword && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-neutral-300">
                Mot de passe (6 car. min.)
              </label>
              {!isSignUp && (
                <button
                  type="button"
                  onClick={() => { setIsForgotPassword(true); setError(""); setMessage(""); }}
                  className="text-[11px] text-amber-400 hover:underline cursor-pointer"
                >
                  Mot de passe oublié ?
                </button>
              )}
            </div>
            
            {/* 👁️ Conteneur avec positionnement absolu pour l'icône de l'œil */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:border-amber-500 transition text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition text-base cursor-pointer"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-neutral-950 font-bold py-3 rounded-xl text-sm transition shadow-lg cursor-pointer disabled:opacity-50 mt-2"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin"></span>
              Chargement...
            </span>
          ) : isForgotPassword ? (
            "Envoyer le lien de réinitialisation"
          ) : isSignUp ? (
            "S'inscrire"
          ) : (
            "Se connecter"
          )}
        </button>
      </form>

      {/* Retour arrière pour Mot de passe oublié */}
      {isForgotPassword && (
        <button
          type="button"
          onClick={() => { setIsForgotPassword(false); setError(""); setMessage(""); }}
          className="w-full mt-4 text-xs text-neutral-400 hover:text-white transition text-center cursor-pointer"
        >
          ← Retour à la connexion
        </button>
      )}
    </div>
  );
}