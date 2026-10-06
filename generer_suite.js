// generer_suite.js
import fs from 'fs';
import path from 'path';

const dir = './src/components';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

console.log("🚀 Lancement de la génération de la suite des composants BOké ONE...");

// 1. CalculateurProAbonnes.jsx (Le Générateur de Prix avec taxes et intermittence)
const calculateurCode = `import React, { useState, useEffect } from 'react';

export default function CalculateurProAbonnes() {
  const [chargesPerso, setChargesPerso] = useState(1200);
  const [chargesProFixes, setChargesProFixes] = useState(500);
  const [licencesOutils, setLicencesOutils] = useState(80);
  const [assurancesPro, setAssurancesPro] = useState(40);
  const [joursFactures, setJoursFactures] = useState(80);
  const [margeSecurite, setMargeSecurite] = useState(40);
  const [tauxChargesSociales, setTauxChargesSociales] = useState(22);
  const [amortissementMatos, setAmortissementMatos] = useState(1500);
  const [joursVotreTravail, setJoursVotreTravail] = useState(3);
  const [fraisDeplacement, setFraisDeplacement] = useState(120);
  const [inclureCadreur, setInclureCadreur] = useState(true);
  const [inclureDroniste, setInclureDroniste] = useState(false);

  const [tjmConseille, setTjmConseille] = useState(0);
  const [devisPlancher, setDevisPlancher] = useState(0);

  useEffect(() => {
    const totalChargesMensuelles = Number(chargesPerso) + Number(chargesProFixes) + Number(licencesOutils) + Number(assurancesPro);
    const totalFraisAnnuels = (totalChargesMensuelles * 12) + Number(amortissementMatos);
    const baseTjmSurvie = joursFactures > 0 ? totalFraisAnnuels / Number(joursFactures) : 0;
    const facteurTaxes = 1 - (Number(tauxChargesSociales) / 100);
    const tjmApresTaxes = baseTjmSurvie / facteurTaxes;
    const tjmFinal = Math.round(tjmApresTaxes * (1 + (Number(margeSecurite) / 100)));
    setTjmConseille(tjmFinal);

    let coutSousTraitance = 0;
    if (inclureCadreur) coutSousTraitance += (320 * 1.95) + 30; // Convention Chef Opérateur + Charges + Portage
    if (inclureDroniste) coutSousTraitance += 600;

    const totalProjet = (tjmFinal * Number(joursVotreTravail)) + ((coutSousTraitance + Number(fraisDeplacement)) * (1 + (Number(margeSecurite) / 100)));
    setDevisPlancher(Math.round(totalProjet));
  }, [chargesPerso, chargesProFixes, licencesOutils, assurancesPro, joursFactures, margeSecurite, tauxChargesSociales, amortissementMatos, joursVotreTravail, fraisDeplacement, inclureCadreur, inclureDroniste]);

  return (
    <div className="p-6 bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 font-sans">
      <h2 className="text-xl font-black mb-4">⚙️ Calculateur Métier Global (Charges & Intermittence)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        <div className="space-y-3 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
          <p className="font-bold text-amber-500 uppercase">Variables Structurelles</p>
          <label className="block">Jours facturés / an :</label>
          <input type="number" value={joursFactures} onChange={(e) => setJoursFactures(e.target.value)} className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white w-full" />
          <div className="flex gap-4 pt-2">
            <label><input type="checkbox" checked={inclureCadreur} onChange={(e) => setInclureCadreur(e.target.checked)} /> Inclure Cadreur Intermittent (320€ brut)</label>
          </div>
        </div>
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col justify-center space-y-4 text-center">
          <div>
            <span className="text-slate-500 uppercase font-bold block text-[10px]">Ton TJM Conseillé (+Marge)</span>
            <span className="text-3xl font-black text-amber-400">{tjmConseille} € / jour</span>
          </div>
          <div className="border-t border-slate-800 pt-3">
            <span className="text-slate-400 uppercase font-bold block text-[10px]">Prix Minimum du Devis Global</span>
            <span className="text-4xl font-black text-emerald-400">{devisPlancher.toLocaleString()} €</span>
          </div>
        </div>
      </div>
    </div>
  );
}`;
fs.writeFileSync(path.join(dir, 'CalculateurProAbonnes.jsx'), calculateurCode);

