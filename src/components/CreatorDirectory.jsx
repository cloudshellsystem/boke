import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";

const CREATORS_DATA = [
  {
    id: 101,
    name: "Antoine Leroy",
    specialty: { fr: "Pilote Drone Certifié", en: "Certified Drone Pilot" },
    category: "drone",
    city: "Paris / Île-de-France",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
    starting_price: 450,
    certifications: ["BAPD 2026", "CATS", "S1-S3"]
  },
  {
    id: 102,
    name: "Camille Morel",
    specialty: { fr: "Photographe Immobilier & Architecture", en: "Real Estate & Architecture Photographer" },
    category: "photo",
    city: "Lyon / Auvergne-Rhône-Alpes",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
    starting_price: 350,
    certifications: ["SIRET Vérifié"]
  },
  {
    id: 103,
    name: "Mateo Fernandez",
    specialty: { fr: "Régisseur Général & Chef Opérateur", en: "General Line Producer & Director of Photography" },
    category: "regisseur",
    city: "Marseille / PACA",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300",
    starting_price: 500,
    certifications: ["Permis Côtier", "Habilitation Électrique"]
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
    btnContact: "Contacter / Devis",
    btnAddToCart: "🛒 Réserver / Ajouter"
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
    btnContact: "Contact / Quote",
    btnAddToCart: "🛒 Book / Add to cart"
  }
};

export default function CreatorDirectory() {
  const { lang } = useLanguage();
  const t = DIRECTORY_TEXT[lang];
  const { addToCart } = useCart();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredCreators = CREATORS_DATA.filter((creator) => {
    const matchSearch =
      creator.name.toLowerCase().includes(search.toLowerCase()) ||
      creator.specialty[lang].toLowerCase().includes(search.toLowerCase()) ||
      creator.city.toLowerCase().includes(search.toLowerCase());

    const matchCategory = filter === "all" || creator.category === filter;

    return matchSearch && matchCategory;
  });

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

        {/* Grille des créateurs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCreators.map((creator) => (
            <div
              key={creator.id}
              className="bg-neutral-900 border border-neutral-800/80 hover:border-amber-500/30 rounded-3xl p-6 flex flex-col justify-between shadow-xl transition"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-amber-500/30"
                  />
                  <div>
                    <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase">
                      {t.certifiedBadge}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1">{creator.name}</h3>
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
                  onClick={() => addToCart(creator)}
                  className="bg-amber-500 hover:bg-amber-400 text-neutral-950 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow cursor-pointer"
                >
                  {t.btnAddToCart}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}