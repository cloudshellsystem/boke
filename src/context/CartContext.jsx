import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

const storageKey = (userId) => `bokeone_cart_${userId}`;

function readCart(userId) {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return []; // stockage indisponible ou contenu corrompu
  }
}

// On ne garde dans le panier que le strict nécessaire. Le prix stocké ici est INDICATIF :
// le montant réellement facturé doit être recalculé par le serveur au moment du paiement.
const toCartItem = (creator) => ({
  id: creator.id,
  name: creator.name,
  starting_price: Number(creator.starting_price) || 0,
  avatar: creator.avatar || null,
});

export function CartProvider({ children }) {
  const { user, isLoggedIn, loading } = useAuth();
  const userId = user?.id ?? null;

  const [cart, setCart] = useState([]);
  const [hydratedFor, setHydratedFor] = useState(null); // id de l'utilisateur dont le panier est chargé

  // 1) Chargement du panier de l'utilisateur, UNE FOIS la session connue.
  //    (Bug corrigé : avant, `isLoggedIn` valait false pendant que la session se restaurait,
  //     donc le panier était effacé à chaque rafraîchissement de la page.)
  useEffect(() => {
    if (loading) return; // session en cours de restauration : on ne touche à rien
    if (!userId) {
      setCart([]);
      setHydratedFor(null);
      return;
    }
    setCart(readCart(userId));
    setHydratedFor(userId);
  }, [loading, userId]);

  // 2) Sauvegarde — seulement après le chargement, pour ne jamais écraser avec un panier vide.
  useEffect(() => {
    if (!userId || hydratedFor !== userId) return;
    try {
      localStorage.setItem(storageKey(userId), JSON.stringify(cart));
    } catch {
      /* le panier reste utilisable pour la session en cours */
    }
  }, [cart, userId, hydratedFor]);

  const ready = Boolean(isLoggedIn && userId && hydratedFor === userId);
  const safeCart = ready ? cart : [];

  const addToCart = useCallback(
    (creator) => {
      if (!ready) return false; // panier réservé aux abonnés connectés
      setCart((prev) => (prev.some((i) => i.id === creator.id) ? prev : [...prev, toCartItem(creator)]));
      return true;
    },
    [ready]
  );

  const removeFromCart = useCallback((id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    if (userId) {
      try {
        localStorage.removeItem(storageKey(userId));
      } catch {
        /* ignoré */
      }
    }
  }, [userId]);

  const cartTotal = useMemo(
    () => Math.round(safeCart.reduce((acc, item) => acc + (Number(item.starting_price) || 0), 0) * 100) / 100,
    [safeCart]
  );

  const value = useMemo(
    () => ({ cart: safeCart, cartCount: safeCart.length, cartTotal, addToCart, removeFromCart, clearCart }),
    [safeCart, cartTotal, addToCart, removeFromCart, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart doit être utilisé dans un <CartProvider>");
  return ctx;
}
