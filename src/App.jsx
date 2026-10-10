import React, { useState, useCallback, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import ReactGA from "react-ga4";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider, useCart } from "./context/CartContext";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";
import { supabase } from "./lib/supabaseClient";

import HomePage from "./components/HomePage";
import CreatorDirectory from "./components/CreatorDirectory";
import ForumPage from "./components/ForumPage";
import AdminForumModeration from "./components/AdminForumModeration";
import EspaceMembrePro from "./components/EspaceMembrePro";
import Abonnes from "./components/Abonnes";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import CGUPage from "./components/CGUPage";
import WhatsAppWidget from "./components/WhatsAppWidget";
import Footer from "./components/Footer";

// Initialisation de Google Analytics 4
ReactGA.initialize("G-FVFKNP75BZ");

const NAV_LINKS_DATA = {
  fr: [
    { to: "/", label: "Accueil / Stock" },
    { to: "/creators", label: "Créateurs" },
    { to: "/forum", label: "Forum" },
    { to: "/espace-pro", label: "Espace Pro" },
    { to: "/abonnes", label: "Abonnés" },
  ],
  en: [
    { to: "/", label: "Home / Stock" },
    { to: "/creators", label: "Creators" },
    { to: "/forum", label: "Forum" },
    { to: "/espace-pro", label: "Pro Space" },
    { to: "/abonnes", label: "Subscribers" },
  ],
};

const UI_LABELS = {
  fr: {
    cart: "Panier",
    connected: "Connecté",
    login: "Connexion",
    slogan: "RESEAU D'ELITE & BANQUE D'IMAGES NATIONALE",
  },
  en: {
    cart: "Cart",
    connected: "Connected",
    login: "Sign In",
    slogan: "ELITE NETWORK & NATIONAL IMAGE BANK",
  },
};

const isActivePath = (pathname, to) =>
  to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(`${to}/`);

