import React, { useState } from 'react';

export default function StripeCheckoutModal({ isOpen, onClose, itemName, amount }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 max-w-md w-full text-white shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-white">✕</button>
        
        <h3 className="text-lg font-bold mb-1">Paiement Sécurisé Boké One</h3>
        <p className="text-xs text-neutral-400 mb-6">{itemName} — <strong className="text-amber-400">{amount} €</strong></p>

        {success ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">✓</div>
            <h4 className="font-bold text-base mb-1">Paiement validé avec succès !</h4>
            <p className="text-xs text-neutral-400 mb-4">Votre facture et vos accès ont été mis à jour.</p>
            <button onClick={onClose} className="w-full bg-neutral-800 hover:bg-neutral-700 py-2.5 rounded-xl font-bold text-xs">Fermer</button>
          </div>
        ) : (
          <form onSubmit={handlePayment} className="space-y-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3">
              <label className="block text-[10px] text-neutral-400 uppercase font-bold mb-1">Informations Carte (Stripe Elements)</label>
              <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-sm text-neutral-300">
                Card Element (Numéro, Expire, CVC)
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black py-3 rounded-xl text-xs uppercase tracking-wider transition"
            >
              {loading ? 'Traitement en cours...' : `Payer ${amount} €`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
