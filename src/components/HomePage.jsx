import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

// Mêmes catégories que la table `requests` (supabase_01_requests.sql)
const CATEGORIES = [
  { id: "portrait-corporate", label: "Portrait Corporate" },
  { id: "evenementiel", label: "Événementiel" },
  { id: "contenu", label: "Réalisation de contenu" },
  { id: "mariage-naissance", label: "Mariage & Naissance" },
  { id: "autre", label: "Autre besoin" },
];

export default function HomePage({ onNavigate }) {
  const [needOpen, setNeedOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  function handleSearchSubmit(e) {
    e.preventDefault();
    // ⚠️ Recherche minimale pour l'instant : redirige vers les portfolios.
    // Une vraie recherche par référence demandera une colonne "reference"
    // sur une future table `photos` — pas encore créée, je n'ai pas voulu l'inventer.
    onNavigate("portfolios");
  }

  return (
    <div className="relative max-w-6xl mx-auto px-4 py-16">
      {/* ENCADRÉ "BESOIN URGENT" — discret, coin haut-droit, accent rouge */}
      <button
        type="button"
        onClick={() => setNeedOpen(true)}
        className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 flex items-center gap-2 rounded-xl border border-rose-500/50 bg-rose-500/10 px-3 py-2 text-left hover:bg-rose-500/20 transition cursor-pointer"
      >
        <span className="text-rose-400 text-sm">🔴</span>
        <span className="leading-tight">
          <span className="block text-[11px] font-black text-rose-300">Besoin urgent ?</span>
          <span className="block text-[10px] text-rose-400/80">Déposer une demande →</span>
        </span>
      </button>

      <div className="text-center max-w-3xl mx-auto mb-14">
        <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold tracking-widest uppercase border border-amber-500/20 mb-6">
          Réseau d'Élite & Agence de Créateurs
        </span>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
          L'Excellence Visuelle par <span className="text-amber-500">Boké One</span>
        </h1>
        <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-10">
          Plateforme exclusive connectant les créateurs d'images professionnels et les clients à la recherche de prestations haut de gamme en Île-de-France.
        </p>
      </div>

      {/* BLOC CENTRAL : rappel planche contact + mini moteur de recherche par référence */}
      <div className="max-w-2xl mx-auto mb-16 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md text-center space-y-4">
        <h2 className="text-lg font-bold text-white">🖼️ Retrouver une réalisation</h2>
        <p className="text-slate-400 text-sm">
          Parcourez la planche contact complète, ou cherchez directement une référence si vous l'avez déjà en tête.
        </p>
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Référence, titre ou nom du créateur…"
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-lg transition cursor-pointer whitespace-nowrap"
          >
            Rechercher
          </button>
        </form>
        <button
          type="button"
          onClick={() => onNavigate('portfolios')}
          className="inline-block px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl border border-slate-700 transition cursor-pointer"
        >
          Voir la planche contact complète
        </button>
      </div>

      <div className="flex justify-center gap-4 flex-wrap mb-16">
        <button
          type="button"
          onClick={() => onNavigate('annuaire')}
          className="px-8 py-4 bg-slate-900 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl border border-slate-800 hover:bg-slate-800 transition cursor-pointer"
        >
          Découvrir l'Annuaire
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

      {/* MODALE BESOIN — compacte, pas de grand hero */}
      {needOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4"
          onMouseDown={(e) => e.target === e.currentTarget && setNeedOpen(false)}
        >
          <div className="bg-[#0e1424] border border-rose-500/30 w-full max-w-md rounded-2xl p-6 relative shadow-2xl">
            <button
              type="button"
              onClick={() => setNeedOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold cursor-pointer"
            >
              ✕
            </button>
            <NeedForm onDone={() => setNeedOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

function NeedForm({ onDone }) {
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | success | error
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!category) return setError("Choisissez un type de besoin.");
    if (city.trim().length < 2) return setError("Indiquez une ville.");
    if (description.trim().length < 10) return setError("Décrivez votre besoin (10 caractères min.).");
    if (contactName.trim().length < 2) return setError("Indiquez votre prénom.");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contactEmail)) return setError("E-mail invalide.");
    if (!consent) return setError("Merci d'accepter l'utilisation de vos informations.");

    setSubmitting(true);
    const { error: dbError } = await supabase.from("requests").insert([{
      category,
      city: city.trim(),
      timing: "non-defini",
      description: description.trim(),
      contact_name: contactName.trim(),
      contact_email: contactEmail.trim(),
      consent: true,
    }]);
    setSubmitting(false);

    if (dbError) {
      console.error("Erreur dépôt de besoin :", dbError);
      setError("Une erreur est survenue. Réessayez.");
      return;
    }
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className="text-center py-4 space-y-3">
        <div className="text-3xl">✅</div>
        <h3 className="text-sm font-bold text-white">Votre besoin est enregistré</h3>
        <p className="text-xs text-slate-400">Nous revenons vers vous dès qu'un créatif correspondant est identifié.</p>
        <button type="button" onClick={onDone} className="px-5 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl cursor-pointer">Fermer</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h3 className="text-sm font-black text-white">🔴 Besoin urgent — déposez votre demande</h3>
      <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-[#070b12] border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500">
        <option value="">Type de besoin…</option>
        {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
      </select>
      <input type="text" placeholder="Ville" value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-[#070b12] border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500" />
      <textarea rows={3} placeholder="Décrivez votre besoin…" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-[#070b12] border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500" />
      <div className="flex gap-2">
        <input type="text" placeholder="Prénom" value={contactName} onChange={(e) => setContactName(e.target.value)} className="flex-1 bg-[#070b12] border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500" />
        <input type="email" placeholder="E-mail" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="flex-1 bg-[#070b12] border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500" />
      </div>
      <label className="flex items-start gap-2 text-[11px] text-slate-400">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5" />
        J'accepte que mes informations soient utilisées pour étudier mon besoin.
      </label>
      {error && <p className="text-[11px] text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">{error}</p>}
      <button type="submit" disabled={submitting} className="w-full py-2.5 bg-rose-500 hover:bg-rose-400 disabled:opacity-60 text-slate-950 text-xs font-black rounded-xl cursor-pointer">
        {submitting ? "Envoi…" : "Envoyer ma demande"}
      </button>
    </form>
  );
}
