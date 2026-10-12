import React, { useState } from 'react';
import { formatPrice } from '../lib/formatPrice';

export default function ModulePaiementStripe({ totalAmount, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [cardData, setCardData] = useState({
    name: '',
    number: '',
    expiry: '',
    cvc: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePay = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulation de la validation du paiement en mode test
    setTimeout(() => {
      setLoading(false);
      if (onSuccess) {
        onSuccess(); // Déclenche l'enregistrement Supabase et clearCart() dans Checkout.jsx
      }
    }, 1200);
  };

  return (
    <div className="bg-[#0e1424] border border-slate-800 p-6 rounded-2xl shadow-2xl space-y-6 font-sans text-slate-100">
      <div>
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <span>💳</span> Paiement Sécurisé Boké One
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Règlement instantané et sécurisé par carte bancaire.
        </p>
      </div>

      <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-amber-400 border-b border-slate-800 pb-2">
          Récapitulatif à régler
        </h3>
        <div className="flex justify-between text-xs text-slate-300">
          <span>Montant Total Panier</span>
          <span className="font-mono font-bold text-white">
            {formatPrice ? formatPrice(totalAmount) : `${totalAmount} €`}
          </span>
        </div>
        <div className="flex justify-between text-xs text-slate-300">
          <span>Frais de réservation</span>
          <span className="font-mono font-bold text-emerald-400">Inclus</span>
        </div>
        <div className="flex justify-between text-xs text-slate-300 pt-2 border-t border-slate-900 font-bold">
          <span>Total Débité</span>
          <span className="font-mono text-amber-400 text-sm">
            {formatPrice ? formatPrice(totalAmount) : `${totalAmount} €`}
          </span>
        </div>
      </div>

      <form onSubmit={handlePay} className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white">Informations de Carte Bancaire</h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1">Titulaire de la carte</label>
            <input 
              type="text" 
              name="name" 
              required
              placeholder="Jean Dupont" 
              value={cardData.name}
              onChange={handleChange}
              className="w-full bg-[#070b12] border border-slate-700 rounded-lg p-2.5 text-xs text-white font-sans focus:border-amber-400 outline-none" 
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1">Numéro de Carte (Test)</label>
            <input 
              type="text" 
              name="number" 
              required
              placeholder="4242 •••• •••• 4242" 
              value={cardData.number}
              onChange={handleChange}
              className="w-full bg-[#070b12] border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono focus:border-amber-400 outline-none" 
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1">Expiration</label>
              <input 
                type="text" 
                name="expiry" 
                required
                placeholder="MM / AA" 
                value={cardData.expiry}
                onChange={handleChange}
                className="bg-[#070b12] border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono w-full focus:border-amber-400 outline-none" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1">CVC</label>
              <input 
                type="text" 
                name="cvc" 
                required
                placeholder="123" 
                value={cardData.cvc}
                onChange={handleChange}
                className="bg-[#070b12] border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono w-full focus:border-amber-400 outline-none" 
              />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-lg cursor-pointer transition-colors shadow-lg mt-2"
        >
          {loading ? "Validation de la transaction..." : `Payer ${formatPrice ? formatPrice(totalAmount) : `${totalAmount} €`}`}
        </button>
      </form>
    </div>
  );
}