// src/components/Gallery.jsx
import React, { useState } from "react";

export default function Gallery({ userProfile }) {
  const [filtreCategorie, setFiltreCategorie] = useState("TOUS");
  const [panier, setPanier] = useState([]);
  const [panierOuvert, setPanierOuvert] = useState(false);

  // État local pour gérer les likes dynamiques de chaque réalisation
  const [realisations, setRealisations] = useState([
    {
      id: 1,
      titre: "Publicité Luxe & Or",
      categorie: "COMMERCIAL",
      auteur: "Agence One",
      prix: 350,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
      likes: 18,
      liked: false
    },
    {
      id: 2,
      titre: "Portrait Naturel",
      categorie: "PORTRAIT",
      auteur: "Studio Boke",
      prix: 150,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      likes: 24,
      liked: false
    },
    {
      id: 3,
      titre: "Aftermovie Festival Électro",
      categorie: "EVENEMENT",
      auteur: "Sarah Lemaire",
      prix: 180,
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80",
      likes: 42,
      liked: false
    }
  ]);

  const elementsFiltres = filtreCategorie === "TOUS" 
    ? realisations 
    : realisations.filter(r => r.categorie === filtreCategorie);

  // Gestion du Like interactif
  const toggleLike = (id) => {
    setRealisations(realisations.map(item => {
      if (item.id === id) {
        const newLiked = !item.liked;
        return {
          ...item,
          liked: newLiked,
          likes: newLiked ? item.likes + 1 : item.likes - 1
        };
      }
      return item;
    }));
  };

  // Ajout au panier sécurisé (Nécessite d'être connecté)
  const ajouterAuPanier = (item) => {
    if (!userProfile) {
      alert("🔒 Accès restreint : Vous devez être connecté à l'Espace Pro pour réserver une réalisation.");
      return;
    }
    if (!panier.some(p => p.id === item.id)) {
      setPanier([...panier, item]);
    }
    setPanierOuvert(true);
  };

  const retirerDuPanier = (id) => {
    setPanier(panier.filter(p => p.id !== id));
  };

  const totalPanier = panier.reduce((acc, item) => acc + item.prix, 0);

  return (
    <div className="space-y-6 font-sans relative">
      {/* En-tête et Titre */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-white">🖼️ Portfolios & Réalisations</h2>
          <p className="text-xs text-slate-400 mt-1">Explorez et réservez les prestations des créateurs de l'écosystème.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filtres */}
          <div className="flex flex-wrap gap-2 bg-[#0e1424] p-1.5 rounded-xl border border-slate-800">
            {["TOUS", "COMMERCIAL", "PORTRAIT", "EVENEMENT"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFiltreCategorie(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filtreCategorie === cat 
                    ? "bg-amber-500 text-slate-950 shadow-md" 
                    : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Bouton Panier avec compteur rouge vif */}
          <button 
            onClick={() => setPanierOuvert(!panierOuvert)}
            className="relative px-4 py-2.5 bg-[#0e1424] hover:bg-slate-800 border border-slate-700 text-amber-400 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-lg"
          >
            <span>🛒 Panier</span>
            {panier.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-rose-600 text-white font-black px-2 py-0.5 rounded-full text-[10px] shadow-md animate-pulse">
                {panier.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Grille des réalisations avec filigrane et masquage des prix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {elementsFiltres.map((item) => (
          <div key={item.id} className="bg-[#0e1424] border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between group">
            <div className="relative h-48 overflow-hidden bg-slate-950">
              <img 
                src={item.image} 
                alt={item.titre} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              {/* FILIGRANE DE PROTECTION (WATERMARK) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <span className="text-white font-black text-lg tracking-widest uppercase rotate-[-25deg] border-2 border-white px-3 py-1">
                  BOKÉ ONE — PRO
                </span>
              </div>

              <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-[10px] font-black text-amber-400 px-2.5 py-1 rounded-md border border-slate-700">
                {item.categorie}
              </span>

              {/* BOUTON LIKE CLIQUABLE */}
              <button 
                onClick={() => toggleLike(item.id)}
                className={`absolute bottom-3 right-3 backdrop-blur-md text-[10px] font-bold px-2.5 py-1 rounded-md border transition-all cursor-pointer flex items-center gap-1 ${
                  item.liked 
                    ? "bg-rose-500/20 text-rose-400 border-rose-500/40" 
                    : "bg-slate-950/80 text-slate-200 border-slate-700 hover:bg-slate-900"
                }`}
              >
                <span>{item.liked ? "❤️" : "🤍"}</span>
                <span>{item.likes}</span>
              </button>
            </div>

            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">{item.titre}</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Par {item.auteur}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <span className="text-[11px] text-slate-500 italic">🔒 Tarif sur devis / réservation</span>
                <button 
                  onClick={() => ajouterAuPanier(item)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl cursor-pointer transition-colors shadow-md"
                >
                  Réserver
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* TIROIR / PANIER LATÉRAL */}
      {panierOuvert && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#0e1424] border-l border-slate-800 shadow-2xl p-6 flex flex-col justify-between animate-slide-left">
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <span>🛒</span> Votre Panier de Réservation
              </h3>
              <button 
                onClick={() => setPanierOuvert(false)}
                className="text-slate-400 hover:text-white text-base font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {panier.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <p className="text-2xl">📭</p>
                <p className="text-xs text-slate-400">Votre panier est actuellement vide.</p>
                <p className="text-[11px] text-slate-500">Cliquez sur « Réserver » sur un portfolio pour l'ajouter.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {panier.map((p) => (
                  <div key={p.id} className="bg-[#070b12] border border-slate-800 p-3 rounded-xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.titre} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <h4 className="text-xs font-bold text-white">{p.titre}</h4>
                        <span className="text-[10px] font-mono text-amber-400 font-bold">{p.prix} € HT</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => retirerDuPanier(p.id)}
                      className="text-slate-500 hover:text-rose-400 text-xs font-bold p-2 cursor-pointer"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {panier.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold">Total général :</span>
                <span className="font-mono text-sm font-black text-amber-400">{totalPanier} € HT</span>
              </div>
              <button 
                onClick={() => {
                  alert("Redirection vers la passerelle de règlement sécurisé.");
                  setPanier([]);
                  setPanierOuvert(false);
                }}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl cursor-pointer shadow-lg transition-colors"
              >
                Valider et Procéder au Règlement
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}