// src/components/CreatifsPage.jsx
import React, { useState } from "react";

export default function CreatifsPage({ userProfile }) {
  const [filtreRole, setFiltreRole] = useState("TOUS");

  // Données fictives des créateurs de l'annuaire
  const creatifs = [
    {
      id: 1,
      nom: "Alexandre Gaultier",
      role: "PILOTE DRONE",
      bio: "Télépilote certifié S1/S3. Captation aérienne haute résolution.",
      email: "alex@drone-vision.fr",
      telephone: "06 45 88 22 11",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 2,
      nom: "Sarah Lemaire",
      role: "VIDÉASTE",
      bio: "Réalisatrice de clips publicitaires et de contenus brandés pour les réseaux.",
      email: "sarah@lemaire-prod.com",
      telephone: "07 82 33 19 44",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 3,
      nom: "Marc Vane",
      role: "PHOTOGRAPHE",
      bio: "Photographe de mode, portrait et lifestyle corporate.",
      email: "marc@bokeone.com",
      telephone: "06 12 34 56 78",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
    }
  ];

  const creatifsFiltres = filtreRole === "TOUS" 
    ? creatifs 
    : creatifs.filter(c => c.role.includes(filtreRole));

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-white">📖 Annuaire des Créateurs BOKE ONE</h2>
          <p className="text-xs text-slate-400 mt-1">Mettez en relation vos projets avec les meilleurs talents de l'écosystème.</p>
        </div>

        {/* Filtres par spécialité */}
        <div className="flex flex-wrap gap-2 bg-[#0e1424] p-1.5 rounded-xl border border-slate-800">
          {["TOUS", "PHOTOGRAPHE", "VIDÉASTE", "DRONE"].map((role) => (
            <button
              key={role}
              onClick={() => setFiltreRole(role)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filtreRole === role 
                  ? "bg-amber-500 text-slate-950 shadow-md" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800/40"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Grille des profils */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {creatifsFiltres.map((creatif) => (
          <div key={creatif.id} className="bg-[#0e1424] border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <img src={creatif.avatar} alt={creatif.nom} className="w-12 h-12 rounded-full object-cover border-2 border-amber-500/40" />
                <div>
                  <h3 className="text-sm font-bold text-white">{creatif.nom}</h3>
                  <span className="text-[10px] font-black bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">
                    {creatif.role}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-300 font-light leading-relaxed">{creatif.bio}</p>
            </div>

            {/* Bloc Contacts conditionné par la connexion */}
            <div className="bg-[#070b12] p-3 rounded-xl border border-slate-800/80 space-y-2 text-xs">
              {userProfile ? (
                <>
                  <div className="flex items-center gap-2 text-slate-300">
                    <span>✉️</span>
                    <span className="font-mono text-[11px] text-amber-300">{creatif.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <span>📞</span>
                    <span className="font-mono text-[11px] text-emerald-400 font-bold">{creatif.telephone}</span>
                  </div>
                </>
              ) : (
                <div className="text-center py-2 space-y-1">
                  <p className="text-[11px] text-amber-400/90 font-medium">🔒 Coordonnées masquées</p>
                  <p className="text-[10px] text-slate-500">Connectez-vous à l'Espace Pro pour révéler les contacts directs.</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}