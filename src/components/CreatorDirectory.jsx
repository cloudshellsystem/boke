import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

const CREATORS_DATA = [
  {
    id: 101,
    name: "Antoine Leroy",
    specialty: { fr: "Pilote Drone Certifié", en: "Certified Drone Pilot" },
    category: "drone",
    city: "Paris / Île-de-France",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
    starting_price: 450,
    certifications: ["BAPD 2026", "CATS", "S1-S3"],
    bio: {
      fr: "Télépilote professionnel passionné d'audiovisuel depuis plus de 8 ans. Spécialisé dans les prises de vues aériennes techniques et cinématiques pour l'immobilier de prestige, le cinéma et les grands suivis de chantier en Île-de-France.",
      en: "Professional drone pilot passionate about audiovisuals for over 8 years. Specialized in technical and cinematic aerial shooting for luxury real estate, cinema, and large construction projects in Île-de-France."
    },
    equipment: ["DJI Inspire 3 (8K RAW)", "DJI Mavic 3 Cine", "Station FPV CGO"],
    portfolio: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600"
    ]
  },
  {
    id: 102,
    name: "Camille Morel",
    specialty: { fr: "Photographe Immobilier & Architecture", en: "Real Estate & Architecture Photographer" },
    category: "photo",
    city: "Lyon / Auvergne-Rhône-Alpes",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
    starting_price: 350,
    certifications: ["SIRET Vérifié", "HDR Pro"],
    bio: {
      fr: "Photographe d'architecture chevronnée, spécialisée dans la mise en valeur de biens immobiliers haut de gamme et d'ouvrages d'art. Mon travail repose sur la maîtrise de la lumière naturelle et la précision des perspectives.",
      en: "Seasoned architectural photographer, specialized in showcasing high-end real estate and engineering structures. My work relies on mastering natural light and precise perspective balance."
    },
    equipment: ["Sony A7R V (61MP)", "Objectifs Cadrage DÉCENTRÉ (Tilt-Shift)", "Éclairage Studio Portable Profoto"],
    portfolio: [
      "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600",
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600"
    ]
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
      en: "General line producer and cinematographer with 12 years of field experience (complex sets, maritime shoots, corporate events). Expert in team logistics and shoot safety management."
    },
    equipment: ["RED V-Raptor 8K", "Gréement Stabilisé Ronin 2", "Véhicule Régie Tout-Terrain"],
    portfolio: [
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600"
    ]
  }
];

const DIRECTORY_TEXT = {
  fr: {
    badge: "ANNUAIRE NATIONAL DES CRÉATEURS",
    title: "Trouvez vos experts audiovisuels certifiés",
    subtitle: "Télépilotes Drone (BAPD, CATT, CATS 2026), Photographes professionnels & Régisseurs qualifiés.",
    searchPlaceholder: "Rechercher un créateur, une spécialité, une ville...",
    filterAll: "Tous les profils",
    filterDrone: "Pilotes Drone",
    filterPhoto: "Photographes",
    filterRegisseur: "Régisseurs / Techniciens",
    certifiedBadge: "CERTIFIÉ 2026",
    fromPrice: "À partir de",
    btnContact: "💬 Contacter / Devis Direct",
    btnAddToCart: "🛒 Réserver / Ajouter au panier",
    modalBioTitle: "📖 Storytelling & Parcours",
    modalEquipTitle: "🛠️ Matériel & Équipement de Tournage",
    modalPortfolioTitle: "📸 Aperçu du Portfolio",
    closeBtn: "Fermer"
  },
  en: {
    badge: "NATIONAL CREATORS DIRECTORY",
    title: "Find your certified audiovisual experts",
    subtitle: "Drone Pilots (BAPD, CATT, CATS 2026), Professional Photographers & Qualified Line Producers.",
    searchPlaceholder: "Search creator, specialty, city...",
    filterAll: "All profiles",
    filterDrone: "Drone Pilots",
    filterPhoto: "Photographers",
    filterRegisseur: "Line Producers / Technicians",
    certifiedBadge: "CERTIFIED 2026",
    fromPrice: "Starting from",
    btnContact: "💬 Contact / Direct Quote",
    btnAddToCart: "🛒 Book / Add to Cart",
    modalBioTitle: "📖 Storytelling & Background",
    modalEquipTitle: "🛠️ Gear & Filming Equipment",
    modalPortfolioTitle: "📸 Portfolio Preview",
    closeBtn: "Close"
  }
};

