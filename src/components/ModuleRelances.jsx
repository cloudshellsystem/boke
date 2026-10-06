import React, { useState } from 'react';

export default function ModuleRelances() {
  const [contacts] = useState([
    { id: 1, nom: 'Anna Leclerc', entreprise: 'Occitanie Événements', tel: '06 45 78 12 90', joursSansNouvelles: 66 },
    { id: 2, nom: 'Raphaël Colin', entreprise: 'Toulouse Immo Conseil', tel: '05 61 22 33 44', joursSansNouvelles: 47 }
  ]);
  const [contactEnCours, setContactEnCours] = useState(null);

  return (
    <div className="p-6 bg-slate-950 text-slate-100 border border-slate-800 rounded-2xl shadow-2xl font-sans">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
        <h2 className="text-xl font-black text-white">🔥 Tes relances prioritaires du jour</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          {contacts.map(c => (
            <div key={c.id} onClick={() => setContactEnCours(c)} className="p-4 rounded-xl border bg-slate-900 border-slate-800 cursor-pointer flex justify-between items-center">
              <div>
                <h4 className="text-sm font-bold text-white">{c.entreprise}</h4>
                <p className="text-xs text-slate-400">👤 {c.nom}</p>
              </div>
              <span className="text-xs font-black text-rose-400">+{c.joursSansNouvelles} j</span>
            </div>
          ))}
        </div>
        <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 min-h-[250px] flex flex-col justify-center">
          {contactEnCours ? (
            <div className="space-y-4">
              <h3 className="text-lg font-black text-white">{contactEnCours.nom}</h3>
              <p className="text-xs text-amber-400 font-mono">{contactEnCours.tel}</p>
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-mono">
                "Bonjour {contactEnCours.nom}, je vous recontacte suite à notre dernier échange..."
              </div>
            </div>
          ) : (
            <p className="text-center text-xs text-slate-500">Sélectionne un prospect pour lancer l'appel.</p>
          )}
        </div>
      </div>
    </div>
  );
}