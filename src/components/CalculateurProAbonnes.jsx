import React, { useState, useEffect } from 'react';

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
}