export default function CreatorDirectory({ onRequireLogin }) {
  const { lang } = useLanguage();
  const { isLoggedIn } = useAuth();
  const { addToCart } = useCart();
  const t = DIRECTORY_TEXT[lang];

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedCreator, setSelectedCreator] = useState(null);

  const filteredCreators = CREATORS_DATA.filter((creator) => {
    const matchSearch =
      creator.name.toLowerCase().includes(search.toLowerCase()) ||
      creator.specialty[lang].toLowerCase().includes(search.toLowerCase()) ||
      creator.city.toLowerCase().includes(search.toLowerCase());

    const matchCategory = filter === "all" || creator.category === filter;

    return matchSearch && matchCategory;
  });

  const handleAddToCart = (e, creator) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      onRequireLogin?.();
    } else {
      addToCart(creator);
      alert(`${creator.name} a été ajouté à votre sélection !`);
    }
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

        {/* Barre de recherche & filtres */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-neutral-900 border border-neutral-800 p-4 rounded-2xl">
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-96 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-amber-500"
          />

          <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: "all", label: t.filterAll },
              { id: "drone", label: t.filterDrone },
              { id: "photo", label: t.filterPhoto },
              { id: "regisseur", label: t.filterRegisseur }
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setFilter(btn.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  filter === btn.id
                    ? "bg-amber-500 text-neutral-950"
                    : "bg-neutral-950 text-neutral-400 border border-neutral-800 hover:text-white"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grille des cartes créateurs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCreators.map((creator) => (
            <div
              key={creator.id}
              onClick={() => setSelectedCreator(creator)}
              className="bg-neutral-900 border border-neutral-800/80 hover:border-amber-500/40 rounded-3xl p-6 flex flex-col justify-between shadow-xl transition cursor-pointer group"
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
                    <h3 className="text-base font-bold text-white mt-1 group-hover:text-amber-400 transition">{creator.name}</h3>
                    <p className="text-xs text-neutral-400">{creator.city}</p>
                  </div>
                </div>

                <p className="text-xs text-amber-400/90 font-medium mb-4">{creator.specialty[lang]}</p>

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
                  onClick={(e) => handleAddToCart(e, creator)}
                  className="bg-amber-500 hover:bg-amber-400 text-neutral-950 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow cursor-pointer"
                >
                  {t.btnAddToCart}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* POP-UP STORYTELLING & FICHE DÉTAILLÉE CRÉATEUR */}
      {selectedCreator && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
          onClick={() => setSelectedCreator(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl"
          >
            {/* Header Modale */}
            <div className="flex justify-between items-start border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedCreator.avatar}
                  alt={selectedCreator.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-500/40"
                />
                <div>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-md font-bold uppercase">
                    {t.certifiedBadge}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white mt-1">{selectedCreator.name}</h2>
                  <p className="text-xs text-amber-400 font-bold">{selectedCreator.specialty[lang]} • {selectedCreator.city}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCreator(null)}
                className="text-neutral-400 hover:text-white font-bold text-xl cursor-pointer bg-neutral-950 rounded-full h-8 w-8 flex items-center justify-center border border-neutral-800"
              >
                ✕
              </button>
            </div>

            {/* Storytelling / Bio */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">{t.modalBioTitle}</h4>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
                {selectedCreator.bio[lang]}
              </p>
            </div>

            {/* Équipement */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">{t.modalEquipTitle}</h4>
              <ul className="text-xs text-neutral-300 space-y-1 bg-neutral-950 p-4 rounded-2xl border border-neutral-800 list-disc list-inside">
                {selectedCreator.equipment.map((eq, i) => (
                  <li key={i}>{eq}</li>
                ))}
              </ul>
            </div>

            {/* Portfolio */}
            <div className="space-y-2">
              <h4 className="text-