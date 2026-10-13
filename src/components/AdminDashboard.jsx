import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export default function AdminDashboard() {
  const { user, isLoggedIn } = useAuth();
  const { lang } = useLanguage();
  const isEn = lang === "en";

  // --- États analytiques et de pilotage ---
  const [stats] = useState({
    vues: "14 250",
    likes: "3 840",
    telechargements: "142",
    totalGagne: "1 850,00"
  });

  const [packs, setPacks] = useState([
    { id: 1, nom: "Pack Éditorial France", prix: 300, desc: "Shooting 4h + 10 clichés retouchés + Licence Éditoriale Nationale" },
    { id: 2, nom: "Prestige Monument & Drone", prix: 750, desc: "Cadrage 4K + Droits commerciaux complets pour offices de tourisme" }
  ]);

  // --- États pour la modération Supabase ---
  const [pendingTopics, setPendingTopics] = useState([]);
  const [pendingReplies, setPendingReplies] = useState([]);
  const [jobs, setJobs] = useState([]);
  
  const [activeTab, setActiveTab] = useState("overview"); // 'overview', 'forum', 'jobs', 'pricing'
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    fetchAllContent();
  }, []);

  const fetchAllContent = async () => {
    setLoading(true);
    setMsg(null);
    try {
      // 1. Sujets du forum
      const { data: topics, error: errTopics } = await supabase
        .from("forum_topics")
        .select("*")
        .order("created_at", { ascending: false });
      if (errTopics) throw errTopics;
      setPendingTopics(topics || []);

      // 2. Réponses du forum
      const { data: replies, error: errReplies } = await supabase
        .from("forum_replies")
        .select("*")
        .order("created_at", { ascending: false });
      if (errReplies) throw errReplies;
      setPendingReplies(replies || []);

      // 3. Missions (jobs)
      const { data: jobsData, error: errJobs } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });
      if (errJobs) throw errJobs;
      setJobs(jobsData || []);

    } catch (err) {
      console.warn("Mode hors-ligne ou table Supabase non initialisée :", err.message);
    } finally {
      setLoading(false);
    }
  };

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

  const handlePriceChange = (id, newPrice) => {
    setPacks(packs.map(p => p.id === id ? { ...p, prix: Number(newPrice) } : p));
  };

  if (!isLoggedIn) {
    return (
      <div className="mx-auto w-full max-w-4xl bg-neutral-950 p-8 text-neutral-400 min-h-[70vh] flex items-center justify-center text-sm">
        {isEn ? "Please log in to access the admin dashboard." : "Veuillez vous connecter pour accéder au tableau de bord administrateur."}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl bg-neutral-950 p-4 sm:p-8 text-neutral-200 min-h-screen font-sans space-y-8">
      
      {/* --- EN-TÊTE PRINCIPAL --- */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 border-b border-neutral-800 pb-6">
        <div>
          <span className="text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full font-bold uppercase tracking-widest">
            {isEn ? "Super-Admin Control Center" : "Centre de Super-Administration"}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">
            {isEn ? "Platform Dashboard" : "Tableau de Bord Centralisé"}
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            {isEn ? "Connected as: " : "Connecté en tant que : "} <span className="text-amber-400 font-mono font-bold">{user?.email}</span>
          </p>
        </div>
        
        <button
          onClick={fetchAllContent}
          className="self-start sm:self-auto bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer"
        >
          🔄 {isEn ? "Refresh Data" : "Actualiser les données"}
        </button>
      </div>

      {/* --- ONGLETS DE NAVIGATION DU BACK-OFFICE --- */}
      <div className="flex flex-wrap gap-2 bg-neutral-900 p-1.5 rounded-2xl border border-neutral-800">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer ${
            activeTab === "overview" ? "bg-amber-500 text-neutral-950 shadow" : "text-neutral-400 hover:text-white"
          }`}
        >
          📊 Vue d'ensemble & Stats
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("pricing")}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer ${
            activeTab === "pricing" ? "bg-amber-500 text-neutral-950 shadow" : "text-neutral-400 hover:text-white"
          }`}
        >
          🏷️ Gestion des Prix & Offres
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("forum")}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer ${
            activeTab === "forum" ? "bg-amber-500 text-neutral-950 shadow" : "text-neutral-400 hover:text-white"
          }`}
        >
          💬 Modération Forum ({pendingTopics.length + pendingReplies.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("jobs")}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer ${
            activeTab === "jobs" ? "bg-amber-500 text-neutral-950 shadow" : "text-neutral-400 hover:text-white"
          }`}
        >
          💼 Offres de Missions ({jobs.length})
        </button>
      </div>

      {/* --- CONTENU DES ONGLETS --- */}
      {loading ? (
        <p className="text-xs text-neutral-500 font-mono animate-pulse">Chargement des données du serveur...</p>
      ) : (
        <div className="space-y-6">

          {/* ONGLET 1 : VUE D'ENSEMBLE & STATS */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl space-y-1">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">👁️ Vues Globales</span>
                  <div className="text-2xl font-black text-white font-mono">{stats.vues}</div>
                </div>
                <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl space-y-1 border-red-950/40">
                  <span className="text-[10px] text-rose-500 font-bold uppercase tracking-wider">❤️ Likes Totaux</span>
                  <div className="text-2xl font-black text-rose-500 font-mono">{stats.likes}</div>
                </div>
                <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl space-y-1">
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">📥 Cessions de Droits</span>
                  <div className="text-2xl font-black text-white font-mono">{stats.telechargements}</div>
                </div>
                <div className="bg-gradient-to-br from-neutral-900 to-amber-950/30 border border-amber-900/30 p-5 rounded-2xl space-y-1">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">💰 Chiffre d'Affaires</span>
                  <div className="text-2xl font-black text-emerald-400 font-mono">{stats.totalGagne} €</div>
                </div>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-4">
                <h3 className="text-sm font-bold text-white">Raccourcis de Gestion Rapide</h3>
                <p className="text-xs text-neutral-400">
                  Utilisez les onglets ci-dessus pour modérer instantanément les publications du forum ou ajuster les tarifs des packs exposés sur la plateforme.
                </p>
              </div>
            </div>
          )}

          {/* ONGLET 2 : GESTION DES PRIX */}
          {activeTab === "pricing" && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">🏷️ Ajustement Dynamique des Tarifs (Packs & Licences)</h3>
              <div className="space-y-4 max-w-2xl">
                {packs.map(pack => (
                  <div key={pack.id} className="bg-neutral-950 border border-neutral-800 p-4 rounded-2xl flex justify-between items-center gap-4">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-white">{pack.nom}</h4>
                      <p className="text-[11px] text-neutral-400">{pack.desc}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <input 
                        type="number" 
                        value={pack.prix} 
                        onChange={(e) => handlePriceChange(pack.id, e.target.value)}
                        className="w-20 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-amber-400 text-center outline-none focus:border-amber-400"
                      />
                      <span className="text-xs text-neutral-500 font-bold">€</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ONGLET 3 : MODÉRATION FORUM */}
          {activeTab === "forum" && (
            <div className="space-y-6">
              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-4">
                <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Sujets du Forum ({pendingTopics.length})</h3>
                {pendingTopics.length === 0 ? (
                  <p className="text-xs text-neutral-500 italic">Aucun sujet à modérer.</p>
                ) : (
                  <div className="space-y-3">
                    {pendingTopics.map((topic) => (
                      <div key={topic.id} className="flex items-center justify-between bg-neutral-950 border border-neutral-800 p-4 rounded-2xl">
                        <div>
                          <h4 className="text-xs font-bold text-white">{topic.title}</h4>
                          <p className="text-[11px] text-neutral-400 mt-0.5">{topic.content?.substring(0, 90)}...</p>
                        </div>
                        <button
                          onClick={() => handleDeleteTopic(topic.id)}
                          className="px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-bold cursor-pointer transition"
                        >
                          Supprimer
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-4">
                <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Réponses du Forum ({pendingReplies.length})</h3>
                {pendingReplies.length === 0 ? (
                  <p className="text-xs text-neutral-500 italic">Aucune réponse à modérer.</p>
                ) : (
                  <div className="space-y-3">
                    {pendingReplies.map((reply) => (
                      <div key={reply.id} className="flex items-center justify-between bg-neutral-950 border border-neutral-800 p-4 rounded-2xl">
                        <p className="text-xs text-neutral-300">{reply.content}</p>
                        <button
                          onClick={() => handleDeleteReply(reply.id)}
                          className="px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-bold cursor-pointer transition"
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

          {/* ONGLET 4 : MISSIONS / JOBS */}
          {activeTab === "jobs" && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Flux des Offres de Missions ({jobs.length})</h3>
              {jobs.length === 0 ? (
                <p className="text-xs text-neutral-500 italic">Aucune mission enregistrée.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-neutral-300">
                    <thead className="bg-neutral-950 text-neutral-400 border-b border-neutral-800 uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="p-3">Date</th>
                        <th className="p-3">Titre & Description</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                      {jobs.map((job) => (
                        <tr key={job.id} className="hover:bg-neutral-800/40 transition">
                          <td className="p-3 font-mono text-neutral-400">
                            {new Date(job.created_at).toLocaleDateString("fr-FR")}
                          </td>
                          <td className="p-3">
                            <div className="font-bold text-white">{job.title || job.titre || "Sans titre"}</div>
                            <div className="text-neutral-400 truncate max-w-lg">{job.description}</div>
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