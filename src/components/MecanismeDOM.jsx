import React, { useState } from 'react';

export default function MecanismeDOM() {
  const [affranchir, setAffranchir] = useState(false);

  return (
    <div className="p-6 bg-slate-950 text-slate-100 border border-slate-800 rounded-2xl font-sans max-w-xl mx-auto">
      <h3 className="text-lg font-black text-white border-b border-slate-800 pb-2 mb-4">🎯 Le Diagnostic de l'Opportunité Manquée</h3>
      {!affranchir ? (
        <button onClick={() => setAffranchir(true)} className="w-full bg-slate-800 text-white font-bold py-2 rounded-xl text-xs">📊 Calculer l'Impact Financier en Closing</button>
      ) : (
        <div className="space-y-4 text-xs font-mono text-slate-300">
          <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl text-center">
            <span className="text-slate-400 block uppercase text-[10px]">Coût mensuel de l'inaction</span>
            <span className="text-3xl font-black text-rose-400 block mt-1">-4 500 € / mois</span>
          </div>
          <p className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl text-amber-400 text-[11px]">
            "Monsieur, j'ai vu que vos concurrents captent les demandes premium de la région pendant que votre savoir-faire reste invisible. Rester sans action vous coûte 4 500€ par mois."
          </p>
        </div>
      )}
    </div>
  );
}