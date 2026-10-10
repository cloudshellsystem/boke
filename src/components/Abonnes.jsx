import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext"; // 👈 Importation du contexte global de langue

const SUBSCRIPTION_PLANS = {
  fr: [
    { 
      id: 1, 
      name: "Formule Découverte", 
      price: "19,00 €", 
      period: "par mois", 
      badge: "Créateur Indépendant",
      desc: "Idéal pour débuter et accéder au stock standard avec un engagement mensuel flexible", 
      features: ["Accès au stock d'images standard", "Filigrane de protection standard", "Support par e-mail"],
      detailedFeatures: [
        "Consultation et recherche sur toute la banque d'images",
        "Téléchargements en qualité standard",
        "Usage personnel et maquettes",
        "Engagement mensuel résiliable à tout moment"
      ],
      target: "Créateurs indépendants et amateurs exigeants"
    },
    { 
      id: 2, 
      name: "Formule Pro Annuaire & Certifié", 
      price: "49,00 €", 
      period: "par mois", 
      badge: "Recommandé Pro",
      desc: "Pour les professionnels (Photographes, Télépilotes Drone BAPD/CATT/CATS, Régisseurs)", 
      features: ["Visibilité complète dans l'annuaire", "Vérification conformité SIRET & Examens Drone 2026", "Gestion directe des demandes de devis"],
      detailedFeatures: [
        "Fiche profil certifiée dans l'annuaire national",
        "Badges de vérification : SIRET, BAPD, CATT & CATS 2026",
        "Mise en avant de vos spécialités (Drone, Immobilier, Studio)",
        "Accès aux missions exclusives postées sur le réseau"
      ],
      target: "Photographes pro, Pilotes de drone certifiés & Techniciens"
    },
    { 
      id: 3, 
      name: "Formule Élites Entreprise & Compta", 
      price: "129,00 €", 
      period: "par mois", 
      badge: "Agence & Studio",
      desc: "Solution complète avec outil de comptabilité, déclaration annuelle, CRM & conformité globale", 
      features: ["Outil de comptabilité & déclaration annuelle inclus", "CRM personnalisé et tunnels de vente", "Téléchargements illimités sans filigrane"],
      detailedFeatures: [
        "Outil de compta dédié pour la gestion des revenus et déclarations annuelles",
        "CRM complet pour closer vos prospects en salon et gérer vos acomptes (30%)",
        "Registre de conformité juridique (Droit à l'image, autorisations de vol 2026)",
        "Téléchargements illimités en Ultra-HD / 4K avec licences étendues",
        "Support prioritaire & téléphonique 7j/7"
      ],
      target: "Agences médias, Grands comptes & Studios d'élite"
    }
  ],
  en: [
    { 
      id: 1, 
      name: "Discovery Plan", 
      price: "€19.00", 
      period: "per month", 
      badge: "Independent Creator",
      desc: "Ideal for starting out and accessing standard stock with a flexible monthly commitment", 
      features: ["Access to standard image stock", "Standard protection watermark", "Email support"],
      detailedFeatures: [
        "Browse and search across the entire image bank",
        "Standard quality downloads",
        "Personal use and mockups",
        "Flexible monthly subscription, cancel anytime"
      ],
      target: "Independent creators and demanding enthusiasts"
    },
    { 
      id: 2, 
      name: "Pro Directory & Certified Plan", 
      price: "€49.00", 
      period: "per month", 
      badge: "Pro Recommended",
      desc: "For professionals (Photographers, Drone Pilots BAPD/CATT/CATS, Line Producers)", 
      features: ["Full directory visibility", "SIRET & 2026 Drone Exams compliance check", "Direct quote request management"],
      detailedFeatures: [
        "Certified profile page in the national directory",
        "Verification badges: SIRET, BAPD, CATT & CATS 2026",
        "Highlight your specialties (Drone, Real Estate, Studio)",
        "Access to exclusive network jobs and assignments"
      ],
      target: "Pro photographers, Certified drone pilots & Technicians"
    },
    { 
      id: 3, 
      name: "Enterprise & Accounting Elites Plan", 
      price: "€129.00", 
      period: "per month", 
      badge: "Agency & Studio",
      desc: "Complete solution with accounting tool, annual declaration, CRM & global compliance", 
      features: ["Accounting tool & annual declaration included", "Custom CRM & sales funnels", "Unlimited watermark-free downloads"],
      detailedFeatures: [
        "Dedicated accounting tool for revenue tracking and annual declarations",
        "Complete CRM to convert prospects at trade shows and manage deposits (30%)",
        "Legal compliance registry (Image rights, 2026 flight authorizations)",
        "Unlimited Ultra-HD / 4K downloads with extended licenses",
        "Priority & phone support 7 days a week"
      ],
      target: "Media agencies, Key accounts & Elite studios"
    }
  ]
};

