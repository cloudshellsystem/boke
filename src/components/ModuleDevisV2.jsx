import React, { useState } from 'react';

export default function ModuleDevisV2({ onPayDevis }) {
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [statutMission, setStatutMission] = useState('Brouillon');
  const [lignes, setLignes] = useState([
    { description: 'Reportage photo & direction artistique (Journée)', qte: 1, prixHt: 500, tva: 20 }
  ]);

  const ajouterLigne = () => {
    setLignes([...lignes, { description: '', qte: 1, prixHt: 0, tva: 20 }]);
  };

  const modifierLigne = (index, champ, valeur) => {
    const nouvellesLignes = [...lignes];
    nouvellesLignes[index][champ] = valeur;
    setLignes(nouvellesLignes);
  };

  const supprimerLigne = (index) => {
    setLignes(lignes.filter((_, i) => i !== index));
  };

  const totalHt = lignes.reduce((acc, l) => acc + (Number(l.qte) * Number(l.prixHt)), 0);
  const totalTva = lignes.reduce((acc, l) => acc + (Number(l.qte) * Number(l.prixHt) * (Number(l.tva) / 100)), 0);
  const totalTtc = totalHt + totalTva;
  const acompte30 = totalTtc * 0.30;

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 text-white max-w-4xl mx-auto shadow-2xl">
      <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
        <div>
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Module 2 : Éditeur Pro & Tunnel Mission</span>
          <h2 className="text-xl font-black mt-1">Devis Multi-Lignes & Dossier de Mission</h2>
          <p className="text-xs text-neutral-400 mt-1">Générez des propositions détaillées et encaissez l'acompte directement sur Boké One.</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statutMission}
            onChange={(e) => setStatutMission(e.target.value)}
            className="bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-lg text-xs font-black text-amber-400 uppercase outline-none"
          >
            <option value="Brouillon" className="bg-neutral-900">1. Brouillon</option>
            <option value="Envoyé" className="bg-neutral-900">2. Devis Envoyé</option>
            <option value="Signé" className="bg-neutral-900">3. Signé (Attente Acompte)</option>
            <option value="En cours" className="bg-neutral-900">4. Mission en cours</option>
            <option value="Soldé" className="bg-neutral-900">5. Soldé</option>
          </select>
        </div>
      </div>

      {/* Informations Client */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-neutral-900 p-4 rounded-xl border border-neutral-800">
        <div>
          <label className="block text-xs font-semibold text-neutral-300 mb-1">Nom du Client / Société</label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Ex : Agence Studio Paris"
            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white text-sm focus:border-amber-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-300 mb-1">Adresse de Facturation</label>
          <input
            type="text"
            value={clientAddress}
            onChange={(e) => setClientAddress(e.target.value)}
            placeholder="Ex : 12 rue de la Paix, Paris"
            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white text-sm focus:border-amber-500 outline-none"
          />
        </div>
      </div>

      {/* Tableau des prestations multi-lignes */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300">Lignes de Prestation</h3>
          <button
            type="button"
            onClick={ajouterLigne}
            className="bg-neutral-800 hover:bg-neutral-700 text-amber-400 px-3 py-1.5 rounded-lg text-xs font-bold transition"
          >
            + Ajouter une ligne
          </button>
        </div>

        <div className="space-y-3">
          {lignes.map((ligne, index) => (
            <div key={index} className="flex gap-2 items-center bg-neutral-900 p-3 rounded-xl border border-neutral-800 flex-wrap sm:flex-nowrap">
              <input
                type="text"
                placeholder="Description de la prestation..."
                value={ligne.description}
                onChange={(e) => modifierLigne(index, 'description', e.target.value)}
                className="flex-grow bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-xs text-white outline-none focus:border-amber-500"
              />
              <input
                type="number"
                placeholder="Qté"
                value={ligne.qte}
                onChange={(e) => modifierLigne(index, 'qte', e.target.value)}
                className="w-16 bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-xs text-white text-center outline-none focus:border-amber-500"
              />
              <input
                type="number"
                placeholder="Prix HT (€)"
                value={ligne.prixHt}
                onChange={(e) => modifierLigne(index, 'prixHt', e.target.value)}
                className="w-24 bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-xs text-white text-right outline-none focus:border-amber-500"
              />
              <select
                value={ligne.tva}
                onChange={(e) => modifierLigne(index, 'tva', e.target.value)}
                className="w-20 bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-xs text-white outline-none focus:border-amber-500"
              >
                <option value="20">20%</option>
                <option value="10">10%</option>
                <option value="5.5">5.5%</option>
                <option value="0">0%</option>
              </select>
              {lignes.length > 1 && (
                <button
                  type="button"
                  onClick={() => supprimerLigne(index)}
                  className="text-red-400 hover:text-red-300 p-2 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Résumé Financier */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-5 mb-6 flex justify-between items-center flex-wrap gap-4">
        <div className="space-y-1 text-xs text-neutral-400">
          <div>Total HT : <strong className="text-white">{totalHt.toFixed(2)} €</strong></div>
          <div>Total TVA : <strong className="text-white">{totalTva.toFixed(2)} €</strong></div>
          <div>Acompte recommandé (30%) : <strong className="text-emerald-400">{acompte30.toFixed(2)} € TTC</strong></div>
        </div>
        <div className="text-right">
          <span className="text-xs text-amber-400 font-bold block">TOTAL NET À PAYER TTC</span>
          <div className="text-2xl font-black text-amber-400">{totalTtc.toFixed(2)} €</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => {
            setStatutMission('Envoyé');
            alert('Dossier mission sauvegardé !');
          }}
          className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition"
        >
          💾 Enregistrer le Dossier Mission
        </button>
        <button
          type="button"
          onClick={() => onPayDevis && onPayDevis(acompte30.toFixed(2), `Acompte Mission - ${clientName || 'Client'}`)}
          className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black py-3.5 rounded-xl text-xs uppercase tracking-wider transition shadow-lg"
        >
          💳 Encaisser l'Acompte ({acompte30.toFixed(2)} €) sur le site
        </button>
      </div>
    </div>
  );
}
