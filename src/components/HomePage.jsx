import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

// Filigrane SVG répété, visible sur les photos
const WATERMARK_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="120"><text x="110" y="60" text-anchor="middle" dominant-baseline="middle" transform="rotate(-30 110 60)" fill="white" fill-opacity="0.45" stroke="black" stroke-opacity="0.3" stroke-width="0.8" font-family="Arial, sans-serif" font-size="18" font-weight="900" letter-spacing="4">BOKÉ ONE</text></svg>`
);
const watermarkStyle = { 
  backgroundImage: `url("data:image/svg+xml,${WATERMARK_SVG}")`, 
  backgroundRepeat: "repeat" 
};

const STOCK_IMAGES = [
  { id: 1, title: { fr: "Lumières de Conakry", en: "Conakry Lights" }, type: { fr: "Image", en: "Image" }, photographe: "Antoine Leroy", description: { fr: "Vue panoramique au coucher du soleil sur les côtes guinéennes.", en: "Panoramic sunset view over the Guinean coastline." }, url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80", initialLikes: 12, licence: { fr: "Payante", en: "Paid" }, price: "45.00 €" },
  { id: 2, title: { fr: "Regards de Guinée", en: "Glimpse of Guinea" }, type: { fr: "Portrait", en: "Portrait" }, photographe: "Alejandro Ruiz", description: { fr: "Portrait expressif en lumière naturelle capturé à Conakry.", en: "Expressive natural light portrait captured in Conakry." }, url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80", initialLikes: 27, licence: { fr: "Libre de droit", en: "Royalty Free" }, price: "Gratuit" },
  { id: 3, title: { fr: "Symphonie Sauvage", en: "Wild Symphony" }, type: { fr: "Nature", en: "Nature" }, photographe: "Camille Morel", description: { fr: "Paysage matinal brumeux dans la réserve naturelle.", en: "Misty morning landscape in the nature reserve." }, url: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=800&q=80", initialLikes: 8, licence: { fr: "Payante", en: "Paid" }, price: "30.00 €" },
  { id: 4, title: { fr: "Boké Stories", en: "Boké Stories" }, type: { fr: "Vidéo", en: "Video" }, photographe: "Mateo Fernandez", description: { fr: "Séquence dynamique au cœur de l'activité locale.", en: "Dynamic footage at the heart of local life." }, url: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80", initialLikes: 19, licence: { fr: "Payante", en: "Paid" }, price: "50.00 €" },
  { id: 5, title: { fr: "Kamsar Industriel", en: "Industrial Kamsar" }, type: { fr: "Architecture", en: "Architecture" }, photographe: "Élodie Bernard", description: { fr: "Lignes géométriques et structures industrielles modernes.", en: "Geometric lines and modern industrial structures." }, url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80", initialLikes: 34, licence: { fr: "Libre de droit", en: "Royalty Free" }, price: "Gratuit" },
  { id: 6, title: { fr: "Guinée Créative", en: "Creative Guinea" }, type: { fr: "Studio", en: "Studio" }, photographe: "Carmen Gomez", description: { fr: "Composition artistique en studio avec éclairage recherché.", en: "Artistic studio composition with fine lighting." }, url: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=800&q=80", initialLikes: 41, licence: { fr: "Payante", en: "Paid" }, price: "40.00 €" }
];

const UI_TEXT = {
  fr: {
    searchPlaceholder: "Rechercher des photos, vidéos, créateurs...",
    eventBadge: "🔥 Événement & Salon IDF",
    eventTime: "Ce week-end",
    eventTitle: "Boké One en direct sur le terrain",
    eventDesc: "Rencontrez nos dronistes, photographes immobiliers et créateurs partenaires. Démonstrations et networking au rendez-vous.",
    eventAccess: "Accès libre & partenaires",
    learnMore: "En savoir plus ➔",
    missionBadge: "📢 Mission Validée (IDF)",
    missionTime: "Posté récemment",
    missionTitle: "Reportage architectural & Droniste - Paris 16e",
    missionDesc: "Recherche photographe immobilier et opérateur drone accrédité pour la valorisation d'un bien d'exception.",
    missionBudget: "Budget sécurisé (SIRET)",
    viewOffer: "Voir l'offre ➔",
    subSpace: "🔒 Espace Abonnés ➔",
    trendingTitle: "✨ Découvertes Tendances",
    stockBadge: "Stock",
    by: "Par",
    photographer: "Photographe :",
    seeWorks: "voir ses œuvres ➔",
    licence: "Licence :",
    price: "Prix :",
    subToSeePrice: "🔒 Abonnez-vous pour voir le prix",
    buyDownload: "🛒 Acheter / Télécharger",
    loginToBuy: "Se connecter pour acheter",
    eventModalTitle: "Boké One au Salon de la Photo – Grande Halle de la Villette",
    eventModalLocation: "Grande Halle de la Villette, Paris",
    eventModalDesc: "L'équipe Boké One fait le tour du salon ! Retrouvez nos représentants, nos pilotes de drone accrédités, photographes immobiliers et régisseurs sur le terrain. C'est l'occasion idéale de venir échanger directement avec nous, découvrir le réseau d'élite, discuter de vos projets audiovisuel ou concrétiser votre inscription.",
    questionTitle: "🔥 Une question ou envie de nous rencontrer ?",
    questionDesc: "Notre équipe réseau est disponible sur place tout au long du salon.",
    chatBtn: "💬 Discuter",
    closeBtn: "Fermer"
  },
  en: {
    searchPlaceholder: "Search photos, videos, creators...",
    eventBadge: "🔥 Event & Trade Show IDF",
    eventTime: "This weekend",
    eventTitle: "Boké One live on the ground",
    eventDesc: "Meet our drone pilots, real estate photographers, and partner creators. Live demonstrations and networking.",
    eventAccess: "Free access & partners",
    learnMore: "Learn more ➔",
    missionBadge: "📢 Validated Mission (IDF)",
    missionTime: "Recently posted",
    missionTitle: "Architectural & Drone Coverage - Paris 16th",
    missionDesc: "Looking for real estate photographer and certified drone operator for luxury property showcase.",
    missionBudget: "Secured budget (SIRET)",
    viewOffer: "View offer ➔",
    subSpace: "🔒 Subscriber Area ➔",
    trendingTitle: "✨ Trending Discoveries",
    stockBadge: "Stock",
    by: "By",
    photographer: "Photographer:",
    seeWorks: "view portfolio ➔",
    licence: "License:",
    price: "Price:",
    subToSeePrice: "🔒 Subscribe to view price",
    buyDownload: "🛒 Buy / Download",
    loginToBuy: "Sign in to buy",
    eventModalTitle: "Boké One at Salon de la Photo – Grande Halle de la Villette",
    eventModalLocation: "Grande Halle de la Villette, Paris",
    eventModalDesc: "The Boké One team is at the show! Meet our representatives, certified drone pilots, real estate photographers, and line producers on-site. This is the perfect opportunity to chat directly with us, discover our elite network, discuss your audiovisual projects, or finalize your membership.",
    questionTitle: "🔥 Have a question or want to meet us?",
    questionDesc: "Our team is available on site throughout the show.",
    chatBtn: "💬 Chat now",
    closeBtn: "Close"
  }
};

export default function HomePage({ onRequireLogin }) {
  const { isLoggedIn } = useAuth();
  const { lang } = useLanguage();
  const ui = UI_TEXT[lang];

  const [searchQuery, setSearchQuery] = useState("");
  const [likes, setLikes] = useState(() => Object.fromEntries(STOCK_IMAGES.map((img) => [img.id, { count: img.initialLikes, liked: false }])));
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const toggleLike = (e, id) => {
    e.stopPropagation();
    setLikes((prev) => {
      const current = prev[id];
      return { ...prev, [id]: { liked: !current.liked, count: current.liked ? current.count - 1 : current.count + 1 } };
    });
  };

  const filteredImages = STOCK_IMAGES.filter((img) => 
    img.title[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
    img.photographe.toLowerCase().includes(searchQuery.toLowerCase()) ||
    img.type[lang].toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-neutral-950 min-h-screen text-neutral-200 font-sans">
      
      {/* Barre de recherche */}
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-4 flex justify-center">
        <div className="w-full max-w-3xl flex items-center bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl overflow-hidden focus-within:border-amber-500/50 transition">
          <input 
            type="text" 
            placeholder={ui.searchPlaceholder} 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="w-full bg-transparent px-4 py-3 text-sm text-neutral-100 placeholder-neutral-500 outline-none" 
          />
          <button type="button" className="bg-amber-500 hover:bg-amber-400 text-neutral-950 px-5 py-3 transition flex items-center justify-center font-bold">
            🔍
          </button>
        </div>
      </div>

      {/* SECTION ACTUALITÉS & ÉVÉNEMENTS */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Carte Événement / Salon */}
          <div className="bg-neutral-900/40 border border-neutral-900 rounded-2xl p-5 flex flex-col justify-between hover:border-amber-500/30 transition">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20 uppercase">
                  {ui.eventBadge}
                </span>
                <span className="text-[11px] text-neutral-400">{ui.eventTime}</span>
              </div>
              <h4 className="text-sm font-bold text-neutral-100 mb-1">{ui.eventTitle}</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {ui.eventDesc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-900 flex justify-between items-center">
              <span className="text-[11px] text-amber-400 font-semibold">{ui.eventAccess}</span>
              <button 
                onClick={() => setSelectedEvent({
                  title: ui.eventModalTitle,
                  location: ui.eventModalLocation,
                  date: ui.eventTime,
                  image: "https://media.istockphoto.com/id/1256309402/fr/photo/la-grande-halle-de-la-villette-%C3%A0-paris-france.jpg?s=612x612&w=0&k=20&c=EDEWj9PLx88V4pmPbjCEI0MYTZvxuNs1_G8Dhk-0QAc=",
                  description: ui.eventModalDesc
                })}
                className="text-xs text-neutral-300 hover:text-amber-400 font-bold transition flex items-center gap-1 cursor-pointer"
              >
                {ui.learnMore}
              </button>
            </div>
          </div>

          {/* Carte Annonce / Mission Exclusive */}
          <div className="bg-neutral-900/40 border border-neutral-900 rounded-2xl p-5 flex flex-col justify-between hover:border-amber-500/30 transition">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20 uppercase">
                  {ui.missionBadge}
                </span>
                <span className="text-[11px] text-neutral-400">{ui.missionTime}</span>
              </div>
              <h4 className="text-sm font-bold text-neutral-100 mb-1">{ui.missionTitle}</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {ui.missionDesc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-900 flex justify-between items-center">
              <span className="text-[11px] text-emerald-400 font-semibold">{ui.missionBudget}</span>
              <button 
                onClick={() => {
                  if (!isLoggedIn) {
                    onRequireLogin?.();
                  } else {
                    alert("Redirection vers les détails de la mission exclusive !");
                  }
                }}
                className="text-xs text-neutral-300 hover:text-amber-400 font-bold transition flex items-center gap-1 cursor-pointer"
              >
                {isLoggedIn ? ui.viewOffer : ui.subSpace}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Grille de photos principale avec filigrane */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-base sm:text-lg font-bold text-neutral-100 tracking-tight flex items-center gap-2">
            {ui.trendingTitle} <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-full font-semibold">{ui.stockBadge}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredImages.map((img) => {
            const { count, liked } = likes[img.id];
            return (
              <div 
                key={img.id} 
                onClick={() => setSelectedPhoto(img)}
                className="group relative rounded-2xl overflow-hidden border border-neutral-900 bg-neutral-900/50 p-2 shadow-md hover:border-amber-500/30 transition cursor-pointer flex flex-col justify-between"
              >
                <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-gradient-to-br from-neutral-800 to-neutral-900 relative">
                  <img src={img.url} alt={img.title[lang]} className="h-full w-full object-cover select-none transition duration-500 group-hover:scale-105" />
                  <div aria-hidden="true" style={watermarkStyle} className="absolute inset-0 z-10 pointer-events-none select-none opacity-85" />
                  <span className="absolute top-2 left-2 z-20 bg-neutral-950/80 border border-neutral-800 backdrop-blur-md text-[10px] font-bold text-amber-400 px-2 py-0.5 rounded-md">{img.type[lang]}</span>
                </div>

                <div className="p-3 flex items-center justify-between gap-2 text-left mt-1">
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-neutral-200 truncate">{img.title[lang]}</h4>
                    <p className="text-[11px] text-neutral-400">{ui.by} {img.photographe}</p>
                  </div>
                  
                  <button 
                    type="button" 
                    onClick={(e) => toggleLike(e, img.id)} 
                    className={`shrink-0 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition cursor-pointer ${liked ? "bg-amber-500/10 border-amber-500/40 text-amber-400" : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-amber-500/30"}`}
                  >
                    <span>{liked ? "❤️" : "🤍"}</span>
                    <span>{count}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* POP-UP ÉVÉNEMENT */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md" onClick={() => setSelectedEvent(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col">
            
            <div className="relative h-64 w-full overflow-hidden bg-neutral-950">
              <img src={selectedEvent.image} alt="Grande Halle de la Villette" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />
              <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 bg-neutral-950/80 hover:bg-neutral-800 text-white w-9 h-9 rounded-full flex items-center justify-center font-bold text-base transition border border-neutral-800 cursor-pointer">✕</button>
              
              <div className="absolute bottom-4 left-6 right-6">
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/20 border border-amber-500/30 px-3 py-1 rounded-full uppercase">
                  📍 {selectedEvent.location}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-2 leading-snug">{selectedEvent.title}</h3>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-neutral-300 leading-relaxed">
                {selectedEvent.description}
              </p>
              
              <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-2xl flex items-center justify-between gap-4">
                <div>
                  <h5 className="text-xs font-bold text-neutral-200">{ui.questionTitle}</h5>
                  <p className="text-[11px] text-neutral-400 mt-0.5">{ui.questionDesc}</p>
                </div>
                <button 
                  onClick={() => window.open("https://wa.me/?text=" + encodeURIComponent("Bonjour Boké One, je suis au salon et souhaite échanger !"), "_blank")}
                  className="shrink-0 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 px-4 py-2.5 rounded-xl font-black text-xs transition shadow flex items-center gap-1.5 cursor-pointer"
                >
                  {ui.chatBtn}
                </button>
              </div>

              <div className="pt-2 flex justify-end">
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  {ui.closeBtn}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Modale photo */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md" onClick={() => setSelectedPhoto(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-3xl w-full overflow-hidden flex flex-col md:flex-row shadow-2xl">
            <div className="relative md:w-3/5 bg-neutral-950 flex items-center justify-center p-4 min-h-[300px]">
              <img src={selectedPhoto.url} alt={selectedPhoto.title[lang]} className="max-h-[65vh] object-contain rounded-xl select-none" />
              <div aria-hidden="true" style={watermarkStyle} className="absolute inset-0 z-10 pointer-events-none select-none opacity-90" />
            </div>

            <div className="md:w-2/5 p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2.5 py-0.5 rounded font-bold border border-amber-500/20 uppercase">
                    {selectedPhoto.type[lang]}
                  </span>
                  <button onClick={() => setSelectedPhoto(null)} className="text-neutral-400 hover:text-white font-bold text-lg cursor-pointer">✕</button>
                </div>

                <div>
                  <h3 className="text-lg font-black text-white">{selectedPhoto.title[lang]}</h3>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery(selectedPhoto.photographe); 
                      setSelectedPhoto(null); 
                    }}
                    className="mt-1 text-xs text-neutral-400 hover:text-amber-400 transition flex items-center gap-1 group text-left cursor-pointer"
                  >
                    <span>{ui.photographer}</span>
                    <span className="font-bold text-amber-400 group-hover:underline">
                      {selectedPhoto.photographe}
                    </span>
                    <span className="text-[10px] text-amber-500 opacity-0 group-hover:opacity-100 transition">{ui.seeWorks}</span>
                  </button>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed">{selectedPhoto.description[lang]}</p>
              </div>

              <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-neutral-400 font-medium">{ui.licence}</span>
                  <span className="text-xs font-bold text-emerald-400">{selectedPhoto.licence[lang]}</span>
                </div>

                <div className="flex justify-between items-center border-t border-neutral-800 pt-3">
                  <span className="text-xs text-neutral-400 font-medium">{ui.price}</span>
                  {isLoggedIn ? (
                    <span className="text-sm font-black text-amber-400">{selectedPhoto.price}</span>
                  ) : (
                    <span className="text-[11px] text-amber-400/90 font-bold bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20 text-center">
                      {ui.subToSeePrice}
                    </span>
                  )}
                </div>

                <button 
                  onClick={() => {
                    if (!isLoggedIn) { 
                      onRequireLogin?.(); 
                    } else { 
                      alert("Redirection vers le paiement / panier !"); 
                    }
                  }}
                  className="w-full mt-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 py-2.5 rounded-xl font-black text-xs transition shadow cursor-pointer"
                >
                  {isLoggedIn ? ui.buyDownload : ui.loginToBuy}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}