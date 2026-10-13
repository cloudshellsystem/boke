// src/components/Gallery.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useSelectionCart } from "../hooks/useSelectionCart";

const REALISATIONS_INITIALES = [
  { id: 1, titre: "Publicité Luxe & Or", categorie: "COMMERCIAL", auteur: "Agence One", likes: 142, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80" },
  { id: 2, titre: "Portrait Naturel", categorie: "PORTRAIT", auteur: "Studio Boke", likes: 89, image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80" },
  { id: 3, titre: "Aftermovie Festival Électro", categorie: "EVENEMENT", auteur: "Sarah Lemaire", likes: 215, image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80" },
  { id: 4, titre: "Haute Couture & Mode Urbaine", categorie: "MANNEQUINS", auteur: "Sarah Lemaire", likes: 310, image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=600&q=80" },
  { id: 5, titre: "Aurore Boréale — Norvège", categorie: "NATURE", auteur: "Marc V.", likes: 420, image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=600&q=80" },
  { id: 6, titre: "Architecture Gothique Paris", categorie: "ARCHITECTURE", auteur: "Agence One", likes: 178, image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80" },
  { id: 7, titre: "Forêt Brumeuse d'Automne", categorie: "NATURE", auteur: "Lucas P.", likes: 95, image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80" },
  { id: 8, titre: "Design Épuré Béton", categorie: "ARCHITECTURE", auteur: "Claire B.", likes: 132, image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80" },
  { id: 9, titre: "Regard Profond Studio", categorie: "PORTRAIT", auteur: "Alexandre T.", likes: 264, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80" },
  { id: 10, titre: "Fashion Week Backstage", categorie: "MANNEQUINS", auteur: "Agence One", likes: 512, image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80" }
];

export default function Gallery({ onRequireLogin }) {
  const { isLoggedIn, user } = useAuth();
  const cart = useSelectionCart();

  const [filtreCategorie, setFiltreCategorie] = useState("TOUS");
  const [panierOuvert, setPanierOuvert] = useState(false);
  const [likedIds, setLikedIds] = useState(() => new Set());
  const [likesCountMap, setLikesCountMap] = useState(() => {
    const map = {};
    REALISATIONS_INITIALES.forEach((item) => {
      map[item.id] = item.likes;
    });
    return map;
  });

  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const canUpload = isLoggedIn && (user?.subscription_status === 'pro' || user?.subscription_status === 'elite');

  const categories = ["TOUS", "COMMERCIAL", "PORTRAIT", "EVENEMENT", "MANNEQUINS", "NATURE", "ARCHITECTURE"];

  const elementsFiltres = filtreCategorie === "TOUS" 
    ? REALISATIONS_INITIALES 
    : REALISATIONS_INITIALES.filter((r) => r.categorie === filtreCategorie);

  function toggleLike(id) {
    setLikedIds((prev) => {
      const next = new Set(prev);
      const isAlreadyLiked = next.has(id);
      
      if (isAlreadyLiked) {
        next.delete(id);
        setLikesCountMap(m => ({ ...m, [id]: (m[id] || 0) - 1 }));
      } else {
        next.add(id);
        setLikesCountMap(m => ({ ...m, [id]: (m[id] || 0) + 1 }));
      }
      return next;
    });
  }

  function ajouterALaSelection(item) {
    cart.add({ id: item.id, titre: item.titre, image_url: item.image });
    setPanierOuvert(true);
  }

  function handleValiderSelection() {
    if (cart.items.length === 0) return;
    setPanierOuvert(false);
    setShowDownloadModal(true);
  }

  const handleDownloadAll = () => {
    cart.items.forEach((item, index) => {
      setTimeout(() => {
        const link = document.createElement("a");
        link.href = item.image_url;
        link.download = `${item.titre.replace(/\s+/g, "_")}.jpg`;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 300);
    });
  };

  const handleUploadClick = () => {
    if (!canUpload) {
      alert("🔒 L'importation de fichiers et la création de portfolios sont réservées aux abonnés Pro et Élite. Rendez-vous dans l'onglet des offres pour mettre à niveau votre compte !");
      return;
    }
    alert("📤 Ouverture de votre gestionnaire de médias Boké One...");
  };

  return (
    <div className="space-y-6 relative max-w-[1700px] mx-auto px-4 py-4">
      
      {/* Panel de gestion d'upload conditionnelle */}
      <div className="bg-[#0e1424] border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <h4 className="text-sm font-bold text-white">Gestion de votre catalogue média</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Niveau de formule actuel : <span className="text-amber-400 font-black uppercase tracking-wider">{user?.subscription_status || 'Visiteur'}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={handleUploadClick}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-md ${
            canUpload
              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 cursor-pointer'
              : 'bg-slate-900 text-slate-500 border border-slate-800 cursor-pointer'
          }`}
        >
          {canUpload ? <>📤 Importer une œuvre</> : <>🔒 Importer (Pro / Élite)</>}
        </button>
      </div>

      {/* En-tête de la Galerie */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-2">
        <div>
          <h2 className="text-xl font-black text-white">Portfolios &amp; Réalisations</h2>
          <p className="text-xs text-slate-400 mt-0.5">Explorez les réalisations et pré-sélectionnez vos coups de cœur pour votre projet.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-1.5 bg-[#0e1424] p-1.5 rounded-xl border border-slate-800">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFiltreCategorie(cat)}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  filtreCategorie === cat ? "bg-amber-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setPanierOuvert((v) => !v)}
            className="relative px-3.5 py-2 bg-[#0e1424] hover:bg-slate-800 border border-slate-700 text-amber-400 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-lg"
          >
            <span>🛒 Ma sélection</span>
            {cart.count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white font-black px-1.5 py-0.5 rounded-full text-[10px] shadow-md">{cart.count}</span>
            )}
          </button>
        </div>
      </div>

      {/* GRILLE COMPACTE : 5 PHOTOS PAR LIGNE SUR GRAND ÉCRAN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5">
        {elementsFiltres.map((item) => {
          const liked = likedIds.has(item.id);
          const currentLikes = likesCountMap[item.id] || 0;
          const inCart = cart.items.some((p) => p.id === item.id);

          return (
            <div key={item.id} className="bg-[#0e1424] border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col group hover:border-slate-700 transition">
              
              {/* Image hauteur réduite (h-36) */}
              <div className="relative h-36 overflow-hidden bg-slate-950">
                <img src={item.image} alt={item.titre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" draggable={false} />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                  <span className="text-white font-black text-xs tracking-widest uppercase -rotate-25 border border-white px-2 py-0.5">BOKÉ ONE</span>
                </div>
                <span className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-md text-[9px] font-black text-amber-400 px-2 py-0.5 rounded border border-slate-700 uppercase">{item.categorie}</span>
                
                {/* Bouton Like avec Nombre Visible */}
                <button
                  type="button"
                  onClick={() => toggleLike(item.id)}
                  className={`absolute bottom-2 right-2 backdrop-blur-md text-[10px] font-bold px-2 py-0.5 rounded-md border transition-all cursor-pointer flex items-center gap-1 ${
                    liked ? "bg-rose-500/20 text-rose-400 border-rose-500/40" : "bg-slate-950/80 text-slate-200 border-slate-700 hover:bg-slate-900"
                  }`}
                >
                  <span>{liked ? "❤️" : "🤍"}</span>
                  <span className="font-mono text-[10px]">{currentLikes}</span>
                </button>
              </div>

              {/* Contenu compact */}
              <div className="p-3 space-y-2.5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white truncate">{item.titre}</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5 truncate">Par {item.auteur}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">Gratuit</span>
                  <button
                    type="button"
                    disabled={inCart}
                    onClick={() => ajouterALaSelection(item)}
                    className={`px-3 py-1 text-[10px] font-black rounded-lg transition-colors shadow-md ${
                      inCart ? "bg-slate-800 text-slate-500 cursor-default" : "bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer"
                    }`}
                  >
                    {inCart ? "✓ Ajouté" : "Présélectionner"}
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Drawer Panier Latéral */}
      {panierOuvert && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#0e1424] border-l border-slate-800 shadow-2xl p-6 flex flex-col justify-between">
          <div className="space-y-6 flex-1 flex flex-col min-h-0">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4 shrink-0">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <span>🛒</span> Ma sélection ({cart.count})
              </h3>
              <button 
                type="button" 
                onClick={() => setPanierOuvert(false)} 
                className="text-slate-400 hover:text-white text-base font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {cart.items.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <p className="text-2xl">📭</p>
                <p className="text-xs text-slate-400">Votre sélection est vide.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 flex-1">
                {cart.items.map((p) => (
                  <div key={p.id} className="bg-[#070b12] border border-slate-800 p-2.5 rounded-xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {p.image_url && (
                        <img src={p.image_url} alt={p.titre} className="w-9 h-9 object-cover rounded-lg shrink-0" />
                      )}
                      <span className="text-xs text-white truncate">{p.titre}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => cart.remove?.(p.id)}
                      className="text-slate-500 hover:text-rose-400 text-xs font-bold px-2 py-1 cursor-pointer transition-colors"
                    >
                      Retirer
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.items.length > 0 && (
            <div className="border-t border-slate-800 pt-4 space-y-3 shrink-0">
              <button
                type="button"
                onClick={handleValiderSelection}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-xl text-xs uppercase tracking-wider transition shadow-lg cursor-pointer"
              >
                ✓ VALIDER MA SÉLECTION
              </button>
            </div>
          )}
        </div>
      )}

      {/* POP-UP MODAL DE TÉLÉCHARGEMENT DIRECT AU CLIC SUR VALIDER */}
      {showDownloadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-[#0e1424] border border-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-5 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowDownloadModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold text-sm cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg">
                📥
              </div>
              <div>
                <h3 className="text-base font-black text-white">Téléchargement de vos photos</h3>
                <p className="text-xs text-slate-400">{cart.items.length} fichier(s) prêt(s) pour votre projet</p>
              </div>
            </div>

            <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
              {cart.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-[#070b12] p-2.5 rounded-xl border border-slate-800 text-xs">
                  <div className="flex items-center gap-3 truncate">
                    <img src={item.image_url} alt="" className="w-8 h-8 object-cover rounded-lg shrink-0" />
                    <span className="text-white font-medium truncate">{item.titre}</span>
                  </div>
                  <a
                    href={item.image_url}
                    download={`${item.titre}.jpg`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-[11px] rounded-lg transition"
                  >
                    Télécharger
                  </a>
                </div>
              ))}
            </div>

            <div className="pt-2 space-y-3">
              <button
                type="button"
                onClick={handleDownloadAll}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-xl text-xs uppercase tracking-wider transition shadow-lg cursor-pointer"
              >
                Tout télécharger en un clic
              </button>
              <button
                type="button"
                onClick={() => setShowDownloadModal(false)}
                className="w-full text-xs text-slate-500 hover:text-slate-300 font-semibold cursor-pointer text-center block"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}