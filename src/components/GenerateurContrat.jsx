// src/components/GenerateurContrat.jsx
import React, { useState } from 'react';

export default function GenerateurContrat({ userProfile }) {
  const [clientNom, setClientNom] = useState("Entreprise Innovante SAS");
  const [montantPrestation, setMontantPrestation] = useState(2400);
  const [typePack, setTypePack] = useState("Pack Creator Illimité");
  const [genere, setGenere] = useState(false);

  const handleGenerer = (e) => {
    e.preventDefault();
    setGenere(true);
  };

  return (
    <div className="bg-[#0e1424] border border-slate-800 p-6 rounded-2xl shadow-2xl space-y-6 font-sans text-slate-100">
      <div>
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <span>📜</span> Générateur Automatisé de Contrats & Cession de Droits
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Édition aux normes de la convention collective de l'audiovisuel, incluant la marge d'agence et les frais Guso.
        </p>
      </div>

      <form onSubmit={handleGenerer} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
        <div>
          <label className="block text-xs font-bold text-slate-400 mb-1">Nom du Client / Prospect</label>
          <input 
            type="text" 
            value={clientNom} 
            onChange={(e) => setClientNom(e.target.value)}
            className="w-full bg-[#070b12] border border-slate-700 rounded-lg p-2.5 text-xs text-white" 
            required 
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 mb-1">Type de Pack / Prestation</label>
          <select 
            value={typePack} 
            onChange={(e) => setTypePack(e.target.value)}
            className="w-full bg-[#070b12] border border-slate-700 rounded-lg p-2.5 text-xs text-white"
          >
            <option>Pack Creator Standard</option>
            <option>Pack Creator Illimité</option>
            <option>Abonnement Récurrent 12k</option>
            <option>Sur-mesure Studio</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 mb-1">Montant Total HT (€)</label>
          <input 
            type="number" 
            value={montantPrestation} 
            onChange={(e) => setMontantPrestation(e.target.value)}
            className="w-full bg-[#070b12] border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono" 
            required 
          />
        </div>
        <div className="md:col-span-3 flex justify-end">
          <button type="submit" className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-lg cursor-pointer transition-colors shadow-lg">
            Générer le Contrat Juridique
          </button>
        </div>
      </form>

      {genere && (
        <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl space-y-4 animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <span className="text-xs font-mono text-amber-400">CONTRAT DE PRESTATION DE SERVICES #BK-2026-89</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold">PRÊT POUR SIGNATURE</span>
          </div>

          <div className="text-xs text-slate-300 space-y-3 leading-relaxed font-light">
            <p><strong>Entre les soussignés :</strong><br />
            La société BOKE ONE, représentée par {userProfile?.nom || "l'administrateur"}, ci-après dénommé « Le Prestataire », d'une part,</p>
            
            <p>Et la société <strong>{clientNom}</strong>, ci-après dénommé « Le Client », d'autre part.</p>

            <p><strong>Article 1 — Objet du contrat :</strong><br />
            Réalisation des prestations audiovisuelles dans le cadre de l'offre <em>{typePack}</em>, incluant la captation, le montage et la cession des droits d'exploitation associés.</p>

            <p><strong>Article 2 — Conditions financières :</strong><br />
            Le montant total de la prestation s'élève à la somme de <strong>{montantPrestation} € HT</strong> (TVA non applicable, art. 293 B du CGI ou taux en vigueur). Un acompte de 30% est exigible à la signature.</p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button onClick={() => alert("Contrat téléchargé au format PDF.")} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg cursor-pointer">
              📥 Télécharger en PDF
            </button>
            <button onClick={() => alert("Lien de signature électronique envoyé au client par SMS/Email.")} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg cursor-pointer shadow">
              ✍️ Envoyer pour Signature Électronique
            </button>
          </div>
        </div>
      )}
    </div>
  );
}