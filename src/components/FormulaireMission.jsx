import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export default function FormulaireMission({ onMissionAjoute }) {
  const { user, isLoggedIn } = useAuth();
  const { lang } = useLanguage();
  const isEn = lang === "en";

  // États du formulaire conformes à votre structure SQL de la table 'jobs'
  const [titre, setTitre] = useState("");
  const [region, setRegion] = useState("");
  const [ville, setVille] = useState("");
  const [budget, setBudget] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null); // { type: "ok" | "error", text }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setMsg({
        type: "error",
        text: isEn ? "🚨 Please log in to post an offer." : "🚨 Veuillez vous connecter pour publier une offre."
      });
      return;
    }

    setLoading(true);
    setMsg(null);

    try {
      const { error } = await supabase.from("jobs").insert({
        titre: titre.trim(),
        region: region.trim(),
        ville: ville.trim(),
        budget: budget.trim() ? `${budget.trim()} €` : null,
        description: description.trim(),
        cree_par: user.id,
      });

      if (error) throw error;

      setMsg({
        type: "ok",
        text: isEn ? "⚡ Mission published successfully!" : "⚡ Mission publiée avec succès sur le flux national !"
      });

      // Remise à zéro
      setTitre(""); setRegion(""); setVille(""); setBudget(""); setDescription("");
      
      // Déclencheur pour actualiser la liste des missions en arrière-plan
      if (onMissionAjoute) onMissionAjoute();

    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto text-neutral-200 font-sans shadow-2xl relative overflow-hidden">
      {/* Effet Bokeh Arrière-plan */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-16 -left-16 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl" />

      <div className="border-b border-neutral-800 pb-4 mb-6">
        <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
          {isEn ? "Recruitment & Tenders" : "Recrutement & Appels d'offres"}
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-white mt-1.5">
          {isEn ? "Deposit a Prestation Mission" : "Déposer une Demande de Prestation"}
        </h2>
        <p className="text-xs text-neutral-400 mt-0.5">
          {isEn ? "Find the elite photographers, videographers and drone pilots for your project." : "Trouvez l'élite des photographes, cinéastes et télépilotes pour vos projets de terrain."}
        </p>
      </div>

      {msg && (
        <div className={`p-4 rounded-xl text-xs font-bold text-center mb-4 transition animate-pulse ${
          msg.type === "ok" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
        }`}>
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
        {/* Titre de la Mission */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-neutral-300 block">
            {isEn ? "Mission Title" : "Intitulé de la mission / Objet"}
          </label>
          <input
            type="text"
            required
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            placeholder={isEn ? "Ex: Drone Shooting - Loire Valley Castles" : "Ex: Prises de vues Drone - Châteaux de la Loire"}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 outline-none focus:border-amber-400 transition"
          />
        </div>

        {/* Grille Géo & Budget */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-300 block">
              {isEn ? "Region" : "Région"}
            </label>
            <input
              type="text"
              required
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="Ex: Centre-Val de Loire"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 outline-none focus:border-amber-400 transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-300 block">
              {isEn ? "City" : "Ville"}
            </label>
            <input
              type="text"
              required
              value={ville}
              onChange={(e) => setVille(e.target.value)}
              placeholder="Ex: Amboise"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 outline-none focus:border-amber-400 transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-300 block">
              {isEn ? "Estimated Budget" : "Budget Estimé (€)"}
            </label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Ex: 450"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 outline-none focus:border-amber-400 transition font-mono"
            />
          </div>
        </div>

        {/* Description / Cahier des Charges */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-neutral-300 block">
            {isEn ? "Detailed Description / Requirements" : "Description détaillée & Cahier des charges"}
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={isEn ? "Describe your needs, flight constraints, necessary gear..." : "Décrivez vos besoins précis, contraintes de survol, matériel requis (ex: Capteur plein format, homologation DGAC)..."}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 outline-none focus:border-amber-400 transition resize-none"
          />
        </div>

        {/* Bouton de soumission */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black py-3.5 rounded-xl text-xs uppercase tracking-wider transition shadow-lg cursor-pointer border-none disabled:opacity-50 mt-2"
        >
          {loading ? (isEn ? "Publishing..." : "Publication sur le réseau...") : (isEn ? "Post Offer ➔" : "Publier l'appel d'offres ➔")}
        </button>
      </form>
    </div>
  );
}
