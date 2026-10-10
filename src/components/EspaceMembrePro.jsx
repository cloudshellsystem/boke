import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function EspaceMembrePro({ onRequireLogin }) {
  const { isLoggedIn, user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('factures');

  // Champs Devis & Factures B2B
  const [docType, setDocType] = useState('DEVIS');
  const [clientName, setClientName] = useState('Agence Horizon');
  const [clientAddress, setClientAddress] = useState('10 Rue de la République, 75001 Paris');
  const [clientSiret, setClientSiret] = useState('');
  const [statutJuridique, setStatutJuridique] = useState('Micro-Entreprise / EI');
  const [prestation, setPrestation] = useState('Cession de droits & Prise de vue - Lumières de Conakry');
  const [montantHT, setMontantHT] = useState(250);
  const [tvaRate, setTvaRate] = useState(20);
  const [clientLogo, setClientLogo] = useState(null);

  if (loading) {
    return (
      <div className="bg-neutral-950 min-h-screen flex items-center justify-center text-amber-500 font-bold text-xs">
        Vérification des accès en cours...
      </div>
    );
  }

  // Verrouillage de sécurité : Si non connecté ou pas Pro
  if (!isLoggedIn) {
    return (
      <div className="bg-neutral-950 min-h-screen flex items-center justify-center p-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 max-w-md text-center space-y-4">
          <div className="text-4xl">🔒</div>
          <h2 className="text-lg font-black text-white">Espace Pro & Facturation Verrouillé</h2>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Cet espace est exclusivement réservé aux abonnés Pro & Élite (Photographes, Dronistes, Créateurs).
          </p>
          <button
            onClick={() => onRequireLogin?.()}
            className="bg-amber-500 hover:bg-amber-400 text-neutral-950 px-6 py-3 rounded-xl font-black text-xs transition cursor-pointer"
          >
            Se connecter / Rejoindre
          </button>
        </div>
      </div>
    );
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setClientLogo(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const totalTVA = (parseFloat(montantHT || 0) * (parseFloat(tvaRate) / 100)).toFixed(2);
  const totalTTC = (parseFloat(montantHT || 0) + parseFloat(totalTVA)).toFixed(2);

  return (
    <div className="bg-neutral-950 text-neutral-100 min-h-screen p-4 md:p-8 space-y-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* En-tête sans compteurs virtuels */}
        <div className="border-b border-neutral-800 pb-4 flex justify-between items-center">
          <div>
            <span className="bg-amber-500/10 text-amber-500 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider border border-amber-500/20">
              Espace Pro Officiel
            </span>
            <h1 className="text-2xl font-black text-white mt-2">Espace Vente, Compta & Conformité B2B</h1>
            <p className="text-xs text-neutral-400">Configurez vos devis et factures conformes aux normes B2B.</p>
          </div>
        </div>

        {/* Onglets */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('factures')}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition ${
              activeTab === 'factures' ? 'bg-amber-500 text-neutral-950' : 'bg-neutral-900 text-neutral-400 hover:text-white'
            }`}
          >
            📄 Éditeur Devis & Factures PDF
          </button>
          <button
            onClick={() => setActiveTab('entreprise')}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition ${
              activeTab === 'entreprise' ? 'bg-amber-500 text-neutral-950' : 'bg-neutral-900 text-neutral-400 hover:text-white'
            }`}
          >
            🏢 Mon Entreprise & Statut (SIRET/MDA)
          </button>
        </div>

        {/* Contenu Éditeur */}
        {activeTab === 'factures' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Formulaire */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-black text-white">Éditeur Devis & Facture B2B</h2>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="bg-neutral-950 border border-neutral-800 text-amber-500 font-bold text-xs rounded-lg px-3 py-1.5"
                >
                  <option value="DEVIS">DEVIS</option>
                  <option value="FACTURE">FACTURE</option>
                </select>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-neutral-400">Statut / Régime Fiscale</label>
                  <select
                    value={statutJuridique}
                    onChange={(e) => setStatutJuridique(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Micro-Entreprise / EI">Micro-Entreprise / EI (TVA non applicable art. 293B)</option>
                    <option value="Maison des Artistes / AGESSA">Maison des Artistes / AGESSA (Artiste-Auteur)</option>
                    <option value="SASU / EURL / SA (Assujetti TVA)">Société Assujettie TVA (20%)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-neutral-400">Nom du Client / Agence B2B</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-neutral-400">Adresse & SIRET du Client</label>
                  <input
                    type="text"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-neutral-400">Logo du Client (Optionnel)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="w-full text-xs text-neutral-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500/10 file:text-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-neutral-400">Intitulé de la prestation / œuvre</label>
                  <input
                    type="text"
                    value={prestation}
                    onChange={(e) => setPrestation(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-neutral-400">Montant HT (€)</label>
                    <input
                      type="number"
                      value={montantHT}
                      onChange={(e) => setMontantHT(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-neutral-400">Taux TVA (%)</label>
                    <input
                      type="number"
                      value={tvaRate}
                      onChange={(e) => setTvaRate(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Aperçu Aperçu PDF */}
            <div className="bg-white text-neutral-900 rounded-2xl p-6 space-y-4 shadow-xl text-xs">
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <h3 className="font-black text-lg text-neutral-950">{docType}</h3>
                  <p className="text-[10px] text-neutral-500">Réf : BOKÉ-{Math.floor(100000 + Math.random() * 900000)}</p>
                  <p className="text-[10px] text-neutral-500">Régime : {statutJuridique}</p>
                </div>
                {clientLogo && <img src={clientLogo} alt="Logo Client" className="h-10 object-contain" />}
              </div>

              <div className="border-b pb-4 space-y-1">
                <p className="font-bold text-neutral-700">Client / Destinataire :</p>
                <p className="font-black">{clientName}</p>
                <p className="text-[10px] text-neutral-600">{clientAddress}</p>
              </div>

              <div className="py-2">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b text-[10px] text-neutral-400">
                      <th className="py-1">Description</th>
                      <th className="py-1 text-right">Montant HT</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2 font-medium">{prestation}</td>
                      <td className="py-2 text-right font-bold">{montantHT} €</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="border-t pt-4 space-y-1 text-right">
                <p className="text-[10px] text-neutral-600">Total HT : {montantHT} €</p>
                <p className="text-[10px] text-neutral-600">TVA ({tvaRate}%) : {totalTVA} €</p>
                <p className="font-black text-sm text-neutral-950">Total TTC : {totalTTC} €</p>
              </div>

              <button
                onClick={() => window.print()}
                className="w-full bg-neutral-950 text-white font-bold py-2.5 rounded-xl text-xs hover:bg-neutral-800 transition cursor-pointer"
              >
                🖨️ Imprimer / Télécharger en PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}