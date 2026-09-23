import React, { useState, useEffect } from "react";

export default function ForumPage() {
  // Utilisateur connecté au forum
  const [forumUser, setForumUser] = useState(localStorage.getItem("boke_forum_user") || null);

  // États pour la gestion de l'authentification du Forum
  const [authMode, setAuthMode] = useState("login"); // "login", "register", "verify"
  const [emailInput, setEmailInput] = useState("");
  const [pseudoInput, setPseudoInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [sentCode, setSentCode] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [pendingPseudo, setPendingPseudo] = useState("");

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

  // Simulation d'envoi de code par e-mail lors de l'inscription
  function handleStartRegister(e) {
    e.preventDefault();
    if (!emailInput || !pseudoInput || !passwordInput) return;

    // Générer un code aléatoire à 4 chiffres
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setSentCode(code);
    setPendingEmail(emailInput);
    setPendingPseudo(pseudoInput);

    // Simulation d'envoi d'e-mail (Alerte pour test + affichage discret)
    alert(`[SIMULATION EMAIL] Un code de validation a été envoyé à ${emailInput}.\nVotre code secret est : ${code}`);
    
    setAuthMode("verify");
  }

  // Validation du code reçu par email
  function handleVerifyCode(e) {
    e.preventDefault();
    if (verificationCode === sentCode) {
      alert("Inscription validée avec succès ! Bienvenue sur le forum.");
      localStorage.setItem("boke_forum_user", pendingPseudo);
      setForumUser(pendingPseudo);
      setAuthMode("login");
      setVerificationCode("");
    } else {
      alert("Code incorrect. Veuillez réessayer.");
    }
  }

  // Connexion simple pour un membre déjà inscrit
  function handleLogin(e) {
    e.preventDefault();
    if (!pseudoInput) return;
    localStorage.setItem("boke_forum_user", pseudoInput);
    setForumUser(pseudoInput);
    setPseudoInput("");
  }

  function handleLogout() {
    localStorage.removeItem("boke_forum_user");
    setForumUser(null);
  }

  // Création d'un sujet
  function handleCreateTopic(e) {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const topic = {
      id: Date.now(),
      title: newTitle,
      author: forumUser,
      category: newCategory,
      likedBy: [],
      replies: []
    };

    setTopics([topic, ...topics]);
    setNewTitle("");
    setShowNewTopicModal(false);
  }

  // Like unique
  function handleLike(id) {
    setTopics(topics.map(t => {
      if (t.id === id) {
        const hasLiked = t.likedBy.includes(forumUser);
        if (hasLiked) {
          return { ...t, likedBy: t.likedBy.filter(u => u !== forumUser) };
        } else {
          return { ...t, likedBy: [...t.likedBy, forumUser] };
        }
      }
      return t;
    }));
  }

  // Réponse à un sujet
  function handleAddReply(topicId, e) {
    e.preventDefault();
    const text = replyText[topicId];
    if (!text || !text.trim()) return;

    setTopics(topics.map(t => {
      if (t.id === topicId) {
        return {
          ...t,
          replies: [...t.replies, { id: Date.now(), author: forumUser, text }]
        };
      }
      return t;
    }));

    setReplyText({ ...replyText, [topicId]: "" });
  }

  return (
    <div style={{ color: "white", padding: "10px", maxWidth: "900px", margin: "0 auto" }}>
      
      {/* En-tête & Espace Authentification Forum */}
      <div style={{ background: "#0f172a", border: "1px solid #1e293b", padding: "20px", borderRadius: "10px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
          <div>
            <h2 style={{ margin: "0 0 5px 0", fontSize: "20px" }}>💬 Forum Communautaire Boke One</h2>
            <p style={{ color: "#94a3b8", margin: 0, fontSize: "13px" }}>Discutez entre créatifs (Anti-flood activé par validation e-mail).</p>
          </div>

          {forumUser ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#1e293b", padding: "8px 15px", borderRadius: "8px", border: "1px solid #334155" }}>
              <span style={{ fontSize: "13px", color: "#38bdf8" }}>👤 <strong>{forumUser}</strong></span>
              <button onClick={handleLogout} style={{ background: "#ef4444", color: "white", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer", fontSize: "11px" }}>
                Déconnexion
              </button>
            </div>
          ) : null}
        </div>

        {/* Formulaires d'authentification si non connecté */}
        {!forumUser && (
          <div style={{ marginTop: "15px", background: "#1e293b", padding: "15px", borderRadius: "8px", border: "1px solid #334155" }}>
            
            {authMode === "login" && (
              <div>
                <h4 style={{ margin: "0 0 10px 0", color: "#38bdf8", fontSize: "14px" }}>🔑 Connexion au Forum</h4>
                <form onSubmit={handleLogin} style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <input 
                    type="text" 
                    placeholder="Votre Pseudo du Forum" 
                    value={pseudoInput}
                    onChange={(e) => setPseudoInput(e.target.value)}
                    style={{ flex: 1, padding: "8px", background: "#0f172a", border: "1px solid #475569", color: "white", borderRadius: "6px", fontSize: "13px" }}
                    required
                  />
                  <button type="submit" style={{ background: "#06b6d4", color: "#0f172a", border: "none", padding: "8px 16px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "13px" }}>
                    Se connecter
                  </button>
                  <button type="button" onClick={() => setAuthMode("register")} style={{ background: "transparent", color: "#38bdf8", border: "1px solid #38bdf8", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}>
                    Créer un compte forum
                  </button>
                </form>
              </div>
            )}

            {authMode === "register" && (
              <div>
                <h4 style={{ margin: "0 0 10px 0", color: "#10b981", fontSize: "14px" }}>✨ Inscription Rapide au Forum (Sécurisée Anti-Flood)</h4>
                <form onSubmit={handleStartRegister} style={{ display: "grid", gap: "10px" }}>
                  <input 
                    type="email" 
                    placeholder="Votre Adresse E-mail (pour recevoir le code)" 
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    style={{ padding: "8px", background: "#0f172a", border: "1px solid #475569", color: "white", borderRadius: "6px", fontSize: "13px" }}
                    required
                  />
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input 
                      type="text" 
                      placeholder="Choisissez un Pseudo" 
                      value={pseudoInput}
                      onChange={(e) => setPseudoInput(e.target.value)}
                      style={{ flex: 1, padding: "8px", background: "#0f172a", border: "1px solid #475569", color: "white", borderRadius: "6px", fontSize: "13px" }}
                      required
                    />
                    <input 
                      type="password" 
                      placeholder="Mot de passe" 
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      style={{ flex: 1, padding: "8px", background: "#0f172a", border: "1px solid #475569", color: "white", borderRadius: "6px", fontSize: "13px" }}
                      required
                    />
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button type="submit" style={{ background: "#10b981", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "13px" }}>
                      Recevoir mon code de validation
                    </button>
                    <button type="button" onClick={() => setAuthMode("login")} style={{ background: "transparent", color: "#94a3b8", border: "none", cursor: "pointer", fontSize: "13px" }}>
                      Retour à la connexion
                    </button>
                  </div>
                </form>
              </div>
            )}

            {authMode === "verify" && (
              <div>
                <h4 style={{ margin: "0 0 10px 0", color: "#f59e0b", fontSize: "14px" }}>✉️ Validation par E-mail</h4>
                <p style={{ margin: "0 0 10px 0", fontSize: "12px", color: "#cbd5e1" }}>
                  Un code de confirmation a été simulé pour <strong>{pendingEmail}</strong>. Entrez le code à 4 chiffres pour valider votre compte :
                </p>
                <form onSubmit={handleVerifyCode} style={{ display: "flex", gap: "10px" }}>
                  <input 
                    type="text" 
                    placeholder="Entrez le code..." 
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    style={{ width: "150px", padding: "8px", background: "#0f172a", border: "1px solid #475569", color: "white", borderRadius: "6px", fontSize: "13px", textAlign: "center", letterSpacing: "2px" }}
                    required
                  />
                  <button type="submit" style={{ background: "#f59e0b", color: "#0f172a", border: "none", padding: "8px 16px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "13px" }}>
                    Valider mon inscription
                  </button>
                </form>
              </div>
            )}

          </div>
        )}
      </div>

      {/* Bouton Lancer une discussion */}
      {forumUser && (
        <div style={{ marginBottom: "20px" }}>
          <button 
            onClick={() => setShowNewTopicModal(!showNewTopicModal)}
            style={{ background: "#06b6d4", color: "#0f172a", border: "none", padding: "10px 18px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
          >
            🔥 Lancer une discussion
          </button>
        </div>
      )}

      {/* Formulaire création sujet */}
      {showNewTopicModal && forumUser && (
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

      {/* Liste des sujets */}
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {topics.map((t) => {
          const hasUserLiked = forumUser && t.likedBy.includes(forumUser);
          return (
            <div key={t.id} style={{ background: "#0f172a", border: "1px solid #1e293b", padding: "20px", borderRadius: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ background: "#1e293b", color: "#38bdf8", padding: "4px 10px", borderRadius: "4px", fontSize: "11px", border: "1px solid #334155" }}>
                  {t.category}
                </span>
                {forumUser && (
                  <button 
                    onClick={() => handleLike(t.id)} 
                    style={{ background: hasUserLiked ? "#f43f5e" : "#1e293b", color: hasUserLiked ? "white" : "#f43f5e", border: "1px solid #475569", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
                  >
                    ❤️ {t.likedBy.length} {hasUserLiked ? "(Liké)" : "J'aime"}
                  </button>
                )}
              </div>

              <h3 style={{ margin: "10px 0 5px 0", fontSize: "16px" }}>{t.title}</h3>
              <span style={{ color: "#64748b", fontSize: "12px" }}>Par {t.author}</span>

              {/* Réponses */}
              <div style={{ margin: "15px 0", paddingLeft: "15px", borderLeft: "2px solid #334155" }}>
                {t.replies.map((r) => (
                  <div key={r.id} style={{ fontSize: "13px", marginBottom: "8px" }}>
                    <strong style={{ color: "#38bdf8" }}>{r.author} : </strong> {r.text}
                  </div>
                ))}
              </div>

              {/* Formulaire réponse ou verrou */}
              {forumUser ? (
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
                  🔒 Connectez-vous ou créez un compte forum ci-dessus pour participer et répondre.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}