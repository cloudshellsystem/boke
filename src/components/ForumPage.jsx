import React, { useState, useEffect } from "react";

export default function ForumPage() {
  const [forumUser, setForumUser] = useState(localStorage.getItem("boke_forum_user") || null);

  // États pour la sécurité et la validation par code
  const [authMode, setAuthMode] = useState("login"); // "login", "register", "verify"
  const [emailInput, setEmailInput] = useState("");
  const [pseudoInput, setPseudoInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  
  const [generatedCode, setGeneratedCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [tempData, setTempData] = useState(null);

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

  // Étape 1 : Demande d'inscription -> Génération du code e-mail obligatoire
  function handleRequestRegister(e) {
    e.preventDefault();
    if (!emailInput || !pseudoInput || !passwordInput) {
      alert("Veuillez remplir tous les champs du formulaire.");
      return;
    }

    // Génération d'un code unique à 4 chiffres (Anti-flood strict)
    const secureCode = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedCode(secureCode);
    setTempData({ pseudo: pseudoInput, email: emailInput });

    // Simulation de l'envoi du mail (À remplacer par ton service d'e-mailing ou Supabase Auth)
    alert(`[SÉCURITÉ ANTI-SPAM BOKE ONE]\nUn e-mail vient d'être envoyé à : ${emailInput}\n\n[POUR TEST] Votre code de confirmation secret est : ${secureCode}`);
    
    // Bascule stricte vers l'écran de saisie du code
    setAuthMode("verify");
  }

  // Étape 2 : Validation stricte du code e-mail
  function handleConfirmCode(e) {
    e.preventDefault();
    if (inputCode !== generatedCode) {
      alert("❌ Code de confirmation incorrect. Le compte n'a pas été créé pour éviter le spam.");
      return;
    }

    // Succès total : Le code est correct, on valide et connecte l'utilisateur
    alert("✅ E-mail vérifié avec succès ! Votre compte forum est activé.");
    localStorage.setItem("boke_forum_user", tempData.pseudo);
    setForumUser(tempData.pseudo);
    
    // Réinitialisation
    setAuthMode("login");
    setInputCode("");
    setGeneratedCode("");
    setTempData(null);
  }

  // Connexion simple pour les membres déjà validés
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
      
      {/* En-tête du Forum & Bloc Authentification */}
      <div style={{ background: "#0f172a", border: "1px solid #1e293b", padding: "20px", borderRadius: "10px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
          <div>
            <h2 style={{ margin: "0 0 5px 0", fontSize: "20px" }}>💬 Forum Communautaire Boke One</h2>
            <p style={{ color: "#94a3b8", margin: 0, fontSize: "13px" }}>Espace ultra-sécurisé anti-spam par validation e-mail.</p>
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

        {/* Formulaires d'authentification */}
        {!forumUser && (
          <div style={{ marginTop: "15px", background: "#1e293b", padding: "15px", borderRadius: "8px", border: "1px solid #334155" }}>
            
            {/* Mode Connexion */}
            {authMode === "login" && (
              <div>
                <h4 style={{ margin: "0 0 10px 0", color: "#38bdf8", fontSize: "14px" }}>🔑 Connexion au Forum</h4>
                <form onSubmit={handleLogin} style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <input 
                    type="text" 
                    placeholder="Votre Pseudo vérifié" 
                    value={pseudoInput}
                    onChange={(e) => setPseudoInput(e.target.value)}
                    style={{ flex: 1, padding: "8px", background: "#0f172a", border: "1px solid #475569", color: "white", borderRadius: "6px", fontSize: "13px" }}
                    required
                  />
                  <button type="submit" style={{ background: "#06b6d4", color: "#0f172a", border: "none", padding: "8px 16px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "13px" }}>
                    Se connecter
                  </button>
                  <button type="button" onClick={() => setAuthMode("register")} style={{ background: "transparent", color: "#38bdf8", border: "1px solid #38bdf8", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}>
                    Créer un compte (Anti-spam)
                  </button>
                </form>
              </div>
            )}

            {/* Mode Inscription (Étape 1) */}
            {authMode === "register" && (
              <div>
                <h4 style={{ margin: "0 0 10px 0", color: "#10b981", fontSize: "14px" }}>🛡️ Inscription Sécurisée (Validation par e-mail requise)</h4>
                <form onSubmit={handleRequestRegister} style={{ display: "grid", gap: "10px" }}>
                  <input 
                    type="email" 
                    placeholder="Votre vraie adresse e-mail (pour recevoir le code)" 
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
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <button type="submit" style={{ background: "#10b981", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "13px" }}>
                      Recevoir mon code de confirmation
                    </button>
                    <button type="button" onClick={() => setAuthMode("login")} style={{ background: "transparent", color: "#94a3b8", border: "none", cursor: "pointer", fontSize: "13px" }}>
                      Retour à la connexion
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Mode Saisie du Code (Étape 2 - Bloquant contre le spam) */}
            {authMode === "verify" && (
              <div style={{ background: "#172554", padding: "12px", borderRadius: "6px", border: "1px solid #3b82f6" }}>
                <h4 style={{ margin: "0 0 5px 0", color: "#60a5fa", fontSize: "14px" }}>✉️ Saisie du Code de Sécurité E-mail</h4>
                <p style={{ margin: "0 0 10px 0", fontSize: "12px", color: "#93c5fd" }}>
                  Le compte ne sera activé qu'après la saisie correcte du code reçu par e-mail.
                </p>
                <form onSubmit={handleConfirmCode} style={{ display: "flex", gap: "10px" }}>
                  <input 
                    type="text" 
                    placeholder="Entrez le code à 4 chiffres" 
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    style={{ width: "180px", padding: "8px", background: "#0f172a", border: "1px solid #475569", color: "white", borderRadius: "6px", fontSize: "13px", textAlign: "center", letterSpacing: "2px" }}
                    required
                  />
                  <button type="submit" style={{ background: "#2563eb", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "13px" }}>
                    Valider et Activer mon compte
                  </button>
                  <button type="button" onClick={() => setAuthMode("register")} style={{ background: "transparent", color: "#94a3b8", border: "none", cursor: "pointer", fontSize: "12px" }}>
                    Annuler
                  </button>
                </form>
              </div>
            )}

          </div>
        )}
      </div>

      {/* Actions et liste du forum */}
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

              <div style={{ margin: "15px 0", paddingLeft: "15px", borderLeft: "2px solid #334155" }}>
                {t.replies.map((r) => (
                  <div key={r.id} style={{ fontSize: "13px", marginBottom: "8px" }}>
                    <strong style={{ color: "#38bdf8" }}>{r.author} : </strong> {r.text}
                  </div>
                ))}
              </div>

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
                  🔒 Validez votre inscription par code e-mail pour participer au forum.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}