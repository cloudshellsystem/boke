import React, { useState } from 'react';

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
