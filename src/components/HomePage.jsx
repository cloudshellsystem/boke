import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ACTUALITES_ITEMS = [
  {
    id: 1,
    date: "Salon Pro 2026",
    title: "Ouverture des accréditations Élite & Pro - Salon de la Photo",
    summary: "Accédez en avant-première aux masterclasses et plannings exclusifs à la Grande Halle de la Villette.",
    fullContent: "Le grand Salon Photo & Vidéo bat actuellement son plein à la Grande Halle de la Villette ! Quatre jours exceptionnels dédiés à la pratique, aux masterclasses de pointe, aux tests de matériel en situation réelle (studio, macro, architecture) et aux rencontres exclusives avec l'élite de la création visuelle française.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    date: "Octobre 2026",
    title: "Mise à jour des certifications nationales de l'audiovisuel",
    summary: "Renforcement des protocoles de sécurité pour les tournages en espace public et en milieu aquatique.",
    fullContent: "Dans le cadre de notre démarche d'élite, cette mise à jour intègre de nouvelles normes obligatoires pour tous les prestataires du réseau Boké One intervenant sur le domaine public en Île-de-France.",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80",
  },
];

const ANNONCES_ITEMS = [
  {
    id: 101,
    date: "OFFRE D'EMPLOI / CASTING",
    title: "Recherche Chef Opérateur & Pilote Drone S1-S3 (Série Docu)",
    summary: "🔒 Offre réservée aux adhérents Élite : Tournage 3 semaines en région PACA à partir de Novembre.",
    fullContent: "Tournage d'une série documentaire de 4 épisodes. Expérience exigée en drone FPV et caméras cinéma grand capteur. Rémunération selon grille conventionnelle + défraiements complets.",
    image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80",
    restricted: true,
  },
  {
    id: 102,
    date: "MISSION PACKSHOT",
    title: "Photographe Studio Luxe — Campagne Horlogerie Paris 8e",
    summary: "🔒 Offre réservée aux adhérents : Shooting 2 jours en studio avec retouche haute définition.",
    fullContent: "Mandat confié par une grande maison horlogère parisienne. Maîtrise des éclairages Profoto et focus stacking exigée. Portfolio haut de gamme requis.",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
    restricted: true,
  },
];

export default function HomePage({ onRequireLogin }) {
  const { lang } = useLanguage();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const isEn = lang === "en";

  const [activeSubTab, setActiveSubTab] = useState("actualites"); // "actualites" ou "annonces"
  const [searchQuery, setSearchQuery] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentList = activeSubTab === "actualites" ? ACTUALITES_ITEMS : ANNONCES_ITEMS;

  useEffect(() => {
    setCurrentIndex(0);
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % currentList.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeSubTab, currentList.length]);

  const [selectedNews, setSelectedNews] = useState(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/creators?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate("/creators");
    }
  };

  const item = currentList[currentIndex] || currentList[0];

  return (
    <div className="bg-neutral-950 min-h-screen text-neutral-200 font-sans selection:bg-amber-500 selection:text-neutral-950 pb-16">
      
      {/* Filet gris simple de séparation sous la navbar (boutons superflus supprimés) */}
      <div className="w-full border-b border-neutral-800/80 mb-6" />

      <div className="max-w-6xl mx-auto px-4 space-y-8">

        {/* 1. MOTEUR DE RECHERCHE REMONTÉ EN HAUT */}
        <div className="bg-neutral-900/80 border border-neutral-800 p-4 rounded-2xl shadow-xl backdrop-blur-md">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">
                🔍
              </span>
              <input
                type="text"
                placeholder={isEn ? "Search by creator name, subscription, reference..." : "Rechercher par nom de presta, abonnement, référence..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-11 pr-4 py-3 text-xs md:text-sm text-white placeholder-neutral-500 outline-none focus:border-amber-400 transition"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black px-8 py-3 rounded-xl text-xs uppercase tracking-wider transition shadow-lg cursor-pointer shrink-0"
            >
              {isEn ? "Search" : "Rechercher"}
            </button>
          </form>
        </div>

        {/* 2. ONGLETS : ACTUALITÉS / ANNONCES */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 border-b border-neutral-800/60 pb-3">
            <button
              type="button"
              onClick={() => setActiveSubTab("actualites")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                activeSubTab === "actualites"
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <span>⚡</span> {isEn ? "News" : "Actualités"}
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab("annonces")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                activeSubTab === "annonces"
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <span>📢</span> {isEn ? "Ads (Job Offers)" : "Annonces (Offres d'emploi)"}
            </button>
          </div>

          {/* CARROUSEL D'AFFICHAGE */}
          <div
            onClick={() => setSelectedNews(item)}
            className="bg-neutral-900/60 border border-neutral-800/80 hover:border-amber-500/40 rounded-3xl p-5 md:p-8 relative overflow-hidden shadow-2xl transition-all duration-300 cursor-pointer group"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              <div className="md:col-span-5 relative overflow-hidden rounded-2xl border border-neutral-800 h-48 md:h-56">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur-md text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2.5 py-1 rounded-md">
                  {item.date}
                </span>
              </div>

              <div className="md:col-span-7 space-y-4">
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full">
                  {activeSubTab === "actualites" ? "Information Réseau" : "Réservé Adhérents"}
                </span>

                <h3 className="text-xl md:text-2xl font-black text-white group-hover:text-amber-400 transition leading-tight">
                  {item.title}
                </h3>

                <p className="text-xs md:text-sm text-neutral-400 leading-relaxed">
                  {item.summary}
                </p>

                <div className="pt-2">
                  {!isLoggedIn && item.restricted ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRequireLogin?.();
                      }}
                      className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-5 py-2.5 rounded-xl text-xs transition shadow-lg cursor-pointer"
                    >
                      {isEn ? "🔒 Log in to apply" : "🔒 Se connecter pour postuler à cette offre"}
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-amber-400 underline">
                      {isEn ? "Read full details →" : "Lire le détail complet →"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Puces de pagination */}
            <div className="flex justify-end gap-1.5 mt-4">
              {currentList.map((_, idx) => (
                <span
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx ? "w-6 bg-amber-400" : "w-1.5 bg-neutral-700 hover:bg-neutral-500"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* MODALE DÉTAIL ACTU / ANNONCE */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl space-y-5 p-6 sm:p-8 relative">
            <button
              type="button"
              onClick={() => setSelectedNews(null)}
              className="absolute top-4 right-4 bg-neutral-800 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold hover:bg-neutral-700 transition cursor-pointer"
            >
              ✕
            </button>
            <div className="space-y-1">
              <span className="text-xs text-amber-400 font-bold">{selectedNews.date}</span>
              <h2 className="text-xl sm:text-2xl font-black text-white">{selectedNews.title}</h2>
            </div>
            <div className="relative h-64 rounded-2xl overflow-hidden border border-neutral-800 shadow-inner">
              <img src={selectedNews.image} alt="" className="w-full h-full object-cover" />
            </div>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">{selectedNews.fullContent}</p>
            <button
              type="button"
              onClick={() => setSelectedNews(null)}
              className="w-full bg-amber-500 text-neutral-950 font-bold py-3.5 rounded-xl text-xs cursor-pointer hover:bg-amber-400 transition shadow-lg"
            >
              {isEn ? "Close" : "Fermer"}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}