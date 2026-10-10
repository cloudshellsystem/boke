import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthForm({ onAuthSuccess, onClose }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login, signup, resetPassword } = useAuth();
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const showError = (text) => {
    setIsError(true);
    setMessage(text);
  };
  const showSuccess = (text) => {
    setIsError(false);
    setMessage(text);
  };

  const closeAfterSuccess = () => {
    timerRef.current = setTimeout(() => {
      if (onAuthSuccess) onAuthSuccess();
      if (onClose) onClose();
    }, 700);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setMessage("");
    setIsError(false);
    setSubmitting(true);

    try {
      if (isForgotPassword) {
        await resetPassword(email);
        // Message volontairement identique que le compte existe ou non (pas de fuite d'information)
        showSuccess("Si un compte existe pour cette adresse, un lien de réinitialisation vient d'être envoyé.");
        return;
      }

      if (isSignUp) {
        const { needsEmailConfirmation } = await signup(email, password);
        if (needsEmailConfirmation) {
          showSuccess("Compte créé. Un e-mail de confirmation vous a été envoyé : cliquez sur le lien, puis connectez-vous.");
          setIsSignUp(false);
          setPassword("");
        } else {
          showSuccess("Compte créé avec succès ! Bienvenue sur Boké One.");
          closeAfterSuccess();
        }
        return;
      }

      await login(email, password);
      showSuccess("Connexion réussie !");
      closeAfterSuccess();
    } catch (err) {
      // Vraie erreur affichée telle quelle : aucune session n'est créée dans ce cas.
      showError(err?.message || "Une erreur est survenue. Réessayez.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl text-neutral-200 shadow-2xl relative">
      {onClose && (
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-white font-bold text-lg">
          ✕
        </button>
      )}

      <h2 className="text-xl font-black text-amber-400 mb-6">
        {isForgotPassword ? "Récupérer le mot de passe" : isSignUp ? "Créer un compte" : "Connexion"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-neutral-400 mb-1">Email :</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-amber-500"
            placeholder="votre@email.com"
          />
        </div>

        {!isForgotPassword && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-neutral-400">Mot de passe :</label>
              {!isSignUp && (
                <button
                  type="button"
                  onClick={() => { setIsForgotPassword(true); setMessage(""); setIsError(false); }}
                  className="text-[11px] text-amber-400 hover:underline font-medium"
                >
                  Mot de passe oublié ?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={isSignUp ? 6 : undefined}
                autoComplete={isSignUp ? "new-password" : "current-password"}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 pr-10 text-sm text-white outline-none focus:border-amber-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-amber-400 text-xs font-bold transition"
                title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-neutral-950 font-bold py-3 rounded-xl transition text-sm mt-2 shadow-md cursor-pointer"
        >
          {submitting
            ? "Veuillez patienter…"
            : isForgotPassword
            ? "Envoyer le lien de réinitialisation"
            : isSignUp
            ? "S'inscrire"
            : "Se connecter"}
        </button>

        {message && (
          <p
            role={isError ? "alert" : "status"}
            className={`text-xs text-center font-bold mt-3 ${isError ? "text-red-400" : "text-emerald-400"}`}
          >
            {message}
          </p>
        )}
      </form>

      <div className="mt-6 text-center text-xs text-neutral-400">
        {isForgotPassword ? (
          <button type="button" onClick={() => { setIsForgotPassword(false); setMessage(""); setIsError(false); }} className="text-amber-400 font-bold hover:underline">
            ← Retour à la connexion
          </button>
        ) : (
          <>
            {isSignUp ? "Déjà un compte ?" : "Pas encore de compte ?"}{" "}
            <button type="button" onClick={() => { setIsSignUp(!isSignUp); setMessage(""); setIsError(false); }} className="text-amber-400 font-bold hover:underline ml-1">
              {isSignUp ? "Se connecter" : "S'inscrire"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
