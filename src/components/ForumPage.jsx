import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

const FORUM_DISCUSSIONS = [
  {
    id: 1,
    title: { fr: "Réglementation Drone 2026 : Exigences BAPD & CATS en pratique", en: "2026 Drone Regulations: Practical BAPD & CATS Requirements" },
    author: "Marc V. (Pilote Certifié)",
    category: { fr: "Législation & Examens", en: "Legislation & Exams" },
    replies: 14,
    views: 340,
    date: { fr: "Il y a 2 heures", en: "2 hours ago" }
  },
  {
    id: 2,
    title: { fr: "Retour d'expérience : Quel boîtier pour le suivi de chantier en 4K ?", en: "Feedback: Best camera body for 4K construction tracking?" },
    author: "Sophie T. (Photographe Immo)",
    category: { fr: "Matériel & Studio", en: "Equipment & Studio" },
    replies: 8,
    views: 195,
    date: { fr: "Hier", en: "Yesterday" }
  },
  {
    id: 3,
    title: { fr: "Missions en réseau : Comment optimiser vos devis avec acompte 30%", en: "Network missions: Optimizing quotes with a 30% deposit" },
    author: "Boké One Conciergerie",
    category: { fr: "Conseils Pro & Tarifs", en: "Pro Advice & Rates" },
    replies: 22,
    views: 510,
    date: { fr: "Il y a 3 jours", en: "3 days ago" }
  }
];

const FORUM_TEXT = {
  fr: {
    badge: "COMMUNAUTÉ & RÉSEAU",
    title: "Forum & Échanges Professionnels",
    subtitle: "Discussions sur les autorisations de vol 2026, retours d'expérience matériel et opportunités de tournages.",
    btnNewTopic: "➕ Créer un sujet",
    searchPlaceholder: "Rechercher une discussion...",
    replies: "réponses",
    views: "vues",
    btnReadMore: "Lire la discussion ➔",
    modalNoticeTitle: "Accès Réservé aux Membres",
    modalNoticeDesc: "Connectez-vous pour participer aux échanges et poser vos questions."
  },
  en: {
    badge: "COMMUNITY & NETWORK",
    title: "Forum & Professional Discussions",
    subtitle: "Discussions on 2026 flight authorizations, gear reviews, and filming opportunities.",
    btnNewTopic: "➕ New Topic",
    searchPlaceholder: "Search discussion...",
    replies: "replies",
    views: "views",
    btnReadMore: "Read discussion ➔",
    modalNoticeTitle: "Member Restricted Access",
    modalNoticeDesc: "Sign in to participate in discussions and post questions."
  }
};

export default function ForumPage({ onRequireLogin }) {
  const { lang } = useLanguage();
  const t = FORUM_TEXT[lang];

  const [search, setSearch] = useState("");

  const filteredDiscussions = FORUM_DISCUSSIONS.filter((disc) =>
    disc.title[lang].toLowerCase().includes(search.toLowerCase()) ||
    disc.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-neutral-950 min-h-screen text-neutral-200 p-6 sm:p-12 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
          <div>
            <span className="inline-block text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full font-bold uppercase tracking-widest mb-2">
              {t.badge}
            </span>
            <h1 className="text-3xl font-black text-white">{t.title}</h1>
            <p className="text-xs text-neutral-400 mt-1">{t.subtitle}</p>
          </div>

          <button
            onClick={onRequireLogin}
            className="bg-amber-500 hover:bg-amber-400 text-neutral-950 px-5 py-3 rounded-xl font-bold text-xs transition shadow shrink-0 cursor-pointer"
          >
            {t.btnNewTopic}
          </button>
        </div>

        {/* Recherche */}
        <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl">
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-amber-500"
          />
        </div>

        {/* Liste des sujets */}
        <div className="space-y-4">
          {filteredDiscussions.map((disc) => (
            <div
              key={disc.id}
              className="bg-neutral-900/60 border border-neutral-800 hover:border-amber-500/30 p-5 rounded-2xl transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded font-bold uppercase">
                    {disc.category[lang]}
                  </span>
                  <span className="text-[11px] text-neutral-500">• {disc.date[lang]}</span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white hover:text-amber-400 transition cursor-pointer">
                  {disc.title[lang]}
                </h3>
                <p className="text-xs text-neutral-400">Par <span className="text-neutral-200">{disc.author}</span></p>
              </div>

              <div className="flex items-center gap-6 shrink-0 border-t sm:border-t-0 border-neutral-800 pt-3 sm:pt-0">
                <div className="text-right">
                  <span className="text-xs font-bold text-white block">{disc.replies} {t.replies}</span>
                  <span className="text-[10px] text-neutral-500">{disc.views} {t.views}</span>
                </div>
                <button
                  onClick={onRequireLogin}
                  className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
                >
                  {t.btnReadMore}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}