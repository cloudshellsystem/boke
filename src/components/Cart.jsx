import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function Cart({ onRequireLogin }) {
  const { cart, removeFromCart, cartTotal } = useCart();
  const { isLoggedIn } = useAuth();
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");

  // Paiement : on envoie UNIQUEMENT les identifiants des prestataires. Le prix est recalculé
  // côté serveur (jamais celui du navigateur, qui peut être modifié) par la fonction
  // `create-checkout-session`, qui renvoie l'URL de paiement hébergée par Stripe.
  const handleCheckoutStripe = async () => {
    if (!isLoggedIn) {
      onRequireLogin?.();
      return;
    }
    if (paying || cart.length === 0) return;

    setPaying(true);
    setPayError("");
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout-session", {
        body: { creator_ids: cart.map((item) => item.id), lang },
      });
      if (error) throw error;

      const url = data && data.url;
      const host = url ? new URL(url).hostname : "";
      if (!url || !host.endsWith("stripe.com")) throw new Error("url_de_paiement_invalide");

      window.location.assign(url);
    } catch (err) {
      console.error("Paiement indisponible :", err?.message || err);
      setPayError(
        lang === "en"
          ? "Payment is temporarily unavailable. Nothing has been charged. Please try again later."
          : "Le paiement est momentanément indisponible. Rien n'a été débité. Réessayez plus tard."
      );
      setPaying(false);
    }
  };

  return (
    <div className="bg-neutral-950 min-h-screen text-neutral-200 p-6 sm:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="border-b border-neutral-800 pb-4 flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {lang === "en" ? "Your Booking & Cart" : "Votre Panier & Réservations"}
          </h1>
        </div>
        {cart.length === 0 ? (
          <div className="text-center py-16 space-y-4 bg-neutral-900 border border-neutral-800 rounded-3xl">
            <p className="text-neutral-400 text-sm">Panier vide.</p>
            <button onClick={() => navigate("/creators")} className="bg-amber-500 text-neutral-950 px-6 py-3 rounded-xl font-bold text-xs cursor-pointer">
              Explorer les créateurs
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">{item.name}</h3>
                    <p className="text-xs text-amber-400">{item.starting_price} €</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-400 text-xs font-bold cursor-pointer">Retirer</button>
                </div>
              ))}
            </div>
            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl space-y-6 h-fit">
              <h3 className="text-base font-bold text-white border-b border-neutral-800 pb-3">Total</h3>
              <span className="text-xl font-black text-amber-400">{cartTotal} €</span>
              {payError && (
                <p role="alert" className="text-xs text-red-400 font-bold">{payError}</p>
              )}
              <button
                onClick={handleCheckoutStripe}
                disabled={paying}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl text-xs cursor-pointer"
              >
                {paying ? "Redirection…" : "💳 Payer par Stripe"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
