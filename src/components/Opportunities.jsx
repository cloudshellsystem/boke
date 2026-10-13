import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

/* ------------------------------------------------------------------
   PALETTE & BOKEH OPTIQUE (Arrière-plan)
------------------------------------------------------------------- */
const AMBER = "251,191,36";
const GOLD = "245,158,11";
const CHAMPAGNE = "253,230,138";
const QUARTZ = "147,170,255";

const halo = (rgb, a) =>
  `radial-gradient(circle at 50% 50%, rgba(${rgb},${a}) 0%, rgba(${rgb},${a * 0.45}) 40%, transparent 70%)`;

const disc = (rgb, a) =>
  `radial-gradient(circle at 50% 50%, rgba(${rgb},${a * 0.45}) 0%, rgba(${rgb},${a * 0.7}) 62%, rgba(${rgb},${a * 1.2}) 80%, rgba(${rgb},0) 83%)`;

const ORBS = [
  { s: "clamp(320px,50vw,600px)", x: "-5%",  y: "-10%", bg: halo(AMBER, 0.35),     b: "blur-3xl", d: 22, dl: 0 },
  { s: "clamp(280px,42vw,500px)", x: "60%",  y: "8%",   bg: halo(QUARTZ, 0.25),    b: "blur-3xl", d: 26, dl: -4 },
  { s: "clamp(90px,12vw,180px)",  x: "10%",  y: "25%",  bg: disc(AMBER, 0.4),      b: "blur-[2px]", d: 14, dl: -2 },
  { s: "clamp(110px,15vw,220px)", x: "80%",  y: "18%",  bg: disc(GOLD, 0.35),      b: "blur-sm",    d: 18, dl: -6 },
];

/* ------------------------------------------------------------------
   DONNÉES DES OPPORTUNITÉS & COLLABORATIONS
------------------------------------------------------------------- */
const ALL_OPPORTUNITIES = [
  {
    id: 1,
    type: "emploi",
    badge: "OFFRE D'EMPLOI / CASTING",
    title: "Recherche Chef Opérateur & Pilote Drone S1-S3 (Série Docu)",
    budget: "4 500 € / Mission",
    location: "Région PACA",
    date: "Aujourd'hui",
    requiredPlan: "pro",
    summary: "Tournage d'une série documentaire de 4 épisodes. Expérience exigée en drone FPV et caméras cinéma grand capteur.",
    description: "Dans le cadre de la production d'une série documentaire sur le patrimoine de la côte méditerranéenne, nous recherchons un binôme ou un profil polyvalent Chef Opérateur + Pilote Drone certifié S1-S3. Matériel fourni ou défraiement.",
    author: "Prod Riviera Films"
  },
  {
    id: 2,
    type: "emploi",
    badge: "MISSION PACKSHOT",
    title: "Photographe Studio Luxe — Campagne Horlogerie Paris 8e",
    budget: "1 200 € / Jour",
    location: "Paris 8e",
    date: "Hier",
    requiredPlan: "pro",
    summary: "Shooting 2 jours en studio avec retouche HD pour une grande maison horlogère.",
    description: "Recherche d'un photographe expérimenté en gestion des réflexions sur surfaces métalliques et verre saphir. Éclairage broncolor fourni.",
    author: "Maison Horlogère de Paris"
  },
  {
    id: 3,
    type: "collab",
    badge: "COLLABORATION CRÉATIVE",
    title: "Photographe Mode cherche Modèle Femme & Maquilleuse (Projet Editorial)",
    budget: "Pro bono / Cession de droits partagée",
    location: "Lyon (Studio)",
    date: "Il y a 2 jours",
    requiredPlan: "free",
    summary: "Projet éditorial destiné à être soumis au magazine Blind. Thème : Lumières obliques et textures.",
    description: "Recherche d'une modèle professionnelle et d'une MUA pour une session de 4h en studio. Publication garantie et visuels HD fournis pour portfolios respectifs.",
    author: "Marc L. (Membre Vérifié)"
  },
  {
    id: 4,
    type: "collab",
    badge: "RECHERCHE CO-CRÉATEUR",
    title: "Vidéaste cherche Cadreur Seconde Caméra (Tournage Clip Indé)",
    budget: "250 € + Défraiement",
    location: "Bordeaux",
    date: "Il y a 3 jours",
    requiredPlan: "free",
    summary: "Renfort sur un tournage de clip musical indépendant à Bordeaux centre.",
    description: "Besoin d'un second cadreur équipé en Sony FX3 ou A7SIII pour assurer les plans de coupe et de coulisses lors du tournage nocturne.",
    author: "Lucas M."
  },
  {
    id: 5,
    type: "appel",
    badge: "APPEL À PROJETS",
    title: "Bourse Jeune Création 2027 — Exposition Galerie Nationale",
    budget: "Dotation : 5 000 €",
    location: "National (France)",
    date: "Il y a 5 jours",
    requiredPlan: "free",
    summary: "Soumettez vos séries documentaires pour la sélection officielle Boké One 2027.",
    description: "Le comité d'évaluation Boké One sélectionne 5 lauréats pour une exposition collective en galerie physique à Paris et un accompagnement médiatique complet.",
    author: "Comité Curation Boké One"
  }
];

