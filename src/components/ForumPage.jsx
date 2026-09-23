import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function ForumPage() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // États d'authentification
  const [authMode, setAuthMode] = useState("login"); // "login" ou "register"
  const [emailInput, setEmailInput] = useState("");
  const [pseudoInput, setPseudoInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // États du forum
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

  // Vérification de la session active au chargement
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Inscription ultra-sécurisée avec e-mail de confirmation obligatoire
  async function handleRegister(e) {
    e.preventDefault();
    if (!emailInput || !pseudoInput || !passwordInput) return;
    setAuthLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: emailInput,
        password: passwordInput,
        options: {
          data: { pseudo: pseudoInput }
        }
      });

      if (error) {
        alert("Erreur d'inscription : " + error.message);
      } else {
        alert("🛡️ Inscription réussie ! Un e-mail de confirmation vient d'être envoyé à " + emailInput + ". Vous devez valider cet e-mail pour pouvoir vous connecter.");
        setAuthMode("login");
        setEmailInput("");
        setPasswordInput("");
        setPseudoInput("");
      }
    } catch (err) {
      alert("Erreur : " + err.message);
    } finally {
      setAuthLoading(false);
    }
  }

  // Connexion sécurisée (bloquée si l'e-mail n'est pas confirmé)
  async function handleLogin(e) {
    e.preventDefault();
    if (!emailInput || !passwordInput) return;
    setAuthLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: emailInput,
        password: passwordInput,
      });

      if (error) {
        alert("❌ Connexion refusée : " + error.message + " (Avez-vous bien validé votre e-mail ?)");
      } else {
        setEmailInput("");
        setPasswordInput("");
      }
    } catch (err) {
      alert("Erreur : " + err.message);
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  function handleCreateTopic(e) {
    e.preventDefault();
    if (!newTitle.trim() || !session) return;

    const pseudoUser = session.user.user_metadata?.pseudo || session.user.email.split("@")[0];

    const topic = {
      id: Date.now(),
      title: newTitle,
      author: pseudoUser,
      category: newCategory,
      likedBy: [],
      replies: []
    };

    setTopics([topic, ...topics]);
    setNewTitle("");
    setShowNewTopicModal(false);
  }

  function handleLike(id) {
    if (!session) return;
    const pseudoUser = session.user.user_metadata?.pseudo || session.user.email.split("@")[0];

    setTopics(topics.map(t => {
      if (t.id === id) {
        const hasLiked = t.likedBy.includes(pseudoUser);
        if (hasLiked) {
          return { ...t, likedBy: t.likedBy.filter(u => u !== pseudoUser) };
        } else {
          return { ...t, likedBy: [...t.likedBy, pseudoUser] };
        }
      }
      return t;
    }));
  }

  function handleAddReply(topicId, e) {
    e.preventDefault();
    if (!session) return;
    const text = replyText[topicId];
    if (!text || !text.trim()) return;

    const pseudoUser = session.user.user_metadata?.pseudo || session.user.email.split("@")[0];

    setTopics(topics.map(t => {
      if (t.id === topicId) {
        return {
          ...t,
          replies: [...t.replies, { id: Date.now(), author: pseudoUser, text }]
        };
      }
      return t;
    }));

    setReplyText({ ...replyText, [topicId]: "" });
  }

  if (loading) {
    return <div style={{ color: "white", textAlign: "center", padding: "40px" }}>Chargement de la sécurité...</div>;
  }

  const currentPseudo = session?.user?.user_metadata?.pseudo || session?.user?.email?.split("@")[0];

  return (
    <div style={{ color: "white", padding: "10px", maxWidth: "900px", margin: "0 auto" }}>
      
      {/* En-tête du Forum */}
      <div style={{ background: "#0f172a", border: "1px solid #1e293b", padding: "20px", borderRadius: "10px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
          <div>
            <h2 style={{ margin: "0 0 5px 0", fontSize: "20px" }}>💬 Forum Communautaire Boke One</h2>
            <p style={{ color: "#94a3b8", margin: 0, fontSize: "13px" }}>Espace protégé : Accès strictement réservé aux membres validés par e-mail.</p>
          </div>

          {session ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#1e293b", padding: "8px 15px", borderRadius: "8px", border: "1px solid #334155" }}>
              <span style={{ fontSize: "13px", color: "#38bdf8" }}>👤 Connecté en tant que : <strong>{currentPseudo}</strong></span>
              <button onClick={handleLogout} style={{ background: "#ef4444", color: "white", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer", fontSize: "11px" }}>
                Déconnexion
              </button>
            </div>
          ) : null}
        </div>

        {/* Bloc Authentification Obligatoire */}
        {!session && (
          <div style={{ marginTop: "15px", background: "#1e293b", padding: "15px", borderRadius: "8px", border: "1px solid #334155" }}>
            
            {authMode === "login" ? (
              <div>
                <h4 style={{ margin: "0 0 10px 0", color: "#38bdf8", fontSize: "14px" }}>🔑 Connexion Sécurisée au Forum</h4>
                <form onSubmit={handleLogin} style={{ display: "grid", gap: "10px" }}>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <input 
                      type="email" 
                      placeholder="Votre e-mail" 
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
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
                    <button type="submit" disabled={authLoading} style={{ background: "#06b6d4", color: "#0f172a", border: "none", padding: "8px 16px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "13px" }}>
                      {authLoading ? "Connexion..." : "Se connecter"}
                    </button>
                    <button type="button" onClick={() => setAuthMode("register")} style={{ background: "transparent", color: "#38bdf8", border: "1px solid #38bdf8", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}>
                      Créer un compte (Anti-spam e-mail)
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div>
                <h4 style={{ margin: "0 0 10px 0", color: "#10b981", fontSize: "14px" }}>🛡️ Inscription Anti-Spam (Vérification e-mail obligatoire)</h4>
                <form onSubmit={handleRegister} style={{ display: "grid", gap: "10px" }}>
                  <input 
                    type="email" 
                    placeholder="Votre vraie adresse e-mail" 
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    style={{ padding: "8px", background: "#0f172a", border: "1px solid #475569", color: "white", borderRadius: "6px", fontSize: "13px" }}
                    required
                  />
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input 
                      type="text" 
                      placeholder="Votre Pseudo unique" 
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
                    <button type="submit" disabled={authLoading} style={{ background: "#10b981", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "13px" }}>
                      {authLoading ? "Envoi..." : "S'inscrire (Recevoir l'e-mail de validation)"}
                    </button>
                    <button type="button" onClick={() => setAuthMode("login")} style={{ background: "transparent", color: "#94a3b8", border: "none", cursor: "pointer", fontSize: "13px" }}>
                      Déjà un compte ? Se connecter
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        )}
      </div>

      {/* Actions réservées uniquement aux membres connectés et validés */}
      {session && (
        <div style={{ marginBottom: "20px" }}>
          <button 
            onClick={() => setShowNewTopicModal(!showNewTopicModal)}
            style={{ background: "#06b6d4", color: "#0f172a", border: "none", padding: "10px 18px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
          >
            🔥 Lancer une discussion
          </button>
        </div>
      )}

      {showNewTopicModal && session && (
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
          const hasUserLiked = session && t.likedBy.includes(currentPseudo);
          return (
            <div key={t.id} style={{ background: "#0f172a", border: "1px solid #1e293b", padding: "20px", borderRadius: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ background: "#1e293b", color: "#38bdf8", padding: "4px 10px", borderRadius: "4px", fontSize: "11px", border: "1px solid #334155" }}>
                  {t.category}
                </span>
                {session && (
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

              {session ? (
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
                <div style={{ marginTop: "15px", padding: "12px", background: "#1e293b", borderRadius: "6px", fontSize: "13px", color: "#f43f5e", textAlign: "center", border: "1px solid #7f1d1d" }}>
                  🔒 <strong>Accès restreint :</strong> Vous devez créer un compte et valider votre e-mail pour participer aux discussions et poster des messages.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}