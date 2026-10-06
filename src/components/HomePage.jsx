import React from 'react';

export default function HomePage({ onNavigate }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold tracking-widest uppercase border border-amber-500/20 mb-6">
          Réseau d'Élite & Agence de Créateurs
        </span>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
          L'Excellence Visuelle par <span className="text-amber-500">Boké One</span>
        </h1>
        <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-10">
          Plateforme exclusive connectant les créateurs d'images professionnels et les clients à la recherche de prestations haut de gamme en Île-de-France.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <button
            onClick={() => onNavigate('gallery')}
            className="px-8 py-4 bg-amber-500 text-slate-950 font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-lg hover:bg-amber-400 transition cursor-pointer"
          >
            Explorer les Portfolios
          </button>
          <button
            onClick={() => onNavigate('creatifs')}
            className="px-8 py-4 bg-slate-900 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl border border-slate-800 hover:bg-slate-800 transition cursor-pointer"
          >
            Découvrir l'Annuaire
          </button>
        </div>
      </div>

      {/* Grille des fonctionnalités clés */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
        <div className="p-8 bg-slate-900/80 border border-slate-800 rounded-2xl backdrop-blur-md">
          <div className="text-amber-500 text-2xl font-black mb-4">01</div>
          <h3 className="text-xl font-bold text-white mb-2">Portfolios Ciblés</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Parcourez les réalisations artistiques par catégorie et pré-sélectionnez vos coups de cœur pour vos séances.
          </p>
        </div>
        <div className="p-8 bg-slate-900/80 border border-slate-800 rounded-2xl backdrop-blur-md">
          <div className="text-amber-500 text-2xl font-black mb-4">02</div>
          <h3 className="text-xl font-bold text-white mb-2">Réseau & Annuaire</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Identifiez et entrez en contact direct avec les créateurs abonnés et les talents validés par l'agence.
          </p>
        </div>
        <div className="p-8 bg-slate-900/80 border border-slate-800 rounded-2xl backdrop-blur-md">
          <div className="text-amber-500 text-2xl font-black mb-4">03</div>
          <h3 className="text-xl font-bold text-white mb-2">Espace Pro & CRM</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Un tableau de bord sécurisé gérant les transactions, les commandes et le calcul des commissions de l'agence.
          </p>
        </div>
      </div>
    </div>
  );
}