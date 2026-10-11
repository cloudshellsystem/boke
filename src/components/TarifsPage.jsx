import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function TarifsPage() {
  const { isLoggedIn, user, updateSubscription } = useAuth(); // On suppose une fonction pour simuler l'achat

  const formulas = [
    {
      id: 'free',
      name: 'Standard / Découverte',
      price: '0€',
      features: ['Planche contact (12 photos)', 'Lecture seule de l\'annuaire', 'Participation au Forum', 'Upload bloqué'],
      color: 'border-neutral-800 bg-neutral-900',
      btnText: 'Formule Actuelle'
    },
    {
      id: 'decouverte',
      name: 'Standard Option',
      price: '19€ / mois',
      features: ['1 annonce de service / semaine', '3 photos par annonce', '2 offres d\'emploi', 'Participation au Forum'],
      color: 'border-neutral-700 bg-neutral-900',
      btnText: 'S\'abonner'
    },
    {
      id: 'pro',
      name: 'Membre Pro',
      price: '49€ / mois',
      features: ['Annonces & Photos illimitées', 'Upload actif (10 photos/semaine)', 'Espace Légal (Devis/Factures PDF)', 'Suivi des ventes & likes'],
      color: 'border-amber-500/40 bg-neutral-900 shadow-amber-500/5 shadow-xl',
      badge: 'Le plus populaire',
      btnText: 'Passer au statut Pro'
    },
    {
      id: 'elite',
      name: 'Agence Élite',
      price: '129€ / mois',
      features: ['CRM de prospection complet', 'Générateur de Tunnels de vente', 'Liasse Fiscale Auto (MDA, AE, AE...)', 'Badge VIP Élite sur le forum', 'Upload illimité'],
      color: 'border-yellow-400 bg-gradient-to-b from-neutral-900 to-neutral-950',
      badge: '👑 Prestige',
      btnText: 'Devenir Membre Élite'
    }
  ];

  const handleSimulateUpgrade = async (statusId) => {
    if (!isLoggedIn) {
      alert("Veuillez d'abord créer un compte gratuit pour simuler une mise à niveau !");
      return;
    }
    // Appel de simulation pour mettre à jour la base de données en direct devant le client
    if (updateSubscription) {
      await updateSubscription(statusId);
      alert(`Félicitations ! Votre compte est passé au statut : ${statusId.toUpperCase()}`);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl bg-neutral-950 p-6 sm:p-8 text-neutral-200 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-5xl font-black text-amber-400">Nos Formules d'Abonnement</h1>
        <p className="text-sm text-neutral-400 mt-2">Choisissez la puissance adaptée à vos productions médias haut de gamme</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {formulas.map((f) => {
          const isCurrent = user?.subscription_status === f.id;
          return (
            <div key={f.id} className={`border p-6 rounded-3xl flex flex-col justify-between relative ${f.color}`}>
              {f.badge && (
                <span className="absolute -top-3 left-6 bg-amber-500 text-neutral-950 text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider">
                  {f.badge}
                </span>
              )}
              <div>
                <h3 className="text-xl font-bold text-white mb-1">{f.name}</h3>
                <div className="text-2xl font-black text-amber-400 mb-6">{f.price}</div>
                <ul className="space-y-3 mb-8">
                  {f.features.map((feat, idx) => (
                    <li key={idx} className="text-xs text-neutral-400 flex items-start gap-2">
                      <span className="text-amber-500">✓</span> {feat}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                disabled={isCurrent || f.id === 'free'}
                onClick={() => handleSimulateUpgrade(f.id)}
                className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                  isCurrent 
                    ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                    : 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-md cursor-pointer'
                }`}
              >
                {isCurrent ? f.btnText : f.btnText}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}