import React, { useState } from "react";

export default function DashboardCreatif() {
  // 📊 DONNÉES ANALYTIQUES DU CRÉATIF
  const [stats] = useState({
    vues: "14 250",
    likes: "3 840",
    telechargements: "142",
    totalGagne: "1 850,00"
  });

  // 📦 CATALOGUE DE TARIFS & PACKS DU CRÉATIF
  const [packs, setPacks] = useState([
    { id: 1, nom: "Pack Éditorial France", prix: 300, active: true, desc: "Shooting 4h + 10 clichés retouchés + Licence Éditoriale Nationale" },
    { id: 2, nom: "Prestige Monument & Drone", prix: 750, active: true, desc: "Cadrage 4K + Droits commerciaux complets pour offices de tourisme" }
  ]);

  // 📸 BANQUE D'IMAGES & ETAT DES LICENCES DE L'ARTISTE
  const [images, setImages] = useState([
    { id: "img1", titre: "Crépuscule sur Pierrefonds", categorie: "Architecture", statut: "Sous Licence", ventes: 12 },
    { id: "img2", titre: "Lumières d'Automne à Paris", categorie: "Urbain", statut: "Exclusif", ventes: 28 },
    { id: "img3", titre: "Reflets Gothiques", categorie: "Portrait", statut: "Libre", ventes: 5 }
  ]);

  // États pour la modification rapide des prix
  const handlePriceChange = (id, newPrice) => {
    setPacks(packs.map(p => p.id === id ? { ...p, prix: Number(newPrice) } : p));
  };

  return (
    <div className="w-full space-y-8 font-sans text-neutral-200">
      
      {/* 👑 VIGNETTE PRINCIPALE : LE TABLEAU DE BORD CENTRALISÉ */}
      <div className="relative overflow-hidden bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        
        {/* Effet lumineux de Bokeh en arrière-plan */}
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
        
        {/* En-tête de la Vignette */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-800 pb-6 relative z-10">
          <div>
            <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Espace Performance Élite
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              Tableau de Bord de votre Activité Visuelle
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Pilotez vos tarifs, suivez l'impact de vos galeries et gérez l'exploitation de vos œuvres.
            </p>
          </div>
          
          <div className="flex items-center gap-2 bg-neutral-950 p-1.5 rounded-xl border border-neutral-850">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse ml-2" />
            <span className="text-[11px] font-mono font-bold text-neutral-300 pr-2">Données synchronisées</span>
          </div>
        </div>

        {/* 📊 MINI-MATRICE DES PERFORMANCES ET LIKES */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 relative z-10">
          <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl space-y-1">
            <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">👁️ Vues de la Galerie</span>
            <div className="text-xl font-black text-white font-mono">{stats.vues}</div>
          </div>
          
          <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl space-y-1 shadow-[0_0_15px_rgba(239,68,68,0.05)] border-red-950/50">
            <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider flex items-center gap-1">❤️ Appréciations / Likes</span>
            <div className="text-xl font-black text-white font-mono">{stats.likes}</div>
          </div>
          
          <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl space-y-1">
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">📥 Cessions de Droits</span>
            <div className="text-xl font-black text-white font-mono">{stats.telechargements}</div>
          </div>
          
          <div className="bg-gradient-to-br from-neutral-950 to-amber-950/20 border border-amber-900/30 p-4 rounded-xl space-y-1">
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">💰 Chiffre d'Affaires</span>
            <div className="text-xl font-black text-emerald-400 font-mono">{stats.totalGagne} €</div>
          </div>
        </div>

        {/* 🧱 ZONE BIPARTITE : GESTION DES TARIFS & PHOTOTHÈQUE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 relative z-10">
          
          {/* SECTION COMPOSANTE A : PILOTAGE DES TARIFS & SERVICES */}
          <div className="bg-neutral-950 border border-neutral-850 p-5 rounded-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-900 pb-2">
              <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider">🏷️ Gestion des Prix & Offres</h3>
              <span className="text-[9px] text-neutral-500 font-mono">Mise à jour instantanée</span>
            </div>
            
            <div className="space-y-3">
              {packs.map(pack => (
                <div key={pack.id} className="bg-neutral-900/60 border border-neutral-800 p-3.5 rounded-xl flex justify-between items-center gap-4">
                  <div className="space-y-0.5 flex-1">
                    <h4 className="text-xs font-bold text-white">{pack.nom}</h4>
                    <p className="text-[10px] text-neutral-400 max-w-xs truncate">{pack.desc}</p>
                  </div>
                  
                  {/* Champ d'ajustement dynamique du prix */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <input 
                      type="number" 
                      value={pack.prix} 
                      onChange={(e) => handlePriceChange(pack.id, e.target.value)}
                      className="w-16 bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1 text-xs font-mono font-bold text-amber-400 text-center outline-none focus:border-amber-400"
                    />
                    <span className="text-xs text-neutral-500 font-bold">€</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION COMPOSANTE B : SUIVI DE LA PHOTOTHÈQUE ET DES IMAGES */}
          <div className="bg-neutral-950 border border-neutral-850 p-5 rounded-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-900 pb-2">
              <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider">📸 Vos Images Nationales & Licences</h3>
              <span className="text-[9px] text-neutral-500 font-mono">{images.length} Clichés</span>
            </div>

            <div className="space-y-2.5">
              {images.map(img => (
                <div key={img.id} className="bg-neutral-900/60 border border-neutral-800 p-2.5 rounded-xl flex items-center justify-between gap-4 text-[11px]">
                  <div className="flex items-center gap-3 truncate">
                    {/* Placeholder d'icône d'image pour le design */}
                    <div className="h-8 w-8 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-center font-bold text-neutral-600 shrink-0">📷</div>
                    <div className="truncate">
                      <div className="font-bold text-white truncate">{img.titre}</div>
                      <div className="text-[10px] text-neutral-500">{img.categorie}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                      img.statut === "Exclusif" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                      img.statut === "Sous Licence" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                      "bg-neutral-800 text-neutral-400 border-neutral-700"
                    }`}>
                      {img.statut}
                    </span>
                    <span className="font-mono text-neutral-400 font-bold">{img.ventes} cessions</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
