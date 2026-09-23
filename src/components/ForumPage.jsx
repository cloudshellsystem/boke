import React, { useState, useEffect } from "react";
// Assure-toi que le chemin vers ton client supabase est correct
// import { supabase } from "../supabaseClient"; 

export default function ForumPage() {
  // Récupération de l'utilisateur authentifié (depuis Supabase ou ton state global)
  // Pour l'instant, on vérifie si un utilisateur est enregistré via ton espace Profils/Connexion
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Exemple : Vérification dans le localStorage ou via Supabase session
    const savedUser = localStorage.getItem("boke_logged_user") || localStorage.getItem("boke_user");
    if (savedUser) {
      setCurrentUser(savedUser);
    }
  }, []);

  const [topics, setTopics] = useState([
    {
      id: 1,
      title: "Quel objectif privilégier pour du portrait en studio avec faible recul ?",
      author: "Marc Vancans",
      category: "Matériel & Technique",
      likedBy: [],
      replies: [
        { id: 1, author: "Sophie Laurent", text: "Un 35mm ou un 50mm fait parfaitement l'affaire !" }
      ]
    }
  ]);

  const [showNewTopicModal, setShowNewTopicModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Matériel & Technique");
  const [replyText, setReplyText] = useState({});

  // Ajouter une discussion (Uniquement si connecté officiellement)
  function handleCreateTopic(e) {
    e.preventDefault();
    if (!currentUser) {
      alert("Accès refusé : Vous devez vous inscrire et vous connecter officiellement sur Boke One pour créer un sujet.");
      return;
    }
    if (!newTitle.trim()) return;

    const topic = {
      id: Date.now(),
      title: newTitle,
      author: currentUser,
      category: newCategory,
      likedBy: [],
      replies: []
    };

    setTopics([topic, ...topics]);
    setNewTitle("");
    setShowNewTopicModal(false);
  }

  // Gérer le Like unique
  function handleLike(id) {
    if (!currentUser) {
      alert("Veuillez vous connecter à votre compte officiel pour aimer une publication.");
      return;
    }

    setTopics(topics.map(t => {
      if (t.id === id) {
        const hasLiked = t.likedBy.includes(currentUser);
        if (hasLiked) {
          return { ...t, likedBy: t.likedBy.filter(user => user !== currentUser) };
        } else {
          return { ...t, likedBy: [...t.likedBy, currentUser] };
        }
      }
      return t;
    }));
  }

  // Ajouter une réponse
  function handleAddReply(topicId, e) {
    e.preventDefault();
    if (!currentUser) {
      alert("Veuillez vous connecter pour répondre.");
      return;
    }
    const text = replyText[topicId];
    if (!text || !text.trim()) return;

    setTopics(topics.map(t => {
      if (t.id === topicId) {
        return {
          ...t,
          replies: [...t.replies, { id: Date.now(), author: currentUser, text }]
        };
      }
      return t;
    }));

    setReplyText({ ...replyText, [topicId]: "" });
  }

  return (
    <div style={{ color: "white", padding: "10px", maxWidth: "900px", margin: "0 auto" }}>
      
      {/* En-tête du Forum */}
      <div style={{ background: "#0f172a", border: "1px solid #1e293b", padding: "20px", borderRadius: "10px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
        <div>
          <h2 style={{ margin: "0 0 5px 0", fontSize: "20px" }}>💬 Forum Communautaire Boke One</h2>
          <p style={{ color: "#94a3b8", margin: 0, fontSize: "13px" }}>Espace d'échange sécurisé réservé aux membres inscrits.</p>
        </div>

        {/* Affichage de l'état de connexion officiel */}
        {currentUser ? (
          <div style={{ background: "#1e293b", padding: "8px 15px", borderRadius: "8px", border: "1px solid #334155" }}>
            <span style={{ fontSize: "13px", color: "#38bdf8" }}>👤 Membre : <strong>{currentUser}</strong></span>
          </div>
        ) : (
          <div style={{ background: "#1e293b", padding: "12px", borderRadius: "8px", border: "1px solid #f43f5e", textAlign: "center" }}>
            <span style={{ fontSize: "13px", color: "#f43f5e", display: "block", marginBottom: "5px" }}>🔒 Vous n'êtes pas connecté</span>
            <span style={{ fontSize: "12px", color: "#94a3b8" }}>Veuillez vous inscrire via l'onglet <strong>Profils</strong> pour participer.</span>
          </div>
        )}
      </div>

      {/* Bouton pour lancer une discussion (Actif uniquement si connecté) */}
      {currentUser && (
        <div style={{ marginBottom: "20px" }}>
          <button 
            onClick={() => setShowNewTopicModal(!showNewTopicModal)}
            style={{ background: "#06b6d4", color: "#0f172a", border: "none", padding: "10px 18px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
          >
            🔥 Lancer une discussion
          </button>
        </div>
      )}

      {/* Formulaire de création de sujet */}
      {showNewTopicModal && currentUser && (
        <form onSubmit={handleCreateTopic} style={{ background: "#0f172a", border: "1px solid #06b6d4", padding: "20px", borderRadius: "10px", marginBottom: "20px" }}>
          <h3 style={{ margin: "0 0 15px 0", color: "#38bdf8" }}>Créer un nouveau sujet</h3>
          <div style={{ display: "grid", gap: "10px", marginBottom: "15px" }}>
            <input 
              type="text" 
              placeholder="Titre de la discussion..." 
              value={newTitle} 
              onChange={(e) => setNewTitle(e.target.value)}
              style={{ padding: "10px", background: "#1e293b", border: "1px solid #475569", color: "white", borderRadius: "6px" }}
              required 
            />
            <select 
              value={newCategory} 
              onChange={(e) => setNewCategory(e.target.value)}
              style={{ padding: "10px", background: "#1e293b", border: "1px solid #475569", color: "white", borderRadius: "6px" }}
            >
              <option>Matériel & Technique</option>
              <option>Business & Juridique</option>
              <option>Montage & Étalonnage</option>
            </select>
          </div>
          <button type="submit" style={{ background: "#10b981", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>
            Publier le sujet
          </button>
        </form>
      )}

      {/* Liste des discussions */}
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {topics.map((t) => {
          const hasUserLiked = currentUser && t.likedBy.includes(currentUser);
          return (
            <div key={t.id} style={{ background: "#0f172a", border: "1px solid #1e293b", padding: "20px", borderRadius: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ background: "#1e293b", color: "#38bdf8", padding: "4px 10px", borderRadius: "4px", fontSize: "11px", border: "1px solid #334155" }}>
                  {t.category}
                </span>
                <button 
                  onClick={() => handleLike(t.id)} 
                  style={{ background: hasUserLiked ? "#f43f5e" : "#1e293b", color: hasUserLiked ? "white" : "#f43f5e", border: "1px solid #475569", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
                >
                  ❤️ {t.likedBy.length} {hasUserLiked ? "(Liké)" : "J'aime"}
                </button>
              </div>

              <h3 style={{ margin: "10px 0 5px 0", fontSize: "16px" }}>{t.title}</h3>
              <span style={{ color: "#64748b", fontSize: "12px" }}>Par {t.author}</span>

              {/* Réponses existantes */}
              <div style={{ margin: "15px 0", paddingLeft: "15px", borderLeft: "2px solid #334155" }}>
                {t.replies.map((r) => (
                  <div key={r.id} style={{ fontSize: "13px", marginBottom: "8px" }}>
                    <strong style={{ color: "#38bdf8" }}>{r.author} : </strong> {r.text}
                  </div>
                ))}
              </div>

              {/* Formulaire de réponse conditionnel */}
              {currentUser ? (
                <form onSubmit={(e) => handleAddReply(t.id, e)} style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                  <input 
                    type="text" 
                    placeholder="Écrire une réponse..." 
                    value={replyText[t.id] || ""}
                    onChange={(e) => setReplyText({ ...replyText, [t.id]: e.target.value })}
                    style={{ flex: 1, padding: "8px", background: "#1e293b", border: "1px solid #475569", color: "white", borderRadius: "6px", fontSize: "13px" }}
                    required
                  />
                  <button type="submit" style={{ background: "#0891b2", color: "white", border: "none", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}>
                    Répondre
                  </button>
                </form>
              ) : (
                <div style={{ marginTop: "15px", padding: "10px", background: "#1e293b", borderRadius: "6px", fontSize: "12px", color: "#f43f5e", textAlign: "center" }}>
                  🔒 Vous devez être inscrit et connecté via l'onglet <strong>Profils</strong> pour répondre à cette discussion.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}