import React from "react";
import { useAuth } from "../context/AuthContext";

export default function TarifsPage() {
  const { user } = useAuth();

  const plans = [
    {
      id: "free",
      name: "Découverte / Gratuit",
      price: "0€",
      period: "à vie",
      description: "Idéal pour tester la plateforme et exposer ses premiers travaux.",
      features: [
        "Quota limité à 3 photos en ligne",
        "Modification des photos à volonté",
        "Profil de base dans l'annuaire",
        "🔒 Tableau des missions verrouillé",
        "🔒 Module CRM & Factures verrouillé"
      ],
      buttonText: "Votre plan actuel",
      actionUrl: null,
      color: "border-neutral-800 bg-neutral-900/50"
    },
    {
      id: "essentiel",
      name: "Essentiel",
      price: "19€",
      period: "/ mois",
      description: "Parfait pour les créatifs de terrain qui cherchent activement des contrats.",
      features: [
        "Quota augmenté à 20 photos",
        "Profil complet dans l'annuaire",
        "🔓 Accès illimité au Tableau des Missions",
        "Postuler aux appels d'offres (Châteaux, Mariages...)",
        "🔒 Module CRM & Factures verrouillé"
      ],
      buttonText: "Souscrire au plan Essentiel",
      actionUrl: "https://stripe.com", // REMPLACER par votre vrai lien Stripe Checkout
      color: "border-amber-500/30 bg-neutral-900 shadow-amber-500/5 shadow-2xl relative"
    },
    {
      id: "pro",
      name: "Pro / Élite",
      price: "49€",
      period: "/ mois",
      description: "L'outil de gestion complet pour piloter votre activité de A à Z.",
      features: [
        "Téléversement de photos ILLIMITÉ",
        "Mise en avant prioritaire dans l'annuaire",
        "🔓 Accès illimité au Tableau des Missions",
        "🔓 Module CRM complet (Gestion des ventes)",
        "Générateur de Devis & Factures PDF (Liasse/SIRET)"
      ],
      buttonText: "Passer à la vitesse supérieure",
      actionUrl: "https://stripe.com", // REMPLACER par votre vrai lien Stripe Checkout
      color: "border-neutral-800 bg-neutral-900/50"
    }
  ];

  const handleSubscription = (url) => {
    if (!user) {
      alert("Veuillez vous connecter ou créer un compte avant de choisir une formule.");
      return;
    }
    if (url) {
      window.location.href = url; // Redirection automatique vers la passerelle sécurisée Stripe
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl bg-neutral-950 px-4 py-12 sm:px-8 text-neutral-200 min-h-screen font-sans">
      
      {/* En-tête de la page */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full font-bold uppercase tracking-widest">
          Abonnements Boké One
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white mt-3 tracking-tight">
          Choisissez la formule adaptée à votre activité
        </h1>
        <p className="text-sm text-neutral-400 mt-2 max-w-xl mx-auto">
          Débloquez vos outils de gestion de liasse fiscale ou accédez instantanément aux appels d'offres exclusifs de nos clients.
        </p>
      </div>

      {/* Grille des 3 offres */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className={`border rounded-2xl p-6 sm:p-8 flex flex-col justify-between min-h-[520px] transition hover:border-neutral-700 ${plan.color}`}
          >
            {plan.id === "essentiel" && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] bg-amber-500 text-neutral-950 font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
                Le plus populaire
              </span>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-black text-white">{plan.name}</h3>
                <p className="text-xs text-neutral-400 mt-1 min-h-[32px]">{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-1 py-2">
                <span className="text-4xl font-black text-white tracking-tight">{plan.price}</span>
                <span className="text-xs text-neutral-500 font-medium">{plan.period}</span>
              </div>

              {/* Liste des fonctionnalités */}
              <ul className="space-y-2.5 text-xs text-neutral-300 border-t border-neutral-800/60 pt-4">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span className={feature.startsWith("🔒") ? "text-neutral-500 italic" : ""}>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bouton d'action Stripe */}
            <div className="mt-8">
              {plan.id === "free" ? (
                <div className="w-full bg-neutral-950 border border-neutral-800 text-neutral-500 text-center py-3 rounded-xl text-xs font-bold font-mono">
                  {plan.buttonText}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSubscription(plan.actionUrl)}
                  className={`w-full text-center py-3 rounded-xl text-xs font-bold transition shadow cursor-pointer ${
                    plan.id === "essentiel" 
                      ? "bg-gradient-to-r from-amber-400 to-amber-500 text-neutral-950 hover:brightness-110" 
                      : "bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700"
                  }`}
                >
                  {plan.buttonText}
                </button>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
