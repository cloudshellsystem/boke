import React, { useState } from 'react';

export default function SuviCoachIA() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const lancerScan = () => {
    setLoading(true);
    setTimeout(() => {
      setData({
        accroches: ["Trois recrutements ouverts sur Indeed", "Showroom inauguré récemment"],
        conseil: "Utilise l'accroche obligatoire : 'J'ai vu que...'"
      });
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl font-sans text-slate-100">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">🐱 Suvi Coach IA</h4>
        <button onClick={lancerScan} className="bg-amber-500 text-slate-950 text-xs font-black px-3 py-1.5 rounded-lg">⚡ Scanner l'actu</button>
      </div>
      {loading && <p className="text-xs text-slate-500 animate-pulse font-mono">Suvi travaille...</p>}
      {data && (
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2 text-xs font-mono text-slate-300">
          {data.accroches.map((a, i) => <p key={i}>• {a}</p>)}
          <p className="text-amber-400 font-bold mt-2">{data.conseil}</p>
        </div>
      )}
    </div>
  );
}