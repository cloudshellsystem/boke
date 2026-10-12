import React, { useState, useCallback, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import ReactGA from "react-ga4";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider, useCart } from "./context/CartContext";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";

import HomePage from "./components/HomePage";
import CreatorDirectory from "./components/CreatorDirectory";
import AdminForumModeration from "./components/AdminForumModeration";
import EspaceMembrePro from "./components/EspaceMembrePro";
import Abonnes from "./components/Abonnes";
import About from "./components/About";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import CGUPage from "./components/CGUPage";
import WhatsAppWidget from "./components/WhatsAppWidget";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";

// Initialisation de Google Analytics 4
ReactGA.initialize("G-FVFKNP75BZ");

const ADMIN_EMAIL = "kultordi@gmail.com";

/* -------------------------------------------------------------------------- */
/*  NAVIGATION : ordre strict -> Accueil / Créateurs / Espace Pro / Tarifs /  */
/*  À propos (TOUJOURS EN DERNIER)                                            */
/* -------------------------------------------------------------------------- */
const NAV_LINKS_DATA = {
  fr: [
    { to: "/", label: "Accueil / Stock" },
    { to: "/creators", label: "Créateurs" },
    { to: "/espace-pro", label: "Espace Pro" },
    { to: "/abonnes", label: "Tarifs" },
    { to: "/about", label: "À propos" },
  ],
  en: [
    { to: "/", label: "Home / Stock" },
    { to: "/creators", label: "Creators" },
    { to: "/espace-pro", label: "Pro Space" },
    { to: "/abonnes", label: "Pricing" },
    { to: "/about", label: "About" },
  ],
};

const UI_LABELS = {
  fr: {
    cart: "Panier",
    connected: "Connecté",
    logout: "Déconnexion",
    login: "Connexion",
    slogan: "RESEAU D'ELITE & BANQUE D'IMAGES NATIONALE",
  },
  en: {
    cart: "Cart",
    connected: "Connected",
    logout: "Sign Out",
    login: "Sign In",
    slogan: "ELITE NETWORK & NATIONAL IMAGE BANK",
  },
};

/* -------------------------------------------------------------------------- */
/*  SEO : titres, descriptions et mots-clés par page                          */
/* -------------------------------------------------------------------------- */
const SITE_NAME = "Boké One";

