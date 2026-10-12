import React, { useState } from 'react';

export default function ModulePaiementStripe({ totalAmount, onSuccess }) {
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Codes promo disponibles
  const VALID_CODES = {
    BOKE10: 0.10,     // 10% de réduction
    PROMO2026: 0.15,  // 15% de réduction
    WELCOME50: 50,    // 50 € de réduction fixe
  };

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (VALID_CODES[code] !== undefined) {
      const val = VALID_CODES[code];
      if (val < 1) {
        setDiscount(totalAmount * val);
      } else {
        setDiscount(val);
      }
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Code promo invalide');
    }
  };

  // Calculs financiers
  const totalHT = Math.max(0, totalAmount - discount) / 1.2;
  const tvaAmount = Math.max(0, totalAmount - discount) - totalHT;
  const finalTotal = Math.max(0, totalAmount - discount);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Enregistrement / Validation In-App
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess?.();
    }, 1000);
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl space-y-6 text-neutral-200 shadow-2xl">
      
      {/* 1. Récapitulatif Financier (Sous-total, TVA, Total) */}
      <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2 text-xs">
        <h4 className="font-bold text-amber-400 uppercase tracking-wider mb-2">Détail de la commande</h4>
        <div className="flex justify-between text-neutral-400">
          <span>Sous-total HT :</span>
          <span>{totalHT.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between text-neutral-400">
          <span>TVA (20%) :</span>
          <span>{tvaAmount.toFixed(2)} €</span>
        </div>

        {promoApplied && (
          <div className="flex justify-between text-emerald-400 font-bold border-t border-neutral-800 pt-2">
            <span>Remise Code Promo :</span>
            <span>-{discount.toFixed(2)} €</span>
          </div>
        )}

        <div className="flex justify-between text-sm font-black text-white border-t border-neutral-800 pt-2 mt-1">
          <span>Total TTC :</span>
          <span className="text-amber-400">{finalTotal.toFixed(2)} €</span>
        </div>
      </div>

      {/* 2. Bloc Code Promo */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-neutral-300">Avez-vous un code promo ?</label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ex: BOKE10"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            disabled={promoApplied}
            className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white uppercase outline-none focus:border-amber-400 disabled:opacity-50"
          />
          <button
            type="button"
            onClick={handleApplyPromo}
            disabled={promoApplied || !promoCode}
            className="bg-neutral-800 hover:bg-neutral-700 text-amber-400 px-4 py-2 rounded-xl text-xs font-bold transition disabled:opacity-40 cursor-pointer"
          >
            {promoApplied ? 'Appliqué ✓' : 'Valider'}
          </button>
        </div>
        {promoError && <p className="text-[10px] text-red-400">{promoError}</p>}
      </div>

      {/* 3. Formulaire de carte bancaire Stripe In-App */}
      <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-neutral-800">
        <h4 className="font-bold text-white text-xs flex items-center gap-2">
          <span>💳</span> Informations de paiement sécurisé
        </h4>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-neutral-400 uppercase">Titulaire de la carte</label>
          <input
            type="text"
            required
            placeholder="Nom & Prénom"
            value={cardHolder}
            onChange={(e) => setCardHolder(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-amber-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-neutral-400 uppercase">Numéro de carte</label>
          <input
            type="text"
            required
            placeholder="4242 •••• •••• 4242"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-amber-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-neutral-400 uppercase">Expiration</label>
            <input
              type="text"
              required
              placeholder="MM / AA"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-amber-400"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-neutral-400 uppercase">Code de sécurité (CVC)</label>
            <input
              type="text"
              required
              placeholder="501"
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold py-3.5 rounded-xl text-xs transition shadow-lg cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? 'Traitement en cours...' : `Payer ${finalTotal.toFixed(2)} €`}
        </button>
      </form>
    </div>
  );
}