import React, { useState } from 'react';

export default function CalculateurRentabilite() {
  const [revenuNetCible, setRevenuNetCible] = useState(35000);
  const [chargesAnnuelles, setChargesAnnuelles] = useState(12000);
  const [tauxCotisations, setTauxCotisations] = useState(25);
  const [joursFacturables, setJoursFacturables] = useState(100);

  const totalBesoinBrut = (revenuNetCible + chargesAnnuelles) / (1 - tauxCotisations / 100);
  const tjmCalcule = joursFacturables > 0 ? totalBesoinBrut / joursFacturables : 0;
  
  const PLANCHER_BOKE_ONE = 500;
  const tjmFinal = Math.max(tjmCalcule, PLANCHER_BOKE_ONE);
  const estPlancherForce = tjmCalcule < PLANCHER_BOKE_ONE;

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 text-white max-w-2xl mx-auto shadow-xl">
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Espace Performance Élite</span>
          <h2 className="text-xl font-black mt-1">Calculateur de Rentabilité & TJM Plancher</h2>
          <p className="text-xs text-neutral-400 mt-1">Définissez votre seuil de rentabilité réel pour garantir un TJM viable.</p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-lg text-right">
          <span className="text-[10px] text-amber-400 block font-bold">TJM PLANCHER REQUIS</span>
          <span className="text-lg font-black text-amber-400">500 € / j</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800">
          <label className="block text-xs font-semibold text-neutral-300 mb-1">Revenu Net Cible Annuel (€)</label>
          <input
            type="number"
            value={revenuNetCible}
            onChange={(e) => setRevenuNetCible(Number(e.target.value))}
            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white font-bold focus:border-amber-500 outline-none"
          />
        </div>
        <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800">
          <label className="block text-xs font-semibold text-neutral-300 mb-1">Charges Pro Annuelles (€)</label>
          <input
            type="number"
            value={chargesAnnuelles}
            onChange={(e) => setChargesAnnuelles(Number(e.target.value))}
            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white font-bold focus:border-amber-500 outline-none"
          />
        </div>
        <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800">
          <label className="block text-xs font-semibold text-neutral-300 mb-1">Taux Cotisations Sociales (%)</label>
          <input
            type="number"
            value={tauxCotisations}
            onChange={(e) => setTauxCotisations(Number(e.target.value))}
            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white font-bold focus:border-amber-500 outline-none"
          />
        </div>
        <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800">
          <label className="block text-xs font-semibold text-neutral-300 mb-1">Jours Travaillés / an</label>
          <input
            type="number"
            value={joursFacturables}
            onChange={(e) => setJoursFacturables(Number(e.target.value))}
            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white font-bold focus:border-amber-500 outline-none"
          />
        </div>
      </div>

      <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-5 mb-4 flex items-center justify-between">
        <div>
          <span className="text-xs text-neutral-400">TJM mathématique calculé :</span>
          <div className="text-xl font-bold text-neutral-200">{Math.round(tjmCalcule)} € HT / jour</div>
        </div>
        <div className="text-right">
          <span className="text-xs text-amber-400 font-bold">TJM Validé Boké One :</span>
          <div className="text-3xl font-black text-amber-400">{Math.round(tjmFinal)} € HT / jour</div>
        </div>
      </div>

      {estPlancherForce && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-300 flex items-center gap-2">
          <span>🔒</span>
          <span><strong>Règle Élite active :</strong> Plancher protecteur de <strong>500 €</strong> appliqué d'office.</span>
        </div>
      )}
    </div>
  );
}
