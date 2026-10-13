import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const ACTUALITES_ITEMS = [
  {
    id: 1,
    date: "Novembre 2026",
    title: "Paris Photo Grand Palais — Accréditations Galerie & Presse",
    summary: "Rencontrez les galeristes, acheteurs d'art et éditeurs majeurs au Grand Palais.",
    fullContent: "Boké One organise un parcours réservé à ses membres lors du rendez-vous international de la photographie d'art au Grand Palais. Accès exclusif aux signatures, vernissages privés et rencontres avec les directeurs artistiques.",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80",
    alt: "Exposition de photographie au Grand Palais",
    externalUrl: "https://www.parisphoto.com",
    externalLabel: "Site officiel Paris Photo ↗"
  },
  {
    id: 2,
    date: "Novembre 2026",
    title: "Paris Audio Video Show — Innovation & Matériel Pro",
    summary: "Découvrez les dernières innovations son, image et tournages au Palais des Congrès de Paris.",
    fullContent: "Le rendez-vous incontournable des passionnés d'image et de son haute fidélité ouvre ses portes au Palais des Congrès. Tests de matériel cinéma, écoutes studio et conférences dédiées aux nouvelles technologies audiovisuelles.",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80",
    alt: "Équipement audio et studio au Paris Audio Video Show",
    externalUrl: "https://www.parisaudiovideoshow.com",
    externalLabel: "Site officiel Paris Audio Video Show ↗"
  },
  {
    id: 3,
    date: "Décembre 2026",
    title: "Appel à Projets — Curation Nationale & Prix de la Jeune Création",
    summary: "Soumettez vos séries documentaires et portfolios pour la sélection officielle 2027.",
    fullContent: "Le comité d'évaluation Boké One ouvre les dépôts de dossiers pour la prochaine édition nationale. Les lauréats bénéficieront d'une exposition en galerie physique et de mandats auprès des partenaires de presse.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
    alt: "Exposition et jury de sélection photographique",
  },
  {
    id: 4,
    date: "Janvier 2027",
    title: "Mise à jour des certifications nationales de l'audiovisuel",
    summary: "Renforcement des protocoles de sécurité pour les tournages en espace public.",
    fullContent: "Dans le cadre de notre démarche d'élite, cette mise à jour intègre de nouvelles normes obligatoires pour tous les prestataires du réseau Boké One intervenant sur le domaine public.",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80",
    alt: "Équipe de tournage audiovisuel",
  },
];

const ANNONCES_ITEMS = [
  {
    id: 101,
    date: "OFFRE D'EMPLOI / CASTING",
    title: "Recherche Chef Opérateur & Pilote Drone S1-S3 (Série Docu)",
    summary: "🔒 Offre réservée aux adhérents Élite : Tournage 3 semaines en région PACA.",
    fullContent: "Tournage d'une série documentaire de 4 épisodes. Expérience exigée en drone FPV et caméras cinéma grand capteur.",
    image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80",
    alt: "Pilote de drone",
    restricted: true,
  },
  {
    id: 102,
    date: "MISSION PACKSHOT",
    title: "Photographe Studio Luxe — Campagne Horlogerie Paris 8e",
    summary: "🔒 Offre réservée aux adhérents : Shooting 2 jours en studio avec retouche HD.",
    fullContent: "Mandat confié par une grande maison horlogère parisienne. Maîtrise des éclairages studio exigée.",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
    alt: "Photographe packshot studio",
    restricted: true,
  },
];

