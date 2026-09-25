import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function PremiumPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Remplace ceci par ton e-mail exact avec lequel tu te connectes sur le site
  const ADMIN_EMAIL = "yiyejew339@kingdais.com"; 

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    }
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div style={{ color: '#fff', textAlign: 'center', padding: '50px' }}>Chargement de l'espace exclusif...</div>;
  }

  // Vérifie si l'utilisateur est connecté ET s'il est soit ton e-mail admin, soit marqué comme fondateur
  const isFounder = user && (user.email === ADMIN_EMAIL || user.user_metadata?.is_founder === true);

  if (!user) {
    return (
      <div style={{ maxWidth: '600px', margin: '50px auto', padding: '30px', background: '#111827', borderRadius: '12px', border: '1px solid #374151', textAlign: 'center', color: '#fff' }}>
        <h2 style={{ color: '#38bdf8', marginBottom: '15px' }}>💎 Espace Fondateurs & Pro Boke One</h2>
        <p style={{ color: '#9ca3af', marginBottom: '20px' }}>Cet espace est réservé aux membres connectés. Connecte-toi via l'onglet Forum (même compte) pour y accéder.</p>
      </div>
    );
  }

  if (!isFounder) {
    return (
      <div style={{ maxWidth: '600px', margin: '50px auto', padding: '30px', background: '#111827', borderRadius: '12px', border: '1px solid #374151', textAlign: 'center', color: '#fff' }}>
        <h2 style={{ color: '#facc15', marginBottom: '15px' }}>🔒 Espace réservé</h2>
        <p style={{ color: '#9ca3af', lineHeight: '1.6' }}>
          Connecté en tant que : <strong style={{ color: '#fff' }}>{user.email}</strong>
        </p>
        <p style={{ color: '#9ca3af', marginTop: '10px' }}>
          Cet espace est réservé aux membres Fondateurs et aux comptes Pro. Si tu fais partie de nos premiers membres, contacte-nous pour activer ton statut Fondateur.
        </p>
      </div>
    );
  }

  // Si l'utilisateur est bien reconnu comme Fondateur / Admin
  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '30px', background: '#111827', borderRadius: '12px', border: '1px solid #38bdf8', color: '#fff' }}>
      <h2 style={{ color: '#38bdf8', marginBottom: '10px' }}>💎 Tableau de Bord Fondateur — Boke One</h2>
      <p style={{ color: '#10b981', marginBottom: '30px' }}>Statut actif : <strong>Membre Fondateur / VIP (Accès illimité)</strong></p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: '#1f2937', padding: '20px', borderRadius: '8px', border: '1px solid #374151' }}>
          <h4 style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '5px' }}>Visibilité de la mini-page</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#38bdf8' }}>1 240 vues</p>
        </div>
        <div style={{ background: '#1f2937', padding: '20px', borderRadius: '8px', border: '1px solid #374151' }}>
          <h4 style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '5px' }}>Montant généré (Ce mois)</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>450,00 €</p>
        </div>
      </div>

      <div style={{ background: '#1f2937', padding: '20px', borderRadius: '8px', border: '1px solid #374151' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '10px', color: '#fff' }}>⚙️ Espace Dédié / Mini-Page Personnelle</h3>
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>C'est ici que tu peux configurer tes liens, ta bio de créateur de niche et tes préférences de mise en relation directe.</p>
      </div>
    </div>
  );
}