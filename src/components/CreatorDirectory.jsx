import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

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
    id: "1001",
    name: "Antoine Leroy",
    pseudo: "AntoineL_Photo",
    category: "pilote-drone",
    role: { fr: "Pilote Drone & Vidéaste", en: "Drone Pilot & Videographer" },
    city: "Paris / Île-de-France",
    rate: "450 €",
    bio: {
      fr: "Télépilote professionnel et vidéaste spécialisé dans les prises de vues aériennes techniques et cinématiques pour l'immobilier, le cinéma et la publicité.",
      en: "Professional drone pilot and videographer specialized in technical and cinematic aerial shots for real estate, cinema, and advertising.",
    },
    equipment: ["DJI Inspire 3 (8K RAW)", "DJI Mavic 3 Cine", "Station FPV CGO"],
    portfolio: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800",
    ],
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
  },
  {
    id: "1002",
    name: "Camille Morel",
    pseudo: "CamilleStudio",
    category: "photographe",
    role: { fr: "Photographe Studio & Architecture", en: "Studio & Architecture Photographer" },
    city: "Lyon / Auvergne-Rhône-Alpes",
    rate: "350 €",
    bio: {
      fr: "Photographe d'architecture et de studio chevronnée, spécialisée dans la mise en valeur de biens haut de gamme, d'objets de luxe et d'ouvrages d'art.",
      en: "Seasoned architectural and studio photographer, specialized in high-end real estate, luxury goods, and art pieces.",
    },
    equipment: ["Sony A7R V (61MP)", "Objectifs Tilt-Shift", "Éclairage Studio Profoto"],
    portfolio: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800",
    ],
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
  },
  {
    id: "1003",
    name: "Mateo Fernandez",
    pseudo: "Mateo_Art",
    category: "chef-operateur",
    role: { fr: "Chef Opérateur & Réalisateur", en: "Director of Photography & Director" },
    city: "Marseille / PACA",
    rate: "500 €",
    bio: {
      fr: "Chef opérateur et réalisateur fort de 12 ans d'expérience (fictions, clips, films institutionnels). Maîtrise totale des grands capteurs et de l'éclairage cinéma.",
      en: "Cinematographer and director with 12 years of experience. Total mastery of large sensors and cinematic lighting.",
    },
    equipment: ["RED V-Raptor 8K", "Gréement Ronin 2", "Optiques Anamorphiques"],
    portfolio: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800",
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800",
    ],
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300",
  },
];

