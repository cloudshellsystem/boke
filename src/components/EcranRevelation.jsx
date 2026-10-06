import React, { useState } from 'react';

export default function EcranRevelation() {
  const [step, setStep] = useState(1);
  return (
    <div className="p-6 bg-slate-950 text-slate-100 border border-slate-800 rounded-2xl font-sans max-w-lg mx-auto">
      <h3 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-2">Étape 06 · La Proposition Finale</h3>
      {step === 1 ? (
        <div className="space-y-4 text-xs">
          <h4 className="text-lg font-black text-white">1. La Révélation (Récapitulatif)</h4>
          <p className="text-slate-300">"Les concurrents captent les clients premium en ligne, manque de temps pour filmer, stress..."</p>
          <button onClick={() => setStep(2)} className="w-full bg-amber-500 text-slate-950 font-black py-2 rounded-xl">Découvrir la solution Unique →</button>
        </div>
      ) : (
        <div className="space-y-4 text-xs">
          <h4 className="text-lg font-black text-white">2. L'Offre Forfaitaire Globale</h4>
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center space-y-1">
            <span className="text-slate-400 text-[10px] uppercase">Investissement Total Unique</span>
            <span className="text-3xl font-black text-emerald-400 block">6 900 € HT</span>
            <span className="text-slate-500 text-[10px]">Aucun détail technique à négocier. Solution clé en main.</span>
          </div>
          <button onClick={() => setStep(1)} className="text-[10px] text-slate-500 underline block mx-auto">← Revoir le récapitulatif</button>
        </div>
      )}
    </div>
  );
}