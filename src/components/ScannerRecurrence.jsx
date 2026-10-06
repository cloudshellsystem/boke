import React, { useState } from 'react';

export default function ScannerRecurrence() {
  const [rmr] = useState(4500);
  const pct = Math.round((rmr / 12000) * 100);
  return (
    <div className="p-6 bg-slate-950 text-slate-100 border border-slate-800 rounded-2xl font-sans max-w-xl mx-auto text-center space-y-4">
      <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest">💰 Scanner de Récurrence · Objectif 12K</h3>
      <div>
        <span className="text-3xl font-black text-white">{rmr.toLocaleString()} € / mois</span>
        <span className="text-slate-500 text-[10px] block mt-1">Revenu Mensuel Récurrent Actuel</span>
      </div>
      <div className="w-full bg-slate-900 h-3 rounded-full border border-slate-800 overflow-hidden p-0.5">
        <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
      </div>
      <span className="text-xs font-bold text-slate-400">Progression : {pct}% de l'objectif</span>
    </div>
  );
}