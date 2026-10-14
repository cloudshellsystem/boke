import React, { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

const MAX_CHARS = 1000;
const PENDING_TTL_MS = 10 * 60 * 1000;

const ROLE_LABELS = {
  admin: { fr: "Administrateur", en: "Administrator" },
  elite: { fr: "Premium / Agence", en: "Premium / Agency" },
  pro: { fr: "Pro", en: "Pro" },
  decouverte: { fr: "Découverte", en: "Discovery" },
  essentiel: { fr: "Essentiel", en: "Essential" },
  gratuit: { fr: "Membre Gratuit", en: "Free Member" },
  none: { fr: "Membre Gratuit", en: "Free Member" },
};
const roleLabel = (code, isEn) => (ROLE_LABELS[code] || ROLE_LABELS.none)[isEn ? "en" : "fr"];

export function parseYoutubeId(url) {
  if (!url) return null;
  try {
    const u = new URL(url.trim());
    if (u.protocol !== "https:") return null;
    const host = u.hostname.replace(/^www\./, "").replace(/^m\./, "");
    let id = null;
    if (host === "youtu.be") id = u.pathname.slice(1).split("/")[0];
    else if (host === "youtube.com") {
      if (u.pathname === "/watch") id = u.searchParams.get("v");
      else {
        const m = u.pathname.match(/^\/(embed|shorts)\/([^/]+)/);
        id = m ? m[2] : null;
      }
    }
    return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

export default function ForumPage({ onRequireLogin }) {
  const { lang } = useLanguage();
  const { isLoggedIn, user, profile } = useAuth();
  const isEn = lang === "en";
  const isAdmin = profile?.role === "admin";

  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [showNewTopicForm, setShowNewTopicForm] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [replies, setReplies] = useState([]);
  const [feedback, setFeedback] = useState(null);

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");

  const pendingActionRef = useRef(null);
  const selectedTopic = topics.find((t) => t.id === selectedTopicId) || null;

  const fetchTopics = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("forum_feed")
        .select("*")
        .order("last_activity_at", { ascending: false });
      if (error) throw error;
      setTopics(data || []);
      setLoadError("");
    } catch (err) {
      console.error(err);
      setLoadError(isEn ? "Unable to load the forum." : "Impossible de charger le forum.");
    } finally {
      setLoading(false);
    }
  }, [isEn]);

  const fetchReplies = useCallback(async (topicId) => {
    if (!topicId) return;
    try {
      const { data, error } = await supabase
        .from("forum_replies_feed")
        .select("*")
        .eq("topic_id", topicId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      setReplies(data || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => { fetchTopics(); }, [fetchTopics]);
  useEffect(() => { if (selectedTopicId) fetchReplies(selectedTopicId); }, [selectedTopicId, fetchReplies]);

  const requireLoginFor = (action) => {
    pendingActionRef.current = { ...action, at: Date.now() };
    onRequireLogin?.();
  };

  const handleOpenNewTopic = () => {
    if (!isLoggedIn) { requireLoginFor({ type: "newTopic" }); return; }
    setShowNewTopicForm(true);
  };

  const handleReplyAction = () => {
    if (!isLoggedIn) { requireLoginFor({ type: "reply", topicId: selectedTopicId }); return; }
    setShowReplyBox(true);
  };

  const handleCreateTopic = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("forum_topics").insert({
        title: newTitle.trim(),
        content: newContent.trim(),
        image_url: imageUrl.trim() || null,
        youtube_url: youtubeUrl.trim() || null,
        author_id: user.id
      });
      if (error) throw error;
      setNewTitle(""); setNewContent(""); setImageUrl(""); setYoutubeUrl("");
      setShowNewTopicForm(false);
      setFeedback({ type: "ok", text: isEn ? "Topic submitted for moderation." : "Sujet envoyé à la modération." });
      fetchTopics();
    } catch (err) {
      setFeedback({ type: "error", text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("forum_replies").insert({
        topic_id: selectedTopicId,
        content: replyText.trim(),
        author_id: user.id
      });
      if (error) throw error;
      setReplyText("");
      setShowReplyBox(false);
      fetchReplies(selectedTopicId);
      setFeedback({ type: "ok", text: isEn ? "Reply submitted for moderation." : "Réponse envoyée à la modération." });
    } catch (err) {
      setFeedback({ type: "error", text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 text-neutral-200 font-sans space-y-6">
      
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-neutral-900/60 border border-neutral-800 p-6 rounded-2xl shadow-xl">
        <div>
          <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full font-bold uppercase tracking-widest">
            COMMUNAUTÉ NATIONALE
          </span>
          <h1 className="text-2xl font-black text-white mt-2">💬 Forum &amp; Échanges d'Élite</h1>
          <p className="text-xs text-neutral-400 mt-1">Partagez vos projets, posez vos questions et collaborez entre professionnels.</p>
        </div>
        <button
          onClick={handleOpenNewTopic}
          className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black px-5 py-3 rounded-xl text-xs uppercase tracking-wider transition shadow-lg cursor-pointer shrink-0"
        >
          {isEn ? "+ New Topic" : "+ Nouveau Sujet"}
        </button>
      </div>

      {feedback && (
        <div className={`p-4 rounded-xl text-xs font-bold text-center ${feedback.type === "ok" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
          {feedback.text}
        </div>
      )}

      {loadError && (
        <div className="p-4 rounded-xl text-xs font-bold text-center bg-red-500/10 text-red-400 border border-red-500/20">
          {loadError}
        </div>
      )}

      {/* Modal Nouveau Sujet */}
      {showNewTopicForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-xl rounded-2xl p-6 shadow-2xl space-y-4 relative">
            <button onClick={() => setShowNewTopicForm(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-white font-bold cursor-pointer">✕</button>
            <h3 className="text-base font-black text-amber-400">Créer un nouveau sujet</h3>
            
            <form onSubmit={handleCreateTopic} className="space-y-3 text-xs">
              <div>
                <label className="text-neutral-400 block mb-1 font-bold">Titre</label>
                <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Titre explicite de votre sujet..." required className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-white outline-none focus:border-amber-400" />
              </div>
              <div>
                <label className="text-neutral-400 block mb-1 font-bold">Contenu</label>
                <textarea rows="4" value={newContent} onChange={(e) => setNewContent(e.target.value)} placeholder="Développez votre sujet..." required maxLength={MAX_CHARS} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-white outline-none focus:border-amber-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="URL image (optionnel)" className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white outline-none" />
                <input type="url" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} placeholder="URL YouTube (optionnel)" className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white outline-none" />
              </div>
              <button type="submit" disabled={submitting} className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black py-3 rounded-xl uppercase tracking-wider transition shadow-lg cursor-pointer">
                {submitting ? "Publication..." : "Publier le sujet"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Contenu principal : Liste ou Vue détaillée */}
      {loading ? (
        <p className="text-xs text-neutral-500 font-mono animate-pulse text-center py-12">Chargement du forum...</p>
      ) : selectedTopic ? (
        <div className="space-y-6">
          <button onClick={() => setSelectedTopicId(null)} className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1 cursor-pointer">
            ← Retour aux sujets
          </button>

          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl space-y-4 shadow-xl">
            <div className="flex justify-between items-start">
              <h2 className="text-lg font-black text-white">{selectedTopic.title}</h2>
              <span className="text-[10px] bg-neutral-950 border border-neutral-800 px-2.5 py-1 rounded-full text-amber-400 font-mono">
                {roleLabel(selectedTopic.author_plan, isEn)}
              </span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed whitespace-pre-line">{selectedTopic.content}</p>

            {selectedTopic.image_url && (
              <img src={selectedTopic.image_url} alt="" className="max-h-80 rounded-xl object-cover border border-neutral-800" />
            )}

            <div className="pt-4 border-t border-neutral-800 flex justify-between items-center">
              <span className="text-[11px] text-neutral-500 font-mono">Par {selectedTopic.author_email || 'Membre'}</span>
              <button onClick={handleReplyAction} className="bg-neutral-800 hover:bg-neutral-700 text-amber-400 font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer border border-neutral-700">
                Répondre
              </button>
            </div>
          </div>

          {/* Formulaire de réponse */}
          {showReplyBox && (
            <form onSubmit={handleCreateReply} className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Votre réponse</h4>
              <textarea rows="3" value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Écrivez votre réponse..." required className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white outline-none focus:border-amber-400" />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowReplyBox(false)} className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-xl text-xs font-bold cursor-pointer">Annuler</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-amber-500 text-neutral-950 rounded-xl text-xs font-black cursor-pointer">Envoyer</button>
              </div>
            </form>
          )}

          {/* Liste des réponses */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Réponses ({replies.length})</h3>
            {replies.length === 0 ? (
              <p className="text-xs text-neutral-500 italic">Aucune réponse pour le moment.</p>
            ) : (
              replies.map((r) => (
                <div key={r.id} className="bg-neutral-900/40 border border-neutral-800 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between text-[11px] text-neutral-400 font-mono">
                    <span className="text-amber-400">{r.author_email || 'Membre'}</span>
                    <span>{new Date(r.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-neutral-300">{r.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {topics.length === 0 ? (
            <div className="text-center py-16 bg-neutral-900/40 border border-neutral-800 rounded-2xl space-y-2">
              <p className="text-2xl">💬</p>
              <p className="text-xs text-neutral-400">Aucun sujet pour le moment. Soyez le premier à lancer une discussion !</p>
            </div>
          ) : (
            topics.map((t) => (
              <div key={t.id} onClick={() => setSelectedTopicId(t.id)} className="bg-neutral-900/60 border border-neutral-800 p-5 rounded-2xl cursor-pointer hover:border-neutral-700 transition space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-bold text-white hover:text-amber-400 transition">{t.title}</h3>
                  <span className="text-[10px] bg-neutral-950 border border-neutral-800 px-2 py-0.5 rounded text-amber-400 font-mono uppercase">
                    {roleLabel(t.author_plan, isEn)}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">{t.content}</p>
                <div className="flex justify-between items-center pt-2 text-[11px] text-neutral-500 font-mono">
                  <span>Par {t.author_email || 'Membre'}</span>
                  <span>{new Date(t.last_activity_at || t.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
}