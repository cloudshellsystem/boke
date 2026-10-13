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
    return id && /^[A-Za-z0-9_-]{11}\$/.test(id) ? id : null;
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
  const [pendingTopics, setPendingTopics] = useState([]);
  const [pendingReplies, setPendingReplies] = useState([]);

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

  const fetchModeration = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const [t, r] = await Promise.all([
        supabase.from("forum_topics").select("*").eq("status", "en_attente"),
        supabase.from("forum_replies").select("*").eq("status", "en_attente"),
      ]);
      setPendingTopics(t.data || []);
      setPendingReplies(r.data || []);
    } catch (err) {
      console.error(err);
    }
  }, [isAdmin]);

  useEffect(() => { fetchTopics(); }, [fetchTopics]);
  useEffect(() => { fetchModeration(); }, [fetchModeration]);
  useEffect(() => { if (selectedTopicId) fetchReplies(selectedTopicId); }, [selectedTopicId, fetchReplies]);

  useEffect(() => {
    if (!isLoggedIn) return undefined;
    const channel = supabase
      .channel("forum_realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "forum_topics" }, () => { fetchTopics(); fetchModeration(); })
      .on("postgres_changes", { event: "*", schema: "public", table: "forum_replies" }, () => { fetchTopics(); fetchModeration(); if (selectedTopicId) fetchReplies(selectedTopicId); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [isLoggedIn, selectedTopicId, fetchTopics, fetchModeration, fetchReplies]);

  const requireLoginFor = (action) => {
    pendingActionRef.current = { ...action, at: Date.now() };
    setSelectedTopicId(null);
    setShowReplyBox(false);
    onRequireLogin?.();
  };

  useEffect(() => {
    if (!isLoggedIn || !pendingActionRef.current) return;
    const action = pendingActionRef.current;
    pendingActionRef.current = null;
    if (Date.now() - action.at > PENDING_TTL_MS) return;
    if (action.type === "newTopic") setShowNewTopicForm(true);
    if (action.type === "reply") {
      setSelectedTopicId(action.topicId);
      setShowReplyBox(true);
    }
  }, [isLoggedIn]);

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
    <div className="w-full max-w-6xl mx-auto p-4 text-neutral-200 font-sans space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-black text-white uppercase tracking-wider">💬 Forum National</h1>
        <button onClick={handleOpenNewTopic} className="bg-amber-500 text-neutral-950 font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wider">
          {isEn ? "+ New Topic" : "+ Nouveau Sujet"}
        </button>
      </div>

      {feedback && (
        <div className={`p-3 rounded-xl text-xs font-bold text-center ${feedback.type === "ok" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
          {feedback.text}
        </div>
      )}

      {loading ? (
        <p className="text-xs text-neutral-500 font-mono animate-pulse">Chargement...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-3">
            {topics.map(t => (
              <div key={t.id} onClick={() => setSelectedTopicId(t.id)} className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl cursor-pointer hover:border-neutral-700 transition">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-bold text-white">{t.title}</h4>
                  <span className="text-[10px] bg-neutral-950 px-2 py-0.5 rounded text-amber-400 font-mono">{roleLabel(t.author_plan, isEn)}</span>
                </div>
                <p className="text-xs text-neutral-400 mt-2 line-clamp-2">{t.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
