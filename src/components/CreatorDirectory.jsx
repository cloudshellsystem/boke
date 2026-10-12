import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Métiers proposés dans la liste déroulante
const TRADES = [
  { id: "chef-operateur", fr: "Chef Opérateur", en: "Director of Photography" },
  { id: "cadreur", fr: "Cadreur", en: "Camera Operator" },
  { id: "videaste", fr: "Vidéaste", en: "Videographer" },
  { id: "assistant-camera", fr: "Assistant Caméra", en: "Camera Assistant" },
  { id: "directeur-artistique", fr: "Directeur Artistique", en: "Art Director" },
  { id: "maquilleur", fr: "Maquilleur", en: "Makeup Artist" },
  { id: "styliste-photo", fr: "Styliste Photo", en: "Photo Stylist" },
  { id: "decorateur", fr: "Décorateur", en: "Set Designer" },
  { id: "monteur-video", fr: "Monteur Vidéo", en: "Video Editor" },
  { id: "etalonneur", fr: "Étalonneur", en: "Colorist" },
  { id: "vfx", fr: "VFX", en: "VFX Artist" },
  { id: "sound-designer", fr: "Sound Designer", en: "Sound Designer" },
  { id: "compositeur", fr: "Compositeur", en: "Composer" },
  { id: "motion-designer", fr: "Motion Designer", en: "Motion Designer" },
  { id: "photographe", fr: "Photographe", en: "Photographer" },
  { id: "pilote-drone", fr: "Pilote Drone", en: "Drone Pilot" },
  { id: "regisseur", fr: "Régisseur / Technicien", en: "Line Producer / Technician" },
];

const CREATORS_DATA = [
  {
    id: 101,
    name: "Antoine Leroy",
    specialty: { fr: "Pilote Drone Certifié", en: "Certified Drone Pilot" },
    category: "pilote-drone",
    city: "Paris / Île-de-France",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
    starting_price: 450,
    certifications: ["BAPD 2026", "CATS", "S1-S3"],
    bio: {
      fr: "Télépilote professionnel passionné d'audiovisuel depuis plus de 8 ans. Spécialisé dans les prises de vues aériennes techniques et cinématiques pour l'immobilier de prestige, le cinéma et les grands suivis de chantier en Île-de-France.",
      en: "Professional drone pilot passionate about audiovisuals for over 8 years. Specialized in technical and cinematic aerial shooting for luxury real estate, cinema, and large construction projects in Île-de-France.",
    },
    equipment: ["DJI Inspire 3 (8K RAW)", "DJI Mavic 3 Cine", "Station FPV CGO"],
    portfolio: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800"
    ],
  },
  {
    id: 102,
    name: "Camille Morel",
    specialty: { fr: "Photographe Immobilier & Architecture", en: "Real Estate & Architecture Photographer" },
    category: "photographe",
    city: "Lyon / Auvergne-Rhône-Alpes",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
    starting_price: 350,
    certifications: ["SIRET Vérifié", "HDR Pro"],
    bio: {
      fr: "Photographe d'architecture chevronnée, spécialisée dans la mise en valeur de biens immobiliers haut de gamme et d'ouvrages d'art. Mon travail repose sur la maîtrise de la lumière naturelle et la précision des perspectives.",
      en: "Seasoned architectural photographer, specialized in showcasing high-end real estate and engineering structures. My work relies on mastering natural light and precise perspective balance.",
    },
    equipment: ["Sony A7R V (61MP)", "Objectifs Tilt-Shift", "Éclairage Studio Profoto"],
    portfolio: [
      "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800",
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"
    ],
  },
  {
    id: 103,
    name: "Mateo Fernandez",
    specialty: { fr: "Régisseur Général & Chef Opérateur", en: "General Line Producer & Director of Photography" },
    category: "regisseur",
    city: "Marseille / PACA",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300",
    starting_price: 500,
    certifications: ["Permis Côtier", "Habilitation Électrique"],
    bio: {
      fr: "Régisseur général et chef opérateur fort de 12 ans d'expérience sur le terrain (décors complexes, tournages maritimes, événements institutionnels). Expert en logistique d'équipe et sécurisation des tournages.",
      en: "General line producer and cinematographer with 12 years of field experience (complex sets, maritime shoots, corporate events). Expert in team logistics and shoot safety management.",
    },
    equipment: ["RED V-Raptor 8K", "Gréement Ronin 2", "Véhicule Régie Tout-Terrain"],
    portfolio: [
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800",
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800"
    ],
  },
];