export default function CreatorDirectory({ onRequireLogin }) {
  const { lang } = useLanguage();
  const { isLoggedIn } = useAuth();
  const { addToCart } = useCart();
  const isEn = lang === "en";
  const L = isEn ? "en" : "fr";

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Synchronisation des paramètres d'URL (?search= ou ?id=)
  useEffect(() => {
    const creatorId = searchParams.get("id");
    const query = searchParams.get("search");

    if (creatorId) {
      const found = CREATORS_DATA.find((c) => c.id === creatorId);
      if (found) setSelectedCreator(found);
    } else {
      setSelectedCreator(null);
    }

    if (query !== null) {
      setSearchTerm(query);
    }
  }, [searchParams]);

  const filteredCreators = CREATORS_DATA.filter((c) => {
    const term = searchTerm.toLowerCase().trim().replace("#", "");
    const matchSearch =
      !term ||
      c.name.toLowerCase().includes(term) ||
      c.pseudo.toLowerCase().includes(term) ||
      c.id.includes(term) ||
      c.role[L].toLowerCase().includes(term) ||
      c.city.toLowerCase().includes(term);

    const matchCategory = selectedCategory === "all" || c.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const handleOpenCreator = (creator) => {
    setSelectedCreator(creator);
    setSearchParams({ id: creator.id });
  };

  const handleCloseCreator = () => {
    setSelectedCreator(null);
    setSearchParams(searchTerm ? { search: searchTerm } : {});
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleBookAction = (e, creator) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      onRequireLogin?.();
      return;
    }
    addToCart(creator);
  };

  return (
    <div className="bg-neutral-950 min-h-screen text-neutral-200 font-sans pb-20">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        
        {/* PORTFOLIO EN PLEINE PAGE (PARTAGEABLE) */}
        {selectedCreator ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl relative">
            
            {/* Barre supérieure : Retour & Partage */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-5">
              <button
                type="button"
                onClick={handleCloseCreator}
                className="text-xs font-bold text-neutral-400 hover:text-white flex items-center gap-2 cursor-pointer bg-neutral-950 px-4 py-2 rounded-xl border border-neutral-800"
              >
                ← {isEn ? "Back to Directory" : "Retour à l'Annuaire"}
              </button>

              <button
                type="button"
                onClick={handleCopyShareLink}
                className="text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-4 py-2 rounded-xl transition flex items-center gap-2 cursor-pointer"
              >
                <span>🔗</span>
                <span>{copiedLink ? (isEn ? "Link Copied!" : "Lien Copié !") : (isEn ? "Share Portfolio URL" : "Partager ce portfolio")}</span>
              </button>
            </div>

            {/* En-tête Créateur */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-3 flex justify-center">
                <img
                  src={selectedCreator.avatar}
                  alt={selectedCreator.name}
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl object-cover border-2 border-amber-500/40 shadow-xl"
                />
              </div>

              <div className="md:col-span-9 space-y-2 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-md">
                    CERTIFIÉ 2026
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400 bg-neutral-950 px-2.5 py-0.5 rounded border border-neutral-800">
                    #{selectedCreator.id}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white">{selectedCreator.name}</h2>
                <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">{selectedCreator.role[L]}</p>
                <p className="text-xs text-neutral-400">📍 {selectedCreator.city}</p>
              </div>
            </div>

            {/* Biographie & Matériel */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4 border-t border-neutral-800/80">
              <div className="md:col-span-8 bg-neutral-950 p-5 rounded-2xl border border-neutral-800 space-y-2">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Biographie & Style</h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">{selectedCreator.bio[L]}</p>
              </div>

              <div className="md:col-span-4 bg-neutral-950 p-5 rounded-2xl border border-neutral-800 space-y-2">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Matériel Pro</h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCreator.equipment.map((eq, i) => (
                    <span key={i} className="text-[10px] font-semibold bg-neutral-900 border border-neutral-800 text-neutral-300 px-2.5 py-1 rounded-lg">
                      🛠️ {eq}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Galerie Portfolio */}
            <div className="space-y-4 pt-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Travaux & Réalisations
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {selectedCreator.portfolio.map((imgUrl, idx) => (
                  <div key={idx} className="relative h-64 rounded-2xl overflow-hidden border border-neutral-800 group shadow-lg">
                    <img
                      src={imgUrl}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Action Réservation */}
            <div className="pt-6 border-t border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase">Tarif indicatif</span>
                <p className="text-xl font-black text-amber-400">{selectedCreator.rate}</p>
              </div>
              <button
                type="button"
                onClick={(e) => handleBookAction(e, selectedCreator)}
                className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider transition shadow-xl cursor-pointer"
              >
                Réserver ce créateur
              </button>
            </div>

          </div>
        ) : (
          /* ANNUAIRE & RECHERCHE ÉPURÉE */
          <div className="space-y-8">
            
            {/* Barre de Recherche + Menu déroulant des Métiers complets */}
            <div className="bg-neutral-900/60 border border-neutral-800 p-4 rounded-2xl backdrop-blur-md flex flex-col sm:flex-row gap-3">
              <input
                type="search"
                placeholder={isEn ? "Search creator, pseudo, #ID, specialty..." : "Rechercher par nom, pseudo, N° CRM (ex: #1001), spécialité..."}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSearchParams(e.target.value ? { search: e.target.value } : {});
                }}
                className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-neutral-500 outline-none focus:border-amber-400 transition"
              />

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Filtrer par métier"
                className="w-full sm:w-72 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-amber-400 transition cursor-pointer"
              >
                <option value="all">{isEn ? "All professions" : "Tous les métiers"}</option>
                {TRADES.map((trade) => (
                  <option key={trade.id} value={trade.id}>
                    {trade[L]}
                  </option>
                ))}
              </select>
            </div>

            {/* Grille des profils */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {filteredCreators.map((c) => (
                <div
                  key={c.id}
                  onClick={() => handleOpenCreator(c)}
                  className="bg-neutral-900/60 border border-neutral-800/80 hover:border-amber-500/40 rounded-3xl p-5 space-y-4 transition duration-300 cursor-pointer group shadow-lg relative overflow-hidden"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-neutral-800 group-hover:border-amber-400 transition"
                    />
                    <div className="space-y-0.5 overflow-hidden">
                      <span className="text-[9px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        #{c.id}
                      </span>
                      <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition truncate">
                        {c.name}
                      </h3>
                      <p className="text-[11px] text-neutral-400 truncate">@{c.pseudo}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-neutral-200 truncate">{c.role[L]}</p>
                    <p className="text-[11px] text-neutral-500">📍 {c.city}</p>
                  </div>

                  <div className="pt-2 border-t border-neutral-800/60 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:underline">
                    <span>{isEn ? "View Portfolio →" : "Consulter le Portfolio →"}</span>
                  </div>
                </div>
              ))}
            </div>

            {filteredCreators.length === 0 && (
              <div className="text-center py-12 text-neutral-500 text-xs">
                {isEn ? "No creators match your search." : "Aucun créateur ne correspond à votre recherche."}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}