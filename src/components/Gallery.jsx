// src/components/Gallery.jsx
import React, { useState } from "react";
import { useAuth } from "../lib/AuthContext";
import { useSelectionCart } from "../hooks/useSelectionCart";

// ⚠️ Démo : ces réalisations sont codées en dur, pas encore issues d'une table Supabase.
const REALISATIONS = [
  { id: 1, titre: "Publicité Luxe & Or", categorie: "COMMERCIAL", auteur: "Agence One", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80" },
  { id: 2, titre: "Portrait Naturel", categorie: "PORTRAIT", auteur: "Studio Boke", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80" },
  { id: 3, titre: "Aftermovie Festival Électro", categorie: "EVENEMENT", auteur: "Sarah Lemaire", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80" },
];

export default function Gallery({ onRequireLogin }) {
  const { isLoggedIn, user } = useAuth();
  const cart = useSelectionCart();

  const [filtreCategorie, setFiltreCategorie] = useState("TOUS");
  const [panierOuvert, setPanierOuvert] = useState(false);
  const [likedIds, setLikedIds] = useState(() => new Set()); 
  const [syncState, setSyncState] = useState("idle"); 

  // Vérification des droits d'upload selon les formules MVP
  const canUpload = isLoggedIn && (user?.subscription_status === 'pro' || user?.subscription_status === 'elite');

  const elementsFiltres = filtreCategorie === "TOUS" ? REALISATIONS : REALISATIONS.filter((r) => r.categorie === filtreCategorie);

  function toggleLike(id) {
    setLikedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function ajouterALaSelection(item) {
    cart.add({ id: item.id, titre: item.titre, image_url: item.image });
    setPanierOuvert(true);
  }

  async function validerLaSelection() {
    if (!isLoggedIn) {
      onRequireLogin?.();
      return;
    }
    setSyncState("saving");
    const { ok } = await cart.syncToAccount(user?.id);
    setSyncState(ok ? "done" : "error");
  }

  const handleUploadClick = () => {
    if (!canUpload) {
      alert("🔒 L'importation de fichiers et la création de portfolios sont réservées aux abonnés Pro et Élite. Rendez-vous dans l'onglet des offres pour mettre à niveau votre compte !");
      return;
    }
    alert("📤 Ouverture de votre gestionnaire de médias Boké One...");
  };

  return (
    <div className="space-y-6 relative">
      
      {/* Panel de gestion d'upload conditionnelle pour le salon */}
      <div className="bg-[#0e1424] border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <h4 className="text-sm font-bold text-white">Gestion de votre catalogue média</h4>
          <p className="text-xs text-slate-400 mt-1">
            Niveau de formule actuel : <span className="text-amber-400 font-black uppercase tracking-wider">{user?.subscription_status || 'Visiteur'}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={handleUploadClick}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-md ${
            canUpload
              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 cursor-pointer'
              : 'bg-slate-900 text-slate-500 border border-slate-800 cursor-pointer'
          }`}
        >
          {canUpload ? (
            <>📤 Importer une œuvre</>
          ) : (
            <>🔒 Importer (Pro / Élite)</>
          )}
        </button>
      </div>

      {/* En-tête de la Galerie */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4">
        <div>
          <h2 className="text-xl font-black text-white">🖼️ Portfolios &amp; Réalisations</h2>
          <p className="text-xs text-slate-400 mt-1">Explorez les réalisations et pré-sélectionnez vos coups de cœur pour votre projet.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-wrap gap-2 bg-[#0e1424] p-1.5 rounded-xl border border-slate-800">
            {["TOUS", "COMMERCIAL", "PORTRAIT", "EVENEMENT"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFiltreCategorie(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
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
            className="relative px-4 py-2.5 bg-[#0e1424] hover:bg-slate-800 border border-slate-700 text-amber-400 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-lg"
          >
            <span>🛒 Ma sélection</span>
            {cart.count > 0 && (
              <span className="absolute -top-2 -right-2 bg-rose-600 text-white font-black px-2 py-0.5 rounded-full text-[10px] shadow-md">{cart.count}</span>
            )}
          </button>
        </div>
      </div>

      {/* Grille des réalisations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {elementsFiltres.map((item) => {
          const liked = likedIds.has(item.id);
          const inCart = cart.items.some((p) => p.id === item.id);
          return (
            <div key={item.id} className="bg-[#0e1424] border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col group">
              <div className="relative h-48 overflow-hidden bg-slate-950">
                <img src={item.image} alt={item.titre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" draggable={false} />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                  <span className="text-white font-black text-lg tracking-widest uppercase -rotate-25 border-2 border-white px-3 py-1">BOKÉ ONE</span>
                </div>
                <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-[10px] font-black text-amber-400 px-2.5 py-1 rounded-md border border-slate-700">{item.categorie}</span>
                <button
                  type="button"
                  onClick={() => toggleLike(item.id)}
                  className={`absolute bottom-3 right-3 backdrop-blur-md text-[10px] font-bold px-2.5 py-1 rounded-md border transition-all cursor-pointer flex items-center gap-1 ${
                    liked ? "bg-rose-500/20 text-rose-400 border-rose-500/40" : "bg-slate-950/80 text-slate-200 border-slate-700 hover:bg-slate-900"
                  }`}
                >
                  <span>{liked ? "❤️" : "🤍"}</span>
                </button>
              </div>

              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">{item.titre}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Par {item.auteur}</p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                  <span className="text-[11px] text-slate-500 italic">Devis sur mesure</span>
                  <button
                    type="button"
                    disabled={inCart}
                    onClick={() => ajouterALaSelection(item)}
                    className={`px-4 py-2 text-xs font-black rounded-xl transition-colors shadow-md ${
                      inCart ? "bg-slate-800 text-slate-500 cursor-default" : "bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer"
                    }`}
                  >
                    {inCart ? "✓ Présélectionné" : "Présélectionner"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rendu du Panier Latéral */}
      {panierOuvert && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#0e1424] border-l border-slate-800 shadow-2xl p-6 flex flex-col justify-between">
          <div className="space-y-6 flex-1 flex flex-col min-h-0">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4 shrink-0">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <span>🛒</span> Ma sélection
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
                  <div key={p.id} className="bg-[#070b12] border border-slate-800 p-3 rounded-xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {p.image_url && (
                        <img src={p.image_url} alt={p.titre} className="w-10 h-10 object-cover rounded-lg shrink-0" />
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
                onClick={validerLaSelection}
                disabled={syncState === "saving"}
                className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black py-3 rounded-xl text-xs uppercase tracking-wider transition shadow-lg cursor-pointer"
              >
                {syncState === "saving" ? "Synchronisation..." : "✓ Valider ma sélection"}
              </button>
              
              {syncState === "done" && <p className="text-[11px] text-emerald-400 text-center font-bold">Sélection synchronisée avec succès !</p>}
              {syncState === "error" && <p className="text-[11px] text-rose-400 text-center font-bold">Erreur lors de la synchronisation.</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
