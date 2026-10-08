import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function LockedAccess({
  title = "Accès restreint",
  description = "Cette page est réservée aux membres connectés de Boké One.",
  onRequireLogin,
}) {
  const triggered = useRef(false);

  useEffect(() => {
    if (triggered.current) return;
    triggered.current = true;
    onRequireLogin?.();
  }, [onRequireLogin]);

  return (
    <div className="bg-neutral-950 min-h-[70vh] flex items-center justify-center p-4 sm:p-6 text-neutral-200 font-sans">
      <div className="w-full max-w-md text-center border border-neutral-900 bg-neutral-900/50 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
        <div
          className="mx-auto mb-5 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/30 text-3xl sm:text-4xl"
          aria-hidden="true"
        >
          🔒
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-amber-400 mb-2">{title}</h1>
        <p className="text-sm text-neutral-400 leading-relaxed mb-6">{description}</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => onRequireLogin?.()}
            className="rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-3 text-xs font-black uppercase tracking-wider text-neutral-950 shadow-lg hover:brightness-110 transition"
          >
            Se connecter / S'inscrire
          </button>
          <Link
            to="/"
            className="rounded-xl border border-neutral-800 bg-neutral-900 px-6 py-3 text-xs font-bold uppercase tracking-wider text-neutral-300 hover:border-amber-500/30 transition"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}