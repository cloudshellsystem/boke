import React from "react";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/formatPrice";
import { Link } from "react-router-dom";

export default function Cart() {
  const { cart, removeFromCart, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-neutral-950 text-neutral-200 p-6 text-center">
        <div className="max-w-md bg-neutral-900/80 border border-neutral-800 p-8 rounded-3xl shadow-xl space-y-4">
          <div className="text-4xl">🛒</div>
          <h2 className="text-2xl font-bold text-amber-400">Votre panier est vide</h2>
          
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Vous n'avez sélectionné ni prestataires ni actifs du stock national pour le moment. 
            Sur <strong className="text-amber-400">Boké One</strong>, vous pouvez regrouper des réservations professionnelles et l'achat de licences d'images/vidéos exclusives.
          </p>

          <div className="border-t border-neutral-800 pt-4 text-left space-y-2">
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">💡 Comment acheter sur Boké One ?</p>
            <ul className="text-xs text-neutral-400 space-y-1.5 list-disc list-inside">
              <li>Posséder un <strong className="text-neutral-200">compte membre validé</strong> sur la plateforme.</li>
              <li>Utiliser une solution de paiement sécurisée compatible (ex: passerelle <strong className="text-neutral-200">Stripe</strong> pour cartes bancaires ou paiements mobiles pris en charge).</li>
              <li>Valider le panier pour recevoir instantanément vos liens de téléchargement ou confirmer la mission pro.</li>
            </ul>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/" className="rounded-xl bg-amber-500 px-5 py-2.5 font-bold text-neutral-950 hover:bg-amber-400 transition text-xs">
              Explorer le Stock
            </Link>
            <Link to="/creators" className="rounded-xl bg-neutral-800 border border-neutral-700 px-5 py-2.5 font-bold text-neutral-200 hover:bg-neutral-700 transition text-xs">
              Découvrir les Créateurs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl bg-neutral-950 p-6 text-neutral-200 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-amber-400">Votre Sélection ({cart.length})</h2>
          <p className="text-xs text-neutral-400 mt-1">Gestion de vos actifs visuels, licences et prestations professionnelles.</p>
        </div>
        <div className="text-[11px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1.5 rounded-xl font-medium self-start sm:self-auto">
          🔒 Paiement sécurisé (Stripe / CB)
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {cart.map((item) => {
          // Gestion universelle des propriétés d'images, de titres (stock ou créateurs)
          const imageSrc = item.avatar || item.avatar_url || item.url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150";
          const itemName = item.name || item.display_name || item.title || "Créateur / Ressource";
          const itemPrice = item.starting_price ? formatPrice(item.starting_price) : (item.price || "Sur devis");

          return (
            <div key={item.id} className="flex items-center justify-between rounded-xl border border-amber-500/10 bg-neutral-900 p-4 shadow-md gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <img 
                  src={imageSrc} 
                  alt={itemName} 
                  className="h-16 w-16 rounded-xl sm:rounded-full border border-amber-500/30 object-cover shrink-0" 
                />
                <div className="min-w-0">
                  <span className="text-[10px] bg-neutral-950 text-amber-400 px-2 py-0.5 rounded border border-neutral-800 font-bold uppercase">
                    {item.type || item.specialty || "Élément"}
                  </span>
                  <h3 className="font-bold text-neutral-100 text-base truncate mt-1">{itemName}</h3>
                  <p className="text-xs text-neutral-400 truncate">{item.photographe ? `Par ${item.photographe}` : (item.city || "")}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span className="font-bold text-amber-400 text-sm sm:text-base">{itemPrice}</span>
                <button onClick={() => removeFromCart(item.id)} className="text-xs font-semibold text-red-400 hover:text-red-300 transition bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg">
                  Retirer
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col items-end border-t border-neutral-800 pt-6 space-y-4">
        <div className="text-right">
          <span className="text-neutral-400 mr-2 text-sm sm:text-base">Estimation totale :</span>
          <span className="text-2xl sm:text-3xl font-black text-amber-400">{formatPrice(cartTotal)}</span>
        </div>

        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
          <Link to="/checkout" className="rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 px-8 py-3.5 font-bold text-neutral-950 shadow-lg shadow-amber-500/10 hover:brightness-110 transition text-sm text-center">
            Procéder au paiement sécurisé (Stripe)
          </Link>
        </div>
      </div>
    </div>
  );
}