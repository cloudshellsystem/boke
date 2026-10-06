import React from 'react';

export default function GrilleTarifs() {
  const packs = [
    { nom: "L'Essentiel", tag: "Ponctuel", desc: "Demi-journée tournage, montage dynamique, 1 format final." },
    { nom: "Le Mensuel", tag: "Populaire", desc: "1/2 journée tournage / mois, 4 vidéos courtes montées (cut + sous-titres)." },
    { nom: "Le Pro", tag: "YouTube", desc: "1 jour tournage / mois, 8 vidéos (capsules + 1 format long), plan de contenu." },
    { nom: "La Production", tag: "Sur-Mesure", desc: "Pré-production, équipe renforcée (2e cadreur, drone), étalonnage cinéma." }
  ];

  return (
    <div className="p-6 bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 font-sans">
      <h2 className="text-xl font-black text-center mb-6">📦 Nos 4 Offres Packagées à la Valeur</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        {packs.map((p, i) => (
          <div key={i} className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="bg-slate-800 px-2 py-0.5 rounded text-amber-400 font-bold text-[9px] uppercase">{p.tag}</span>
              <h3 className="text-base font-bold text-white mt-2">{p.nom}</h3>
              <p className="text-slate-400 mt-2 leading-relaxed">{p.desc}</p>
            </div>
            <button className="w-full bg-amber-500 text-slate-950 font-black py-2 rounded-lg mt-4 text-[11px]">Choisir pour la propale</button>
          </div>
        ))}
      </div>
    </div>
  );
}