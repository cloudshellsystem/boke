import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

export default function ForumPage({ onRequireLogin }) {
  const { isLoggedIn, user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Général");
  
  const [selectedPost, setSelectedPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [onlineCount, setOnlineCount] = useState(15);

  const fetchPosts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("forum_posts")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (!error && data) {
        setPosts(data);
      }
    } catch (err) {
      console.error("Erreur chargement forum:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    fetchPosts(); 
    const interval = setInterval(() => {
      setOnlineCount((prev) => Math.max(8, prev + (Math.random() > 0.5 ? 1 : -1)));
    }, 15000);
    return () => clearInterval(interval);
  }, [fetchPosts]);

  const fetchReplies = async (postId) => {
    setReplies([]);
    try {
      const { data, error } = await supabase
        .from("forum_replies")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: true });
      
      if (!error && data) {
        setReplies(data);
      }
    } catch (err) {
      console.error("Erreur chargement réponses:", err);
    }
  };

  const handleOpenPost = (post) => {
    setSelectedPost(post);
    setReplyText("");
    fetchReplies(post.id);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) { 
      onRequireLogin?.(); 
      return; 
    }

    if (title.length > 100) {
      alert("Le titre est trop long (maximum 100 caractères).");
      return;
    }

    const { error } = await supabase.from("forum_posts").insert([{ 
      title, 
      content, 
      category, 
      user_name: user?.email ? user.email.split("@")[0] : "Membre" 
    }]);

    if (!error) {
      setTitle(""); 
      setContent(""); 
      setShowForm(false); 
      fetchPosts();
    } else {
      alert("Erreur lors de la publication : " + error.message);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) { 
      onRequireLogin?.(); 
      return; 
    }
    if (!replyText.trim() || !selectedPost) return;

    const { error } = await supabase.from("forum_replies").insert([{
      post_id: selectedPost.id,
      content: replyText,
      user_name: user?.email ? user.email.split("@")[0] : "Membre"
    }]);

    if (!error) {
      setReplyText("");
      fetchReplies(selectedPost.id);
    } else {
      alert("Erreur lors de l'envoi de la réponse : " + error.message);
    }
  };

  // Fonction pour détecter et rendre cliquables les liens / intégrer des images ou vidéos YouTube basiques
  const renderFormattedContent = (text) => {
    if (!text) return null;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        // Détection YouTube
        if (part.includes("youtube.com") || part.includes("youtu.be")) {
          return (
            <div key={index} className="my-2 p-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-amber-400">
              📺 Vidéo partagée : <a href={part} target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-300 break-all">{part}</a>
            </div>
          );
        }
        // Détection Image directe
        if (part.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
          return (
            <div key={index} className="my-2">
              <img src={part} alt="Contenu externe" className="max-h-60 rounded-xl object-contain border border-neutral-800" />
            </div>
          );
        }
        // Lien classique
        return (
          <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-amber-400 underline hover:text-amber-300 break-all">
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-neutral-200 font-sans">
      
      {/* En-tête du forum */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-neutral-800 pb-6 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-amber-400 flex items-center gap-2">
            💬 Forum Communautaire (France)
          </h2>
          <p className="text-xs text-neutral-400 mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-emerald-400 font-bold">{onlineCount} membres</span> en ligne actuellement. Partagez vos liens et vos projets.
          </p>
        </div>

        <button 
          onClick={() => { 
            if (!isLoggedIn) { 
              onRequireLogin?.(); 
            } else { 
              setShowForm(!showForm); 
            } 
          }} 
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-black rounded-xl transition shadow-lg shadow-amber-500/10 cursor-pointer"
        >
          {isLoggedIn ? "+ Nouveau sujet" : "Se connecter pour publier ➔"}
        </button>
      </div>

      {/* Formulaire de création de sujet */}
      {showForm && isLoggedIn && (
        <form onSubmit={handleCreatePost} className="bg-neutral-900/90 border border-neutral-700 p-5 rounded-2xl space-y-4 mb-8 shadow-xl">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-amber-400">Créer une nouvelle discussion</h3>
            <span className="text-[10px] text-neutral-400">Pas d'upload direct d'images • Liens web & YouTube acceptés</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 relative">
              <input 
                type="text" 
                placeholder="Titre de la discussion" 
                value={title} 
                maxLength={100}
                onChange={(e) => setTitle(e.target.value)} 
                className="w-full bg-neutral-950 border border-neutral-800 p-3 rounded-xl text-xs text-white outline-none focus:border-amber-500" 
                required 
              />
              <span className="absolute right-3 bottom-2.5 text-[10px] text-neutral-500">{title.length}/100</span>
            </div>

            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 p-3 rounded-xl text-xs text-white outline-none focus:border-amber-500"
            >
              <option value="Général">📁 Général</option>
              <option value="Présentation">👋 Présentations</option>
              <option value="Matériel & Technique">📷 Matériel & Technique</option>
              <option value="Entraide France">🤝 Entraide France</option>
              <option value="Annonces">📢 Annonces</option>
            </select>
          </div>

          <div className="relative">
            <textarea 
              placeholder="Exprimez-vous ici... Vous pouvez coller des liens web ou des vidéos YouTube." 
              value={content} 
              maxLength={1000}
              onChange={(e) => setContent(e.target.value)} 
              rows={4} 
              className="w-full bg-neutral-950 border border-neutral-800 p-3 rounded-xl text-xs text-white outline-none focus:border-amber-500" 
              required 
            />
            <span className="absolute right-3 bottom-3 text-[10px] text-neutral-500">{content.length}/1000</span>
          </div>

          <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 py-3 rounded-xl font-black text-xs transition">
            🚀 Publier le sujet
          </button>
        </form>
      )}

      {/* Liste des discussions */}
      <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
        <div className="hidden sm:grid grid-cols-12 bg-neutral-950/80 px-5 py-3 text-[11px] font-bold text-neutral-400 border-b border-neutral-800 uppercase tracking-wider">
          <div className="col-span-6">Sujets / Catégories</div>
          <div className="col-span-2 text-center">Type</div>
          <div className="col-span-2 text-center">Auteur</div>
          <div className="col-span-2 text-right">Date & Heure</div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-neutral-400 flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></span>
            Chargement des discussions...
          </div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center text-xs text-neutral-400">
            Aucun sujet pour le moment.
          </div>
        ) : (
          <div className="divide-y divide-neutral-800/60">
            {posts.map((post) => (
              <div 
                key={post.id} 
                onClick={() => handleOpenPost(post)} 
                className="grid grid-cols-1 sm:grid-cols-12 px-5 py-4 items-center hover:bg-neutral-800/40 cursor-pointer transition gap-3 sm:gap-0"
              >
                <div className="sm:col-span-6 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-neutral-800 text-amber-400 px-2.5 py-0.5 rounded-md font-bold">
                      {post.category || "Général"}
                    </span>
                    <h3 className="font-bold text-sm text-neutral-100 hover:text-amber-400 transition line-clamp-1">
                      {post.title}
                    </h3>
                  </div>
                  <p className="text-xs text-neutral-400 line-clamp-1 pl-1">
                    {post.content}
                  </p>
                </div>
                <div className="hidden sm:block sm:col-span-2 text-center text-xs text-neutral-300 font-medium">
                  Discussion
                </div>
                <div className="hidden sm:block sm:col-span-2 text-center text-xs text-amber-400/90 font-medium truncate px-2">
                  {post.user_name || "Anonyme"}
                </div>
                <div className="sm:col-span-2 text-left sm:text-right text-[11px] text-neutral-400 font-medium">
                  {new Date(post.created_at).toLocaleDateString("fr-FR", { day: 'numeric', month: 'short' })} à {new Date(post.created_at).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modale de lecture d'un sujet et de ses réponses */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm" onClick={() => setSelectedPost(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-2xl w-full flex flex-col max-h-[85vh] shadow-2xl overflow-hidden">
            
            <div className="bg-neutral-950 p-5 border-b border-neutral-800 flex justify-between items-center">
              <div>
                <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2.5 py-0.5 rounded font-bold border border-amber-500/20">
                  {selectedPost.category || "Général"}
                </span>
                <h2 className="text-base font-black text-white mt-1">{selectedPost.title}</h2>
              </div>
              <button onClick={() => setSelectedPost(null)} className="text-neutral-400 hover:text-white font-bold text-lg px-2">✕</button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-2xl space-y-2">
                <div className="flex justify-between items-center text-xs text-neutral-400 border-b border-neutral-800/60 pb-2">
                  <span className="text-amber-400 font-bold">👤 {selectedPost.user_name || "Membre"}</span>
                  <span>{new Date(selectedPost.created_at).toLocaleDateString("fr-FR")} à {new Date(selectedPost.created_at).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="text-sm text-neutral-200 whitespace-pre-line pt-1 leading-relaxed">
                  {renderFormattedContent(selectedPost.content)}
                </div>
              </div>

              {replies.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Réponses ({replies.length})</h4>
                  {replies.map((reply) => (
                    <div key={reply.id} className="bg-neutral-900/90 border border-neutral-800/80 p-4 rounded-2xl space-y-2 ml-4 sm:ml-8">
                      <div className="flex justify-between items-center text-xs text-neutral-400 border-b border-neutral-800 pb-2">
                        <span className="text-emerald-400 font-bold">💬 {reply.user_name || "Membre"}</span>
                        <span>{new Date(reply.created_at).toLocaleDateString("fr-FR")} à {new Date(reply.created_at).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="text-xs text-neutral-300 whitespace-pre-line pt-1 leading-relaxed">
                        {renderFormattedContent(reply.content)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Formulaire de réponse */}
            <form onSubmit={handleSendReply} className="bg-neutral-950 border-t border-neutral-800 p-4 space-y-3">
              <div className="relative">
                <textarea 
                  placeholder={isLoggedIn ? "Écrivez votre réponse (liens YouTube ou images acceptés)..." : "Connectez-vous ou abonnez-vous pour participer à la discussion..."} 
                  value={replyText} 
                  maxLength={500}
                  onChange={(e) => setReplyText(e.target.value)} 
                  rows={2} 
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-xs text-neutral-200 outline-none focus:border-amber-500" 
                  required 
                />
                <span className="absolute right-3 bottom-3 text-[10px] text-neutral-500">{replyText.length}/500</span>
              </div>

              <button 
                type="submit" 
                onClick={(e) => {
                  if (!isLoggedIn) {
                    e.preventDefault();
                    onRequireLogin?.();
                  }
                }}
                className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 py-2.5 rounded-xl text-xs font-black transition shadow-md"
              >
                {isLoggedIn ? "🚀 Envoyer ma réponse" : "Se connecter pour participer"}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}