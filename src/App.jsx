// src/App.jsx
import React, { useState } from "react";
import { supabase } from "./lib/supabaseClient";

// ONGLETS VITRINE
import HomePage from "./components/HomePage";
import Gallery from "./components/Gallery";
import CreatifsPage from "./components/CreatifsPage";
import ForumPage from "./components/ForumPage";

// COMPOSANTS DE L'ESPACE PRO
import TableauVendredi from "./components/TableauVendredi";
import PipelineKanban from "./components/PipelineKanban";
import ModuleRelances from "./components/ModuleRelances";
import ScannerRecurrence from "./components/ScannerRecurrence";
import SuviCoachIA from "./components/SuviCoachIA";
import GrilleDecouverte from "./components/GrilleDecouverte";
import MecanismeDOM from "./components/MecanismeDOM";
import EcranRevelation from "./components/EcranRevelation";
import EvaluateurYoutube from "./components/EvaluateurYoutube";
import CalculateurProAbonnes from "./components/CalculateurProAbonnes";
import GrilleTarifs from "./components/GrilleTarifs";
import ModulePropales from "./components/ModulePropales";
import VuePropaleClient from "./components/VuePropaleClient";
import RegieTerrain from "./components/RegieTerrain";
import Afterworks from "./components/Afterworks";

// NOUVELLES BRIQUES : CONTRATS & PAIEMENT STRIPE
import GenerateurContrat from "./components/GenerateurContrat";
import ModulePaiementStripe from "./components/ModulePaiementStripe";

