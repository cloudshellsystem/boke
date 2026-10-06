import React from 'react';

export default function RegieTerrain() {
  return (
    <div className="p-6 bg-slate-950 text-slate-100 border border-slate-800 rounded-2xl font-sans max-w-xl mx-auto">
      <h3 className="text-xl font-black text-white mb-4">🎬 Régie Terrain & Conducteur</h3>
      <div className="space-y-4 text-xs">
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
          <h4 className="font-bold text-amber-400 mb-2">Checklist Matériel Critique :</h4>
          <p className="text-slate-300">• Boîtier Cinéma + Objectif 35mm • Batteries Drone Chargées • Cartes SD Vides</p>
        </div>
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
          <h4 className="font-bold text-emerald-400 mb-2">Feuille de Route :</h4>
          <p className="text-slate-300">4h30 - Arrivée au Fournil • 8h00 - Interview Directeur ESN / PME</p>
        </div>
      </div>
    </div>
  );
}