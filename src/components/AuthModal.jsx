import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export default function AuthModal({ isOpen, onClose }) {
  const { login } = useAuth();
  const { lang } = useLanguage();
  const isEn = lang === "en";

  const [mode, setMode] = React.useState("login");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPass, setShowPass] = React.useState(false);
  const [error, setError] = React.useState("");

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError(isEn ? "Please fill in all fields." : "Veuillez remplir tous les champs.");
      return;
    }

    login({ email, name: email.split("@")[0] });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 bg-neutral-800 text-neutral-300 hover:text-white w-8 h-8 rounded-full flex items-center justify-center font-bold hover:bg-neutral-700 transition cursor-pointer"
          aria-label="Fermer"
        >
          ✕
        </button>

        <div className="flex bg-neutral-950 p-1 rounded-xl border border-neutral-800">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              mode === "login" ? "bg-amber-500 text-neutral-950 shadow-sm" : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            {isEn ? "Sign In" : "Se connecter"}
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              mode === "signup" ? "bg-amber-500 text-neutral-950 shadow-sm" : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            {isEn ? "Sign Up" : "S'inscrire"}
          </button>
        </div>

        <div className="text-center space-y-1">
          <h3 className="text-xl font-black text-white">
            {mode === "login"
              ? isEn ? "Welcome Back" : "Accès Membre Boké One"
              : isEn ? "Create your Account" : "Rejoignez Boké One"}
          </h3>
          <p className="text-xs text-neutral-400">
            {isEn
              ? "Access the network, image bank, and pro bookings."
              : "Connectez-vous ou créez votre compte pour accéder aux services."}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-300 block">
              {isEn ? "Email Address" : "Adresse email"}
            </label>
            <input
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 outline-none focus:border-amber-400 transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-300 block">
              {isEn ? "Password" : "Mot de passe"}
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-4 pr-10 py-3 text-xs text-white placeholder-neutral-600 outline-none focus:border-amber-400 transition"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-neutral-500 hover:text-neutral-300 cursor-pointer"
              >
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black py-3.5 rounded-xl text-xs uppercase tracking-wider transition shadow-lg cursor-pointer mt-2"
          >
            {mode === "login"
              ? isEn ? "Sign In" : "Se connecter"
              : isEn ? "Create Account" : "Créer mon compte"}
          </button>
        </form>
      </div>
    </div>
  );
}