const DIRECTORY_TEXT = {
  fr: {
    badge: "ANNUAIRE NATIONAL DES CRÉATEURS",
    title: "Trouvez vos experts audiovisuels certifiés",
    subtitle: "Chefs opérateurs, photographes, vidéastes, monteurs, étalonneurs, pilotes drone et bien d'autres métiers de l'image et du son.",
    searchPlaceholder: "Rechercher un créateur, une spécialité, une ville...",
    filterLabel: "Filtrer par métier",
    filterAll: "Tous les métiers",
    certifiedBadge: "CERTIFIÉ 2026",
    fromPrice: "À partir de",
    btnPortfolio: "📷 Voir le Portfolio ➔",
    btnBook: "Réserver",
    modalBioTitle: "Biographie & Style",
    modalEquipTitle: "🛠️ Matériel Pro",
    modalPortfolioTitle: "📸 Œuvres & Réalisations",
    noticePlatformOnly: "🔒 Réservé aux abonnés : inscrivez-vous ou connectez-vous pour réserver ce prestataire.",
    noResult: "Aucun créateur ne correspond à votre recherche.",
  },
  en: {
    badge: "NATIONAL CREATORS DIRECTORY",
    title: "Find your certified audiovisual experts",
    subtitle: "Directors of photography, photographers, videographers, editors, colorists, drone pilots and many more image and sound professions.",
    searchPlaceholder: "Search creator, specialty, city...",
    filterLabel: "Filter by profession",
    filterAll: "All professions",
    certifiedBadge: "CERTIFIED 2026",
    fromPrice: "Starting from",
    btnPortfolio: "📷 View Portfolio ➔",
    btnBook: "Book",
    modalBioTitle: "Biography & Style",
    modalEquipTitle: "🛠️ Pro Gear",
    modalPortfolioTitle: "📸 Works & Realizations",
    noticePlatformOnly: "🔒 Reserved for members: sign up or log in to book this provider.",
    noResult: "No creator matches your search.",
  },
};

