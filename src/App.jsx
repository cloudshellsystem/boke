// src/App.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "./lib/supabaseClient"; // Votre client Supabase
import HomePage from "./components/HomePage";
import Gallery from "./components/Gallery";
import CreatifsPage from "./components/CreatifsPage";
import ForumPage from "./components/ForumPage";
import EspaceMembrePro from "./components/EspaceMembrePro";
import AuthForm from "./components/AuthForm";

export default function App() {
  const [currentPage, setCurrentPage] = useState("accueil");
  const [userProfile, setUserProfile] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Vérification de la session active Supabase au chargement et écoute des changements
  useEffect(() => {
    // 1. Récupérer la session actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserProfile(session?.user ?? null);
      setLoadingSession(false);
    });

    // 2. Écouter les changements de connexion (Login / Logout en temps réel)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserProfile(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserProfile(null);
    setCurrentPage("accueil");
  };

  if (loadingSession) {
    return (
      <div className="min-h-screen bg-[#070b12] text-amber-400 flex items-center justify-center font-mono text-xs">
        ⚡ Connexion à l'écosystème BOKÉ ONE...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* HEADER / NAVIGATION PRINCIPALE */}
      <header className="sticky top-0 z-40 bg-[#070b12]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3 flex items-center justify-between">
        
        {/* Logo / Marque */}
        <div 
          onClick={() => setCurrentPage("accueil")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-slate-950 shadow-lg group-hover:scale-105 transition-transform">
            BK
          </div>
          <div>
            <h1 className="text-sm font-black tracking-wider text-white">BOKÉ ONE</h1>
            <p className="text-[9px] text-amber-400 font-bold uppercase tracking-widest">Creators Connected</p>
          </div>
        </div>

        {/* Menu de Navigation Central */}
        <nav className="hidden md:flex items-center gap-2 bg-[#0e1424] p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setCurrentPage("accueil")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentPage === "accueil" ? "bg-amber-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white hover:bg-slate-800/40"
            }`}
          >
            🏠 Accueil
          </button>
          
          <button
            onClick={() => setCurrentPage("portfolios")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentPage === "portfolios" ? "bg-amber-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white hover:bg-slate-800/40"
            }`}
          >
            🖼️️ Portfolios
          </button>

          <button
            onClick={() => setCurrentPage("annuaire")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentPage === "annuaire" ? "bg-amber-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white hover:bg-slate-800/40"
            }`}
          >
            📖 Annuaire
          </button>

          <button
            onClick={() => setCurrentPage("forum")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentPage === "forum" ? "bg-amber-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white hover:bg-slate-800/40"
            }`}
          >
            💬 Forum
          </button>

          {/* ESPACE PRO : Visible UNIQUEMENT si l'utilisateur est authentifié via Supabase */}
          {userProfile && (
            <button
              onClick={() => setCurrentPage("espace-pro")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                currentPage === "espace-pro" ? "bg-amber-500 text-slate-950 shadow-md" : "text-amber-400 hover:bg-amber-500/10 border border-amber-500/20"
              }`}
            >
              <span>💎 Espace Pro Dashboard</span>
            </button>
          )}
        </nav>

        {/* Boutons Droite */}
        <div className="flex items-center gap-3">
          {userProfile ? (
            <div className="flex items-center gap-3 bg-[#0e1424] border border-slate-800 px-3 py-1.5 rounded-xl">
              <span className="text-xs font-bold text-slate-200 truncate max-w-[150px]">👤 {userProfile.email}</span>
              <button 
                onClick={handleLogout}
                className="text-[11px] font-bold text-rose-400 hover:text-rose-300 cursor-pointer bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20 transition-colors"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl shadow-lg transition-colors cursor-pointer"
            >
              🔑 Connexion Espace Pro
            </button>
          )}
        </div>
      </header>

      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
        {currentPage === "accueil" && <HomePage onNavigate={setCurrentPage} />}
        {currentPage === "portfolios" && <Gallery userProfile={userProfile} />}
        {currentPage === "annuaire" && <CreatifsPage userProfile={userProfile} />}
        {currentPage === "forum" && <ForumPage userProfile={userProfile} />}
        
        {currentPage === "espace-pro" && (
          userProfile ? (
            <EspaceMembrePro userProfile={userProfile} />
          ) : (
            <div className="text-center py-20 space-y-4">
              <p className="text-3xl">🔒</p>
              <h2 className="text-lg font-bold text-white">Accès restreint à l'Espace Pro</h2>
              <p className="text-xs text-slate-400">Veuillez vous connecter via Supabase pour accéder à votre tableau de bord.</p>
              <button 
                onClick={() => setAuthModalOpen(true)}
                className="px-5 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl cursor-pointer"
              >
                Se connecter
              </button>
            </div>
          )
        )}
      </main>

      {/* MODAL DE CONNEXION */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1424] border border-slate-800 w-full max-w-md rounded-2xl p-6 relative shadow-2xl">
            <button 
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold cursor-pointer"
            >
              ✕
            </button>
            <AuthForm 
              onLoginSuccess={() => {
                setAuthModalOpen(false);
                setCurrentPage("espace-pro");
              }} 
            />
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-slate-800/80 py-6 px-4 text-center text-xs text-slate-500">
        <p>© 2026 BOKÉ ONE — Propulsé par Supabase. Tous droits réservés.</p>
      </footer>
    </div>
  );
}