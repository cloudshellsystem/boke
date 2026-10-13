import React, { useState, useCallback, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import ReactGA from "react-ga4";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider, useCart } from "./context/CartContext";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";

import HomePage from "./components/HomePage";
import CreatorDirectory from "./components/CreatorDirectory";
import EspaceMembrePro from "./components/EspaceMembrePro";
import Abonnes from "./components/Abonnes";
import About from "./components/About";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import CGUPage from "./components/CGUPage";
import Opportunities from "./components/Opportunities";
import WhatsAppWidget from "./components/WhatsAppWidget";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";

ReactGA.initialize("G-FVFKNP75BZ");

const NAV_LINKS_DATA = {
  fr: [
    { to: "/", label: "Home" },
    { to: "/creators", label: "Annuaire" },
    { to: "/opportunites", label: "Opportunités" },
    { to: "/espace-pro", label: "Espace Pro" },
    { to: "/abonnes", label: "Tarifs" },
    { to: "/about", label: "À propos" },
  ],
  en: [
    { to: "/", label: "Home" },
    { to: "/creators", label: "Directory" },
    { to: "/opportunites", label: "Opportunities" },
    { to: "/espace-pro", label: "Pro Space" },
    { to: "/abonnes", label: "Pricing" },
    { to: "/about", label: "About" },
  ],
};

const UI_LABELS = {
  fr: { cart: "Panier", connected: "Connecté", logout: "Déconnexion", login: "Connexion", slogan: "RÉSEAU D'ÉLITE & BANQUE D'IMAGES NATIONALE" },
  en: { cart: "Cart", connected: "Connected", logout: "Sign Out", login: "Sign In", slogan: "ELITE NETWORK & NATIONAL IMAGE BANK" },
};

const isActivePath = (pathname, to) =>
  to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(`${to}/`);

/* ------------------------------------------------------------------
    CONFIGURATION DU BOKEH HAUT DE GAMME POUR LE HEADER DU DESSUS
------------------------------------------------------------------- */
const AMBER = "251,191,36";
const QUARTZ = "147,170,255";

const halo = (rgb, a) =>
  `radial-gradient(circle at 50% 50%, rgba(${rgb},${a}) 0%, rgba(${rgb},${a * 0.4}) 50%, transparent 70%)`;

const HEADER_ORBS = [
  { s: "320px", x: "5%",  y: "-50%", bg: halo(AMBER, 0.35),  b: "blur-2xl", d: 24, dl: 0 },
  { s: "280px", x: "75%", y: "-40%", bg: halo(QUARTZ, 0.25), b: "blur-2xl", d: 28, dl: -4 },
];

function GlobalNavbar({ onOpenAuth }) {
  const { cart } = useCart();
  const { isLoggedIn, logout } = useAuth();
  const { pathname } = useLocation();
  const { lang, toggleLanguage } = useLanguage();

  const navLinks = NAV_LINKS_DATA[lang];
  const ui = UI_LABELS[lang];

  const tabClass = (to) =>
    `whitespace-nowrap rounded-xl border px-3.5 py-2 text-sm font-medium transition ${
      isActivePath(pathname, to)
        ? "bg-amber-500/10 border-amber-500/30 text-amber-400 font-bold"
        : "border-transparent text-neutral-300 hover:text-amber-400 hover:bg-neutral-900/80"
    }`;

  const cartIsActive = isActivePath(pathname, "/cart");

  return (
    <header className="sticky top-0 z-40">
      <style>{`
        @keyframes header-bokeh-drift {
          0%   { transform: translate3d(0, 0, 0) scale(1); opacity: .85; }
          50%  { transform: translate3d(6px, -8px, 0) scale(1.04); opacity: 1; }
          100% { transform: translate3d(0, 0, 0) scale(1); opacity: .85; }
        }
        .header-bokeh-orb { animation: header-bokeh-drift var(--d) ease-in-out var(--dl) infinite; will-change: transform; }
      `}</style>

      <nav className="relative isolate overflow-hidden bg-neutral-950/90 border-b border-neutral-900 px-4 py-3.5 text-neutral-200 backdrop-blur-md">
        
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          {HEADER_ORBS.map((o, i) => (
            <div
              key={i}
              className={`header-bokeh-orb absolute rounded-full ${o.b}`}
              style={{
                width: o.s,
                height: o.s,
                left: o.x,
                top: o.y,
                background: o.bg,
                "--d": `${o.d}s`,
                "--dl": `${o.dl}s`,
              }}
            />
          ))}
          <div className="absolute inset-0 bg-neutral-950/40" />
        </div>

        <div className="mx-auto max-w-7xl flex items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/" className="flex flex-col items-start group">
              <img src="/logo1-output.png" alt="Boké One" className="h-8 sm:h-9 w-auto object-contain" />
              <span className="text-[9px] font-bold tracking-[0.18em] uppercase text-neutral-400 mt-0.5">
                {ui.slogan}
              </span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} className={tabClass(l.to)}>
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button 
              type="button"
              onClick={toggleLanguage} 
              className="text-xs font-bold border border-neutral-800 bg-neutral-900/90 px-3 py-2 rounded-xl hover:border-amber-400/40 transition text-amber-400 cursor-pointer"
            >
              {lang === "fr" ? "🇬🇧 EN" : "🇫🇷 FR"}
            </button>

            <Link to="/cart" className={`relative border px-3.5 py-2 rounded-xl text-sm flex items-center gap-1.5 transition ${cartIsActive ? "bg-amber-500/10 border-amber-500/40 text-amber-400 font-bold" : "bg-neutral-900/90 border-neutral-800 text-neutral-200"}`}>
              <span>🛒</span>
              <span className="hidden sm:inline font-medium">{ui.cart}</span>
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-neutral-950 text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>

            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link to="/abonnes" className="border-2 border-emerald-500 bg-emerald-500/10 text-emerald-400 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  {ui.connected}
                </Link>
                <button type="button" onClick={logout} className="border border-neutral-800 bg-neutral-900/90 text-neutral-300 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer">
                  {ui.logout}
                </button>
              </div>
            ) : (
              <button type="button" onClick={onOpenAuth} className="rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-2 text-sm font-bold text-neutral-950 hover:brightness-110 transition cursor-pointer shadow-lg">
                {ui.login}
              </button>
            )}
          </div>
        </div>

        <div className="lg:hidden mx-auto max-w-7xl mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] relative z-10">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} className={tabClass(l.to)}>
              {l.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
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
          <Route path="/creators" element={<CreatorDirectory onRequireLogin={openAuth} />} />
          <Route path="/opportunites" element={<Opportunities />} />
          <Route path="/about" element={<About />} />
          <Route path="/espace-pro" element={<EspaceMembrePro onRequireLogin={openAuth} />} />
          <Route path="/abonnes" element={<Abonnes onRequireLogin={openAuth} />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/cgu" element={<CGUPage />} />
        </Routes>
      </main>

      <Footer />
      <WhatsAppWidget />
      <AuthModal isOpen={showAuthModal} onClose={closeAuth} />
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