import React from 'react';

export default function Afterworks() {
  return (
    <div className="p-6 bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 font-sans">
      <span className="text-[10px] font-black text-amber-500 tracking-widest uppercase block mb-1">✨ ÉVÉNEMENT</span>
      <h3 className="text-2xl font-black text-white mb-4">📸 SALON DE LA PHOTO</h3>
      <div className="space-y-3 text-xs text-slate-300">
        <p>📅 <strong>Quand :</strong> Vendredi 9 octobre à 11h00</p>
        <p>📍 <strong>Où :</strong> Grande Halle de la Villette, Paris</p>
        <p className="text-slate-400 mt-2">On se retrouve sur place pour échanger entre créateurs ! 🔥</p>
      </div>
    </div>
  );
}