export default function App() {
  const [currentTab, setCurrentTab] = useState("accueil");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sousOngletPro, setSousOngletPro] = useState("vendredi");

  // SYSTÈMES D'AUTHENTIFICATION & COMPTE UTILISATEUR
  const [estConnecte, setEstConnecte] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  
  const [loginInput, setLoginInput] = useState("");
  const [mdpInput, setMdpInput] = useState("");
  const [errorAuth, setErrorAuth] = useState("");

  const handleLoginSimple = async (e) => {
    e.preventDefault();
    setErrorAuth("");

    // Option 1 : Connexion rapide de test locale
    if (loginInput.trim().toLowerCase() === "admin" && mdpInput.trim() === "admin") {
      setEstConnecte(true);
      setUserProfile({ nom: "Marc Vane", role: "admin", email: "marc@bokeone.com", pack: "Illimité" });
      setCurrentTab("dashboard");
      return;
    } else if (loginInput.trim().toLowerCase() === "membre" && mdpInput.trim() === "membre") {
      setEstConnecte(true);
      setUserProfile({ nom: "Dominique D.", role: "creatif_abonne", email: "dominique@free.fr", pack: "Standard" });
      setCurrentTab("dashboard");
      return;
    }

    // Option 2 : Authentification réelle via Supabase (si l'identifiant est un email)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginInput.trim(),
        password: mdpInput,
      });

      if (error) {
        setErrorAuth("Identifiants incorrects ou erreur Supabase : " + error.message);
      } else if (data.user) {
        setEstConnecte(true);
        setUserProfile({ 
          nom: data.user.email.split('@')[0], 
          role: 'membre_pro', 
          email: data.user.email, 
          pack: 'Illimité' 
        });
        setCurrentTab("dashboard");
      }
    } catch (err) {
      setErrorAuth("Erreur de connexion au serveur d'authentification.");
    }
  };

  const handleNavigatePro = () => {
    if (estConnecte) {
      setCurrentTab("dashboard");
    } else {
      setCurrentTab("login_gate");
    }
    setMobileMenuOpen(false);
  };

  const sectionsEspacePro = [
    {
      titre: "📈 PILOTAGE COMMERCIAL",
      items: [
        { id: 'vendredi', label: '📊 Tableau du Vendredi', comp: <TableauVendredi /> },
        { id: 'pipeline', label: '🗂️ Pipeline Kanban', comp: <PipelineKanban /> },
        { id: 'relances', label: '🔥 Cockpit Relances', comp: <ModuleRelances /> },
        { id: 'recurrence', label: '💰 Scanner Récurrence', comp: <ScannerRecurrence /> },
      ]
    },
    {
      titre: "🤖 INTELLIGENCE & CLOSING",
      items: [
        { id: 'coach_ia', label: '🐱 Suvi Coach IA', comp: <SuviCoachIA /> },
        { id: 'decouverte', label: '📝 Grille SCORE', comp: <GrilleDecouverte /> },
        { id: 'mecanisme_dom', label: '🎯 Diagnostic DOM', comp: <MecanismeDOM /> },
        { id: 'revelation', label: '💼 Écran Révélation', comp: <EcranRevelation /> },
        { id: 'optimiseur_yt', label: '🔴 Optimiseur YouTube', comp: <EvaluateurYoutube /> },
      ]
    },
    {
      titre: "🎬 LIVRABLES & CONTRATS",
      items: [
        { id: 'calculateur_pro', label: '⚙️ Calculateur Métier', comp: <CalculateurProAbonnes /> },
        { id: 'tarifs_packs', label: '📦 Nos 4 Offres Packs', comp: <GrilleTarifs /> },
        { id: 'contrats_gen', label: '📜 Générateur de Contrats', comp: <GenerateurContrat userProfile={userProfile} /> },
        { id: 'paiement_stripe', label: '💳 Passerelle Stripe', comp: <ModulePaiementStripe /> },
        { id: 'propales_liste', label: '📁 Liste des Propales', comp: <ModulePropales /> },
        { id: 'vue_propale', label: '📄 Modèle Propale Client', comp: <VuePropaleClient /> },
        { id: 'regie_tournage', label: '🎥 Régie Terrain & Matos', comp: <RegieTerrain /> },
      ]
    },
    {
      titre: "🤝 ÉCOSYSTÈME SAAS",
      items: [
        { id: 'afterworks', label: '🤝 Hub Afterworks', comp: <Afterworks /> },
      ]
    }
  ];

  const trouverComposantProActif = () => {
    for (const sec of sectionsEspacePro) {
      const match = sec.items.find(i => i.id === sousOngletPro);
      if (match) return match.comp;
    }
    return <TableauVendredi />;
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col font-sans antialiased overflow-x-hidden">
      
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 h-[70px] w-full bg-[#0e1424] border-b border-slate-800 flex items-center justify-between px-6 shadow-xl">
        <div className="flex flex-col cursor-pointer" onClick={() => setCurrentTab("accueil")}>
          <span className="text-lg font-black tracking-wider text-white">BOKE ONE</span>
          <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest block">Creators Connected</span>
        </div>

        <nav className="hidden md:flex items-center gap-2">
          <button className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${currentTab === "accueil" ? "bg-amber-500 text-slate-950 font-black shadow-md" : "text-slate-400 hover:text-white hover:bg-slate-800/40"}`} onClick={() => setCurrentTab("accueil")}>🏠 Accueil</button>
          <button className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${currentTab === "portfolios" ? "bg-amber-500 text-slate-950 font-black shadow-md" : "text-slate-400 hover:text-white hover:bg-slate-800/40"}`} onClick={() => setCurrentTab("portfolios")}>🖼️ Portfolios</button>
          <button className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${currentTab === "annuaire" ? "bg-amber-500 text-slate-950 font-black shadow-md" : "text-slate-400 hover:text-white hover:bg-slate-800/40"}`} onClick={() => setCurrentTab("annuaire")}>📖 Annuaire</button>
          <button className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${currentTab === "forum" ? "bg-amber-500 text-slate-950 font-black shadow-md" : "text-slate-400 hover:text-white hover:bg-slate-800/40"}`} onClick={() => setCurrentTab("forum")}>💬 Forum</button>
          <button className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border border-amber-500/30 flex items-center gap-1.5 ${currentTab === "dashboard" || currentTab === "login_gate" ? "bg-amber-500 text-slate-950 font-black" : "text-amber-400 hover:bg-amber-500/10"}`} onClick={handleNavigatePro}>💎 Espace Pro Dashboard</button>
        </nav>

        <button className="md:hidden bg-transparent border border-slate-800 text-white text-xl px-3 py-1 rounded-lg" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </header>

      {/* MENU MOBILE */}
      {mobileMenuOpen && (
        <div className="fixed top-[70px] left-0 w-full h-[calc(100vh-70px)] bg-[#070b12] border-t border-slate-800 p-6 flex flex-col gap-3 z-50">
          <button className="w-full bg-[#0e1424] border border-slate-800 text-white text-left p-4 rounded-xl text-sm font-bold" onClick={() => { setCurrentTab("accueil"); setMobileMenuOpen(false); }}>🏠 Accueil</button>
          <button className="w-full bg-[#0e1424] border border-slate-800 text-white text-left p-4 rounded-xl text-sm font-bold" onClick={() => { setCurrentTab("portfolios"); setMobileMenuOpen(false); }}>🖼️ Portfolios</button>
          <button className="w-full bg-[#0e1424] border border-slate-800 text-white text-left p-4 rounded-xl text-sm font-bold" onClick={() => { setCurrentTab("annuaire"); setMobileMenuOpen(false); }}>📖 Annuaire</button>
          <button className="w-full bg-[#0e1424] border border-slate-800 text-white text-left p-4 rounded-xl text-sm font-bold" onClick={() => { setCurrentTab("forum"); setMobileMenuOpen(false); }}>💬 Forum</button>
          <button className="w-full bg-[#0e1424] border border-amber-500/40 text-amber-400 text-left p-4 rounded-xl text-sm font-bold" onClick={handleNavigatePro}>💎 Espace Pro Dashboard</button>
        </div>
      )}

      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-start">
        {currentTab === "accueil" && <HomePage onNavigate={setCurrentTab} />}
        {currentTab === "portfolios" && <Gallery userProfile={userProfile} />}
        {currentTab === "annuaire" && <CreatifsPage userProfile={userProfile} />}
        {currentTab === "forum" && <ForumPage />}

        {/* MIRE DE CONNEXION OBLIGATOIRE */}
        {currentTab === "login_gate" && !estConnecte && (
          <div className="w-full max-w-sm mx-auto bg-[#0e1424] border border-slate-800 p-6 rounded-2xl shadow-2xl mt-12 text-xs space-y-4 animate-fade-in">
            <div className="text-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white">🔒 Accès Verrouillé — Cockpit Pro</h3>
              <p className="text-[11px] text-slate-500 mt-1">Test rapide: admin/admin ou email Supabase</p>
            </div>
            <form onSubmit={handleLoginSimple} className="space-y-3">
              {errorAuth && <p className="text-rose-400 font-mono font-bold text-center text-[11px]">{errorAuth}</p>}
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Identifiant / Email :</label>
                <input type="text" value={loginInput} onChange={(e) => setLoginInput(e.target.value)} className="w-full bg-[#070b12] border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-amber-500" placeholder="admin ou email@domaine.com" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Mot de passe :</label>
                <input type="password" value={mdpInput} onChange={(e) => setMdpInput(e.target.value)} className="w-full bg-[#070b12] border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-amber-500" placeholder="••••" />
              </div>
              <button type="submit" className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg transition-colors cursor-pointer shadow-lg">
                Débloquer le Cockpit
              </button>
            </form>
          </div>
        )}

        {/* DASHBOARD PRO (SEULEMENT SI ESTCONNECTE EST TRUE) */}
        {currentTab === "dashboard" && estConnecte && (
          <div className="space-y-6">
            {/* En-tête personnalisé selon le compte connecté */}
            <div className="bg-[#0e1424] border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Espace Personnel Sécurisé</span>
                <h2 className="text-base font-black text-white">Bienvenue, {userProfile?.nom} ({userProfile?.role})</h2>
                <p className="text-xs text-slate-400">Pack actif : <span className="text-emerald-400 font-bold">{userProfile?.pack}</span></p>
              </div>
              <button onClick={async () => { await supabase.auth.signOut(); setEstConnecte(false); setCurrentTab("accueil"); }} className="text-xs text-rose-400 hover:text-rose-300 underline font-bold bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg cursor-pointer">
                Déconnexion
              </button>
            </div>

            {/* Layout Dashboard Pro */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1 space-y-4">
                {sectionsEspacePro.map((sec, sIdx) => (
                  <div key={sIdx} className="bg-[#0e1424] border border-slate-800 p-3 rounded-2xl space-y-1">
                    <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-wider px-2 py-1">{sec.titre}</h3>
                    {sec.items.map((item) => (
                      <button 
                        key={item.id} 
                        onClick={() => setSousOngletPro(item.id)} 
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all border-none cursor-pointer ${sousOngletPro === item.id ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md' : 'text-slate-400 hover:bg-slate-800/40 hover:text-white'}`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                ))}
              </div>

              <div className="lg:col-span-3">
                {trouverComposantProActif()}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}