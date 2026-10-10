import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { isLoggedIn } = useAuth();
  
  // Nettoyage immédiat au chargement si non connecté
  const [cart, setCart] = useState(() => {
    if (!isLoggedIn) {
      localStorage.removeItem("bokeone_cart");
      return [];
    }
    const saved = localStorage.getItem("bokeone_cart");
    return saved ? JSON.parse(saved) : [];
  });

  // Forcer le panier à vide et purger le storage si non connecté
  useEffect(() => {
    if (!isLoggedIn) {
      setCart([]);
      localStorage.removeItem("bokeone_cart");
    }
  }, [isLoggedIn]);

  // Sauvegarde uniquement si connecté
  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem("bokeone_cart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("bokeone_cart");
    }
  }, [cart, isLoggedIn]);

  const addToCart = (item) => {
    if (!isLoggedIn) return; // Bloqué si non connecté
    setCart((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("bokeone_cart");
  };

  const cartTotal = cart.reduce((acc, item) => {
    const price = item.starting_price || parseFloat(item.price) || 0;
    return acc + price;
  }, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);