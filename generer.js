import fs from 'fs';
import path from 'path';

const dir = './src/components';

// Création automatique du dossier components s'il n'existe pas encore
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

console.log("🚀 Lancement de la génération des composants BOké ONE...");

// 1. Génération de PipelineKanban.jsx
const pipelineCode = `import React, { useState } from 'react';

export default function PipelineKanban() {
  const [deals] = useState([
    { id: 1, entreprise: 'Toulouse Immo Conseil', valeur: 3000, relance: 47, etape: 'demarcher' },
    { id: 2, entreprise: 'Occitanie Événements', valeur: 2500, relance: 55, etape: 'demarcher' },
    { id: 3, entreprise: 'École Horizon', valeur: 3200, relance: 2, etape: 'proposition' },
    { id: 4, entreprise: 'Garage Bernat', valeur: 4000, relance: 39, etape: 'rdv' }
  ]);

  const colonnes = [
    { id: 'demarcher', titre: '🎯 À démarcher / Relancer', couleur: 'border-t-rose-500' },
    { id: 'rdv', titre: '📅 RDV Visio Calé', couleur: 'border-t-amber-500' },
    { id: 'proposition', titre: '💼 Propale Présentée', couleur: 'border-t-blue-500' },
    { id: 'gagne', titre: '💰 Gagné (Récurrent)', couleur: 'border-t-emerald-500' }
  ];

  return (
    <div className="p-6 bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 font-sans">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
        <div>
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Suvi Pilote — Relations</span>
          <h2 className="text-2xl font-black text-white mt-1">Votre Pipeline Commercial</h2>
        </div>
        <div className="bg-slate-900 px-4 py-2 rounded-lg border border-slate-800 text-xs">
          🔥 Valeur totale : <span className="font-bold text-emerald-400">{deals.reduce((acc, d) => acc + d.valeur, 0).toLocaleString()} €</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {colonnes.map(col => (
          <div key={col.id} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex flex-col min-h-[400px]">
            <div className={"border-t-4 " + col.couleur + " pt-2 mb-4"}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">{col.titre}</h3>
            </div>
            <div className="space-y-3 flex-1">
              {deals.filter(d => d.etape === col.id).map(deal => (
                <div key={deal.id} className="bg-slate-900 p-4 rounded-lg border border-slate-800 shadow-md">
                  <h4 className="text-sm font-bold text-white">{deal.entreprise}</h4>
                  <div className="flex justify-between items-center mt-3 text-xs">
                    <span className="font-extrabold text-emerald-400">{deal.valeur} €</span>
                    <span className="text-slate-500">{deal.relance}j</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}`;
fs.writeFileSync(path.join(dir, 'PipelineKanban.jsx'), pipelineCode);

// 2. Génération de ModuleRelances.jsx
const relancesCode = `import React, { useState } from 'react';

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
}`;
fs.writeFileSync(path.join(dir, 'ModuleRelances.jsx'), relancesCode);

// 3. Génération de TableauVendredi.jsx
const vendrediCode = `import React from 'react';

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
}`;
fs.writeFileSync(path.join(dir, 'TableauVendredi.jsx'), vendrediCode);

// 4. Génération de SuviCoachIA.jsx
const coachIaCode = `import React, { useState } from 'react';

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
}`;
fs.writeFileSync(path.join(dir, 'SuviCoachIA.jsx'), coachIaCode);

// 5. Génération de GrilleDecouverte.jsx
const decouverteCode = `import React from 'react';

export default function GrilleDecouverte() {
  return (
    <div className="p-6 bg-slate-950 text-slate-100 border border-slate-800 rounded-2xl font-sans">
      <h2 className="text-xl font-black mb-4">La grille SCORE & Frustrations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
        <div className="space-y-2 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
          <p className="text-amber-400 font-bold">S.C.O.R.E</p>
          <p className="text-slate-400">• Situation / Contexte / Objectif / Réalisation / Évolution</p>
        </div>
        <div className="space-y-2 bg-rose-950/10 p-4 rounded-xl border border-rose-900/30">
          <p className="text-rose-400 font-bold">FRUSTRATIONS À NOMMER</p>
          <p className="text-slate-400">• Temps / Argent / Effort / Résultat / Émotionnel</p>
        </div>
      </div>
    </div>
  );
}`;
fs.writeFileSync(path.join(dir, 'GrilleDecouverte.jsx'), decouverteCode);

// 6. Génération de Afterworks.jsx (SÉCURISÉ)
const afterworksCode = `import React from 'react';

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
}`;
fs.writeFileSync(path.join(dir, 'Afterworks.jsx'), afterworksCode);

// 7. Génération de ModulePropales.jsx (SÉCURISÉ)
const propalesCode = `import React from 'react';

export default function ModulePropales() {
  return (
    <div className="p-6 bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 font-sans">
      <h3 className="text-xl font-black text-white mb-4">📄 Propales d'Agence</h3>
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
        <p className="font-bold text-amber-400">Mécalu Systèmes — Marque employeur</p>
        <p className="text-slate-300">🎞️ 9 vidéos • Offre à la valeur</p>
        <p className="text-slate-500">👁️ 3 vues</p>
      </div>
    </div>
  );
}`;
fs.writeFileSync(path.join(dir, 'ModulePropales.jsx'), propalesCode);

console.log("✅ [BOké ONE] Tous les composants ont été injectés sans erreur dans src/components !");