const UI_TEXT = {
  fr: {
    headerBadge: "Nos Formules d'Abonnement Pro",
    headerTitle: "Choisissez l'offre adaptée à vos ambitions",
    headerSubtitle: "Un engagement mensuel clair, conçu pour les professionnels de l'image, télépilotes certifiés 2026 et agences exigeantes.",
    btnDetails: "Détails & Avantages ➔",
    btnSubscribe: "Souscrire à cette formule",
    alreadyAccount: "Déjà un compte abonné ?",
    btnLoginSpace: "Se connecter à son espace",
    pricingLabel: "Tarification :",
    whatIncluded: "Ce qui est inclus :",
    btnSubscribeNow: "Souscrire maintenant",
    btnClose: "Fermer",
    memberSpaceTitle: "Espace Abonné Premium",
    connectedAs: "Connecté en tant que :",
    memberStatus: "STATUT : ACTIF",
    btnLogout: "Se déconnecter",
    privilegesTitle: "⭐ Vos privilèges",
    privilege1: "Accès illimité à l'Annuaire National",
    privilege2: "Validation Examens Drone 2026 (BAPD, CATT, CATS)",
    privilege3: "Outils de comptabilité & déclaration annuelle",
    privilege4: "CRM et gestion des tunnels de vente",
    billingTitle: "💳 Facturation",
    nextRenewal: "Prochain renouvellement automatique le 01/11/2026"
  },
  en: {
    headerBadge: "Our Pro Subscription Plans",
    headerTitle: "Choose the plan that fits your ambitions",
    headerSubtitle: "A clear monthly commitment designed for image professionals, 2026 certified drone pilots, and demanding agencies.",
    btnDetails: "Details & Benefits ➔",
    btnSubscribe: "Subscribe to this plan",
    alreadyAccount: "Already have a subscriber account?",
    btnLoginSpace: "Sign in to your space",
    pricingLabel: "Pricing:",
    whatIncluded: "What's included:",
    btnSubscribeNow: "Subscribe now",
    btnClose: "Close",
    memberSpaceTitle: "Premium Subscriber Space",
    connectedAs: "Logged in as:",
    memberStatus: "STATUS: ACTIVE",
    btnLogout: "Log out",
    privilegesTitle: "⭐ Your privileges",
    privilege1: "Unlimited access to the National Directory",
    privilege2: "2026 Drone Exams validation (BAPD, CATT, CATS)",
    privilege3: "Accounting & annual tax declaration tools",
    privilege4: "CRM & sales funnel management",
    billingTitle: "💳 Billing",
    nextRenewal: "Next automatic renewal on 11/01/2026"
  }
};