const SEO_BY_ROUTE = {
  "/": {
    fr: {
      title: "Boké One | Réseau de photographes professionnels & banque d'images en France",
      description:
        "Boké One : le réseau d'élite des photographes, vidéastes et pilotes de drone professionnels. Banque d'images nationale, annuaire de créateurs, offres de missions et actualités de la photographie.",
      keywords:
        "photographe professionnel, banque d'images, stock photo, annuaire photographes, réseau de photographes, vidéaste, pilote de drone, photographe reportage, photographe corporate, portfolio photographe, offres emploi photographe, licence photo, droits d'auteur photo",
    },
    en: {
      title: "Boké One | Professional Photographers Network & National Image Bank (France)",
      description:
        "Boké One: the elite network of professional photographers, videographers and drone pilots. National image bank, creators directory, job offers and photography news.",
      keywords:
        "professional photographer, image bank, stock photography, photographers directory, photographers network, videographer, drone pilot, editorial photographer, corporate photographer, photography portfolio, photography jobs, image licensing",
    },
  },
  "/creators": {
    fr: {
      title: "Annuaire des photographes & créateurs visuels professionnels | Boké One",
      description:
        "Trouvez et contactez des photographes, vidéastes et créateurs visuels professionnels : portrait, reportage, mariage, packshot, architecture, mode, drone. Portfolios vérifiés partout en France.",
      keywords:
        "annuaire photographes, trouver un photographe, photographe portrait, photographe mariage, photographe packshot, photographe architecture, photographe mode, vidéaste professionnel, photographe drone, portfolio photographe",
    },
    en: {
      title: "Directory of Professional Photographers & Visual Creators | Boké One",
      description:
        "Find and hire professional photographers, videographers and visual creators: portrait, editorial, wedding, product, architecture, fashion, drone. Verified portfolios across France.",
      keywords:
        "photographers directory, hire a photographer, portrait photographer, wedding photographer, product photographer, architecture photographer, fashion photographer, videographer, drone photographer",
    },
  },
  "/espace-pro": {
    fr: {
      title: "Espace Pro photographes & vidéastes : portfolio, missions, visibilité | Boké One",
      description:
        "Espace réservé aux membres : gérez votre portfolio, accédez aux missions et offres d'emploi, échangez avec le réseau et développez votre clientèle de photographe professionnel.",
      keywords:
        "espace pro photographe, missions photographe, offres emploi photographe, portfolio en ligne photographe, trouver des clients photographe, visibilité photographe, réseau professionnel photographie",
    },
    en: {
      title: "Pro Space for Photographers & Videographers: Portfolio, Missions, Visibility | Boké One",
      description:
        "Members-only space: manage your portfolio, access missions and job offers, connect with the network and grow your professional photography business.",
      keywords:
        "photographer pro space, photography missions, photography jobs, online photography portfolio, find photography clients, photographer visibility, professional photography network",
    },
  },
  "/abonnes": {
    fr: {
      title: "Tarifs & abonnements photographes professionnels | Boké One",
      description:
        "Découvrez les abonnements Boké One : profil vérifié, portfolio mis en avant, accès aux missions et à la banque d'images nationale. Rejoignez le réseau des photographes d'élite.",
      keywords:
        "abonnement photographe, tarifs photographe, adhésion réseau photographes, profil photographe vérifié, vendre ses photos, banque d'images abonnement, visibilité photographe professionnel",
    },
    en: {
      title: "Pricing & Memberships for Professional Photographers | Boké One",
      description:
        "Discover Boké One memberships: verified profile, featured portfolio, access to missions and the national image bank. Join the elite photographers network.",
      keywords:
        "photographer membership, photographer pricing, photographers network membership, verified photographer profile, sell your photos, image bank subscription",
    },
  },
  "/about": {
    fr: {
      title: "À propos de Boké One | Le réseau d'élite de la photographie & de l'audiovisuel",
      description:
        "Découvrez la mission de Boké One : valoriser les photographes, vidéastes et créateurs passionnés, garantir des standards professionnels et connecter le talent aux clients exigeants.",
      keywords:
        "à propos Boké One, réseau photographes d'élite, plateforme photographes France, valoriser photographes, certification audiovisuel",
    },
    en: {
      title: "About Boké One | The Elite Photography & Audiovisual Network",
      description:
        "Discover the Boké One mission: showcasing passionate photographers, videographers and creators, guaranteeing professional standards and connecting talent with demanding clients.",
      keywords:
        "about Boké One, elite photographers network, photography platform France, showcase photographers, audiovisual certification",
    },
  },
  "/cgu": {
    fr: {
      title: "Conditions Générales d'Utilisation | Boké One",
      description:
        "Conditions générales d'utilisation de la plateforme Boké One : droits d'auteur, licences d'images, responsabilités et protection des données.",
      keywords: "CGU, conditions générales, droits d'auteur photo, licence images",
    },
    en: {
      title: "Terms of Use | Boké One",
      description:
        "Boké One terms of use: copyright, image licensing, responsibilities and data protection.",
      keywords: "terms of use, copyright, image licensing",
    },
  },
};

// Pages à ne PAS indexer (privées / transactionnelles)
const NOINDEX_PATHS = ["/cart", "/checkout", "/admin"];

