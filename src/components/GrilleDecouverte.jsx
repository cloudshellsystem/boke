import React from 'react';

export default function GrilleDecouverte() {
  return (
    <div className="p-6 bg-slate-950 text-slate-100 border border-slate-800 rounded-2xl font-sans">
      <h2 className="text-xl font-black mb-4">La grille SCORE & Frustrations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
        <div className="space-y-2 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
          <p className="text-amber-400 font-bold">S.C.O.R.E</p>
          <p className="text-slate-400">• Situation / Contexte / Objectif / Réalisation / Évolution</p>
        </div>
        <div className="space-y-2 bg-rose-950/10 p-4 rounded-xl border border-rose-900/30">
          <p className="text-rose-400 font-bold">FRUSTRATIONS À NOMMER</p>
          <p className="text-slate-400">• Temps / Argent / Effort / Résultat / Émotionnel</p>
        </div>
      </div>
    </div>
  );
}