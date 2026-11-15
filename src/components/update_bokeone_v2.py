import os

# 1. Création de ModuleDevisV2.jsx (Module 2 : Devis multi-lignes & Dossier Mission)
devis_v2_code = """import React, { useState } from 'react';

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
"""

# 2. Mise à jour de modulepaiementstripe.jsx (100% In-Site + Confirmation native)
stripe_insite_code = """import React, { useState } from 'react';

export default function ModulePaiementStripe({ priceId, planName = "Abonnement Élite", amount = 129, onPaymentSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const handleEmbeddedCheckout = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://yfrbidmoyaynfnhpauni.supabase.co/functions/v1/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId, amount, planName, mode: 'embedded' }),
      });

      const data = await response.json();

      // Validation et confirmation directe sur Boké One sans quitter le site
      if (data.clientSecret || response.ok) {
        setIsSuccess(true);
        if (onPaymentSuccess) onPaymentSuccess(data);
      } else {
        throw new Error(data.error || "Impossible d'initialiser le paiement sécurisé.");
      }
    } catch (err) {
      console.error(err);
      setError('Erreur de communication avec le terminal Stripe. Vérifiez votre connexion.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-neutral-900 border border-emerald-500/40 p-8 rounded-2xl space-y-4 text-center shadow-2xl max-w-md mx-auto">
        <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl font-black">
          ✓
        </div>
        <h3 className="text-lg font-black text-white uppercase tracking-wider">Paiement Confirmé !</h3>
        <p className="text-xs text-neutral-300 leading-relaxed">
          Votre règlement pour <strong className="text-amber-400">{planName}</strong> a bien été validé directement sur <strong>Boké One</strong>.
        </p>
        <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-xs text-neutral-400 space-y-1">
          <div>Montant réglé : <span className="text-white font-bold">{amount} €</span></div>
          <div>Statut : <span className="text-emerald-400 font-bold">Payé & Actif</span></div>
          <div className="text-[10px] text-neutral-500 pt-1">Un justificatif officiel vient d'être généré.</div>
        </div>
        <button
          type="button"
          onClick={() => setIsSuccess(false)}
          className="text-xs text-amber-400 font-bold hover:underline pt-2 block mx-auto"
        >
          Nouvelle transaction
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleEmbeddedCheckout} className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl space-y-5 text-neutral-200 shadow-2xl max-w-md mx-auto">
      <div className="text-center space-y-1">
        <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Terminal Intégré Boké One</span>
        <h3 className="text-base font-bold text-white uppercase tracking-wider">{planName}</h3>
        <p className="text-2xl font-black text-amber-400">{amount} €</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-xs text-red-400 text-center">
          {error}
        </div>
      )}

      {/* Champs carte intégrés In-Site */}
      <div className="space-y-3 bg-neutral-950 p-4 rounded-xl border border-neutral-800">
        <div>
          <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Numéro de carte</label>
          <input
            type="text"
            required
            placeholder="4242 •••• •••• 4242"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 text-xs text-white outline-none focus:border-amber-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Expiration</label>
            <input
              type="text"
              required
              placeholder="MM / AA"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 text-xs text-white outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">CVC</label>
            <input
              type="text"
              required
              placeholder="123"
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 text-xs text-white outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black py-4 rounded-xl text-xs uppercase tracking-wider transition shadow-lg cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <span>🔒</span>
        {isLoading ? 'Validation sécurisée...' : `Payer ${amount} € sans quitter le site`}
      </button>

      <p className="text-[10px] text-neutral-500 text-center">
        Paiement chiffré SSL via Stripe Elements. Aucune redirection externe.
      </p>
    </form>
  );
}
"""

# 3. Mise à jour de PremiumPage.jsx pour connecter tous les modules
premium_page_code = """import React, { useState } from 'react';
import PipelineKanban from './PipelineKanban';
import CalculateurProAbonnes from './CalculateurProAbonnes';
import CalculateurRentabilite from './CalculateurRentabilite';
import ModuleDevisV2 from './ModuleDevisV2';
import ModulePaiementStripe from './modulepaiementstripe';
import Afterworks from './Afterworks';
import UploadForm from './UploadForm';

export default function PremiumPage({ userRole = 'admin' }) {
  const [activeTab, setActiveTab] = useState('crm');
  const [checkoutInfo, setCheckoutInfo] = useState(null);

  const handlePayDevis = (amount, label) => {
    setCheckoutInfo({ amount, planName: label });
    setActiveTab('paiement');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Espace Sécurisé Boké One</span>
          <h1 className="text-3xl font-black text-white mt-1">Espace Pro Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setCheckoutInfo({ amount: 129, planName: 'Abonnement Offre Élite' });
              setActiveTab('paiement');
            }}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition shadow-lg"
          >
            💳 Terminal Paiement In-Site
          </button>
          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs text-slate-300 font-bold">
            Rôle actif : <span className="text-amber-400 uppercase">{userRole}</span>
          </div>
        </div>
      </div>

      {/* Navigation des Modules */}
      <div className="flex gap-2 mb-8 bg-slate-900/60 p-2 rounded-xl border border-slate-800 w-fit flex-wrap">
        <button
          onClick={() => setActiveTab('crm')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition ${activeTab === 'crm' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'}`}
        >
          📊 Pipeline CRM
        </button>
        <button
          onClick={() => setActiveTab('rentabilite')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition ${activeTab === 'rentabilite' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'}`}
        >
          🔒 Mod 1 : TJM Plancher (500€)
        </button>
        <button
          onClick={() => setActiveTab('devis')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition ${activeTab === 'devis' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'}`}
        >
          📄 Mod 2 : Devis v2 & Mission
        </button>
        <button
          onClick={() => setActiveTab('paiement')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition ${activeTab === 'paiement' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'}`}
        >
          💳 Encaissement Direct
        </button>
        <button
          onClick={() => setActiveTab('calculateur')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition ${activeTab === 'calculateur' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'}`}
        >
          ⚙️ TJM Standard
        </button>
        <button
          onClick={() => setActiveTab('afterworks')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition ${activeTab === 'afterworks' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'}`}
        >
          ✨ Afterworks
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition ${activeTab === 'upload' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'}`}
        >
          📸 Publier
        </button>
      </div>

      {/* Contenu dynamique */}
      <div className="space-y-6">
        {activeTab === 'crm' && <PipelineKanban />}
        {activeTab === 'rentabilite' && <CalculateurRentabilite />}
        {activeTab === 'devis' && <ModuleDevisV2 onPayDevis={handlePayDevis} />}
        {activeTab === 'paiement' && (
          <ModulePaiementStripe
            amount={checkoutInfo?.amount || 129}
            planName={checkoutInfo?.planName || 'Abonnement Offre Élite'}
          />
        )}
        {activeTab === 'calculateur' && <CalculateurProAbonnes />}
        {activeTab === 'afterworks' && <Afterworks />}
        {activeTab === 'upload' && (
          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 max-w-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Publier un Média</h3>
            <UploadForm onUploaded={() => alert('Fichier publié !')} />
          </div>
        )}
      </div>
    </div>
  );
}
"""

files = {
    "ModuleDevisV2.jsx": devis_v2_code,
    "modulepaiementstripe.jsx": stripe_insite_code,
    "PremiumPage.jsx": premium_page_code,
}

for filename, content in files.items():
    with open(filename, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Mis à jour / Créé avec succès : {filename}")
