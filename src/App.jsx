import React, { useState, useCallback, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import ReactGA from "react-ga4";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider, useCart } from "./context/CartContext";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";

import HomePage from "./components/HomePage";
import CreatorDirectory from "./components/CreatorDirectory";
import ForumPage from "./components/ForumPage";
import EspaceMembrePro from "./components/EspaceMembrePro";
import Abonnes from "./components/Abonnes";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import CGUPage from "./components/CGUPage";
import WhatsAppWidget from "./components/WhatsAppWidget";
import Footer from "./components/Footer";

// 🚀 Initialisation de Google Analytics 4
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

  return (
    <nav className="bg-neutral-950/95 border-b border-neutral-900 px-4 py-3.5 text-neutral-200 sticky top-0 z-40 backdrop-blur-md">
      <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
        
        {/* 1. À gauche : Logo + Slogan */}
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/" className="flex flex-col items-start group">
            <img src="/logo1-output.png" alt="Boké One" className="h-8 sm:h-9 w-auto object-contain" />
            <span className="text-[9px] font-bold tracking-[0.15em] uppercase text-neutral-400 mt-0.5">
              {ui.slogan}
            </span>
          </Link>
        </div>

        {/* 2. Au centre : Onglets de navigation */}
        <div className="hidden lg:flex items-center gap-2">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} className={tabClass(l.to)} aria-current={isActivePath(pathname, l.to) ? "page" : undefined}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* 3. À droite : Langue, Panier, Connexion */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Bouton de langue : indique la langue vers laquelle basculer au clic */}
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

      {/* Navigation mobile */}
      <div className="lg:hidden mx-auto max-w-7xl mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {navLinks.map((l) => (
          <Link key={l.to} to={l.to} className={tabClass(l.to)} aria-current={isActivePath(pathname, l.to) ? "page" : undefined}>
            {l.label}
          </Link>
        ))}
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

      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={closeAuth}>
          <div onClick={(e) => e.stopPropagation()} className="max-h-full w-full max-w-md overflow-y-auto">
            {/* Composant d'authentification */}
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