import React from 'react';

export default function VuePropaleClient() {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white text-stone-900 rounded-xl font-sans shadow-md border border-stone-100">
      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">Proposition Commerciale</span>
      <h1 className="text-2xl font-black mt-1 leading-tight text-stone-950">Le bonheur est là. Il ne manque que le film.</h1>
      <div className="text-xs text-stone-600 space-y-3 mt-4 leading-relaxed font-light">
        <p><strong>1 € investi en TV rend 5,7 € à court terme et 8,5 € à 24 mois</strong> (CSA Data Consulting). L'offre recommandée pèse moins de 7 % de ce budget. Un mauvais film divise ce retour par deux, un excellent le double.</p>
        <p className="font-mono bg-stone-50 p-3 rounded-lg border border-stone-100 italic">"4h30, un fournil : la buée sur la vitre, les mains dans la pâte... Pas une publicité pour du pain : le film de ce que vous faites depuis cent ans."</p>
      </div>
      <div className="mt-6 pt-4 border-t border-stone-200 flex justify-between items-center text-xs">
        <div>
          <span className="text-stone-400 block text-[10px]">Stratégie recommandée</span>
          <span className="font-bold">Le film + deux fenêtres de diffusion</span>
        </div>
        <div className="text-right">
          <span className="text-stone-400 block text-[10px]">Total HT</span>
          <span className="text-lg font-black text-emerald-600">102 000 € HT</span>
        </div>
      </div>
    </div>
  );
}