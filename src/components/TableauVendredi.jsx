import React from 'react';

export default function TableauVendredi() {
  const items = [
    { label: "Appels passés", val: 7 },
    { label: "RDV calés", val: 2 },
    { label: "Propales envoyées", val: 1 },
    { label: "Propales en attente", val: 3 },
    { label: "CA signé cette semaine", val: "2 400 €", highlight: true }
  ];

  return (
    <div className="p-6 bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 font-sans">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-3xl font-black text-white">Le tableau du vendredi.</h2>
        <p className="text-xs text-slate-400">Chaque chiffre vient de ce que tu notes dans ton CRM.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 bg-slate-900/60 p-5 border border-slate-800 rounded-xl">
        {items.map((item, idx) => (
          <div key={idx} className={"p-4 rounded-xl border border-slate-800 text-center bg-slate-950 " + (item.highlight ? 'bg-gradient-to-b from-slate-950 to-amber-500/5' : '')}>
            <div className={"text-2xl font-black " + (item.highlight ? 'text-emerald-400' : 'text-white')}>{item.val}</div>
            <div className="text-[10px] text-slate-400 mt-2 font-medium">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}