// 2. GrilleTarifs.jsx (La Vitrine des 4 Offres Packagées)
const tarifsCode = `import React from 'react';

export default function GrilleTarifs() {
  const packs = [
    { nom: "L'Essentiel", tag: "Ponctuel", desc: "Demi-journée tournage, montage dynamique, 1 format final." },
    { nom: "Le Mensuel", tag: "Populaire", desc: "1/2 journée tournage / mois, 4 vidéos courtes montées (cut + sous-titres)." },
    { nom: "Le Pro", tag: "YouTube", desc: "1 jour tournage / mois, 8 vidéos (capsules + 1 format long), plan de contenu." },
    { nom: "La Production", tag: "Sur-Mesure", desc: "Pré-production, équipe renforcée (2e cadreur, drone), étalonnage cinéma." }
  ];

  return (
    <div className="p-6 bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 font-sans">
      <h2 className="text-xl font-black text-center mb-6">📦 Nos 4 Offres Packagées à la Valeur</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        {packs.map((p, i) => (
          <div key={i} className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="bg-slate-800 px-2 py-0.5 rounded text-amber-400 font-bold text-[9px] uppercase">{p.tag}</span>
              <h3 className="text-base font-bold text-white mt-2">{p.nom}</h3>
              <p className="text-slate-400 mt-2 leading-relaxed">{p.desc}</p>
            </div>
            <button className="w-full bg-amber-500 text-slate-950 font-black py-2 rounded-lg mt-4 text-[11px]">Choisir pour la propale</button>
          </div>
        ))}
      </div>
    </div>
  );
}`;
fs.writeFileSync(path.join(dir, 'GrilleTarifs.jsx'), tarifsCode);

// 3. MecanismeDOM.jsx (Diagnostic de l'Opportunité Manquée)
const domCode = `import React, { useState } from 'react';

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
}`;
fs.writeFileSync(path.join(dir, 'MecanismeDOM.jsx'), domCode);

// 4. EvaluateurYoutube.jsx (Optimisateur Algorithmique B2B)
const youtubeCode = `import React, { useState } from 'react';

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
}`;
fs.writeFileSync(path.join(dir, 'EvaluateurYoutube.jsx'), youtubeCode);

// 5. VuePropaleClient.jsx (La Page Web Publique de Proposition Commerciale)
const propaleClientCode = `import React from 'react';

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
}`;
fs.writeFileSync(path.join(dir, 'VuePropaleClient.jsx'), propaleClientCode);

// 6. EcranRevelation.jsx (L'Étape de Closing Révélation et Engagement)
const revelationCode = `import React, { useState } from 'react';

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
}`;
fs.writeFileSync(path.join(dir, 'EcranRevelation.jsx'), revelationCode);

// 7. RegieTerrain.jsx (Feuilles de route & Checklist Matériel)
const regieCode = `import React from 'react';

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
}`;
fs.writeFileSync(path.join(dir, 'RegieTerrain.jsx'), regieCode);

// 8. ScannerRecurrence.jsx (Mouchard de Revenus Récurrents Objectif 12K)
const recurrenceCode = `import React, { useState } from 'react';

export default function ScannerRecurrence() {
  const [rmr] = useState(4500);
  const pct = Math.round((rmr / 12000) * 100);
  return (
    <div className="p-6 bg-slate-950 text-slate-100 border border-slate-800 rounded-2xl font-sans max-w-xl mx-auto text-center space-y-4">
      <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest">💰 Scanner de Récurrence · Objectif 12K</h3>
      <div>
        <span className="text-3xl font-black text-white">{rmr.toLocaleString()} € / mois</span>
        <span className="text-slate-500 text-[10px] block mt-1">Revenu Mensuel Récurrent Actuel</span>
      </div>
      <div className="w-full bg-slate-900 h-3 rounded-full border border-slate-800 overflow-hidden p-0.5">
        <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: \`\${pct}%\` }}></div>
      </div>
      <span className="text-xs font-bold text-slate-400">Progression : {pct}% de l'objectif</span>
    </div>
  );
}`;
fs.writeFileSync(path.join(dir, 'ScannerRecurrence.jsx'), recurrenceCode);

console.log("✅ [BOké ONE] La suite des composants a été injectée avec un succès total sans aucun débordement !");