import React, { useState } from 'react';

export default function PipelineKanban() {
  const [deals] = useState([
    { id: 1, entreprise: 'Toulouse Immo Conseil', valeur: 3000, relance: 47, etape: 'demarcher' },
    { id: 2, entreprise: 'Occitanie Événements', valeur: 2500, relance: 55, etape: 'demarcher' },
    { id: 3, entreprise: 'École Horizon', valeur: 3200, relance: 2, etape: 'proposition' },
    { id: 4, entreprise: 'Garage Bernat', valeur: 4000, relance: 39, etape: 'rdv' }
  ]);

  const colonnes = [
    { id: 'demarcher', titre: '🎯 À démarcher / Relancer', couleur: 'border-t-rose-500' },
    { id: 'rdv', titre: '📅 RDV Visio Calé', couleur: 'border-t-amber-500' },
    { id: 'proposition', titre: '💼 Propale Présentée', couleur: 'border-t-blue-500' },
    { id: 'gagne', titre: '💰 Gagné (Récurrent)', couleur: 'border-t-emerald-500' }
  ];

  return (
    <div className="p-6 bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 font-sans">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
        <div>
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Suvi Pilote — Relations</span>
          <h2 className="text-2xl font-black text-white mt-1">Votre Pipeline Commercial</h2>
        </div>
        <div className="bg-slate-900 px-4 py-2 rounded-lg border border-slate-800 text-xs">
          🔥 Valeur totale : <span className="font-bold text-emerald-400">{deals.reduce((acc, d) => acc + d.valeur, 0).toLocaleString()} €</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {colonnes.map(col => (
          <div key={col.id} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex flex-col min-h-[400px]">
            <div className={"border-t-4 " + col.couleur + " pt-2 mb-4"}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">{col.titre}</h3>
            </div>
            <div className="space-y-3 flex-1">
              {deals.filter(d => d.etape === col.id).map(deal => (
                <div key={deal.id} className="bg-slate-900 p-4 rounded-lg border border-slate-800 shadow-md">
                  <h4 className="text-sm font-bold text-white">{deal.entreprise}</h4>
                  <div className="flex justify-between items-center mt-3 text-xs">
                    <span className="font-extrabold text-emerald-400">{deal.valeur} €</span>
                    <span className="text-slate-500">{deal.relance}j</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}