export default function CreatorDirectory({ onRequireLogin }) {
  const { lang } = useLanguage();
  const { isLoggedIn, login } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const t = DIRECTORY_TEXT[lang] || DIRECTORY_TEXT.fr;
  const L = lang === "en" ? "en" : "fr";

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCreator, setSelectedCreator] = useState(null);

  const [showModalAuth, setShowModalAuth] = useState(false);
  const [authTab, setAuthTab] = useState("register");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  useEffect(() => {
    if (!selectedCreator && !showModalAuth) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setSelectedCreator(null);
        setShowModalAuth(false);
      }
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedCreator, showModalAuth]);

  const query = search.trim().toLowerCase();
  const filteredCreators = CREATORS_DATA.filter((creator) => {
    const matchSearch =
      !query ||
      creator.name.toLowerCase().includes(query) ||
      creator.specialty[L].toLowerCase().includes(query) ||
      creator.city.toLowerCase().includes(query);
    const matchCategory = selectedCategory === "all" || creator.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const handleBookAction = (e, creator) => {
    e.stopPropagation();

    if (!isLoggedIn) {
      setSelectedCreator(null);
      setAuthTab("register");
      setShowModalAuth(true);
      onRequireLogin?.();
      return;
    }

    const added = addToCart(creator);
    if (added === false) return;
    setSelectedCreator(null);
    navigate("/cart");
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    login?.({ email: emailInput });
    setShowModalAuth(false);
    alert(lang === "en" ? "Successfully connected!" : "Connexion réussie ! Bienvenue sur Boké One.");
  };

  return (
    <div className="bg-neutral-950 min-h-screen text-neutral-200 p-6 sm:p-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* En-tête */}
        <div className="text-center space-y-3">
          <span className="inline-block text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full font-bold uppercase tracking-widest">
            {t.badge}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">{t.title}</h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl mx-auto">{t.subtitle}</p>
        </div>

        {/* Barre de recherche & liste déroulante des métiers */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-neutral-900 border border-neutral-800 p-4 rounded-2xl">
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-96 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-amber-500"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label={t.filterLabel}
            className="w-full sm:w-72 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="all">{t.filterAll}</option>
            {TRADES.map((trade) => (
              <option key={trade.id} value={trade.id}>
                {trade[L]}
              </option>
            ))}
          </select>
        </div>

        {/* Grille des cartes créateurs */}
        {filteredCreators.length === 0 ? (
          <p className="text-center text-sm text-neutral-500 py-12">{t.noResult}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCreators.map((creator) => (
              <div
                key={creator.id}
                className="bg-neutral-900 border border-neutral-800/80 hover:border-amber-500/40 rounded-3xl p-6 flex flex-col justify-between shadow-xl transition group"
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-amber-500/30 group-hover:scale-105 transition"
                    />
                    <div>
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase">
                        {t.certifiedBadge}
                      </span>
                      <h3 className="text-base font-bold text-white mt-1">{creator.name}</h3>
                      <p className="text-xs text-neutral-400">{creator.city}</p>
                    </div>
                  </div>

                  <p className="text-xs text-amber-400/90 font-medium mb-4">{creator.specialty[L]}</p>

                  {/* Bouton épuré "Voir le Portfolio" sans fioritures */}
                  <button
                    type="button"
                    onClick={() => setSelectedCreator(creator)}
                    className="w-full text-center text-xs text-amber-400 hover:text-amber-300 font-bold bg-neutral-950 border border-amber-500/30 px-4 py-3 rounded-xl mb-4 transition flex items-center justify-center gap-2 cursor-pointer shadow"
                  >
                    <span>{t.btnPortfolio}</span>
                  </button>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {creator.certifications.map((cert, idx) => (
                      <span key={idx} className="text-[10px] bg-neutral-950 text-neutral-300 border border-neutral-800 px-2.5 py-1 rounded-md font-semibold">
                        ✓ {cert}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-neutral-800 pt-4 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-neutral-500 block">{t.fromPrice}</span>
                    <span className="text-lg font-black text-amber-400">{creator.starting_price} €</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleBookAction(e, creator)}
                    className="bg-amber-500 hover:bg-amber-400 text-neutral-950 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow cursor-pointer"
                  >
                    {t.btnBook}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODALE PORTFOLIO ÉLÉGANTE ET CLASSE (SANS FIORITURES) */}
      {selectedCreator && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md overflow-y-auto"
          onClick={() => setSelectedCreator(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-10 space-y-8 relative shadow-2xl my-8"
          >
            {/* Bouton Fermer */}
            <button
              type="button"
              onClick={() => setSelectedCreator(null)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white font-bold text-lg cursor-pointer bg-neutral-950 rounded-full h-9 w-9 flex items-center justify-center border border-neutral-800"
            >
              ✕
            </button>

            {/* En-tête du portfolio de l'artiste */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-neutral-800 pb-6">
              <div className="flex items-center gap-5">
                <img
                  src={selectedCreator.avatar}
                  alt={selectedCreator.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-amber-500/50 shadow-lg"
                />
                <div>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded font-bold uppercase tracking-wider">
                    PORTFOLIO CERTIFIÉ
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white mt-1.5">{selectedCreator.name}</h2>
                  <p className="text-xs sm:text-sm text-amber-400 font-semibold mt-0.5">
                    {selectedCreator.specialty[L]} • {selectedCreator.city}
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right space-y-1 w-full sm:w-auto bg-neutral-950 sm:bg-transparent p-4 sm:p-0 rounded-2xl border sm:border-0 border-neutral-800">
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest">{t.fromPrice}</span>
                <p className="text-2xl font-black text-amber-400">{selectedCreator.starting_price} €</p>
                <button
                  type="button"
                  onClick={(e) => handleBookAction(e, selectedCreator)}
                  className="w-full sm:w-auto mt-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 px-6 py-2.5 rounded-xl font-bold text-xs transition shadow-lg cursor-pointer"
                >
                  {t.btnBook} / Réserver
                </button>
              </div>
            </div>

            {!isLoggedIn && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-xs text-amber-300 leading-relaxed">
                {t.noticePlatformOnly}
              </div>
            )}

            {/* Biographie & Style */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest">{t.modalBioTitle}</h4>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed bg-neutral-950 p-5 rounded-2xl border border-neutral-800 shadow-inner">
                {selectedCreator.bio[L]}
              </p>
            </div>

            {/* Matériel Pro */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest">{t.modalEquipTitle}</h4>
              <div className="flex flex-wrap gap-2 bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
                {selectedCreator.equipment.map((eq, i) => (
                  <span key={i} className="text-xs bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-xl text-neutral-300 font-medium">
                    🛠️ {eq}
                  </span>
                ))}
              </div>
            </div>

            {/* Galerie d'œuvres / Portfolio Pro épuré */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest">{t.modalPortfolioTitle}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {selectedCreator.portfolio.map((imgUrl, i) => (
                  <div key={i} className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 group shadow-md">
                    <img
                      src={imgUrl}
                      alt={`${selectedCreator.name} — ${i + 1}`}
                      loading="lazy"
                      className="w-full h-52 object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODALE D'INSCRIPTION / CONNEXION SUR-MESURE */}
      {showModalAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 relative shadow-2xl">
            <button 
              type="button"
              onClick={() => setShowModalAuth(false)}
              className="absolute top-4 right-4 bg-neutral-800 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold hover:bg-neutral-700 transition cursor-pointer"
            >
              ✕
            </button>

            <div className="flex bg-neutral-950 p-1.5 rounded-2xl border border-neutral-800">
              <button
                type="button"
                onClick={() => setAuthTab("register")}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                  authTab === "register" ? "bg-amber-500 text-neutral-950 shadow" : "text-neutral-400 hover:text-white"
                }`}
              >
                S'inscrire
              </button>
              <button
                type="button"
                onClick={() => setAuthTab("login")}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                  authTab === "login" ? "bg-amber-500 text-neutral-950 shadow" : "text-neutral-400 hover:text-white"
                }`}
              >
                Se connecter
              </button>
            </div>

            <div className="space-y-1 text-center">
              <h3 className="text-lg font-black text-white">
                {authTab === "register" ? "Rejoignez le réseau Boké One" : "Accès Membre Boké One"}
              </h3>
              <p className="text-xs text-neutral-400">
                {authTab === "register" 
                  ? "Créez votre compte pour réserver vos prestataires en toute sécurité." 
                  : "Connectez-vous pour retrouver votre panier et vos réservations."}
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-neutral-300">Adresse email</label>
                <input
                  type="email"
                  required
                  placeholder="nom@exemple.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-neutral-300">Mot de passe</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold py-3.5 rounded-xl text-xs transition cursor-pointer shadow-lg"
              >
                {authTab === "register" ? "Créer mon compte" : "Se connecter"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}