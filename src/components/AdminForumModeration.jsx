import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export default function AdminForumModeration() {
  const { user, isLoggedIn } = useAuth();
  const { lang } = useLanguage();
  const isEn = lang === "en";

  // --- États pour le Forum ---
  const [pendingTopics, setPendingTopics] = useState([]);
  const [pendingReplies, setPendingReplies] = useState([]);
  
  // --- États pour les Missions (Jobs) ---
  const [jobs, setJobs] = useState([]);
  
  // --- États de contrôle globaux ---
  const [moderationSection, setModerationSection] = useState("forum"); // 'forum' ou 'jobs'
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    fetchAllContent();
  }, []);

  const fetchAllContent = async () => {
    setLoading(true);
    setMsg(null);
    try {
      // 1. Récupération des sujets du forum
      const { data: topics, error: errTopics } = await supabase
        .from("forum_topics")
        .select("*")
        .order("created_at", { ascending: false });
      if (errTopics) throw errTopics;
      setPendingTopics(topics || []);

      // 2. Récupération des réponses du forum
      const { data: replies, error: errReplies } = await supabase
        .from("forum_replies")
        .select("*")
        .order("created_at", { ascending: false });
      if (errReplies) throw errReplies;
      setPendingReplies(replies || []);

      // 3. Récupération des missions de la table jobs
      const { data: jobsData, error: errJobs } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });
      if (errJobs) throw errJobs;
      setJobs(jobsData || []);

    } catch (err) {
      setMsg({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  // --- Actions de suppression ---
  const handleDeleteTopic = async (id) => {
    if (!window.confirm(isEn ? "Delete this topic?" : "Supprimer ce sujet ?")) return;
    const { error } = await supabase.from("forum_topics").delete().eq("id", id);
    if (!error) setPendingTopics(pendingTopics.filter((t) => t.id !== id));
  };

  const handleDeleteReply = async (id) => {
    if (!window.confirm(isEn ? "Delete this reply?" : "Supprimer cette réponse ?")) return;
    const { error } = await supabase.from("forum_replies").delete().eq("id", id);
    if (!error) setPendingReplies(pendingReplies.filter((r) => r.id !== id));
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm(isEn ? "Delete this job offer?" : "Supprimer cette offre de mission ?")) return;
    const { error } = await supabase.from("jobs").delete().eq("id", id);
    if (!error) setJobs(jobs.filter((j) => j.id !== id));
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
      
      {/* En-tête principal */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <span className="text-[10px] bg-red-500/15 text-red-400 border border-red-500/30 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
            {isEn ? "Admin Security" : "Sécurité Administration"}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1.5">
            {isEn ? "Centralized Moderation Panel" : "Panneau de Modération Centralisé"}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
            {isEn ? "Connected as: " : "Connecté en tant que : "} <span className="text-white font-mono">{user?.email}</span>
          </p>
        </div>
        
        <button
          onClick={fetchAllContent}
          className="self-start sm:self-auto bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer"
        >
          🔄 {isEn ? "Refresh Data" : "Actualiser les données"}
        </button>
      </div>

      {msg?.type === "error" && (
        <div className="p-3 bg-red-500/10 border border-red-500/40 rounded-xl text-red-400 text-xs font-semibold">
          {msg.message}
        </div>
      )}

      {/* --- Onglets de Sélection de Modération --- */}
      <div className="flex bg-neutral-900 p-1 rounded-xl border border-neutral-800 max-w-md">
        <button
          type="button"
          onClick={() => setModerationSection("forum")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
            moderationSection === "forum" ? "bg-amber-500 text-neutral-950 shadow" : "text-neutral-400 hover:text-white"
          }`}
        >
          💬 Forum ({pendingTopics.length + pendingReplies.length})
        </button>
        <button
          type="button"
          onClick={() => setModerationSection("jobs")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
            moderationSection === "jobs" ? "bg-amber-500 text-neutral-950 shadow" : "text-neutral-400 hover:text-white"
          }`}
        >
          💼 Offres de Missions ({jobs.length})
        </button>
      </div>

      {loading ? (
        <p className="text-xs text-neutral-500 font-mono animate-pulse">Chargement des contenus...</p>
      ) : (
        <div className="space-y-6">
          
          {/* ====== SECTION A : MODÉRATION DU FORUM ====== */}
          {moderationSection === "forum" && (
            <div className="space-y-6">
              {/* Sujets */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Sujets du Forum ({pendingTopics.length})</h3>
                {pendingTopics.length === 0 ? (
                  <p className="text-xs text-neutral-500 italic">Aucun sujet.</p>
                ) : (
                  <div className="space-y-3">
                    {pendingTopics.map((topic) => (
                      <div key={topic.id} className="flex items-center justify-between bg-neutral-950 border border-neutral-800 p-4 rounded-xl hover:border-neutral-700 transition">
                        <div>
                          <h4 className="text-xs font-bold text-white">{topic.title}</h4>
                          <p className="text-[11px] text-neutral-400 mt-0.5">{topic.content?.substring(0, 80)}...</p>
                        </div>
                        <button
                          onClick={() => handleDeleteTopic(topic.id)}
                          className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-bold cursor-pointer transition"
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
                <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Réponses du Forum ({pendingReplies.length})</h3>
                {pendingReplies.length === 0 ? (
                  <p className="text-xs text-neutral-500 italic">Aucune réponse.</p>
                ) : (
                  <div className="space-y-3">
                    {pendingReplies.map((reply) => (
                      <div key={reply.id} className="flex items-center justify-between bg-neutral-950 border border-neutral-800 p-4 rounded-xl hover:border-neutral-700 transition">
                        <div>
                          <p className="text-xs text-neutral-300">{reply.content}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteReply(reply.id)}
                          className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-bold cursor-pointer transition"
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

          {/* ====== SECTION B : MODÉRATION DES MISSIONS (JOBS) ====== */}
          {moderationSection === "jobs" && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Flux des demandes de prestations ({jobs.length})</h3>
              {jobs.length === 0 ? (
                <p className="text-xs text-neutral-500 italic">Aucune offre de mission en ligne.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-neutral-300">
                    <thead className="bg-neutral-950 text-neutral-400 border-b border-neutral-800 uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="p-3">Date</th>
                        <th className="p-3">Titre / Description</th>
                        <th className="p-3">Auteur / ID</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                      {jobs.map((job) => (
                        <tr key={job.id} className="hover:bg-neutral-800/50 transition">
                          <td className="p-3 font-mono text-neutral-400">
                            {new Date(job.created_at).toLocaleDateString("fr-FR")}
                          </td>
                          <td className="p-3">
                            <div className="font-bold text-white">{job.title || job.titre || "Sans titre"}</div>
                            <div className="text-neutral-400 truncate max-w-md">{job.description}</div>
                          </td>
                          <td className="p-3 font-mono text-neutral-500 truncate max-w-[120px]">
                            {job.user_id || "Anonyme"}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleDeleteJob(job.id)}
                              className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-bold cursor-pointer transition"
                            >
                              Supprimer
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
}