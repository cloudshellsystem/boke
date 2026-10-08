import React from "react";
import { useAuth } from "../context/AuthContext";

const SUBSCRIPTION_PLANS = [
  { id: 1, name: "Formule Découverte", price: "4,99 €", period: "par mois", desc: "Idéal pour les amateurs de belles images", features: ["Accès au stock d'images standard", "Filigrane standard", "Support par e-mail"] },
  { id: 2, name: "Formule Pro Annuaire", price: "14,99 €", period: "par mois", desc: "Pour les créateurs et professionnels indépendants", features: ["Visibilité complète dans l'annuaire", "Mise en avant du matériel et zone de déplacement", "Gestion simplifiée des demandes"] },
  { id: 3, name: "Formule Élites Entreprise", price: "39,99 €", period: "par mois", desc: "Solution complète pour agences et grands comptes", features: ["Accès illimité aux téléchargements", "Support prioritaire 7j/7", "CRM et calculateur de commission pro inclus"] }
];

export default function Abonnes({ onRequireLogin }) {
  const { isLoggedIn, user, logout } = useAuth(); // Récupération de logout

  // Si non connecté : affichage des différentes formules et tarifs
  if (!isLoggedIn) {
    return (
      <div className="bg-neutral-950 min-h-screen py-12 px-6 text-neutral-200 font-sans">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold tracking-widest uppercase border border-amber-500/20 mb-3">Nos Formules d'Abonnement</span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">Choisissez l'offre adaptée à vos ambitions</h1>
          <p className="text-sm text-neutral-400 max-w-xl mx-auto">Accédez à des avantages exclusifs, débloquez l'annuaire des créateurs et profitez d'une visibilité maximale.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <div key={plan.id} className="bg-neutral-900/50 border border-neutral-900 rounded-3xl p-6 flex flex-col justify-between hover:border-amber-500/40 transition">
              <div>
                <h3 className="text-lg font-bold text-amber-400 mb-1">{plan.name}</h3>
                <p className="text-xs text-neutral-400 mb-6">{plan.desc}</p>
                <div className="mb-6">
                  <span className="text-3xl font-black text-white">{plan.price}</span>
                  <span className="text-xs text-neutral-500 ml-1">/ {plan.period}</span>
                </div>
                <ul className="space-y-3 text-xs text-neutral-300 mb-6">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-amber-400">✓</span> {feat}
                    </li>
                  ))}
                </ul>
              </div>
              <button onClick={onRequireLogin} className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold py-3 rounded-xl transition text-xs">
                Souscrire à cette formule
              </button>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-xs text-neutral-500 mb-3">Déjà un compte abonné ?</p>
          <button onClick={onRequireLogin} className="bg-neutral-900 border border-neutral-800 text-amber-400 px-6 py-2.5 rounded-xl text-xs font-bold hover:border-amber-500/40 transition">
            Se connecter à son espace
          </button>
        </div>
      </div>
    );
  }

  // Si l'utilisateur est connecté : affichage de son espace abonné actif avec option de déconnexion
  return (
    <div className="bg-neutral-950 min-h-screen py-12 px-6 text-neutral-200 font-sans">
      <div className="max-w-4xl mx-auto bg-neutral-900/50 border border-neutral-900 rounded-3xl p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-neutral-800 pb-6 gap-4">
          <div>
            <h1 className="text-2xl font-black text-amber-400 mb-1">Espace Abonné Premium</h1>
            <p className="text-xs text-neutral-400">Connecté en tant que : <span className="text-neutral-200">{user?.email || "Membre"}</span></p>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold px-3 py-1.5 rounded-full">STATUT : ACTIF</span>
            <button 
              onClick={logout} 
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-4 py-1.5 rounded-xl text-xs font-bold transition"
            >
              Se déconnecter
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800">
            <h3 className="text-sm font-bold text-amber-400 mb-3 flex items-center gap-2">⭐ Vos privilèges</h3>
            <ul className="space-y-2 text-xs text-neutral-300">
              <li>✓ Accès illimité à l'Annuaire National</li>
              <li>✓ Déblocage complet des fiches créateurs</li>
              <li>✓ Tarifs préférentiels sur les licences</li>
            </ul>
          </div>
          <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-amber-400 mb-3 flex items-center gap-2">💳 Facturation</h3>
              <p className="text-2xl font-black text-white">9,99 € <span className="text-xs font-normal text-neutral-500">/ mois</span></p>
            </div>
            <span className="text-[10px] text-neutral-500 mt-4 block">Prochain renouvellement automatique le 01/05/2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}