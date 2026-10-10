import React, { useState } from "react";
import { useAuth, translateAuthError } from "../context/AuthContext";

export default function AuthForm({ onSuccess }) {
  const { register, authError } = useAuth();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setBusy(true);

    try {
      // register ou login géré proprement par le contexte
      const res = await register(email, password);
      if (res?.error) {
        setLocalError(res.error.message || String(res.error));
      } else {
        onSuccess?.();
      }
    } catch (err) {
      setLocalError(translateAuthError(err));
    } finally {
      setBusy(false);
    }
  };

  const errorMsg = localError || authError;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-xl">
      <h2 className="text-lg font-black text-white text-center">
        {mode === "login" ? "Connexion" : "Créer un compte"}
      </h2>
      <input
        type="email"
        required
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-100 placeholder-neutral-500 outline-none focus:border-amber-500/50"
      />
      <input
        type="password"
        required
        minLength={6}
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-100 placeholder-neutral-500 outline-none focus:border-amber-500/50"
      />
      {errorMsg && (
        <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {errorMsg}
        </p>
      )}
      <button
        type="submit"
        disabled={busy}
        className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 py-3 rounded-xl font-black text-sm transition cursor-pointer"
      >
        {busy ? "..." : mode === "login" ? "Se connecter" : "S'inscrire"}
      </button>
      <button
        type="button"
        onClick={() => { setMode(mode === "login" ? "register" : "login"); setLocalError(""); }}
        className="w-full text-xs text-neutral-400 hover:text-amber-400 transition cursor-pointer"
      >
        {mode === "login" ? "Pas de compte ? S'inscrire" : "Déjà inscrit ? Se connecter"}
      </button>
    </form>
  );
}