import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export default function AdminForumModeration() {
  const { user, isLoggedIn } = useAuth();
  const { lang } = useLanguage();
  const isEn = lang === "en";

  const [pendingTopics, setPendingTopics] = useState([]);
  const [pendingReplies, setPendingReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    fetchPendingContent();
  }, []);

  const fetchPendingContent = async () => {
    setLoading(true);
    try {
      // Récupération des sujets
      const { data: topics, error: errTopics } = await supabase
        .from("forum_topics")
        .select("*")
        .order("created_at", { ascending: false });

      if (errTopics) throw errTopics;
      setPendingTopics(topics || []);

      // Récupération des réponses
      const { data: replies, error: errReplies } = await supabase
        .from("forum_replies")
        .select("*")
        .order("created_at", { ascending: false });

      if (errReplies) throw errReplies;
      setPendingReplies(replies || []);
    } catch (err) {
      setMsg({ type: "error", err: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTopic = async (id) => {
    if (!window.confirm(isEn ? "Delete this topic?" : "Supprimer ce sujet ?")) return;
    const { error } = await supabase.from("forum_topics").delete().eq("id", id);
    if (!error) {
      setPendingTopics(pendingTopics.filter((t) => t.id !== id));
    }
  };

  const handleDeleteReply = async (id) => {
    if (!window.confirm(isEn ? "Delete this reply?" : "Supprimer cette réponse ?")) return;
    const { error } = await supabase.from("forum_replies").delete().eq("id", id);
    if (!error) {
      setPendingReplies(pendingReplies.filter((r) => r.id !== id));
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="mx-auto w-full max-w-4xl bg-neutral-950 p-8 text-neutral-400 min-h-[70vh] flex items-center justify-center text-sm">
        {isEn ? "Please log in to access moderation." : "Veuillez vous connecter pour accéder à la modération."}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl bg-neutral-950 p-4 sm:p-8 text-neutral-200 min-h-screen font-sans space-y-8">
      <div>
        <span className="text-[10px] bg-red-500/15 text-red-400 border border-red-500/30 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
          {isEn ? "Admin Security" : "Sécurité Administration"}
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-1.5">
          {isEn ? "Forum Moderation" : "Modération du Forum"}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
          {isEn ? "Manage and clean up forum posts and replies." : "Gérez et nettoyez les publications et réponses du forum."}
        </p>
      </div>

      {loading ? (
        <p className="text-xs text-neutral-500">Chargement des contenus...</p>
      ) : (
        <div className="space-y-6">
          {/* Sujets */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-amber-400">Sujets du Forum ({pendingTopics.length})</h3>
            {pendingTopics.length === 0 ? (
              <p className="text-xs text-neutral-500 italic">Aucun sujet.</p>
            ) : (
              <div className="space-y-3">
                {pendingTopics.map((topic) => (
                  <div key={topic.id} className="flex items-center justify-between bg-neutral-950 border border-neutral-800 p-4 rounded-xl">
                    <div>
                      <h4 className="text-xs font-bold text-white">{topic.title}</h4>
                      <p className="text-[11px] text-neutral-400 mt-0.5">{topic.content?.substring(0, 80)}...</p>
                    </div>
                    <button
                      onClick={() => handleDeleteTopic(topic.id)}
                      className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Réponses */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-amber-400">Réponses du Forum ({pendingReplies.length})</h3>
            {pendingReplies.length === 0 ? (
              <p className="text-xs text-neutral-500 italic">Aucune réponse.</p>
            ) : (
              <div className="space-y-3">
                {pendingReplies.map((reply) => (
                  <div key={reply.id} className="flex items-center justify-between bg-neutral-950 border border-neutral-800 p-4 rounded-xl">
                    <div>
                      <p className="text-xs text-neutral-300">{reply.content}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteReply(reply.id)}
                      className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}