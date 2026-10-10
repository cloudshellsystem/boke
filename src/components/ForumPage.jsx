import React, { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

// ⚠️ Adaptez si votre colonne de liaison s'appelle autrement (ex: "post_id")
const REPLY_FK = "topic_id";

const CATEGORIES = ["Général", "Image", "Son", "Matériel", "Emploi", "Réseau"];
const PAGE_SIZE = 50;

const getAuthor = (row) => row?.user_name || row?.author_name || "Membre";

export default function ForumPage({ onRequireLogin }) {
  const { user, isLoggedIn } = useAuth();
  const { lang } = useLanguage();
  const isEn = lang === "en";
  const locale = isEn ? "en-GB" : "fr-FR";

  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(false);

  const [showNewTopicForm, setShowNewTopicForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState(CATEGORIES[0]);
  const [newContent, setNewContent] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);

  // Permet d'ignorer les réponses d'un sujet qui n'est plus affiché
  const currentTopicRef = useRef(null);

  const authorName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Membre";

  const formatDate = (d) => new Date(d).toLocaleDateString(locale);

  /* ---------- Lecture ---------- */

  const fetchTopics = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("forum_posts")
      .select("id, title, content, category, user_name, created_at")
      .order("created_at", { ascending: false })
      .limit(PAGE_SIZE);

    if (error) {
      console.error("fetchTopics:", error);
      setMsg({ type: "error", text: isEn ? "Unable to load topics." : "Impossible de charger les sujets." });
    } else {
      setTopics(data ?? []);
    }
    setLoading(false);
  }, [isEn]);

  const fetchReplies = useCallback(async (topicId) => {
    setLoadingReplies(true);
    const { data, error } = await supabase
      .from("forum_replies")
      .select("id, content, user_name, created_at")
      .eq(REPLY_FK, topicId)
      .order("created_at", { ascending: true });

    // Sujet changé entre-temps → on ignore ce résultat
    if (currentTopicRef.current !== topicId) return;

    if (error) {
      console.error("fetchReplies:", error);
      setMsg({ type: "error", text: isEn ? "Unable to load replies." : "Impossible de charger les réponses." });
      setReplies([]);
    } else {
      setReplies(data ?? []);
    }
    setLoadingReplies(false);
  }, [isEn]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  /* ---------- Navigation ---------- */

  const handleSelectTopic = (topic) => {
    currentTopicRef.current = topic.id;
    setSelectedTopic(topic);
    setReplies([]);
    setReplyContent("");
    setMsg(null);
    fetchReplies(topic.id);
  };

  const handleBack = () => {
    currentTopicRef.current = null;
    setSelectedTopic(null);
    setReplies([]);
    setReplyContent("");
    setMsg(null);
  };

  const handleNewTopicClick = () => {
    if (!isLoggedIn) return onRequireLogin();
    setMsg(null);
    setShowNewTopicForm(true);
  };

  /* ---------- Écriture ---------- */

  const handleCreateTopic = async (e) => {
    e.preventDefault();
    if (!isLoggedIn || !user) return onRequireLogin();

    const title = newTitle.trim();
    const content = newContent.trim();
    if (!title || !content) {
      setMsg({ type: "error", text: isEn ? "Title and message are required." : "Le titre et le message sont obligatoires." });
      return;
    }

    setSubmitting(true);
    setMsg(null);

    // status et user_id viennent des DEFAULT SQL / RLS
    const { error } = await supabase.from("forum_posts").insert({
      user_id: user.id,
      title,
      content,
      category: newCategory,
      user_name: authorName,
    });

    if (error) {
      console.error("createTopic:", error);
      setMsg({ type: "error", text: error.message });
    } else {
      setMsg({ type: "ok", text: isEn ? "Topic created successfully!" : "Sujet publié avec succès !" });
      setNewTitle("");
      setNewContent("");
      setNewCategory(CATEGORIES[0]);
      setShowNewTopicForm(false);
      fetchTopics();
    }
    setSubmitting(false);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn || !user) return onRequireLogin();

    const content = replyContent.trim();
    if (!content || !selectedTopic) return;

    setSubmitting(true);
    setMsg(null);

    const { data, error } = await supabase
      .from("forum_replies")
      .insert({
        [REPLY_FK]: selectedTopic.id,
        user_id: user.id,
        content,
        user_name: authorName,
      })
      .select("id, content, user_name, created_at")
      .single();

    if (error) {
      console.error("sendReply:", error);
      setMsg({ type: "error", text: error.message });
    } else {
      setReplyContent("");
      // Ajout direct : pas besoin de refaire une requête
      setReplies((prev) => [...prev, data]);
    }
    setSubmitting(false);
  };

  /* ---------- Rendu ---------- */

  return (
    <div className="mx-auto w-full max-w-7xl bg-neutral-950 p-4 sm:p-8 text-neutral-200 min-h-screen font-sans">
      {/* En-tête */}
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

      {/* Bandeau non connecté */}
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
        <div
          role="alert"
          className={`p-4 rounded-xl text-xs font-bold mb-6 ${
            msg.type === "ok"
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
              : "bg-red-500/10 border border-red-500/30 text-red-400"
          }`}
        >
          {msg.text}
        </div>
      )}

      {/* Formulaire nouveau sujet */}
      {showNewTopicForm && isLoggedIn && (
        <form
          onSubmit={handleCreateTopic}
          className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl mb-8 space-y-4"
        >
          <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
            <h3 className="text-base font-bold text-amber-400">
              {isEn ? "Create a New Topic" : "Créer un nouveau sujet"}
            </h3>
            <button
              type="button"
              onClick={() => setShowNewTopicForm(false)}
              className="text-neutral-400 hover:text-white font-bold cursor-pointer"
              aria-label="Fermer"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              required
              maxLength={150}
              placeholder={isEn ? "Topic Title..." : "Titre de votre sujet..."}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-amber-500"
            />

            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-amber-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <textarea
              rows={4}
              required
              placeholder={isEn ? "Write your message..." : "Rédigez votre message..."}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-xs text-white outline-none focus:border-amber-500"
            />

            <button
              type="submit"
              disabled={submitting}
              className="py-3 px-6 bg-amber-500 text-neutral-950 font-bold rounded-xl text-xs uppercase cursor-pointer disabled:opacity-50"
            >
              {submitting ? (isEn ? "Publishing..." : "Publication...") : (isEn ? "Publish" : "Publier")}
            </button>
          </div>
        </form>
      )}

      {/* Vue détail */}
      {selectedTopic ? (
        <div className="space-y-6">
          <button
            onClick={handleBack}
            className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
          >
            ← {isEn ? "Back to discussions" : "Retour aux discussions"}
          </button>

          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl space-y-4">
            <div className="border-b border-neutral-800 pb-4">
              <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold uppercase">
                {selectedTopic.category || "Général"}
              </span>
              <h2 className="text-xl font-bold text-white mt-2">{selectedTopic.title}</h2>
              <p className="text-xs text-neutral-400 mt-1">
                {isEn ? "By" : "Par"}{" "}
                <span className="text-neutral-200 font-semibold">{getAuthor(selectedTopic)}</span>{" "}
                • {formatDate(selectedTopic.created_at)}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-neutral-300 whitespace-pre-line leading-relaxed">
              {selectedTopic.content}
            </p>
          </div>

          {/* Réponses */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider">
              {isEn ? "Replies" : "Réponses"} ({replies.length})
            </h3>

            {loadingReplies ? (
              <p className="text-xs text-neutral-500">{isEn ? "Loading..." : "Chargement..."}</p>
            ) : replies.length === 0 ? (
              <p className="text-xs text-neutral-500 italic">
                {isEn ? "No replies yet. Be the first to answer!" : "Aucune réponse pour le moment. Soyez le premier !"}
              </p>
            ) : (
              replies.map((reply) => (
                <div key={reply.id} className="bg-neutral-900/60 border border-neutral-800/80 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between text-xs text-neutral-400">
                    <span className="font-bold text-amber-400">{getAuthor(reply)}</span>
                    <span>{formatDate(reply.created_at)}</span>
                  </div>
                  <p className="text-xs text-neutral-300 whitespace-pre-line">{reply.content}</p>
                </div>
              ))
            )}
          </div>

          {/* Formulaire de réponse */}
          <form onSubmit={handleReplySubmit} className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-3">
            <textarea
              rows={3}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              disabled={!isLoggedIn}
              onFocus={() => !isLoggedIn && onRequireLogin()}
              placeholder={
                isLoggedIn
                  ? isEn ? "Write a reply..." : "Écrire une réponse..."
                  : isEn ? "Sign in to reply to this topic..." : "Connectez-vous pour répondre à ce sujet..."
              }
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white outline-none focus:border-amber-500"
            />
            <div className="flex justify-end">
              {isLoggedIn ? (
                <button
                  type="submit"
                  disabled={submitting || !replyContent.trim()}
                  className="py-2.5 px-5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (isEn ? "Sending..." : "Envoi...") : (isEn ? "Reply" : "Répondre")}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onRequireLogin}
                  className="py-2.5 px-5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs cursor-pointer"
                >
                  {isEn ? "Sign in to reply" : "Se connecter pour répondre"}
                </button>
              )}
            </div>
          </form>
        </div>
      ) : (
        /* Liste des sujets */
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 bg-neutral-950 p-4 text-[10px] font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-800">
            <div className="col-span-8 sm:col-span-9">Discussion</div>
            <div className="col-span-4 sm:col-span-3 text-right">Date</div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-neutral-500">
              {isEn ? "Loading topics..." : "Chargement des sujets..."}
            </div>
          ) : topics.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-500 italic">
              {isEn ? "No topics yet." : "Aucun sujet publié."}
            </div>
          ) : (
            topics.map((topic) => (
              <div
                key={topic.id}
                role="button"
                tabIndex={0}
                onClick={() => handleSelectTopic(topic)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleSelectTopic(topic)}
                className="grid grid-cols-12 p-4 items-center border-b border-neutral-800/60 hover:bg-neutral-800/40 transition cursor-pointer"
              >
                <div className="col-span-8 sm:col-span-9 space-y-1">
                  <h3 className="text-xs sm:text-sm font-bold text-white hover:text-amber-400 transition">
                    {topic.title}
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    {isEn ? "by" : "par"}{" "}
                    <span className="text-neutral-300 font-medium">{getAuthor(topic)}</span> •{" "}
                    <span className="text-amber-400/80">{topic.category || "Général"}</span>
                  </p>
                </div>
                <div className="col-span-4 sm:col-span-3 text-right text-xs text-neutral-400 font-medium">
                  {formatDate(topic.created_at)}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}