import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export default function ForumPage({ onRequireLogin }) {
  const { user, isLoggedIn } = useAuth();
  const { lang } = useLanguage();
  const isEn = lang === "en";

  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(false);

  // Formulaires
  const [showNewTopicForm, setShowNewTopicForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Général");
  const [newContent, setNewContent] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    fetchTopics();
  }, []);

  // Récupération des sujets (depuis la table forum_posts)
  const fetchTopics = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("forum_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setTopics(data);
    }
    setLoading(false);
  };

  // Récupération des réponses d'un sujet (depuis la table forum_replies)
  const fetchReplies = async (topicId) => {
    setLoadingReplies(true);
    const { data, error } = await supabase
      .from("forum_replies")
      .select("*")
      .eq("topic_id", topicId)
      .order("created_at", { ascending: true });

    if (!error && data) {
      setReplies(data);
    }
    setLoadingReplies(false);
  };

  // Clic sur un sujet pour voir les détails
  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic);
    fetchReplies(topic.id);
  };

  // Interception du clic "Nouveau Sujet"
  const handleNewTopicClick = () => {
    if (!isLoggedIn) {
      onRequireLogin();
      return;
    }
    setShowNewTopicForm(true);
  };

  // Interception du clic "Répondre"
  const handleReplyClick = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      onRequireLogin();
      return;
    }
    handleSendReply();
  };

  // Envoi d'un nouveau sujet
  const handleCreateTopic = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      onRequireLogin();
      return;
    }

    setSubmitting(true);
    setMsg(null);

    try {
      const { error } = await supabase.from("forum_posts").insert({
        user_id: user.id,
        title: newTitle.trim(),
        category: newCategory,
        content: newContent.trim(),
        user_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Membre",
        status: "approuve",
      });

      if (error) throw error;

      setMsg({ type: "ok", text: isEn ? "Topic created successfully!" : "Sujet publié avec succès !" });
      setNewTitle("");
      setNewContent("");
      setShowNewTopicForm(false);
      fetchTopics();
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Erreur lors de la publication." });
    } finally {
      setSubmitting(false);
    }
  };

  // Envoi d'une réponse
  const handleSendReply = async () => {
    if (!replyContent.trim()) return;
    setSubmitting(true);
    setMsg(null);

    try {
      const { error } = await supabase.from("forum_replies").insert({
        topic_id: selectedTopic.id,
        user_id: user.id,
        content: replyContent.trim(),
        user_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Membre",
        status: "approuve",
      });

      if (error) throw error;

      setReplyContent("");
      fetchReplies(selectedTopic.id);
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Erreur lors de l'envoi." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl bg-neutral-950 p-4 sm:p-8 text-neutral-200 min-h-screen font-sans">
      
      {/* En-tête du Forum */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-amber-400">Forum</h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            {isEn
              ? "Exchanges, technical advice and networking between image and sound professionals."
              : "Échanges, conseils techniques et réseau entre professionnels de l'image et du son."}
          </p>
        </div>

        <button
          onClick={handleNewTopicClick}
          className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black px-5 py-3 rounded-xl text-xs uppercase tracking-wider transition shadow-lg cursor-pointer shrink-0"
        >
          + {isEn ? "New Topic" : "Nouveau Sujet"}
        </button>
      </div>

      {/* Banner d'invitation si non connecté */}
      {!isLoggedIn && (
        <div className="bg-neutral-900/90 border border-neutral-800 p-4 rounded-2xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">🔒</span>
            <p className="text-xs text-neutral-300">
              {isEn
                ? "Browse discussions freely. Log in or register to publish a topic or reply."
                : "Consultez les discussions librement. Connectez-vous ou inscrivez-vous pour publier ou répondre."}
            </p>
          </div>
          <button
            onClick={onRequireLogin}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 underline cursor-pointer shrink-0"
          >
            {isEn ? "Sign In / Register ➔" : "S'inscrire / Se connecter ➔"}
          </button>
        </div>
      )}

      {msg && (
        <div className={`p-4 rounded-xl text-xs font-bold mb-6 ${msg.type === "ok" ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400" : "bg-red-500/10 border border-red-500/30 text-red-400"}`}>
          {msg.text}
        </div>
      )}

      {/* Formulaire de création de sujet */}
      {showNewTopicForm && isLoggedIn && (
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl mb-8 space-y-4">
          <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
            <h3 className="text-base font-bold text-amber-400">{isEn ? "Create a New Topic" : "Créer un nouveau sujet"}</h3>
            <button onClick={() => setShowNewTopicForm(false)} className="text-neutral-400 hover:text-white font-bold cursor-pointer">✕</button>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              placeholder={isEn ? "Topic Title..." : "Titre de votre sujet..."}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-amber-500"
            />

            <textarea
              rows={4}
              placeholder={isEn ? "Write your message..." : "Rédigez votre message..."}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-xs text-white outline-none focus:border-amber-500"
            />

            <button
              onClick={handleCreateTopic}
              disabled={submitting}
              className="py-3 px-6 bg-amber-500 text-neutral-950 font-bold rounded-xl text-xs uppercase cursor-pointer"
            >
              {submitting ? "Publication..." : "Publier"}
            </button>
          </div>
        </div>
      )}

      {/* Vue détaillée d'un Sujet */}
      {selectedTopic ? (
        <div className="space-y-6">
          <button
            onClick={() => setSelectedTopic(null)}
            className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
          >
            ← {isEn ? "Back to discussions" : "Retour aux discussions"}
          </button>

          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-start gap-4 border-b border-neutral-800 pb-4">
              <div>
                <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold uppercase">
                  {selectedTopic.category || "Général"}
                </span>
                <h2 className="text-xl font-bold text-white mt-2">{selectedTopic.title}</h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Par <span className="text-neutral-200 font-semibold">{selectedTopic.user_name || "Membre"}</span> • {new Date(selectedTopic.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-neutral-300 whitespace-pre-line leading-relaxed">
              {selectedTopic.content}
            </p>
          </div>

          {/* Liste des réponses */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider">{isEn ? "Replies" : "Réponses"}</h3>

            {loadingReplies ? (
              <p className="text-xs text-neutral-500">Chargement...</p>
            ) : replies.length === 0 ? (
              <p className="text-xs text-neutral-500 italic">{isEn ? "No replies yet. Be the first to answer!" : "Aucune réponse pour le moment. Soyez le premier !"}</p>
            ) : (
              replies.map((reply) => (
                <div key={reply.id} className="bg-neutral-900/60 border border-neutral-800/80 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between text-xs text-neutral-400">
                    <span className="font-bold text-amber-400">{reply.user_name || "Membre"}</span>
                    <span>{new Date(reply.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-neutral-300">{reply.content}</p>
                </div>
              ))
            )}
          </div>

          {/* Bloc de réponse */}
          <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-3">
            <textarea
              rows={3}
              placeholder={isLoggedIn ? (isEn ? "Write a reply..." : "Écrire une réponse...") : (isEn ? "Sign in to reply to this topic..." : "Connectez-vous pour répondre à ce sujet...")}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white outline-none focus:border-amber-500"
            />
            <div className="flex justify-end">
              <button
                onClick={handleReplyClick}
                disabled={submitting}
                className="py-2.5 px-5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs cursor-pointer"
              >
                {isLoggedIn ? (submitting ? "Envoi..." : "Répondre") : "Se connecter pour répondre"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Table des Sujets du Forum */
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 bg-neutral-950 p-4 text-[10px] font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-800">
            <div className="col-span-8 sm:col-span-9">Discussion</div>
            <div className="col-span-4 sm:col-span-3 text-right">Date</div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-neutral-500">Chargement des sujets...</div>
          ) : topics.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-500 italic">Aucun sujet publié.</div>
          ) : (
            topics.map((topic) => (
              <div
                key={topic.id}
                onClick={() => handleSelectTopic(topic)}
                className="grid grid-cols-12 p-4 items-center border-b border-neutral-800/60 hover:bg-neutral-800/40 transition cursor-pointer"
              >
                <div className="col-span-8 sm:col-span-9 space-y-1">
                  <h3 className="text-xs sm:text-sm font-bold text-white hover:text-amber-400 transition">
                    {topic.title}
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    par <span className="text-neutral-300 font-medium">{topic.user_name || "Membre"}</span> • <span className="text-amber-400/80">{topic.category || "Général"}</span>
                  </p>
                </div>
                <div className="col-span-4 sm:col-span-3 text-right text-xs text-neutral-400 font-medium">
                  {new Date(topic.created_at).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
}