export default function Abonnes({ onRequireLogin }) {
  const { isLoggedIn, user, logout } = useAuth();
  const { lang } = useLanguage(); // 👈 Récupération de la langue globale
  const [selectedPlanDetails, setSelectedPlanDetails] = useState(null);

  const plans = SUBSCRIPTION_PLANS[lang];
  const ui = UI_TEXT[lang];

  if (!isLoggedIn) {
    return (
      <div className="bg-neutral-950 min-h-screen py-12 px-6 text-neutral-200 font-sans">
        
        <div className="max-w-5xl mx-auto text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold tracking-widest uppercase border border-amber-500/20 mb-3">
            {ui.headerBadge}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">{ui.headerTitle}</h1>
          <p className="text-sm text-neutral-400 max-w-xl mx-auto">
            {ui.headerSubtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className="bg-neutral-900/50 border border-neutral-900 rounded-3xl p-6 flex flex-col justify-between hover:border-amber-500/40 transition shadow-xl"
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md border uppercase bg-neutral-800 text-amber-400 border-neutral-700">
                    {plan.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-xs text-neutral-400 mb-6 leading-relaxed min-h-[40px]">{plan.desc}</p>
                
                <div className="mb-6">
                  <span className="text-3xl font-black text-amber-400">{plan.price}</span>
                  <span className="text-xs text-neutral-500 ml-1">/ {plan.period}</span>
                </div>

                <ul className="space-y-3 text-xs text-neutral-300 mb-6">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">✓</span>
                      <span className="leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 pt-4 border-t border-neutral-800/80">
                <button 
                  onClick={() => setSelectedPlanDetails(plan)}
                  className="w-full bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold py-2 rounded-xl transition flex items-center justify-center gap-1"
                >
                  {ui.btnDetails}
                </button>

                <button 
                  onClick={onRequireLogin} 
                  className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold py-2.5 rounded-xl transition text-xs"
                >
                  {ui.btnSubscribe}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-xs text-neutral-500 mb-3">{ui.alreadyAccount}</p>
          <button onClick={onRequireLogin} className="bg-neutral-900 border border-neutral-800 text-amber-400 px-6 py-2.5 rounded-xl text-xs font-bold hover:border-amber-500/40 transition">
            {ui.btnLoginSpace}
          </button>
        </div>

        {/* MODALE DETAILS */}
        {selectedPlanDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md" onClick={() => setSelectedPlanDetails(null)}>
            <div onClick={(e) => e.stopPropagation()} className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6">
              
              <div className="flex justify-between items-start border-b border-neutral-800 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20 uppercase">
                    {selectedPlanDetails.badge}
                  </span>
                  <h3 className="text-xl font-black text-white mt-2">{selectedPlanDetails.name}</h3>
                  <p className="text-xs text-neutral-400">{selectedPlanDetails.target}</p>
                </div>
                <button onClick={() => setSelectedPlanDetails(null)} className="text-neutral-400 hover:text-white font-bold text-lg">✕</button>
              </div>

              <div className="space-y-4">
                <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 flex justify-between items-center">
                  <span className="text-xs text-neutral-400">{ui.pricingLabel}</span>
                  <span className="text-xl font-black text-amber-400">{selectedPlanDetails.price} <span className="text-xs text-neutral-500 font-normal">/ {selectedPlanDetails.period}</span></span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-neutral-200 mb-3 uppercase tracking-wider">{ui.whatIncluded}</h4>
                  <ul className="space-y-2.5">
                    {selectedPlanDetails.detailedFeatures.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                        <span className="text-amber-400 font-bold shrink-0">✔</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => {
                    setSelectedPlanDetails(null);
                    onRequireLogin?.();
                  }}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black py-3 rounded-xl transition text-xs"
                >
                  {ui.btnSubscribeNow}
                </button>
                <button 
                  onClick={() => setSelectedPlanDetails(null)}
                  className="w-full sm:w-auto bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-5 py-3 rounded-xl text-xs font-bold transition"
                >
                  {ui.btnClose}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    );
  }

  return (
    <div className="bg-neutral-950 min-h-screen py-12 px-6 text-neutral-200 font-sans">
      <div className="max-w-4xl mx-auto bg-neutral-900/50 border border-neutral-900 rounded-3xl p-8 shadow-2xl">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-neutral-800 pb-6 gap-4">
          <div>
            <h1 className="text-2xl font-black text-amber-400 mb-1">{ui.memberSpaceTitle}</h1>
            <p className="text-xs text-neutral-400">{ui.connectedAs} <span className="text-neutral-200">{user?.email || "Membre"}</span></p>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold px-3 py-1.5 rounded-full">{ui.memberStatus}</span>
            <button 
              onClick={logout} 
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-4 py-1.5 rounded-xl text-xs font-bold transition"
            >
              {ui.btnLogout}
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800">
            <h3 className="text-sm font-bold text-amber-400 mb-3 flex items-center gap-2">{ui.privilegesTitle}</h3>
            <ul className="space-y-2 text-xs text-neutral-300">
              <li>✓ {ui.privilege1}</li>
              <li>✓ {ui.privilege2}</li>
              <li>✓ {ui.privilege3}</li>
              <li>✓ {ui.privilege4}</li>
            </ul>
          </div>
          <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-amber-400 mb-3 flex items-center gap-2">{ui.billingTitle}</h3>
              <p className="text-2xl font-black text-white">49,00 € <span className="text-xs font-normal text-neutral-500">/ mois</span></p>
            </div>
            <span className="text-[10px] text-neutral-500 mt-4 block">{ui.nextRenewal}</span>
          </div>
        </div>
      </div>
    </div>
  );
}