import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";

// Rang des offres (exactement aligné sur votre AuthContext)
const RANK = { none: 0, decouverte: 1, pro: 2, elite: 3 };

// Ce dont la fonctionnalité a besoin
const NEED = { decouverte: 1, pro: 2, elite: 3 };

// Vos liens Stripe depuis le .env
const LINKS = {
  decouverte: import.meta.env.VITE_STRIPE_LINK_DECOUVERTE,
  pro: import.meta.env.VITE_STRIPE_LINK_PRO,
  elite: import.meta.env.VITE_STRIPE_LINK_ELITE,
};

const Ctx = createContext(null);

export function UpgradeProvider({ children, onRequireLogin }) {
  const { isLoggedIn, isAdmin, plan, user } = useAuth();
  const [need, setNeed] = useState(null);

  const rank = isAdmin ? 99 : RANK[plan] ?? 0;
  const can = useCallback((tier) => rank >= NEED[tier], [rank]);

  // guard("pro", fonctionAExecuter)
  const guard = useCallback(
    (tier, action) => (...args) => {
      if (!isLoggedIn) return onRequireLogin?.();
      if (!can(tier)) return setNeed(tier);
      return action?.(...args);
    },
    [isLoggedIn, can, onRequireLogin]
  );

  const checkoutUrl = (tier) => {
    const base = LINKS[tier];
    if (!base || !user?.id) return null;
    const u = new URL(base);
    u.searchParams.set("client_reference_id", user.id); // Transmet l'UUID Supabase à Stripe
    return u.toString();
  };

  const value = useMemo(() => ({ can, guard, openUpgrade: setNeed }), [can, guard]);

  return (
    <Ctx.Provider value={value}>
      {children}
      {need && <PaywallModal need={need} checkoutUrl={checkoutUrl} onClose={() => setNeed(null)} />}
    </Ctx.Provider>
  );
}

export const useGate = () => useContext(Ctx);

function PaywallModal({ need, checkoutUrl, onClose }) {
  const plans = [
    { id: "decouverte", label: "Formule Découverte", price: "19 €/mois" },
    { id: "pro", label: "Formule Pro", price: "49 €/mois" },
    { id: "elite", label: "Formule Élite", price: "129 €/mois" },
  ].filter((p) => NEED[p.id] >= NEED[need]);

  return (
    <div 
      role="dialog" 
      aria-modal="true" 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" 
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="w-full max-w-md bg-neutral-900 border border-amber-500/40 rounded-3xl p-6 space-y-4 shadow-2xl"
      >
        <div className="text-center space-y-1">
          <h3 className="text-lg font-black text-amber-400">🔒 Zone Réservée</h3>
          <p className="text-xs text-neutral-400">Passez à une formule supérieure pour débloquer cet outil.</p>
        </div>

        <div className="space-y-2">
          {plans.map((p) => {
            const url = checkoutUrl(p.id);
            return (
              <a 
                key={p.id} 
                href={url || "#"} 
                className={`block rounded-xl border p-4 text-sm font-bold text-center transition-all ${
                  url 
                    ? "border-amber-500/50 bg-amber-500/10 text-amber-300 hover:bg-amber-500 hover:text-black" 
                    : "border-neutral-800 text-neutral-600 pointer-events-none"
                }`}
              >
                {p.label} · <span className="font-normal">{p.price}</span>
              </a>
            );
          })}
        </div>

        <button 
          type="button" 
          onClick={onClose} 
          className="w-full text-xs text-neutral-400 hover:text-white cursor-pointer transition-colors"
        >
          Non merci, plus tard
        </button>
      </div>
    </div>
  );
}