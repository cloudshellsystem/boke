import React, { useState } from 'react';
import PipelineKanban from './PipelineKanban';
import CalculateurProAbonnes from './CalculateurProAbonnes';
import Afterworks from './Afterworks';
import UploadForm from './UploadForm';

export default function PremiumPage({ userRole = 'creatif_abonne' }) {
  const [activeTab, setActiveTab] = useState('crm');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Espace Sécurisé</span>
          <h1 className="text-3xl font-black text-white mt-1">Espace Pro Dashboard</h1>
        </div>
        <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs text-slate-300 font-bold">
          Rôle actif : <span className="text-amber-400">{userRole}</span>
        </div>
      </div>

      {/* Boutons de sous-onglets */}
      <div className="flex gap-2 mb-8 bg-slate-900/60 p-2 rounded-xl border border-slate-800 w-fit flex-wrap">
        <button
          onClick={() => setActiveTab('crm')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition ${activeTab === 'crm' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'}`}
        >
          📊 Pipeline CRM
        </button>
        <button
          onClick={() => setActiveTab('calculateur')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition ${activeTab === 'calculateur' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'}`}
        >
          ⚙️ Calculateur TJM
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
          📸 Publier une Photo
        </button>
      </div>

      {/* Contenu dynamique */}
      <div className="space-y-6">
        {activeTab === 'crm' && <PipelineKanban />}
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