import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../lib/formatPrice';
import ModulePaiementStripe from './ModulePaiementStripe';
import { supabase } from '../lib/supabaseClient';

export default function Cart() {
  const { cart, cartTotal, removeFromCart, clearCart } = useCart();
  const { isLoggedIn, user } = useAuth();
  
  const [showPaymentModule, setShowPaymentModule] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Condition 0 € (Gratuit)
  const isFree = Number(cartTotal) === 0;

  // Fonction appelée lors de la validation (paiement ou téléchargement direct si 0€)
  const handlePaymentSuccess = async () => {
    setIsProcessing(true);
    try {
      // 1. Enregistrement de la commande cumulée dans Supabase (table orders)
      const { error } = await supabase.from('orders').insert([
        {
          user_id: user?.id || null,
          user_email: user?.email || 'client@boke-one.fr',
          items: cart,
          total: cartTotal,
          payment_method: isFree ? 'Gratuit (Téléchargement direct)' : 'Stripe In-App (Mode Sécurisé)',
          status: 'paid',
          created_at: new Date().toISOString()
        }
      ]);

      if (error) throw error;

      // 2. Vider le panier et afficher la confirmation sur la même page
      clearCart();
      setOrderSuccess(true);
    } catch (err) {
      alert(`Erreur lors de l'enregistrement de la commande : ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Écran de confirmation de paiement ou de téléchargement direct (Restant sur la même page)
  if (orderSuccess) {
    return (
      <div className="bg-neutral-950 min-h-[70vh] flex items-center justify-center p-6 text-neutral-100 font-sans">
        <div className="max-w-md w-full bg-neutral-900/60 border border-emerald-500/30 p-8 rounded-2xl text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400 text-3xl font-bold">
            ✓
          </div>
          <h2 className="text-2xl font-black text-amber-400">
            {isFree ? "Téléchargement Prêt !" : "Commande Confirmée !"}
          </h2>
          <p className="text-xs text-neutral-400 leading-relaxed">
            {isFree 
              ? "Vos fichiers 100% gratuits ont été débloqués et enregistrés sur votre compte avec succès."
              : "Votre paiement a été validé avec succès. Les prestations ont été ajoutées à votre compte et un récapitulatif a été transmis."}
          </p>
          <button
            onClick={() => {
              setOrderSuccess(false);
              setShowPaymentModule(false);
            }}
            className="w-full mt-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold py-3 rounded-xl text-xs transition cursor-pointer"
          >
            Retourner à l'accueil / Réservations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-950 min-h-screen py-10 px-4 font-sans text-neutral-200">
      <div className="mx-auto max-w-5xl space-y-8">
        
        {/* Titre principal */}
        <div className="border-b border-neutral-800 pb-4">
          <h1 className="text-3xl font-black text-white">Votre Panier & Réservations</h1>
          <p className="text-xs text-neutral-500 mt-1">
            Gérez vos sélections de créateurs et procédez au paiement cumulé en toute sécurité.
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="bg-neutral-900/30 border border-neutral-900 rounded-2xl p-12 text-center space-y-4">
            <p className="text-neutral-400 text-sm">Votre panier est actuellement vide.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Colonne Gauche : Liste des produits cumulés */}
            <div className="lg:col-span-7 space-y-4">
              {cart.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-neutral-900/40 border border-neutral-800/80 p-5 rounded-2xl flex justify-between items-center hover:border-neutral-700 transition"
                >
                  <div className="space-y-1">
                    <h3 className="font-bold text-white text-base">
                      {item.display_name || item.name || item.titre}
                    </h3>
                    <p className="text-xs text-amber-400 font-medium">
                      {(item.starting_price || item.price || item.prix) === 0 || !(item.starting_price || item.price || item.prix) 
                        ? "GRATUIT" 
                        : (formatPrice ? formatPrice(item.starting_price || item.price || item.prix) : `${item.starting_price || item.price || item.prix} €`)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-xs text-red-400 hover:text-red-300 font-semibold px-3 py-1 rounded-lg hover:bg-red-500/10 transition cursor-pointer"
                  >
                    Retirer
                  </button>
                </div>
              ))}
            </div>

            {/* Colonne Droite : Total & Bloc de Paiement ou Téléchargement Direct */}
            <div className="lg:col-span-5 bg-neutral-900/40 border border-neutral-800 p-6 rounded-2xl space-y-6">
              <div>
                <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-wider">Total</h2>
                <div className="text-3xl font-black text-amber-400 mt-2">
                  {cartTotal === 0 ? "0,00 € (GRATUIT)" : (formatPrice ? formatPrice(cartTotal) : `${cartTotal} €`)}
                </div>
              </div>

              {/* SI C'EST GRATUIT (0 €) : PAS DE STRIPE, TÉLÉCHARGEMENT DIRECT INSTANTANÉ */}
              {isFree ? (
                <div className="space-y-3 pt-2">
                  <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl text-center">
                    <p className="text-xs font-bold text-emerald-400">✨ Contenu 100% Gratuit</p>
                    <p className="text-[11px] text-neutral-300 mt-1">Aucune carte bancaire requise. Téléchargez immédiatement vos fichiers.</p>
                  </div>

                  <button
                    type="button"
                    onClick={handlePaymentSuccess}
                    disabled={isProcessing}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black py-4 rounded-xl text-xs uppercase tracking-wider transition shadow-lg cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>📥</span> {isProcessing ? "Traitement..." : "Télécharger directement sans carte"}
                  </button>
                </div>
              ) : (
                /* SI PAYANT : MODULE STRIPE IN-APP CLASSIQUE */
                <>
                  {!showPaymentModule ? (
                    <div className="space-y-3">
                      <button
                        onClick={() => setShowPaymentModule(true)}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                      >
                        <span>💳</span> Payer par Stripe
                      </button>
                      <p className="text-[11px] text-neutral-500 text-center">
                        Paiement sécurisé In-App sans redirection extérieure.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 pt-2 border-t border-neutral-800">
                      {isLoggedIn ? (
                        <ModulePaiementStripe 
                          totalAmount={cartTotal} 
                          onSuccess={handlePaymentSuccess} 
                        />
                      ) : (
                        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-center space-y-2">
                          <p className="text-xs font-bold text-amber-400">
                            ⚠️ Connexion requise
                          </p>
                          <p className="text-[11px] text-neutral-400">
                            Veuillez vous connecter à votre compte pour valider le paiement In-App et associer votre commande.
                          </p>
                        </div>
                      )}

                      <button
                        onClick={() => setShowPaymentModule(false)}
                        className="w-full text-xs text-neutral-500 hover:text-neutral-300 underline text-center block pt-2 cursor-pointer"
                      >
                        ← Modifier la sélection du panier
                      </button>
                    </div>
                  )}
                </>
              )}

            </div>

          </div>
        )}

      </div>
    </div>
  );
}