// src/hooks/useSelectionCart.js
import { useState, useEffect } from 'react';

const CART_STORAGE_KEY = 'boke_one_selection_cart';

export function useSelectionCart() {
  const [items, setItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Erreur de lecture du panier :", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Erreur d'enregistrement du panier :", error);
    }
  }, [items]);

  // Correspond à `cart.add(item)` dans Gallery.jsx
  const add = (item) => {
    setItems((prevItems) => {
      const exists = prevItems.some((i) => i.id === item.id);
      if (exists) return prevItems;
      return [...prevItems, item];
    });
  };

  // Correspond à `cart.remove(id)` dans Gallery.jsx
  const remove = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const clear = () => {
    setItems([]);
  };

  // Optionnel : synchronisation optionnelle avec Supabase si l'utilisateur est connecté
  const syncToAccount = async (userId) => {
    try {
      // Si vous souhaitez stocker aussi en base de données Supabase, vous pouvez le faire ici.
      // Pour l'instant, on valide simplement le succès local :
      return { ok: true };
    } catch (err) {
      console.error("Erreur sync:", err);
      return { ok: false };
    }
  };

  return {
    items,
    count: items.length,
    add,
    remove,
    clear,
    syncToAccount,
  };
}