// Composant Modal d'Authentification Intégré
function AuthModalContent({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert("Inscription réussie ! Vous êtes désormais connecté.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      onClose();
    } catch (err) {
      setErrorMsg(err.message || "Erreur d'authentification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-amber-400">
          {isSignUp ? "Créer un compte Boké One" : "Connexion Membre"}
        </h3>
        <button
          onClick={onClose}
          className="text-neutral-400 hover:text-white font-bold text-lg p-1"
        >
          ✕
        </button>
      </div>

      {errorMsg && (
        <div className="mb-4 text-xs font-semibold bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleAuth} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-neutral-300 block mb-1">Email :</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-amber-500"
            placeholder="votre@email.com"
            required
          />
        </div>

        <div>
          <label className="text-xs font-bold text-neutral-300 block mb-1">Mot de passe :</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-amber-500"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-neutral-950 font-bold rounded-xl text-xs uppercase tracking-wider hover:brightness-110 transition cursor-pointer"
        >
          {loading ? "Chargement..." : isSignUp ? "S'inscrire" : "Se connecter"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-xs text-neutral-400 hover:text-amber-400 underline cursor-pointer"
        >
          {isSignUp ? "Déjà un compte ? Connectez-vous" : "Pas encore de compte ? S'inscrire"}
        </button>
      </div>
    </div>
  );
}

function GlobalNavbar({ onOpenAuth }) {
  const { cart } = useCart();
  const { isLoggedIn } = useAuth();
  const { pathname } = useLocation();
  const { lang, toggleLanguage } = useLanguage();

  const navLinks = NAV_LINKS_DATA[lang];
  const ui = UI_LABELS[lang];

  const tabClass = (to) =>
    `whitespace-nowrap rounded-xl border px-3.5 py-2 text-sm font-medium transition ${
      isActivePath(pathname, to)
        ? "bg-amber-500/10 border-amber-500/30 text-amber-400 font-bold"
        : "border-transparent text-neutral-200 hover:text-amber-400 hover:bg-neutral-900"
    }`;

  const cartIsActive = isActivePath(pathname, "/cart");
  const cartBtnClass = `relative border px-3.5 py-2 rounded-xl text-sm flex items-center gap-1.5 transition ${
    cartIsActive
      ? "bg-amber-500/10 border-amber-500/40 text-amber-400 font-bold shadow-sm"
      : "bg-neutral-900 border-neutral-800 text-neutral-200 hover:border-amber-500/30"
  }`;

  const modIsActive = isActivePath(pathname, "/admin/moderation");

  return (
    <nav className="bg-neutral-950/95 border-b border-neutral-900 px-4 py-3.5 text-neutral-200 sticky top-0 z-40 backdrop-blur-md">
      <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
        
        {/* Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/" className="flex flex-col items-start group">
            <img src="/logo1-output.png" alt="Boké One" className="h-8 sm:h-9 w-auto object-contain" />
            <span className="text-[9px] font-bold tracking-[0.15em] uppercase text-neutral-400 mt-0.5">
              {ui.slogan}
            </span>
          </Link>
        </div>

        {/* Liens Desktop */}
        <div className="hidden lg:flex items-center gap-2">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} className={tabClass(l.to)} aria-current={isActivePath(pathname, l.to) ? "page" : undefined}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Actions Droite */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button 
            onClick={toggleLanguage} 
            className="text-xs font-bold border border-neutral-800 bg-neutral-900 px-3 py-2 rounded-xl hover:border-amber-400/40 transition text-amber-400 flex items-center gap-1.5 cursor-pointer"
          >
            {lang === "fr" ? "🇬🇧 EN" : "🇫🇷 FR"}
          </button>

          <Link to="/cart" className={cartBtnClass} aria-current={cartIsActive ? "page" : undefined}>
            <span>🛒</span>
            <span className="hidden sm:inline font-medium">{ui.cart}</span>
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-neutral-950 text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Link>

          {isLoggedIn && (
            <Link
              to="/admin/moderation"
              className={`border px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                modIsActive
                  ? "bg-red-500/20 border-red-500/60 text-red-400 shadow-sm"
                  : "border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20"
              }`}
            >
              <span>🛡️</span>
              <span className="hidden md:inline">Modération</span>
            </Link>
          )}

          {isLoggedIn ? (
            <Link
              to="/abonnes"
              className="border-2 border-emerald-500 bg-emerald-500/10 text-emerald-400 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-sm shadow-emerald-500/20 flex items-center gap-2 transition hover:bg-emerald-500/20"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {ui.connected}
            </Link>
          ) : (
            <button 
              onClick={onOpenAuth} 
              className="rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-2 text-sm font-bold text-neutral-950 shadow-md hover:brightness-110 transition cursor-pointer"
            >
              {ui.login}
            </button>
          )}
        </div>
      </div>

      {/* Navigation Mobile */}
      <div className="lg:hidden mx-auto max-w-7xl mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {navLinks.map((l) => (
          <Link key={l.to} to={l.to} className={tabClass(l.to)} aria-current={isActivePath(pathname, l.to) ? "page" : undefined}>
            {l.label}
          </Link>
        ))}
        {isLoggedIn && (
          <Link to="/admin/moderation" className={tabClass("/admin/moderation")}>
            🛡️ Modération
          </Link>
        )}
      </div>
    </nav>
  );
}

function AppShell() {
  const { isLoggedIn } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);

  const openAuth = useCallback(() => setShowAuthModal(true), []);
  const closeAuth = useCallback(() => setShowAuthModal(false), []);

  useEffect(() => { if (isLoggedIn) setShowAuthModal(false); }, [isLoggedIn]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      <GlobalNavbar onOpenAuth={openAuth} />
      
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage onRequireLogin={openAuth} />} />
          <Route path="/creators" element={<CreatorDirectory />} />
          <Route path="/forum" element={<ForumPage onRequireLogin={openAuth} />} />
          <Route path="/admin/moderation" element={<AdminForumModeration />} />
          <Route path="/espace-pro" element={<EspaceMembrePro onRequireLogin={openAuth} />} />
          <Route path="/abonnes" element={<Abonnes onRequireLogin={openAuth} />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/cgu" element={<CGUPage />} />
        </Routes>
      </main>

      <WhatsAppWidget />

      <Footer onNavigate={(page) => {
        if (page === "cgu") {
          window.location.href = "/cgu";
        }
      }} />

      {/* Modal d'Authentification Sécurisée (Fermeture & Nettoyage du Flou) */}
      {showAuthModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={closeAuth}
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="max-h-full w-full max-w-md overflow-y-auto"
          >
            <AuthModalContent onClose={closeAuth} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <AppShell />
          </Router>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}