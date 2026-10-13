import React, { useEffect, useState } from "react";
import { useAuth, translateAuthError } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export default function AuthModal({ isOpen, onClose }) {
  const { login, signup, resetPassword } = useAuth();
  const { lang } = useLanguage();
  const isEn = lang === "en";

  const [mode, setMode] = useState("login"); // "login" | "signup" | "forgot"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!email) {
      setError(isEn ? "Please enter your email address." : "Veuillez entrer votre adresse email.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "forgot") {
        await resetPassword(email);
        setSuccessMsg(
          isEn
            ? "A recovery link has been sent to your email address."
            : "Un lien de récupération a été envoyé sur votre adresse email."
        );
      } 
      else if (mode === "signup") {
        const { needsEmailConfirmation } = await signup(email, password);
        
        if (needsEmailConfirmation) {
          setSuccessMsg(
            isEn 
              ? "Registration successful! Please check your mailbox to confirm." 
              : "Inscription réussie ! Un e-mail de confirmation vous a été envoyé."
          );
        } else {
          setSuccessMsg(isEn ? "Account created successfully!" : "Compte créé avec succès !");
          onClose();
        }
      } 
      else {
        await login(email, password);
        onClose(); 
      }
    } catch (err) {
      const rawMessage = err?.message || String(err);
      
      // 🚨 INTERCEPTION GIRO / ALARME : Compte introuvable dans Supabase
      if (rawMessage.includes("Invalid login credentials")) {
        setError(
          isEn 
            ? "🚨 ALARM: You are not registered in our database! Please click on the 'Sign Up' tab above to create your account." 
            : "🚨 ALERTE : Vous n'êtes pas inscrit dans nos bases ! Veuillez cliquer sur l'onglet 'S'inscrire' juste au-dessus pour créer votre compte."
        );
      } else {
        setError(isEn ? rawMessage : translateAuthError(rawMessage));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl space-y-6 text-neutral-200 font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bouton de fermeture */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 bg-neutral-800 text-neutral-300 hover:text-white w-8 h-8 rounded-full flex items-center justify-center font-bold hover:bg-neutral-700 transition cursor-pointer border-none"
          aria-label="Fermer"
        >
          ✕
        </button>

        {/* Onglets d'action */}
        {mode !== "forgot" && (
          <div className="flex bg-neutral-950 p-1 rounded-xl border border-neutral-800">
            <button
              type="button"
              onClick={() => { setMode("login"); setError(""); setSuccessMsg(""); }}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition cursor-pointer border-none ${
                mode === "login" ? "bg-amber-500 text-neutral-950 shadow-sm" : "text-neutral-400 hover:text-neutral-200 bg-transparent"
              }`}
            >
              {isEn ? "Sign In" : "Se connecter"}
            </button>
            <button
              type="button"
              onClick={() => { setMode("signup"); setError(""); setSuccessMsg(""); }}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition cursor-pointer border-none ${
                mode === "signup" ? "bg-amber-500 text-neutral-950 shadow-sm" : "text-neutral-400 hover:text-neutral-200 bg-transparent"
              }`}
            >
              {isEn ? "Sign Up" : "S'inscrire"}
            </button>
          </div>
        )}

        <div className="text-center space-y-1">
          <h3 className="text-xl font-black text-white">
            {mode === "login"
              ? isEn ? "Welcome Back" : "Accès Membre Boké One"
              : mode === "signup"
              ? isEn ? "Create your Account" : "Rejoignez Boké One"
              : isEn ? "Reset Password" : "Réinitialisation de mot de passe"}
          </h3>
          <p className="text-xs text-neutral-400">
            {mode === "forgot"
              ? isEn ? "Enter your email to receive a recovery link." : "Entrez votre email pour recevoir votre lien de récupération."
              : isEn ? "Access the network, image bank, and pro bookings." : "Connectez-vous ou créez votre compte pour accéder aux services."}
          </p>
        </div>

        {/* Encadré d'erreur Look Gyrophare d'alarme clignotant */}
        {error && (
          <div className="bg-red-950/40 border-2 border-red-500 text-red-400 text-xs p-3.5 rounded-xl text-center font-bold animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs p-3 rounded-xl text-center font-medium">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Champ Adresse Email */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-300 block">
              {isEn ? "Email Address" : "Adresse email"}
            </label>
            <input
              type="email"
              required
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 outline-none focus:border-amber-400 transition font-mono"
            />
          </div>

          {/* Champ Mot de passe */}
          {mode !== "forgot" && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-300 block">
                {isEn ? "Password" : "Mot de passe"}
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-4 pr-10 py-3 text-xs text-white placeholder-neutral-600 outline-none focus:border-amber-400 transition font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-neutral-500 hover:text-neutral-300 cursor-pointer border-none bg-transparent"
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
              
              {mode === "login" && (
                <div className="text-right pt-1">
                  <button
                    type="button"
                    onClick={() => { setMode("forgot"); setError(""); setSuccessMsg(""); }}
                    className="text-[11px] text-amber-400 hover:underline cursor-pointer font-medium bg-transparent border-none"
                  >
                    {isEn ? "Forgot password?" : "Mot de passe oublié ?"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Bouton de validation principal */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black py-3.5 rounded-xl text-xs uppercase tracking-wider transition shadow-lg cursor-pointer mt-2 border-none disabled:opacity-50"
          >
            {loading 
              ? (isEn ? "Processing..." : "Connexion au serveur...") 
              : mode === "login"
              ? (isEn ? "Sign In ➔" : "Se connecter ➔")
              : mode === "signup"
              ? (isEn ? "Create Account ➔" : "Créer mon compte ➔")
              : (isEn ? "Send Reset Link ➔" : "Envoyer le lien ➔")}
          </button>

          {mode === "forgot" && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => { setMode("login"); setError(""); setSuccessMsg(""); }}
                className="text-xs text-neutral-400 hover:text-white underline cursor-pointer bg-transparent border-none"
              >
                {isEn ? "Back to Sign In" : "Retour à la connexion"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
