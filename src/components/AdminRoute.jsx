import React, { useState, useEffect } from react;
import { Navigate } from react-router-dom;
import { useAuth } from ..contextAuthContext;
import { supabase } from ..supabaseClient;

export default function AdminRoute({ children }) {
  const { user, loading authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() = {
     Si l'authentification est encore en cours, on attend
    if (authLoading) return;

     Si aucun utilisateur n'est connecté, accès refusé immédiatement
    if (!user) {
      setIsAdmin(false);
      setCheckingRole(false);
      return;
    }

     Sécurité supplémentaire  vérification stricte de l'e-mail du compte de service
    if (user.email !== kultordi@gmail.com) {
      setIsAdmin(false);
      setCheckingRole(false);
      return;
    }

     Double vérification côté base de données sur la table profiles
    const verifyAdminRole = async () = {
      const { data, error } = await supabase
        .from(profiles)
        .select(role)
        .eq(id, user.id)
        .single();

      if (!error && data.role === admin) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      setCheckingRole(false);
    };

    verifyAdminRole();
  }, [user, authLoading]);

   Écran d'attente pendant la double vérification de sécurité
  if (authLoading  checkingRole) {
    return (
      div className=min-h-screen bg-neutral-950 flex items-center justify-center text-xs text-neutral-500 font-mono
        VÉRIFICATION DES ACCÈS SÉCURISÉS...
      div
    );
  }

   🔒 Redirection immédiate si les conditions ne sont pas remplies
  return isAdmin  children  Navigate to= replace ;
}
