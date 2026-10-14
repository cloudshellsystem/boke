// src/components/Gallery.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Gallery() {
  const { isLoggedIn, user } = useAuth();
  const { cart, addToCart, removeFromCart } = useCart();

  const [filtreCategorie, setFiltreCategorie] = useState("TOUS");
  const [panierOuvert, setPanierOuvert] = useState(false);
  const [likedIds, setLikedIds] = useState(() => new Set());
  
  const [photos, setPhotos] = useState([
    { id: 1, titre: "Publicité Luxe & Or", categorie: "COMMERCIAL", auteur: "Agence One", likes: 142, prix: 1.00, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80" },
    { id: 2, titre: "Portrait Naturel HD", categorie: "PORTRAIT", auteur: "Studio Boke", likes: 89, prix: 0, image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80" },
    { id: 3, titre: "Aftermovie Festival Électro", categorie: "EVENEMENT", auteur: "Sarah Lemaire", likes: 215, prix: 1.00, image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80" },
    { id: 4, titre: "Haute Couture & Mode Urbaine", categorie: "MANNEQUINS", auteur: "Sarah Lemaire", likes: 318, prix: 0, image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=600&q=80" },
    { id: 5, titre: "Aurore Boréale — Norvège", categorie: "NATURE", auteur: "Marc V.", likes: 420, prix: 0, image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=600&q=80" },
    { id: 6, titre: "Architecture Gothique Paris", categorie: "ARCHITECTURE", auteur: "Agence One", likes: 178, prix: 1.00, image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80" },
    { id: 7, titre: "Forêt Brumeuse d'Automne", categorie: "NATURE", auteur: "Lucas P.", likes: 95, prix: 0, image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80" },
    { id: 8, titre: "Design Épuré Béton", categorie: "ARCHITECTURE", auteur: "Claire B.", likes: 132, prix: 0, image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80" },
  ]);

  const canUpload = isLoggedIn && (user?.subscription_status === 'pro' || user?.subscription_status === 'elite');
  const categories = ["TOUS", "COMMERCIAL", "PORTRAIT", "EVENEMENT", "MANNEQUINS", "NATURE", "ARCHITECTURE"];

  const elementsFiltres = filtreCategorie === "TOUS" 
    ? photos 
    : photos.filter((r) => r.categorie === filtreCategorie);

  function toggleLike(id) {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

    setPhotos(photos.map(p => {
      if (p.id === id) {
        const isLiked = likedIds.has(id);
        return { ...p, likes: isLiked ? p.likes - 1 : p.likes + 1 };
      }
      return p;
    }));
  }

  function gererAjoutPanier(item) {
    addToCart({ 
      id: item.id, 
      title: item.titre, 
      image_url: item.image, 
      price: item.prix,
      starting_price: item.prix 
    });
    setPanierOuvert(true);
  }

  return (
    <div className="space-y-6 relative max-w-[1700px] mx-auto px-4 py-4">
      
      {/* Panel d'upload */}
      <div className="bg-[#0e1424] border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <h4 className="text-sm font-bold text-white">Gestion de votre catalogue média &amp; Tarifs</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Niveau actuel : <span className="text-amber-400 font-black uppercase tracking-wider">{user?.subscription_status || 'Visiteur'}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => alert(canUpload ? "Ouverture gestionnaire" : "Réservé aux abonnés Pro/Élite")}
          className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition shadow-md ${
            canUpload ? 'bg-emerald-500 text-slate-950 cursor-pointer' : 'bg-slate-900 text-slate-500 border border-slate-800 cursor-pointer'
          }`}
        >
          {canUpload ? "📤 Importer une œuvre" : "🔒 Importer (Pro / Élite)"}
        </button>
      </div>

      {/* En-tête de filtre */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-2">
        <div>
          <h2 className="text-xl font-black text-white">Banque d'Images &amp; Tarifs</h2>
          <p className="text-xs text-slate-400 mt-0.5">Testez le paiement à 1 € ou téléchargez directement les images gratuites.</p>
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
            className="relative px-3.5 py-2 bg-[#0e1424] hover:bg-slate-800 border border-slate-700 text-amber-400 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <span>🛒 Panier</span>
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white font-black px-1.5 py-0.5 rounded-full text-[10px] shadow-md">{cart.length}</span>
            )}
          </button>
        </div>
      </div>

      {/* GRILLE 5 PHOTOS PAR LIGNE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5">
        {elementsFiltres.map((item) => {
          const liked = likedIds.has(item.id);
          const inCart = cart.some((p) => p.id === item.id);

          return (
            <div key={item.id} className="bg-[#0e1424] border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col group hover:border-slate-700 transition">
              
              <div className="relative h-36 overflow-hidden bg-slate-950">
                <img src={item.image} alt={item.titre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" draggable={false} />
                <span className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-md text-[9px] font-black text-amber-400 px-2 py-0.5 rounded border border-slate-700 uppercase">{item.categorie}</span>
                
                <button
                  type="button"
                  onClick={() => toggleLike(item.id)}
                  className={`absolute bottom-2 right-2 backdrop-blur-md text-[10px] font-bold px-2 py-0.5 rounded-md border transition-all cursor-pointer flex items-center gap-1 ${
                    liked ? "bg-rose-500/20 text-rose-400 border-rose-500/40" : "bg-slate-950/80 text-slate-200 border-slate-700 hover:bg-slate-900"
                  }`}
                >
                  <span>{liked ? "❤️" : "🤍"}</span>
                  <span className="font-mono text-[10px]">{item.likes}</span>
                </button>
              </div>

              <div className="p-3 space-y-2.5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white truncate">{item.titre}</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5 truncate">Par {item.auteur}</p>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <span className={`text-xs font-black ${item.prix === 0 ? "text-emerald-400" : "text-amber-400 font-mono text-sm"}`}>
                    {item.prix === 0 ? "GRATUIT" : `${item.prix.toFixed(2)} €`}
                  </span>
                  <button
                    type="button"
                    disabled={inCart}
                    onClick={() => gererAjoutPanier(item)}
                    className={`px-3 py-1 text-[10px] font-black rounded-lg transition shadow-md ${
                      inCart ? "bg-slate-800 text-slate-500 cursor-default" : "bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer"
                    }`}
                  >
                    {inCart ? "✓ Ajouté" : (item.prix === 0 ? "Télécharger" : "Acheter")}
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Drawer Panier (Z-Index élevé pour passer au-dessus du widget WhatsApp) */}
      {panierOuvert && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#0e1424] border-l border-slate-800 shadow-2xl p-6 flex flex-col justify-between">
          <div className="space-y-6 flex-1 flex flex-col min-h-0">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4 shrink-0">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <span>🛒</span> Panier &amp; Sélection
              </h3>
              <button type="button" onClick={() => setPanierOuvert(false)} className="text-slate-400 hover:text-white text-base font-bold p-1 cursor-pointer">✕</button>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <p className="text-2xl">📭</p>
                <p className="text-xs text-slate-400">Votre panier est vide.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 flex-1">
                {cart.map((p) => (
                  <div key={p.id} className="bg-[#070b12] border border-slate-800 p-2.5 rounded-xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {p.image_url && <img src={p.image_url} alt="" className="w-9 h-9 object-cover rounded-lg shrink-0" />}
                      <div className="truncate">
                        <span className="text-xs text-white truncate block">{p.title || p.titre}</span>
                        <span className="text-[10px] text-amber-400 font-bold">{(p.price || p.starting_price || 0) === 0 ? "Gratuit" : `${p.price || p.starting_price} €`}</span>
                      </div>
                    </div>
                    <button type="button" onClick={() => removeFromCart(p.id)} className="text-slate-500 hover:text-rose-400 text-xs font-bold px-2 py-1 cursor-pointer">Retirer</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t border-slate-800 pt-4 space-y-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setPanierOuvert(false);
                  window.location.href = "/cart";
                }}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-xl text-xs uppercase tracking-wider transition shadow-lg cursor-pointer"
              >
                ✓ Valider mon panier &amp; Payer
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}