export default function Opportunities() {
  const { lang } = useLanguage();
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const isEn = lang === "en";

  const [filterType, setFilterType] = useState("all");
  const [selectedOp, setSelectedOp] = useState(null);

  const userPlan = user?.user_metadata?.plan || "free"; 

  const filteredOpportunities = ALL_OPPORTUNITIES.filter((op) => {
    if (filterType === "all") return true;
    return op.type === filterType;
  });

  return (
    <div className="bg-neutral-950 min-h-screen text-neutral-200 font-sans pb-20 pt-8 relative isolate overflow-hidden">
      
      {/* Animation GPU du Bokeh */}
      <style>{`
        @keyframes op-bokeh-drift {
          0%   { transform: translate3d(0, 0, 0) scale(1); opacity: .85; }
          50%  { transform: translate3d(10px, -18px, 0) scale(1.05); opacity: 1; }
          100% { transform: translate3d(0, 0, 0) scale(1); opacity: .85; }
        }
        .op-bokeh-orb { animation: op-bokeh-drift var(--d) ease-in-out var(--dl) infinite; will-change: transform, opacity; }
      `}</style>

      {/* COUCHE BOKEH EN ARRIÈRE-PLAN */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {ORBS.map((o, i) => (
          <div
            key={i}
            className={`op-bokeh-orb absolute rounded-full ${o.b}`}
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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,10,10,0.5)_0%,rgba(10,10,10,0.2)_50%,rgba(10,10,10,0.9)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/40 via-transparent to-neutral-950" />
      </div>

      <div className="max-w-5xl mx-auto px-4 space-y-8 relative z-10">
        
        {/* EN-TÊTE DE LA PAGE */}
        <div className="text-center space-y-3 pt-2">
          <span className="inline-block text-[11px] sm:text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 px-5 py-2 rounded-full font-black uppercase tracking-widest shadow-lg backdrop-blur-md">
            💼 Network & Job Board
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Opportunités & Collaborations
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto">
            Missions rémunérées, castings, appels à projets nationaux et collaborations entre créatifs du réseau Boké One.
          </p>
        </div>

        {/* BARRE DE FILTRES */}
        <div className="flex flex-wrap items-center justify-center gap-2 bg-neutral-900/60 p-2 rounded-2xl border border-neutral-800/80 backdrop-blur-md max-w-3xl mx-auto">
          <button
            onClick={() => setFilterType("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              filterType === "all" ? "bg-amber-500 text-neutral-950 shadow-md" : "text-neutral-400 hover:text-white"
            }`}
          >
            Toutes les opportunités ({ALL_OPPORTUNITIES.length})
          </button>
          <button
            onClick={() => setFilterType("emploi")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              filterType === "emploi" ? "bg-amber-500 text-neutral-950 shadow-md" : "text-neutral-400 hover:text-white"
            }`}
          >
            💼 Offres d'emploi & Castings
          </button>
          <button
            onClick={() => setFilterType("collab")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              filterType === "collab" ? "bg-amber-500 text-neutral-950 shadow-md" : "text-neutral-400 hover:text-white"
            }`}
          >
            🤝 Collaborations
          </button>
          <button
            onClick={() => setFilterType("appel")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              filterType === "appel" ? "bg-amber-500 text-neutral-950 shadow-md" : "text-neutral-400 hover:text-white"
            }`}
          >
            🏆 Appels à Projets
          </button>
        </div>

        {/* LISTE DES CARTES */}
        <div className="space-y-4">
          {filteredOpportunities.map((op) => (
            <div
              key={op.id}
              onClick={() => setSelectedOp(op)}
              className="bg-neutral-900/70 border border-neutral-800/80 hover:border-amber-500/40 rounded-2xl p-5 sm:p-6 transition-all duration-300 backdrop-blur-md shadow-xl cursor-pointer group flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-md">
                    {op.badge}
                  </span>
                  <span className="text-[11px] text-neutral-500">📍 {op.location}</span>
                  <span className="text-[11px] text-neutral-500">• {op.date}</span>
                </div>

                <h3 className="text-base sm:text-lg font-black text-white group-hover:text-amber-400 transition">
                  {op.title}
                </h3>

                <p className="text-xs text-neutral-400 line-clamp-2">{op.summary}</p>
              </div>

              <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 border-t md:border-t-0 border-neutral-800 pt-3 md:pt-0 shrink-0">
                <span className="text-xs sm:text-sm font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-xl">
                  {op.budget}
                </span>

                <button
                  type="button"
                  className="bg-neutral-800 group-hover:bg-amber-500 group-hover:text-neutral-950 text-neutral-200 font-bold px-4 py-2 rounded-xl text-xs transition"
                >
                  Voir l'offre ➔
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* MODALE DÉTAIL D'UNE OFFRE */}
      {selectedOp && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedOp(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative"
          >
            <button
              onClick={() => setSelectedOp(null)}
              className="absolute top-4 right-4 bg-neutral-800 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold hover:bg-neutral-700 transition cursor-pointer"
            >
              ✕
            </button>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full">
                {selectedOp.badge}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white pt-1">{selectedOp.title}</h2>
              <div className="flex gap-4 text-xs text-neutral-400">
                <span>📍 {selectedOp.location}</span>
                <span className="text-emerald-400 font-bold">💰 {selectedOp.budget}</span>
                <span>👤 Par {selectedOp.author}</span>
              </div>
            </div>

            <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl text-xs text-neutral-300 leading-relaxed space-y-2">
              <p className="font-semibold text-white">Description complète :</p>
              <p>{selectedOp.description}</p>
            </div>

            {/* VÉRIFICATION DE LA SESSION ET DE L'ABONNEMENT */}
            <div className="pt-2">
              {!isLoggedIn ? (
                <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl text-center space-y-3">
                  <p className="text-xs text-amber-300 font-semibold">
                    🔒 Vous devez être connecté pour postuler ou contacter l'auteur de cette offre.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedOp(null);
                      navigate("/login");
                    }}
                    className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider transition"
                  >
                    Se connecter ➔
                  </button>
                </div>
              ) : selectedOp.requiredPlan !== "free" && userPlan === "free" ? (
                <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl text-center space-y-3">
                  <p className="text-xs text-amber-300 font-semibold">
                    ⭐ Cette offre d'emploi est réservée aux abonnés Pro & Élite.
                  </p>
                  <Link
                    to="/abonnes"
                    className="inline-block bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider transition"
                  >
                    Mettre à niveau mon abonnement ➔
                  </Link>
                </div>
              ) : (
                <a
                  href={`mailto:contact@bokeone.com?subject=Candidature: ${encodeURIComponent(selectedOp.title)}`}
                  className="block w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black py-3.5 rounded-xl text-xs uppercase tracking-wider text-center transition shadow-lg"
                >
                  ✉️ Postuler directement à cette offre
                </a>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}