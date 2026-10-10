import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

const FALLBACK = [
  { id: "local-1", title: "Bienvenue sur le forum Boké One", content: "Échangez ici entre créateurs et professionnels !" },
];

export default function ForumPage({ onRequireLogin }) {
  const { isLoggedIn, user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("forum_topics")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data?.length ? data : FALLBACK);
    } catch (err) {
      console.warn("Erreur chargement forum :", err.message);
      setPosts(FALLBACK);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) return onRequireLogin?.();
    if (!title.trim() || !content.trim()) return;

    setSending(true);
    setError("");

    try {
      const { error } = await supabase
        .from("forum_topics")
        .insert({ title: title.trim(), content: content.trim(), user_id: user?.id });

      if (error) throw error;
      setTitle("");
      setContent("");
      await fetchPosts();
    } catch (err) {
      setError(err.message || "Publication impossible.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-neutral-950 min-h-screen text-neutral-200 font-sans">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <h2 className="text-lg font-black text-white">💬 Forum</h2>

        {/* Zone d'écriture */}
        {isLoggedIn ? (
          <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre du sujet"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 outline-none focus:border-amber-500/50"
            />
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Votre message..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 outline-none focus:border-amber-500/50"
            />
            {error && <p className="text-xs text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={sending}
              className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 px-5 py-2.5 rounded-xl font-black text-xs transition cursor-pointer"
            >
              {sending ? "..." : "Publier"}
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => onRequireLogin?.()}
            className="w-full bg-neutral-900 border border-neutral-800 hover:border-amber-500/30 rounded-2xl p-5 text-left transition cursor-pointer"
          >
            <span className="text-xs font-bold text-amber-400">🔒 Connectez-vous pour écrire sur le forum</span>
          </button>
        )}

        {/* Liste */}
        {loading ? (
          <p className="text-sm text-neutral-500 text-center py-8">Chargement...</p>
        ) : (
          <div className="space-y-3">
            {posts.map((p) => (
              <div key={p.id} className="bg-neutral-900/50 border border-neutral-900 rounded-2xl p-5 hover:border-amber-500/30 transition">
                <h4 className="text-sm font-bold text-neutral-100 mb-1">{p.title}</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">{p.content}</p>
                {p.created_at && (
                  <p className="text-[10px] text-neutral-600 mt-2">
                    {new Date(p.created_at).toLocaleDateString("fr-FR")}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}