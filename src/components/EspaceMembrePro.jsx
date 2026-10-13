import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import DashboardCreatif from "./DashboardCreatif";
import FacturationEtProfilPro from "./FacturationEtProfilPro";

const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

export default function EspaceMembrePro() {
  const { isLoggedIn, loading: authLoading, user } = useAuth();
  const { lang } = useLanguage();
  const isEn = lang === "en";

  const [activeTab, setActiveTab] = useState("dashboard");
  const [userProfile, setUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [scriptStep, setScriptStep] = useState(1);

  const [mockLeads] = useState([
    {
      id: 1,
      clientName: "M. Kaba",
      status: "Négociation en cours",
      budget: "150 €",
      scriptSteps: {
        1: isEn ? "« Hello Mr. Kaba, I see you closely follow the work 'Lights of Conakry'. For your 150€ budget, we guarantee an immediate rights assignment. »" : "« Bonjour M. Kaba, je vois que vous suivez de près l'œuvre « Lumières de Conakry ». Pour votre budget de 150 €, nous vous garantissons une cession de droits immédiate. »",
        2: isEn ? "« I understand your need for reflection. Please note this license includes a 72h territorial exclusivity on Paris. »" : "« Je comprends votre besoin de réflexion. Sachez que cette licence inclut une exclusivité territoriale de 72h sur Paris. »",
        3: isEn ? "« Perfect, let's sign the digital order form right away! »" : "« Parfait, on signe le bon de commande numérique tout de suite ? »",
      },
    },
  ]);

  useEffect(() => {
    if (isLoggedIn && user) {
      // 🔑 CORRECTION CHIRURGICALE : On sélectionne les vraies colonnes de production BDD
      supabase
        .from("profiles")
        .select("role, role_abonnement")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          if (data) setUserProfile(data);
          setLoadingProfile(false);
        });
    } else {
      setLoadingProfile(false);
    }
  }, [isLoggedIn, user]);

  const userPlan = userProfile?.role_abonnement || "gratuit";
  const isSuperAdmin = userProfile?.role === "admin" || user?.isAdmin === true;

  // 🔒 Matrice de sécurité conforme à vos 4 profils d'accès
  const aAccesMissions = isSuperAdmin || ["essentiel", "pro", "elite"].includes(userPlan);
  const aAccesCRM = isSuperAdmin || ["pro", "elite"].includes(userPlan);

  if (authLoading || loadingProfile) {
    return (
      <div className="mx-auto w-full max-w-4xl bg-neutral-950 p-8 text-neutral-400 min-h-[70vh] flex items-center justify-center text-sm font-sans">
        {isEn ? "Checking your access..." : "Vérification de votre accès…"}
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="mx-auto w-full max-w-4xl bg-neutral-950 p-8 text-neutral-400 min-h-[70vh] flex items-center justify-center text-sm font-sans">
        {isEn ? "Please log in to access the Pro Space." : "Veuillez vous connecter pour accéder à l'Espace Pro."}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl bg-neutral-950 p-4 sm:p-8 text-neutral-200 min-h-screen font-sans space-y-8">
      
      {/* En-tête */}
      <div className="space-y-1">
        <span className="text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
          Espace Pro & Facturation Officielle
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Espace Vente, Compta & Conformité Pro
        </h1>
        <p className="text-xs text-neutral-400">
          Gérez vos abonnements, suivez l'impact de vos galeries et émettez vos documents légaux.
        </p>
      </div>

      {/* 📊 MINI COMPTEURS ANALYTIQUES ACCESSIBLES AU PREMIER REGARD */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">👁️ Vues Totales</span>
          <div className="text-2xl font-black text-white font-mono mt-1">14 250</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
          <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider block">❤️ Likes Cumulés</span>
          <div className="text-2xl font-black text-white font-mono mt-1">3 840</div>
        </div>
        <div className="bg-gradient-to-r from-neutral-900 to-amber-950/20 border border-neutral-800 p-5 rounded-2xl">
          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">💰 CA Généré</span>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">1 850,00 €</div>
        </div>
      </div>

      {/* 📁 BOUTONS DE NAVIGATION INTERNES (AVEC RECRÉATION DU BOUTON DASHBOARD) */}
      <div className="space-y-2">
        <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider">📁 Modules et Fonctionnalités</h3>
        <div className="flex flex-wrap bg-neutral-900/80 p-1.5 rounded-xl border border-neutral-800 gap-1.5 max-w-2xl">
          <button
            type="button"
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-2.5 rounded-lg text-xs font-black transition cursor-pointer border-none ${
              activeTab === "dashboard" ? "bg-amber-500 text-neutral-950 shadow-md" : "text-neutral-400 hover:text-white bg-transparent"
            }`}
          >
            📊 Dashboard Créatif
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("missions")}
            className={`px-4 py-2.5 rounded-lg text-xs font-black transition cursor-pointer border-none flex items-center gap-1.5 ${
              activeTab === "missions" ? "bg-amber-500 text-neutral-950 shadow-md" : "text-neutral-400 hover:text-white bg-transparent"
            }`}
          >
            💼 Missions Dispo {!aAccesMissions && "🔒"}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("crm")}
            className={`px-4 py-2.5 rounded-lg text-xs font-black transition cursor-pointer border-none flex items-center gap-1.5 ${
              activeTab === "crm" ? "bg-amber-500 text-neutral-950 shadow-md" : "text-neutral-400 hover:text-white bg-transparent"
            }`}
          >
            📋 Facturation & CRM {!aAccesCRM && "🔒"}
          </button>
        </div>
      </div>

      {/* 🚀 LOGIQUE DE RENDU CONDITIONNEL DU TABLEAU DE BORD */}
      <div className="pt-2">
        {activeTab === "dashboard" && (
          <DashboardCreatif />
        )}

        {activeTab === "missions" && (
          <>
            {aAccesMissions ? (
              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4">
                <h3 className="text-sm font-black text-amber-400 uppercase tracking-wider">Appels d'offres en France</h3>
                <div className="border border-neutral-850 p-4 rounded-xl text-xs font-mono text-neutral-500 italic text-center">
                  Aucun appel d'offre pour le moment.
                </div>
              </div>
            ) : (
              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 text-center space-y-4 max-w-xl mx-auto shadow-xl">
                <div className="text-2xl">🔒</div>
                <h3 className="text-sm font-black text-white">Module Réservé aux Membres Essentiel & Élite</h3>
                <p className="text-xs text-neutral-400">Votre plan actuel (Gratuit) ne vous permet pas de postuler aux offres de terrain.</p>
                <button type="button" className="bg-amber-500 text-neutral-950 text-xs font-black px-4 py-2 rounded-xl border-none cursor-pointer">
                  Passer au Plan Essentiel (19€/mois) ➔
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === "crm" && (
          <>
            {aAccesCRM ? (
              <div className="space-y-8">
                {/* 🎯 SCRIPT DE VENDRE EN DIRECT RECONSTRUIT POUR LE CRM */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4">
                  <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
                    <div>
                      <h3 className="text-sm font-black text-amber-400 uppercase tracking-wider">🎯 Pipeline & Vendre en Direct</h3>
                      <p className="text-[11px] text-neutral-400 mt-0.5">Prospect actuel : <span className="text-white font-bold">{mockLeads[0].clientName}</span> ({mockLeads[0].status})</p>
                    </div>
                    <span className="text-xs bg-neutral-950 border border-neutral-800 px-3 py-1 rounded-lg font-mono text-amber-500 font-bold">Budget : {mockLeads[0].budget}</span>
                  </div>

                  {/* Étapes du script */}
                  <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-850 space-y-3">
                    <p className="text-xs text-amber-400 italic font-medium">{mockLeads[0].scriptSteps[scriptStep]}</p>
                    <div className="flex gap-2 pt-2">
                      {[1, 2, 3].map((step) => (
                        <button
                          key={step}
                          onClick={() => setScriptStep(step)}
                          className={`px-3 py-1 rounded text-[11px] font-bold border transition cursor-pointer ${
							  
scriptStep === step ? "bg-amber-500 text-neutral-950 border-transparent" : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white"
}`}
>
Étape {step}

))}


{/* MODULE DE FACTURATION COMPLIANT AVEC LIVE PREVIEW & LOGO */}


) : (

🔒
Module Réservé aux Membres Pro & Élite
L'édition de factures PDF, liasse SIRET et outils CRM de closing nécessitent le plan Pro.

Débloquer les outils de Gestion Élite (49€/mois) ➔


)}
</>
)}
);
}