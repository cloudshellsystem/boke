import React, { useState } from "react";

export default function ForumPage() {
  // État de l'utilisateur connecté (simulé localement ou via un pseudo)
  const [currentUser, setCurrentUser] = useState(localStorage.getItem("boke_user") || "");
  const [tempPseudo, setTempPseudo] = useState("");

  const [topics, setTopics] = useState([
    {
      id: 1,
      title: "Quel objectif privilégier pour du portrait en studio avec faible recul ?",
      author: "Marc Vancans",
      category: "Matériel & Technique",
      likedBy: [], // Liste des pseudos qui ont liké
      replies: [
        { id: 1, author: "Sophie Laurent", text: "Un 35mm ou un 50mm fait parfaitement l'affaire !" }
      ]
    }
  ]);

  const [showNewTopicModal, setShowNewTopicModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Matériel & Technique");
  const [replyText, setReplyText] = useState({});

  // Gestion de la connexion / inscription rapide par pseudo
  function handleLogin(e) {
    e.preventDefault();
    if (!tempPseudo.trim()) return;
    localStorage.setItem("boke_user", tempPseudo);
    setCurrentUser(tempPseudo);
    setTempPseudo("");
  }

  function handleLogout() {
    localStorage.removeItem("boke_user");
    setCurrentUser("");
  }

  // Ajouter une discussion
  function handleCreateTopic(e) {
    e.preventDefault();
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

  // Gérer le Like unique (1 like par utilisateur par sujet)
  function handleLike(id) {
    if (!currentUser) {
      alert("Veuillez vous inscrire ou vous connecter pour aimer une publication.");
      return;
    }

    setTopics(topics.map(t => {
      if (t.id === id) {
        const hasLiked = t.likedBy.includes(currentUser);
        if (hasLiked) {
          // Retirer le like si déjà liké
          return { ...t, likedBy: t.likedBy.filter(user => user !== currentUser) };
        } else {
          // Ajouter le like
          return { ...t, likedBy: [...t.likedBy, currentUser] };
        }
      }
      return t;
    }));
  }

  // Ajouter une réponse (uniquement si connecté)
  function handleAddReply(topicId, e) {
    e.preventDefault();
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
      
      {/* Barre d'authentification / Inscription */}
      <div style={{ background: "#0f172a", border: "1px solid #1e293b", padding: "15px", borderRadius: "10px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h2 style={{ margin: "0 0 5px 0", fontSize: "20px" }}>💬 Forum Communautaire Boke One</h2>
          <p style={{ color: "#94a3b8", margin: 0, fontSize: "13px" }}>Discutez technique, partagez vos astuces et échangez entre créatifs.</p>
        </div>

        {currentUser ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "14px", color: "#38bdf8" }}>👤 Connecté en tant que : <strong>{currentUser}</strong></span>
            <button onClick={handleLogout} style={{ background: "#ef4444", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>
              Se déconnecter
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} style={{ display: "flex", gap: "8px" }}>
            <input 
              type="text" 
              placeholder="Votre pseudo pour participer..." 
              value={tempPseudo}
              onChange={(e) => setTempPseudo(e.target.value)}
              style={{ padding: "8px", background: "#1e293b", border: "1px solid #475569", color: "white", borderRadius: "6px", fontSize: "13px" }}
              required
            />
            <button type="submit" style={{ background: "#06b6d4", color: "#0f172a", border: "none", padding: "8px 14px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "13px" }}>
              S'inscrire / Entrer
            </button>
          </form>
        )}
      </div>

      {/* Bouton pour lancer une discussion (Actif si connecté) */}
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

              {/* Formulaire de réponse (Bloqué si non inscrit) */}
              {currentUser ? (
                <form onSubmit={(e) => handleAddReply(t.id, e)} style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                  <input 
                    type="text" 
                    placeholder="Écrire une réponse..." 
                    value={replyText[t.id] || ""}
                    onChange={(e) => setReplyText({ ...replyTest, [t.id]: e.target.value })}
                    style={{ flex: 1, padding: "8px", background: "#1e293b", border: "1px solid #475569", color: "white", borderRadius: "6px", fontSize: "13px" }}
                    required
                  />
                  <button type="submit" style={{ background: "#0891b2", color: "white", border: "none", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}>
                    Répondre
                  </button>
                </form>
              ) : (
                <div style={{ marginTop: "15px", padding: "10px", background: "#1e293b", borderRadius: "6px", fontSize: "12px", color: "#94a3b8", textAlign: "center" }}>
                  🔒 Veuillez entrer un pseudo en haut pour participer à la discussion et répondre.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}