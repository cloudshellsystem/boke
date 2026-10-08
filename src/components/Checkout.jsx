import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { formatPrice } from "../lib/formatPrice";
import ModulePaiementStripe from "./ModulePaiementStripe";

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { isLoggedIn } = useAuth();
  const [success, setSuccess] = useState(false);

  const handleOrderSuccess = async () => {
    try {
      const { error } = await supabase.from("orders").insert({
        items: cart,
        total: cartTotal,
        payment_method: "Stripe Mode Test (€)",
        status: "paid_simulated"
      });

      if (error) throw error;
      clearCart();
      setSuccess(true);
    } catch (err) {
      alert(`Erreur d'enregistrement : ${err.message}`);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center bg-neutral-950 text-neutral-200 text-center p-6 font-sans">
        <div className="mb-4 rounded-full bg-emerald-500/10 p-4 text-emerald-400 text-4xl">✓</div>
        <h2 className="text-3xl font-bold text-amber-400 mb-2">Paiement validé !</h2>
        <p className="text-neutral-400 max-w-md">Votre transaction de test Stripe a réussi. Vos prestations ont été enregistrées.</p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-950 min-h-screen py-10 px-4 font-sans text-neutral-200">
      <div className="mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border border-neutral-900 bg-neutral-900/30 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-amber-400 mb-4">Résumé du Checkout</h2>
            <div className="space-y-3 divide-y divide-neutral-900">
              {cart.map((item) => (
                <div key={item.id} className="pt-3 flex justify-between text-sm">
                  <div>
                    <p className="font-semibold text-neutral-100">{item.display_name}</p>
                    <p className="text-xs text-neutral-500">{item.specialty}</p>
                  </div>
                  <span className="font-bold text-amber-400">{formatPrice(item.starting_price)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-neutral-800 pt-4 mt-6">
            <div className="flex justify-between items-baseline">
              <span className="text-neutral-400 text-sm">Total Final :</span>
              <span className="text-2xl font-black text-amber-400">{formatPrice(cartTotal)}</span>
            </div>
          </div>
        </div>

        <div className="border border-neutral-900 bg-neutral-900/30 p-6 rounded-2xl flex flex-col justify-center">
          {isLoggedIn ? (
            <ModulePaiementStripe totalAmount={cartTotal} onSuccess={handleOrderSuccess} />
          ) : (
            <div className="text-center p-6 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 text-sm font-semibold">
              ⚠️ Sécurité : Vous devez être connecté pour procéder au paiement Stripe.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}