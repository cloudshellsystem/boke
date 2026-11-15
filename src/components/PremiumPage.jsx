import React, { useState } from 'react';
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
