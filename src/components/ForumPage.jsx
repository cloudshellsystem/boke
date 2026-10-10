// src/components/ForumPage.jsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

/**
 * FORUM — règles d'accès (appliquées côté serveur, voir supabase_05_unified.sql)
 * - Visiteur non connecté : LIT les sujets approuvés (vue publique `forum_feed`, qui lit
 *   la table `forum_topics`). Pour écrire : écran de verrouillage avec cadenas.
 * - Membre connecté (toute offre, y compris Découverte) : peut proposer un sujet. Il est
 *   enregistré dans `forum_topics` avec le statut 'en_attente' (imposé par la RLS).
 * - Admin : voit les sujets en attente et les passe à 'approuve'.
 */
export default function ForumPage({ onRequireLogin }) {
  const { isLoggedIn, isAdmin, user } = useAuth();

  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [pending, setPending] = useState([]);       // file de modération (admin)
  const [myPending, setMyPending] = useState([]);   // mes sujets en attente
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);   // { type: "ok" | "error", text }
  const lastSubmitRef = useRef(0);

  const fetchTopics = useCallback(async () => {
    setLoadError("");
    try {
      const { data, error } = await supabase
        .from("forum_feed")
        .select("id, created_at, title, content, author_name")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setTopics(data || []);
    } catch (err) {
      console.error("Chargement du forum impossible :", err?.message || err);
      setTopics([]);
      setLoadError("Impossible de charger le forum pour le moment.");
    } finally {
      setLoading(false); // libère TOUJOURS l'affichage, succès ou échec
    }
  }, []);

  const fetchPrivate = useCallback(async () => {
    if (!isLoggedIn || !user) {
      setPending([]);
      setMyPending([]);
      return;
    }
    try {
      const mine = await supabase
        .from("forum_topics")
        .select("id, title, created_at")
        .eq("author_id", user.id)
        .eq("status", "en_attente")
        .order("created_at", { ascending: false });
      if (mine.error) throw mine.error;
      setMyPending(mine.data || []);

      if (isAdmin) {
        const queue = await supabase
          .from("forum_topics")
          .select("id, title, content, created_at")
          .eq("status", "en_attente")
          .order("created_at", { ascending: true });
        if (queue.error) throw queue.error;
        setPending(queue.data || []);
      } else {
        setPending([]);
      }
    } catch (err) {
      console.error("Sujets en attente illisibles :", err?.message || err);
    }
  }, [isLoggedIn, isAdmin, user]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  useEffect(() => {
    fetchPrivate();
  }, [fetchPrivate]);

  // Temps réel pour les membres connectés (les visiteurs rechargent la page)
  useEffect(() => {
    if (!isLoggedIn) return undefined;
    const channel = supabase
      .channel("forum_topics_realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "forum_topics" }, () => {
        fetchTopics();
        fetchPrivate();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [isLoggedIn, fetchTopics, fetchPrivate]);

  async function handleCreateTopic(e) {
    e.preventDefault();
    if (!isLoggedIn || !user) {
      onRequireLogin?.();
      return;
    }
    if (submitting) return;
    if (title.trim().length < 5 || content.trim().length < 2) {
      setFeedback({ type: "error", text: "Merci de renseigner un titre (5 caractères minimum) et un message." });
      return;
    }
    if (Date.now() - lastSubmitRef.current < 30000) {
      setFeedback({ type: "error", text: "Patientez quelques secondes avant de publier un nouveau sujet." });
      return;
    }

    setSubmitting(true);
    setFeedback(null);
    try {
      // Le statut 'en_attente' et l'auteur sont de toute façon imposés par la RLS côté serveur.
      const { error } = await supabase.from("forum_topics").insert([
        { title: title.trim(), content: content.trim(), author_id: user.id, status: "en_attente" },
      ]);
      if (error) throw error;
      lastSubmitRef.current = Date.now();
      setTitle("");
      setContent("");
      setShowForm(false);
      setFeedback({ type: "ok", text: "✅ Votre sujet a été envoyé : il sera visible après validation par un modérateur." });
      fetchPrivate();
    } catch (err) {
      console.error("Création du sujet impossible :", err?.message || err);
      setFeedback({ type: "error", text: "Votre sujet n'a pas pu être envoyé. Réessayez dans un instant." });
    } finally {
      setSubmitting(false);
    }
  }

  async function approuver(id) {
    try {
      const { error } = await supabase.from("forum_topics").update({ status: "approuve" }).eq("id", id);
      if (error) throw error;
      fetchTopics();
      fetchPrivate();
    } catch (err) {
      console.error("Approbation impossible :", err?.message || err);
      setFeedback({ type: "error", text: "Approbation impossible. Réessayez." });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-white">💬 Forum Communautaire</h2>
          <p className="text-xs text-slate-400 mt-1">Chaque sujet est validé par un modérateur avant publication.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl cursor-pointer shadow-lg transition-colors whitespace-nowrap"
        >
          {showForm ? "✕ Annuler" : "+ Nouveau sujet"}
        </button>
      </div>

      {feedback && (
        <p
          role={feedback.type === "error" ? "alert" : "status"}
          className={`text-xs rounded-xl px-4 py-3 border ${
            feedback.type === "error"
              ? "bg-rose-500/10 border-rose-500/20 text-rose-300"
              : "bg-amber-500/10 border-amber-500/20 text-amber-300"
          }`}
        >
          {feedback.text}
        </p>
      )}

      {/* Écran de verrouillage : écrire un sujet nécessite d'être connecté */}
      {showForm && !isLoggedIn && (
        <div className="bg-[#0e1424] border-2 border-amber-500/40 p-8 rounded-2xl text-center space-y-4">
          <div className="text-3xl">🔒</div>
          <h3 className="text-sm font-black text-white">Connexion requise pour écrire</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Vous pouvez lire le forum librement. Pour créer un sujet, connectez-vous ou créez un compte.
          </p>
          <button
            type="button"
            onClick={onRequireLogin}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl cursor-pointer shadow-lg transition-colors"
          >
            Se connecter / S'inscrire
          </button>
        </div>
      )}

      {showForm && isLoggedIn && (
        <form onSubmit={handleCreateTopic} className="bg-[#0e1424] border border-slate-800 p-5 rounded-2xl space-y-3">
          <input
            type="text"
            placeholder="Titre du sujet"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
            className="w-full bg-[#070b12] border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
          />
          <textarea
            rows={4}
            placeholder="Votre message…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={5000}
            className="w-full bg-[#070b12] border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-950 text-xs font-black rounded-xl cursor-pointer shadow-lg transition-colors"
            >
              {submitting ? "Envoi…" : "Publier (soumis à modération)"}
            </button>
          </div>
        </form>
      )}

      {/* Panneau de modération : affichage réservé à l'admin ; la vraie protection est la RLS */}
      {isAdmin && (
        <div className="bg-[#0e1424] border border-amber-500/30 p-5 rounded-2xl space-y-3">
          <h3 className="text-sm font-black text-amber-400">🛡️ Modération — {pending.length} sujet(s) en attente</h3>
          {pending.length === 0 ? (
            <p className="text-xs text-slate-500">Rien à modérer pour l'instant.</p>
          ) : (
            <div className="space-y-2">
              {pending.map((t) => (
                <div key={t.id} className="bg-[#070b12] border border-slate-800 p-3 rounded-xl flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{t.title}</p>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{t.content}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => approuver(t.id)}
                    className="shrink-0 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[11px] font-black rounded-lg cursor-pointer"
                  >
                    ✓ Approuver
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {myPending.length > 0 && (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 space-y-2">
          <p className="text-[11px] font-bold text-amber-400">Vos sujets en attente de validation :</p>
          {myPending.map((t) => (
            <p key={t.id} className="text-xs text-slate-300">• {t.title}</p>
          ))}
        </div>
      )}

      {loading ? (
        <p className="text-xs text-slate-400 text-center py-10">Chargement…</p>
      ) : loadError ? (
        <div className="text-center py-10 space-y-3">
          <p role="alert" className="text-xs text-rose-300">{loadError}</p>
          <button
            type="button"
            onClick={() => { setLoading(true); fetchTopics(); }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Réessayer
          </button>
        </div>
      ) : topics.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-10">Aucun sujet publié pour l'instant.</p>
      ) : (
        <div className="space-y-3">
          {topics.map((t) => (
            <div key={t.id} className="bg-[#0e1424] border border-slate-800 p-5 rounded-2xl space-y-2">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-white">{t.title}</h3>
                <span className="text-[10px] text-slate-500 shrink-0">{new Date(t.created_at).toLocaleDateString("fr-FR")}</span>
              </div>
              <p className="text-[10px] text-amber-400/80">Par {t.author_name}</p>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{t.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