const upsertMeta = (attr, key, content) => {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const upsertCanonical = (href) => {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

function useSeo(pathname, lang) {
  useEffect(() => {
    const base = pathname.startsWith("/admin") ? null : SEO_BY_ROUTE[pathname] || SEO_BY_ROUTE["/"];
    const seo = base ? base[lang] || base.fr : null;
    const origin = window.location.origin;
    const url = `${origin}${pathname === "/" ? "" : pathname}`;

    document.documentElement.lang = lang;

    if (seo) {
      document.title = seo.title;
      upsertMeta("name", "description", seo.description);
      upsertMeta("name", "keywords", seo.keywords);
      upsertMeta("property", "og:title", seo.title);
      upsertMeta("property", "og:description", seo.description);
      upsertMeta("name", "twitter:title", seo.title);
      upsertMeta("name", "twitter:description", seo.description);
    } else {
      document.title = SITE_NAME;
    }

    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:locale", lang === "en" ? "en_GB" : "fr_FR");
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertCanonical(url);

    const isPrivate = NOINDEX_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
    upsertMeta("name", "robots", isPrivate ? "noindex, nofollow" : "index, follow, max-image-preview:large");
  }, [pathname, lang]);
}

// Données structurées JSON-LD (Organisation + moteur de recherche interne)
function useStructuredData(lang) {
  useEffect(() => {
    const origin = window.location.origin;
    const data = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": `${origin}/#organization`,
          name: SITE_NAME,
          url: origin,
          logo: `${origin}/logo1-output.png`,
          description:
            lang === "en"
              ? "Elite network of professional photographers, videographers and drone pilots, and national image bank."
              : "Réseau d'élite de photographes, vidéastes et pilotes de drone professionnels, et banque d'images nationale.",
          areaServed: "FR",
          knowsAbout: [
            "Photographie professionnelle",
            "Banque d'images",
            "Vidéo",
            "Prise de vue par drone",
            "Photographie de reportage",
            "Photographie corporate",
          ],
        },
        {
          "@type": "WebSite",
          "@id": `${origin}/#website`,
          url: origin,
          name: SITE_NAME,
          inLanguage: lang === "en" ? "en" : "fr",
          publisher: { "@id": `${origin}/#organization` },
          potentialAction: {
            "@type": "SearchAction",
            target: `${origin}/creators?search={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        },
      ],
    };

    let script = document.getElementById("boke-jsonld");
    if (!script) {
      script = document.createElement("script");
      script.id = "boke-jsonld";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }, [lang]);
}

const isActivePath = (pathname, to) =>
  to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(`${to}/`);

function GlobalNavbar({ onOpenAuth }) {
  const { cart } = useCart();
  const { isLoggedIn, user, logout } = useAuth();
  const { pathname } = useLocation();
  const { lang, toggleLanguage } = useLanguage();

  const navLinks = NAV_LINKS_DATA[lang] || NAV_LINKS_DATA.fr;
  const ui = UI_LABELS[lang] || UI_LABELS.fr;
  const isAdmin = isLoggedIn && user?.email === ADMIN_EMAIL;

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
    <nav
      aria-label={lang === "en" ? "Main navigation" : "Navigation principale"}
      className="bg-neutral-950/95 border-b border-neutral-900 px-4 py-3.5 text-neutral-200 sticky top-0 z-40 backdrop-blur-md"
    >
      <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/" className="flex flex-col items-start group">
            <img
              src="/logo1-output.png"
              alt="Boké One – Réseau de photographes professionnels et banque d'images"
              className="h-8 sm:h-9 w-auto object-contain"
            />
            <span className="text-[9px] font-bold tracking-[0.15em] uppercase text-neutral-400 mt-0.5">
              {ui.slogan}
            </span>
          </Link>
        </div>

        {/* Liens Desktop */}
        <div className="hidden lg:flex items-center gap-2">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={tabClass(l.to)}
              aria-current={isActivePath(pathname, l.to) ? "page" : undefined}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Actions Droite */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
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

          {/* Bouton Modération réservé EXCLUSIVEMENT à kultordi@gmail.com */}
          {isAdmin && (
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
            <div className="flex items-center gap-2">
              <Link
                to="/abonnes"
                className="border-2 border-emerald-500 bg-emerald-500/10 text-emerald-400 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-sm shadow-emerald-500/20 flex items-center gap-2 transition hover:bg-emerald-500/20"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                {ui.connected}
              </Link>
              <button
                type="button"
                onClick={logout}
                className="border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
                title={ui.logout}
              >
                {ui.logout}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-2 text-sm font-bold text-neutral-950 shadow-md hover:brightness-110 transition cursor-pointer"
            >
              {ui.login}
            </button>
          )}
        </div>
      </div>

      {/* Navigation Mobile (même ordre que desktop) */}
      <div className="lg:hidden mx-auto max-w-7xl mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {navLinks.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className={tabClass(l.to)}
            aria-current={isActivePath(pathname, l.to) ? "page" : undefined}
          >
            {l.label}
          </Link>
        ))}
        {isAdmin && (
          <Link to="/admin/moderation" className={tabClass("/admin/moderation")}>
            🛡️ Modération
          </Link>
        )}
      </div>
    </nav>
  );
}

function AppShell() {
  const { isLoggedIn, user } = useAuth();
  const { lang } = useLanguage();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const location = useLocation();

  // SEO dynamique (title, description, canonical, OG, robots) + JSON-LD
  useSeo(location.pathname, lang);
  useStructuredData(lang);

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);

  const openAuth = useCallback(() => setShowAuthModal(true), []);
  const closeAuth = useCallback(() => setShowAuthModal(false), []);

  useEffect(() => {
    if (isLoggedIn) setShowAuthModal(false);
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      <GlobalNavbar onOpenAuth={openAuth} />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage onRequireLogin={openAuth} />} />
          <Route path="/creators" element={<CreatorDirectory onRequireLogin={openAuth} />} />
          <Route path="/about" element={<About />} />

          {/* Protection stricte par URL : seul kultordi@gmail.com a accès à /admin/moderation */}
          <Route
            path="/admin/moderation"
            element={user?.email === ADMIN_EMAIL ? <AdminForumModeration /> : <Navigate to="/" replace />}
          />

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