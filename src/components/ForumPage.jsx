import React, { useState } from "react";

export default function ForumPage() {
  const [topics, setTopics] = useState([
    {
      id: 1,
      title: "Quel objectif privilégier pour du portrait en studio avec faible recul ?",
      author: "Marc Vancans",
      category: "Matériel & Technique",
      likes: 14,
      replies: [
        { id: 1, author: "Sophie Laurent", text: "Un 35mm ou un 50mm fait parfaitement l'affaire !" }
      ]
    }
  ]);

  const [showNewTopicModal, setShowNewTopicModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newCategory, setNewCategory] = useState("Matériel & Technique");
  const [replyText, setReplyText] = useState({});

  // Ajouter une discussion
  function handleCreateTopic(e) {
    e.preventDefault();
    if (!newTitle || !newAuthor) return;

    const topic = {
      id: Date.now(),
      title: newTitle,
      author: newAuthor,
      category: newCategory,
      likes: 0,
      replies: []
    };

    setTopics([topic, ...topics]);
    setNewTitle("");
    setNewAuthor("");
    setShowNewTopicModal(false);
  }

  // Ajouter un J'aime
  function handleLike(id) {
    setTopics(topics.map(t => t.id === id ? { ...t, likes: t.likes + 1 } : t));
  }

  // Ajouter une réponse
  function handleAddReply(topicId, e) {
    e.preventDefault();
    const text = replyText[topicId];
    if (!text) return;

    setTopics(topics.map(t => {
      if (t.id === topicId) {
        return {
          ...t,
          replies: [...t.replies, { id: Date.now(), author: "Membre Boke One", text }]
        };
      }
      return t;
    }));

    setReplyText({ ...replyText, [topicId]: "" });
  }

  return (
    <div style={{ color: "white", padding: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h2 style={{ margin: "0 0 5px 0", fontSize: "20px" }}>💬 Forum Communautaire Boke One</h2>
          <p style={{ color: "#94a3b8", margin: 0, fontSize: "13px" }}>Discutez technique, partagez vos astuces et échangez entre créatifs.</p>
        </div>
        <button 
          onClick={() => setShowNewTopicModal(!showNewTopicModal)}
          style={{ background: "#06b6d4", color: "#0f172a", border: "none", padding: "10px 18px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
        >
          🔥 Lancer une discussion
        </button>
      </div>

      {/* Formulaire de création de sujet */}
      {showNewTopicModal && (
        <form onSubmit={handleCreateTopic} style={{ background: "#0f172a", border: "1px solid #06b6d4", padding: "20px", borderRadius: "10px", marginBottom: "20px" }}>
          <h3 style={{ margin: "0 0 15px 0", color: "#38bdf8" }}>Créer un nouveau sujet</h3>
          <div style={{ display: "grid", gap: "10px", marginBottom: "15px" }}>
            <input 
              type="text" 
              placeholder="Votre Nom / Pseudo" 
              value={newAuthor} 
              onChange={(e) => setNewAuthor(e.target.value)}
              style={{ padding: "10px", background: "#1e293b", border: "1px solid #475569", color: "white", borderRadius: "6px" }}
              required 
            />
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
        {topics.map((t) => (
          <div key={t.id} style={{ background: "#0f172a", border: "1px solid #1e293b", padding: "20px", borderRadius: "10px" }}>
            <span style={{ background: "#1e293b", color: "#38bdf8", padding: "4px 10px", borderRadius: "4px", fontSize: "11px", border: "1px solid #334155" }}>
              {t.category}
            </span>
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

            {/* Formulaire pour répondre */}
            <form onSubmit={(e) => handleAddReply(t.id, e)} style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
              <input 
                type="text" 
                placeholder="Écrire une réponse..." 
                value={replyText[t.id] || ""}
                onChange={(e) => setReplyText({ ...replyText, [t.id]: e.target.value })}
                style={{ flex: 1, padding: "8px", background: "#1e293b", border: "1px solid #475569", color: "white", borderRadius: "6px", fontSize: "13px" }}
              />
              <button type="submit" style={{ background: "#0891b2", color: "white", border: "none", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}>
                Répondre
              </button>
              <button type="button" onClick={() => handleLike(t.id)} style={{ background: "#1e293b", color: "#f43f5e", border: "1px solid #475569", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}>
                ❤️ {t.likes}
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}