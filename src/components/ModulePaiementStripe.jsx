// src/components/ModulePaiementStripe.jsx
import React, { useState } from 'react';

export default function ModulePaiementStripe() {
  const [statutPaiement, setStatutPaiement] = useState("en_attente"); // en_attente, valide

  const handleSimulerPaiement = () => {
    // Simulation d'un appel à l'API Stripe / Checkout Session
    setTimeout(() => {
      setStatutPaiement("valide");
    }, 1000);
  };

  return (
    <div className="bg-[#0e1424] border border-slate-800 p-6 rounded-2xl shadow-2xl space-y-6 font-sans text-slate-100">
      <div>
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <span>💳</span> Passerelle de Paiement Sécurisée (Acompte / Abonnement)
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Encaissez vos acomptes instantanément par carte bancaire ou prélèvement SEPA via Stripe.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Détails du panier */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-amber-400 border-b border-slate-800 pb-2">Résumé de la Transaction</h3>
          <div className="flex justify-between text-xs text-slate-300">
            <span>Acompte Prestation (30%)</span>
            <span className="font-mono font-bold text-white">720,00 € HT</span>
          </div>
          <div className="flex justify-between text-xs text-slate-300">
            <span>Frais de gestion plateforme</span>
            <span className="font-mono font-bold text-emerald-400">Inclus</span>
          </div>
          <div className="flex justify-between text-xs text-slate-300 pt-2 border-t border-slate-900 font-bold">
            <span>Total à régler immédiatement</span>
            <span className="font-mono text-amber-400 text-sm">864,00 € TTC</span>
          </div>
        </div>

        {/* Formulaire Carte Bancaire / Stripe UI */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white">Informations de Paiement CB</h3>
            {statutPaiement === "en_attente" ? (
              <div className="space-y-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">Numéro de Carte</label>
                  <input type="text" placeholder="4242 •••• •••• 4242" className="w-full bg-[#070b12] border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono" disabled />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" placeholder="MM / AA" className="bg-[#070b12] border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono" disabled />
                  <input type="text" placeholder="CVC" className="bg-[#070b12] border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono" disabled />
                </div>
              </div>
            ) : (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl text-center space-y-2">
                <span className="text-2xl">✅</span>
                <p className="text-xs font-bold text-emerald-400">Paiement validé avec succès !</p>
                <p className="text-[10px] text-slate-400">La facture acquittée a été transmise au client et au CRM.</p>
              </div>
            )}
          </div>

          {statutPaiement === "en_attente" && (
            <button 
              onClick={handleSimulerPaiement}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-lg cursor-pointer transition-colors shadow-lg"
            >
              Payer l'Acompte (864,00 €)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}