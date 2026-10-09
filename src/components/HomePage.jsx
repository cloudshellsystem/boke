import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

// Filigrane SVG répété, visible sur les photos
const WATERMARK_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="120"><text x="110" y="60" text-anchor="middle" dominant-baseline="middle" transform="rotate(-30 110 60)" fill="white" fill-opacity="0.45" stroke="black" stroke-opacity="0.3" stroke-width="0.8" font-family="Arial, sans-serif" font-size="18" font-weight="900" letter-spacing="4">BOKÉ ONE</text></svg>`
);
const watermarkStyle = { 
  backgroundImage: `url("data:image/svg+xml,${WATERMARK_SVG}")`, 
  backgroundRepeat: "repeat" 
};

const STOCK_IMAGES = [
  { id: 1, title: "Lumières de Conakry", type: "Image", photographe: "Antoine Leroy", description: "Vue panoramique au coucher du soleil sur les côtes guinéennes.", url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80", initialLikes: 12, licence: "Payante", price: "45.00 €" },
  { id: 2, title: "Regards de Guinée", type: "Portrait", photographe: "Alejandro Ruiz", description: "Portrait expressif en lumière naturelle capturé à Conakry.", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80", initialLikes: 27, licence: "Libre de droit", price: "Gratuit" },
  { id: 3, title: "Symphonie Sauvage", type: "Nature", photographe: "Camille Morel", description: "Paysage matinal brumeux dans la réserve naturelle.", url: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=800&q=80", initialLikes: 8, licence: "Payante", price: "30.00 €" },
  { id: 4, title: "Boké Stories", type: "Vidéo", photographe: "Mateo Fernandez", description: "Séquence dynamique au cœur de l'activité locale.", url: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80", initialLikes: 19, licence: "Payante", price: "50.00 €" },
  { id: 5, title: "Kamsar Industriel", type: "Architecture", photographe: "Élodie Bernard", description: "Lignes géométriques et structures industrielles modernes.", url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80", initialLikes: 34, licence: "Libre de droit", price: "Gratuit" },
  { id: 6, title: "Guinée Créative", type: "Studio", photographe: "Carmen Gomez", description: "Composition artistique en studio avec éclairage recherché.", url: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=800&q=80", initialLikes: 41, licence: "Payante", price: "40.00 €" }
];

export default function HomePage({ onRequireLogin }) {
  const { isLoggedIn } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [likes, setLikes] = useState(() => Object.fromEntries(STOCK_IMAGES.map((img) => [img.id, { count: img.initialLikes, liked: false }])));
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  
  // État pour la modale événement
  const [selectedEvent, setSelectedEvent] = useState(null);

  const toggleLike = (e, id) => {
    e.stopPropagation();
    setLikes((prev) => {
      const current = prev[id];
      return { ...prev, [id]: { liked: !current.liked, count: current.liked ? current.count - 1 : current.count + 1 } };
    });
  };

  const filteredImages = STOCK_IMAGES.filter((img) =>  
    img.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    img.photographe.toLowerCase().includes(searchQuery.toLowerCase()) ||
    img.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-neutral-950 min-h-screen text-neutral-200 font-sans">
      
      {/* Barre de recherche isolée */}
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-4 flex justify-center">
        <div className="w-full max-w-3xl flex items-center bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl overflow-hidden focus-within:border-amber-500/50 transition">
          <input 
            type="text" 
            placeholder="Rechercher des photos, vidéos, créateurs..." 
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
                  🔥 Événement & Salon IDF
                </span>
                <span className="text-[11px] text-neutral-400">Ce week-end</span>
              </div>
              <h4 className="text-sm font-bold text-neutral-100 mb-1">Boké One en direct sur le terrain</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Rencontrez nos dronistes, photographes immobiliers et créateurs partenaires. Démonstrations et networking au rendez-vous.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-900 flex justify-between items-center">
              <span className="text-[11px] text-amber-400 font-semibold">Accès libre & partenaires</span>
              <button 
                onClick={() => setSelectedEvent({
                  title: "Boké One au Salon de la Photo – Grande Halle de la Villette",
                  location: "Grande Halle de la Villette, Paris",
                  date: "Ce week-end",
                  image: "https://media.istockphoto.com/id/1256309402/fr/photo/la-grande-halle-de-la-villette-%C3%A0-paris-france.jpg?s=612x612&w=0&k=20&c=EDEWj9PLx88V4pmPbjCEI0MYTZvxuNs1_G8Dhk-0QAc=",
                  description: "L'équipe Boké One fait le tour du salon ! Retrouvez nos représentants, nos pilotes de drone accrédités, photographes immobiliers et régisseurs sur le terrain. C'est l'occasion idéale de venir échanger directement avec nous, découvrir le réseau d'élite, discuter de vos projets audiovisuels ou concrétiser votre inscription."
                })}
                className="text-xs text-neutral-300 hover:text-amber-400 font-bold transition flex items-center gap-1 cursor-pointer"
              >
                En savoir plus ➔
              </button>
            </div>
          </div>

          {/* Carte Annonce / Mission Exclusive */}
          <div className="bg-neutral-900/40 border border-neutral-900 rounded-2xl p-5 flex flex-col justify-between hover:border-amber-500/30 transition">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20 uppercase">
                  📢 Mission Validée (IDF)
                </span>
                <span className="text-[11px] text-neutral-400">Posté récemment</span>
              </div>
              <h4 className="text-sm font-bold text-neutral-100 mb-1">Reportage architectural & Droniste - Paris 16e</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Recherche photographe immobilier et opérateur drone accrédité pour la valorisation d'un bien d'exception.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-900 flex justify-between items-center">
              <span className="text-[11px] text-emerald-400 font-semibold">Budget sécurisé (SIRET)</span>
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
                {isLoggedIn ? "Voir l'offre ➔" : "🔒 Espace Abonnés ➔"}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Grille de photos principale avec filigrane */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-base sm:text-lg font-bold text-neutral-100 tracking-tight flex items-center gap-2">
            ✨ Découvertes Tendances <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-full font-semibold">Stock</span>
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
                  <img src={img.url} alt={img.title} className="h-full w-full object-cover select-none transition duration-500 group-hover:scale-105" />
                  <div aria-hidden="true" style={watermarkStyle} className="absolute inset-0 z-10 pointer-events-none select-none opacity-85" />
                  <span className="absolute top-2 left-2 z-20 bg-neutral-950/80 border border-neutral-800 backdrop-blur-md text-[10px] font-bold text-amber-400 px-2 py-0.5 rounded-md">{img.type}</span>
                </div>

                <div className="p-3 flex items-center justify-between gap-2 text-left mt-1">
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-neutral-200 truncate">{img.title}</h4>
                    <p className="text-[11px] text-neutral-400">Par {img.photographe}</p>
                  </div>
                  
                  <button 
                    type="button" 
                    onClick={(e) => toggleLike(e, img.id)} 
                    className={`shrink-0 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition ${liked ? "bg-amber-500/10 border-amber-500/40 text-amber-400" : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-amber-500/30"}`}
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

      {/* POP-UP ÉVÉNEMENT : LA GRANDE HALLE DE LA VILLETTE & BOKÉ ONE */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md" onClick={() => setSelectedEvent(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col">
            
            {/* Visuel Grande Halle de la Villette */}
            <div className="relative h-64 w-full overflow-hidden bg-neutral-950">
              <img src={selectedEvent.image} alt="Grande Halle de la Villette" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />
              <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 bg-neutral-950/80 hover:bg-neutral-800 text-white w-9 h-9 rounded-full flex items-center justify-center font-bold text-base transition border border-neutral-800">✕</button>
              
              <div className="absolute bottom-4 left-6 right-6">
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/20 border border-amber-500/30 px-3 py-1 rounded-full uppercase">
                  📍 {selectedEvent.location}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-2 leading-snug">{selectedEvent.title}</h3>
              </div>
            </div>

            {/* Contenu textuel d'immersion */}
            <div className="p-6 space-y-4">
              <p className="text-sm text-neutral-300 leading-relaxed">
                {selectedEvent.description}
              </p>
              
              <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-2xl flex items-center justify-between gap-4">
                <div>
                  <h5 className="text-xs font-bold text-neutral-200">🔥 Une question ou envie de nous rencontrer ?</h5>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Notre équipe réseau est disponible sur place tout au long du salon.</p>
                </div>
                <button 
                  onClick={() => window.open("https://wa.me/?text=Bonjour%20Boké%20One,%20je%20suis%20au%20salon%20et%20souhaite%20échanger !", "_blank")}
                  className="shrink-0 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 px-4 py-2.5 rounded-xl font-black text-xs transition shadow flex items-center gap-1.5"
                >
                  💬 Discuter
                </button>
              </div>

              <div className="pt-2 flex justify-end">
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-5 py-2 rounded-xl text-xs font-bold transition"
                >
                  Fermer
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Modale photo originale */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md" onClick={() => setSelectedPhoto(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-3xl w-full overflow-hidden flex flex-col md:flex-row shadow-2xl">
            <div className="relative md:w-3/5 bg-neutral-950 flex items-center justify-center p-4 min-h-[300px]">
              <img src={selectedPhoto.url} alt={selectedPhoto.title} className="max-h-[65vh] object-contain rounded-xl select-none" />
              <div aria-hidden="true" style={watermarkStyle} className="absolute inset-0 z-10 pointer-events-none select-none opacity-90" />
            </div>

            <div className="md:w-2/5 p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2.5 py-0.5 rounded font-bold border border-amber-500/20 uppercase">
                    {selectedPhoto.type}
                  </span>
                  <button onClick={() => setSelectedPhoto(null)} className="text-neutral-400 hover:text-white font-bold text-lg">✕</button>
                </div>

                <div>
                  <h3 className="text-lg font-black text-white">{selectedPhoto.title}</h3>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery(selectedPhoto.photographe); 
                      setSelectedPhoto(null); 
                    }}
                    className="mt-1 text-xs text-neutral-400 hover:text-amber-400 transition flex items-center gap-1 group text-left cursor-pointer"
                  >
                    <span>Photographe :</span>
                    <span className="font-bold text-amber-400 group-hover:underline">
                      {selectedPhoto.photographe}
                    </span>
                    <span className="text-[10px] text-amber-500 opacity-0 group-hover:opacity-100 transition">voir ses œuvres ➔</span>
                  </button>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed">{selectedPhoto.description}</p>
              </div>

              <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-neutral-400 font-medium">Licence :</span>
                  <span className="text-xs font-bold text-emerald-400">{selectedPhoto.licence}</span>
                </div>

                <div className="flex justify-between items-center border-t border-neutral-800 pt-3">
                  <span className="text-xs text-neutral-400 font-medium">Prix :</span>
                  {isLoggedIn ? (
                    <span className="text-sm font-black text-amber-400">{selectedPhoto.price}</span>
                  ) : (
                    <span className="text-[11px] text-amber-400/90 font-bold bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20 text-center">
                      🔒 Abonnez-vous pour voir le prix
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
                  className="w-full mt-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 py-2.5 rounded-xl font-black text-xs transition shadow"
                >
                  {isLoggedIn ? "🛒 Acheter / Télécharger" : "Se connecter pour acheter"}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}