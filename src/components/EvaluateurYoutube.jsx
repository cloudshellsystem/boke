import React, { useState } from 'react';

export default function EvaluateurYoutube() {
  const [titre, setTitre] = useState("Présentation de notre entreprise de BTP");
  const [score, setScore] = useState("");

  return (
    <div className="p-6 bg-slate-950 text-slate-100 border border-slate-800 rounded-2xl font-sans max-w-xl mx-auto">
      <h4 className="text-xs font-bold uppercase tracking-wider text-red-500 mb-3">🔴 Optimisateur Algorithmique YouTube</h4>
      <div className="space-y-3 text-xs">
        <input type="text" value={titre} onChange={(e) => setTitre(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono" />
        <button onClick={() => setScore("🏗️️ Comment vérifier la solidité d'un gros chantier avant de signer le devis ?")} className="w-full bg-red-600 text-white font-bold py-2 rounded-xl">⚡ Optimiser pour la Conversion</button>
        {score && <p className="p-3 bg-slate-900 rounded border border-slate-800 text-white font-bold font-mono">{score}</p>}
      </div>
    </div>
  );
}