const INITIAL_PLANCHE_ITEMS = [
  { id: 1, title: "Horlogerie & Lumière", author: "Marc L.", creatorId: "1002", category: "Studio", defaultLikes: 142, image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80" },
  { id: 2, title: "Série Humaniste", author: "Sophie T.", creatorId: "1001", category: "Reportage", defaultLikes: 98, image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80" },
  { id: 3, title: "Lignes Béton & Verre", author: "Antoine V.", creatorId: "1002", category: "Architecture", defaultLikes: 210, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80" },
  { id: 4, title: "Collections Capsule", author: "Elena R.", creatorId: "1003", category: "Mode", defaultLikes: 185, image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80" },
  { id: 5, title: "Vol Côtier FPV", author: "Lucas M.", creatorId: "1001", category: "Drone", defaultLikes: 312, image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80" },
  { id: 6, title: "Regards Complices", author: "Claire B.", creatorId: "1003", category: "Portrait", defaultLikes: 89, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80" },
  { id: 7, title: "Espaces Intérieurs", author: "Antoine V.", creatorId: "1002", category: "Architecture", defaultLikes: 76, image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80" },
  { id: 8, title: "Couture Automne", author: "Elena R.", creatorId: "1003", category: "Mode", defaultLikes: 134, image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80" },
  { id: 9, title: "Ombres Studio", author: "Marc L.", creatorId: "1002", category: "Studio", defaultLikes: 201, image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=80" },
  { id: 10, title: "Scènes de Rue", author: "Sophie T.", creatorId: "1001", category: "Reportage", defaultLikes: 115, image: "https://images.unsplash.com/photo-1477959858617-67f30ac4ce78?auto=format&fit=crop&w=600&q=80" },
  { id: 11, title: "Survol Alpin", author: "Lucas M.", creatorId: "1001", category: "Drone", defaultLikes: 267, image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80" },
  { id: 12, title: "Portraits Noir & Blanc", author: "Claire B.", creatorId: "1003", category: "Portrait", defaultLikes: 154, image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80" },
  { id: 13, title: "Flacons & Cosmetiques", author: "Marc L.", creatorId: "1002", category: "Studio", defaultLikes: 92, image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80" },
  { id: 14, title: "Festivals & Lumières", author: "Sophie T.", creatorId: "1001", category: "Reportage", defaultLikes: 178, image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80" },
  { id: 15, title: "Façades Contemporaines", author: "Antoine V.", creatorId: "1002", category: "Architecture", defaultLikes: 143, image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80" },
  { id: 16, title: "Defilé & Backstage", author: "Elena R.", creatorId: "1003", category: "Mode", defaultLikes: 221, image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=600&q=80" },
  { id: 17, title: "Falaises & Mer", author: "Lucas M.", creatorId: "1001", category: "Drone", defaultLikes: 199, image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80" },
  { id: 18, title: "Expressions Naturelles", author: "Claire B.", creatorId: "1003", category: "Portrait", defaultLikes: 110, image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80" },
];

const SEARCH_SUGGESTIONS = {
  fr: ["Portrait", "Reportage", "Mariage", "Corporate", "Packshot", "Architecture", "Mode", "Drone", "#1001"],
  en: ["Portrait", "Editorial", "Wedding", "Corporate", "Product", "Architecture", "Fashion", "Drone", "#1001"],
};

export default function HomePage({ onRequireLogin }) {
  const { lang } = useLanguage();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const isEn = lang === "en";

  const [activeSubTab, setActiveSubTab] = useState("actualites");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedNews, setSelectedNews] = useState(null);

  const [likedIds, setLikedIds] = useState(() => {
    try {
      const saved = localStorage.getItem("boke_liked_photos");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleLikeToggle = (e, id) => {
    e.stopPropagation();
    let updated;
    if (likedIds.includes(id)) {
      updated = likedIds.filter((item) => item !== id);
    } else {
      updated = [...likedIds, id];
    }
    setLikedIds(updated);
    try {
      localStorage.setItem("boke_liked_photos", JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  const currentList = activeSubTab === "actualites" ? ACTUALITES_ITEMS : ANNONCES_ITEMS;

  useEffect(() => {
    setCurrentIndex(0);
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % currentList.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeSubTab, currentList.length]);

  useEffect(() => {
    if (!selectedNews) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setSelectedNews(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedNews]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/creators?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/creators");
    }
  };

  const item = currentList[currentIndex] || currentList[0];
  const suggestions = SEARCH_SUGGESTIONS[isEn ? "en" : "fr"];

  return (
    <div className="bg-neutral-950 min-h-screen text-neutral-200 font-sans pb-20">
      
      {/* SECTION HAUTE SANS BOKEH (Propre et sobre sur fond sombre pur) */}
      <section className="pt-8 pb-12 px-4 border-b border-neutral-900 bg-neutral-950">
        <div className="max-w-5xl mx-auto space-y-8">
          <h1 className="sr-only">
            {isEn
              ? "Boké One – Professional photographers network and national image bank in France"
              : "Boké One – Réseau de photographes professionnels et banque d'images nationale en France"}
          </h1>

          {/* MOTEUR DE RECHERCHE */}
          <section aria-label={isEn ? "Search a photographer or creator" : "Rechercher un photographe ou un créateur"}>
            <div className="bg-neutral-900/90 border border-neutral-800 p-3.5 rounded-2xl shadow-2xl backdrop-blur-md">
              <form onSubmit={handleSearchSubmit} role="search" className="flex flex-col sm:flex-row gap-3 items-center">
                <div className="relative flex-1 w-full">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 text-sm" aria-hidden="true">
                    🔍
                  </span>
                  <input
                    type="search"
                    aria-label={isEn ? "Search" : "Recherche"}
                    placeholder={
                      isEn
                        ? "Search photographer, pseudo, #ID (e.g. #1001), specialty, city..."
                        : "Rechercher par nom, pseudo, N° CRM (ex: #1001), spécialité, ville..."
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-11 pr-4 py-2.5 text-xs md:text-sm text-white placeholder-neutral-500 outline-none focus:border-amber-400 transition"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black px-7 py-2.5 rounded-xl text-xs uppercase tracking-wider transition shadow-lg cursor-pointer shrink-0"
                >
                  {isEn ? "Search" : "Rechercher"}
                </button>
              </form>
            </div>
            <nav
              aria-label={isEn ? "Popular specialties" : "Spécialités populaires"}
              className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 px-1 text-[11px] text-neutral-400"
            >
              <span className="uppercase tracking-wider text-neutral-500 font-medium">
                {isEn ? "Popular" : "Populaires"}
              </span>
              {suggestions.map((s) => (
                <Link
                  key={s}
                  to={`/creators?search=${encodeURIComponent(s)}`}
                  className="hover:text-amber-400 transition"
                >
                  {s}
                </Link>
              ))}
            </nav>
          </section>

          {/* CARROUSEL ACTUALITÉS & OFFRES D'EMPLOI */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 border-b border-neutral-800 pb-2.5" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeSubTab === "actualites"}
                onClick={() => setActiveSubTab("actualites")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                  activeSubTab === "actualites"
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                    : "text-neutral-400 hover:text-white border border-transparent"
                }`}
              >
                <span aria-hidden="true">⚡</span> {isEn ? "News" : "Actualités"}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeSubTab === "annonces"}
                onClick={() => setActiveSubTab("annonces")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                  activeSubTab === "annonces"
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                    : "text-neutral-400 hover:text-white border border-transparent"
                }`}
              >
                <span aria-hidden="true">📢</span> {isEn ? "Ads (Job Offers)" : "Annonces (Offres d'emploi)"}
              </button>
            </div>

            <article
              onClick={() => {
                if (activeSubTab === "annonces") {
                  navigate("/opportunites");
                } else {
                  setSelectedNews(item);
                }
              }}
              className="bg-neutral-900 border border-neutral-800 hover:border-amber-500/40 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-2xl transition-all duration-300 cursor-pointer group"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                <div className="md:col-span-4 relative overflow-hidden rounded-xl border border-neutral-800 h-36 sm:h-44 bg-neutral-950">
                  <img
                    src={item.image}
                    alt={item.alt || item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <span className="absolute top-2 left-2 bg-neutral-950/80 backdrop-blur-md text-amber-400 border border-amber-500/30 text-[9px] font-bold px-2 py-0.5 rounded-md">
                    {item.date}
                  </span>
                </div>
                <div className="md:col-span-8 space-y-2.5">
                  <span className="inline-block text-[9px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                    {activeSubTab === "actualites"
                      ? isEn ? "Network Information" : "Information Réseau"
                      : isEn ? "Members Only" : "Réservé Adhérents"}
                  </span>
                  <h2 className="text-lg md:text-xl font-black text-white group-hover:text-amber-400 transition leading-snug">
                    {item.title}
                  </h2>
                  <p className="text-xs text-neutral-300 leading-relaxed line-clamp-2">{item.summary}</p>
                  
                  <div className="pt-1 flex items-center gap-4">
                    {activeSubTab === "annonces" ? (
                      <span className="bg-amber-500 group-hover:bg-amber-400 text-neutral-950 font-bold px-4 py-2 rounded-xl text-xs transition shadow-lg cursor-pointer">
                        Voir l'opportunité complète ➔
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-amber-400 underline">
                        {isEn ? "Read full details →" : "Lire le détail complet →"}
                      </span>
                    )}

                    {item.externalUrl && (
                      <a
                        href={item.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs font-bold text-neutral-300 hover:text-white bg-neutral-950 border border-neutral-800 hover:border-amber-500/40 px-3 py-1.5 rounded-lg transition"
                      >
                        {item.externalLabel}
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-1.5 mt-2">
                {currentList.map((_, idx) => (
                  <span
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(idx);
                    }}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      currentIndex === idx ? "w-5 bg-amber-400" : "w-1.5 bg-neutral-700 hover:bg-neutral-500"
                    }`}
                  />
                ))}
              </div>
            </article>
          </section>
        </div>
      </section>

      {/* RESTE DE LA PAGE */}
      <div className="max-w-5xl mx-auto px-4 space-y-12 pt-8">
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                {isEn ? "National Directory" : "Répertoire National"}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {isEn ? "Creators' Contact Sheet" : "Planche Contact des Créatifs"}
              </h2>
            </div>
            <Link
              to="/creators"
              className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
            >
              {isEn ? "Access Full Directory →" : "Accéder à l'Annuaire Complet →"}
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {INITIAL_PLANCHE_ITEMS.map((c) => {
              const isLiked = likedIds.includes(c.id);
              const totalLikes = c.defaultLikes + (isLiked ? 1 : 0);

              return (
                <div
                  key={c.id}
                  onClick={() => navigate(`/creators?id=${c.creatorId}`)}
                  className="group relative overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800/80 hover:border-amber-500/40 transition cursor-pointer aspect-square shadow-xl"
                >
                  <img
                    src={c.image}
                    alt={c.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent opacity-85 group-hover:opacity-95 transition" />

                  <button
                    type="button"
                    onClick={(e) => handleLikeToggle(e, c.id)}
                    className={`absolute top-2 right-2 px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 backdrop-blur-md border transition ${
                      isLiked
                        ? "bg-red-500/20 border-red-500/60 text-red-400 shadow-md scale-105"
                        : "bg-neutral-950/60 border-neutral-800 text-neutral-300 hover:text-red-400"
                    }`}
                  >
                    <span>{isLiked ? "❤️" : "🤍"}</span>
                    <span>{totalLikes}</span>
                  </button>

                  <div className="absolute bottom-2 left-2 right-2 space-y-0.5">
                    <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider block">
                      {c.category}
                    </span>
                    <p className="text-xs font-bold text-white truncate">{c.title}</p>
                    <p className="text-[10px] text-neutral-400 truncate">{c.author}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="border-t border-neutral-800 pt-8 text-center space-y-4">
          <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
            {isEn
              ? "Photographers & videographers: showcase your portfolio"
              : "Photographes & créateurs : valorisez votre portfolio"}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            {isEn
              ? "Join the elite network: verified profile, custom portfolio page, and direct contact with demanding buyers."
              : "Rejoignez le réseau d'élite : profil vérifié, page portfolio personnalisée et mise en relation directe avec les acheteurs d'art."}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/about"
              className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition shadow-lg"
            >
              {isEn ? "Contact Boké One" : "Écrire à l'administration / Contact"}
            </Link>
            <Link
              to="/abonnes"
              className="border border-neutral-800 bg-neutral-900 hover:border-amber-500/40 text-neutral-200 font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition"
            >
              {isEn ? "Discover Memberships" : "Découvrir les Abonnements"}
            </Link>
          </div>
        </section>
      </div>

      {selectedNews && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedNews.title}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedNews(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl space-y-4 p-6 relative"
          >
            <button
              type="button"
              onClick={() => setSelectedNews(null)}
              aria-label={isEn ? "Close" : "Fermer"}
              className="absolute top-4 right-4 bg-neutral-800 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold hover:bg-neutral-700 transition cursor-pointer"
            >
              ✕
            </button>
            
            <div className="space-y-1 pr-6">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">{selectedNews.date}</span>
              <h2 className="text-lg sm:text-xl font-black text-white leading-snug">{selectedNews.title}</h2>
            </div>

            <div className="relative h-44 rounded-xl overflow-hidden border border-neutral-800 shadow-inner bg-neutral-950">
              <img
                src={selectedNews.image}
                alt={selectedNews.alt || selectedNews.title}
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">{selectedNews.fullContent}</p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {selectedNews.externalUrl && (
                <a
                  href={selectedNews.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-neutral-950 hover:bg-neutral-800 text-amber-400 border border-amber-500/30 font-bold py-3 px-4 rounded-xl text-xs text-center transition"
                >
                  {selectedNews.externalLabel}
                </a>
              )}
              <Link
                to="/about"
                onClick={() => setSelectedNews(null)}
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold py-3 rounded-xl text-xs text-center transition shadow-lg"
              >
                {isEn ? "Contact Us Direct" : "Nous écrire / Contact direct"}
              </Link>
              <button
                type="button"
                onClick={() => setSelectedNews(null)}
                className="px-5 border border-neutral-800 bg-neutral-800 text-neutral-300 font-bold rounded-xl text-xs hover:bg-neutral-700 transition cursor-pointer"
              >
                {isEn ? "Close" : "Fermer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}