// src/components/ForumPage.jsx
import React, { useState } from "react";

export default function ForumPage() {
  const [sujetActif, setSujetActif] = useState(null);
  const [nouveauMessage, setNouveauMessage] = useState("");

  // Liste initiale des sujets de discussion
  const [sujets, setSujets] = useState([
    {
      id: 1,
      titre: "Stratégie de prix pour les packs créateurs en 2026",
      auteur: "Marc Vane",
      categorie: "Business & Tarifs",
      reponsesCount: 14,
      date: "Il y a 2 jours",
      messages: [
        { auteur: "Marc Vane", texte: "Hello à tous, comment positionnez-vous vos grilles tarifaires face à la concurrence actuelle ?", date: "Il y a 2 jours" },
        { auteur: "Sarah L.", texte: "Personnellement, j'intègre un forfait minimum journalier de 450€ HT, ça filtre direct les clients non qualifiés.", date: "Il y a 1 jour" }
      ]
    },
    {
      id: 2,
      titre: "Optimisation de nos tournages avec le nouveau boîtier Sony",
      auteur: "Alexandre Gaultier",
      categorie: "Matériel & Technique",
      reponsesCount: 8,
      date: "Il y a 3 jours",
      messages: [
        { auteur: "Alexandre Gaultier", texte: "Le rendu en low-light est absolument incroyable. Des retours de votre côté sur les profils S-Log3 ?", date: "Il y a 3 jours" }
      ]
    },
    {
      id: 3,
      titre: "Recherche vidéaste partenaire sur Lyon pour mission corporate",
      auteur: "Thomas B.",
      categorie: "Collaborations",
      reponsesCount: 5,
      date: "Il y a 5 jours",
      messages: [
        { auteur: "Thomas B.", texte: "Je cherche un binôme caméraman + son pour un gros séminaire d'entreprise le mois prochain.", date: "Il y a 5 jours" }
      ]
    }
  ]);

  const handleEnvoyerMessage = (e) => {
    e.preventDefault();
    if (!nouveauMessage.trim()) return;

    const sujetMaj = {
      ...sujetActif,
      reponsesCount: sujetActif.reponsesCount + 1,
      messages: [
        ...sujetActif.messages,
        { auteur: "Vous (Membre Pro)", texte: nouveauMessage, date: "À l'instant" }
      ]
    };

    setSujetActif(sujetMaj);
    setSujets(sujets.map(s => s.id === sujetMaj.id ? sujetMaj : s));
    setNouveauMessage("");
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-white">💬 Forum & Échanges de la Communauté</h2>
          <p className="text-xs text-slate-400 mt-1">Partagez vos retours d'expérience, astuces techniques et opportunités.</p>
        </div>
        {sujetActif && (
          <button 
            onClick={() => setSujetActif(null)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors"
          >
            ← Retour à la liste des sujets
          </button>
        )}
      </div>

      {!sujetActif ? (
        /* LISTE DES SUJETS */
        <div className="space-y-3">
          {sujets.map((sujet) => (
            <div 
              key={sujet.id} 
              onClick={() => setSujetActif(sujet)}
              className="bg-[#0e1424] hover:bg-[#131b31] border border-slate-800 hover:border-amber-500/50 p-5 rounded-2xl transition-all cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-lg"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black bg-amber-500/10 text-amber-400 px-2.5 py-0.5 rounded border border-amber-500/20">
                    {sujet.categorie}
                  </span>
                  <span className="text-[10px] text-slate-500">• Publié par {sujet.auteur} ({sujet.date})</span>
                </div>
                <h3 className="text-sm font-bold text-white hover:text-amber-400 transition-colors">{sujet.titre}</h3>
              </div>
              
              <div className="flex items-center gap-2 bg-[#070b12] px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono text-amber-400">
                <span>💬</span>
                <span>{sujet.reponsesCount} réponses</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* VUE DÉTAILLÉE DU FIL DE DISCUSSION */
        <div className="bg-[#0e1424] border border-slate-800 p-6 rounded-2xl space-y-6 shadow-2xl animate-fade-in">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">{sujetActif.categorie}</span>
            <h3 className="text-lg font-black text-white mt-1">{sujetActif.titre}</h3>
            <p className="text-xs text-slate-400 mt-1">Initié par {sujetActif.auteur}</p>
          </div>

          {/* Liste des messages du fil */}
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {sujetActif.messages.map((msg, index) => (
              <div key={index} className="bg-[#070b12] border border-slate-800/80 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-amber-400">{msg.auteur}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{msg.date}</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-light">{msg.texte}</p>
              </div>
            ))}
          </div>

          {/* Formulaire de réponse */}
          <form onSubmit={handleEnvoyerMessage} className="space-y-3 pt-4 border-t border-slate-800">
            <label className="block text-xs font-bold text-slate-300">Participer à la discussion :</label>
            <textarea 
              rows="3" 
              value={nouveauMessage}
              onChange={(e) => setNouveauMessage(e.target.value)}
              placeholder="Écrivez votre réponse ici..."
              className="w-full bg-[#070b12] border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 font-sans"
              required
            ></textarea>
            <div className="flex justify-end">
              <button 
                type="submit" 
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl cursor-pointer shadow-lg transition-colors"
              >
                Envoyer ma réponse
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}