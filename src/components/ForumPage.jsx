import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function ForumPage() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vrais états d'authentification par e-mail / mot de passe obligatoires
  const [authMode, setAuthMode] = useState("login"); 
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [pseudoInput, setPseudoInput] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

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

  useEffect(() => {
    // Vérification stricte de la session Supabase active
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
        alert("🛡️ Inscription réussie ! Un e-mail de confirmation a été envoyé à " + emailInput + ". Validez-le pour activer votre accès.");
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
        alert("❌ Accès refusé : " + error.message);
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

  if (loading) {
    return <div style={{ color: "white", textAlign: "center", padding: "40px" }}>Vérification des sécurités du forum...</div>;
  }

  const currentPseudo = session?.user?.user_metadata?.pseudo || session?.user?.email?.split("@")[0];

  return (
    <div style={{ color: "white", padding: "10px", maxWidth: "900px", margin: "0 auto" }}>
      
      <div style={{ background: "#0f172a", border: "1px solid #1e293b", padding: "20px", borderRadius: "10px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
          <div>
            <h2 style={{ margin: "0 0 5px 0", fontSize: "20px" }}>💬 Forum Communautaire Boke One</h2>
            <p style={{ color: "#ef4444", margin: 0, fontSize: "13px" }}>⚠️ Espace ultra-sécurisé : Aucun accès anonyme autorisé.</p>
          </div>

          {session && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#1e293b", padding: "8px 15px", borderRadius: "8px", border: "1px solid #334155" }}>
              <span style={{ fontSize: "13px", color: "#38bdf8" }}>👤 Membre : <strong>{currentPseudo}</strong></span>
              <button onClick={handleLogout} style={{ background: "#ef4444", color: "white", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer", fontSize: "11px" }}>
                Déconnexion
              </button>
            </div>
          )}
        </div>

        {/* SI PAS DE SESSION : AFFICHAGE OBLIGATOIRE DU FORMULAIRE SUPABASE */}
        {!session && (
          <div style={{ marginTop: "15px", background: "#1e293b", padding: "20px", borderRadius: "8px", border: "2px solid #ef4444" }}>
            <h3 style={{ margin: "0 0 10px 0", color: "#ef4444", fontSize: "15px" }}>🔒 Authentification e-mail obligatoire pour entrer</h3>
            <p style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "15px" }}>
              Il est strictement impossible d'entrer ou de poster un message sans posséder un compte vérifié par e-mail.
            </p>

            {authMode === "login" ? (
              <form onSubmit={handleLogin} style={{ display: "grid", gap: "10px" }}>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <input 
                    type="email" 
                    placeholder="Entrez votre e-mail enregistré..." 
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    style={{ flex: 1, padding: "10px", background: "#0f172a", border: "1px solid #475569", color: "white", borderRadius: "6px", fontSize: "13px" }}
                    required
                  />
                  <input 
                    type="password" 
                    placeholder="Mot de passe..." 
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    style={{ flex: 1, padding: "10px", background: "#0f172a", border: "1px solid #475569", color: "white", borderRadius: "6px", fontSize: "13px" }}
                    required
                  />
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "5px" }}>
                  <button type="submit" disabled={authLoading} style={{ background: "#06b6d4", color: "#0f172a", border: "none", padding: "10px 20px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "13px" }}>
                    {authLoading ? "Vérification..." : "Se connecter au Forum"}
                  </button>
                  <button type="button" onClick={() => setAuthMode("register")} style={{ background: "transparent", color: "#38bdf8", border: "1px solid #38bdf8", padding: "10px 15px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}>
                    Pas de compte ? S'inscrire par e-mail
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegister} style={{ display: "grid", gap: "10px" }}>
                <input 
                  type="email" 
                  placeholder="Votre vraie adresse e-mail..." 
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  style={{ padding: "10px", background: "#0f172a", border: "1px solid #475569", color: "white", borderRadius: "6px", fontSize: "13px" }}
                  required
                />
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <input 
                    type="text" 
                    placeholder="Votre Pseudo unique..." 
                    value={pseudoInput}
                    onChange={(e) => setPseudoInput(e.target.value)}
                    style={{ flex: 1, padding: "10px", background: "#0f172a", border: "1px solid #475569", color: "white", borderRadius: "6px", fontSize: "13px" }}
                    required
                  />
                  <input 
                    type="password" 
                    placeholder="Créer un mot de passe..." 
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    style={{ flex: 1, padding: "10px", background: "#0f172a", border: "1px solid #475569", color: "white", borderRadius: "6px", fontSize: "13px" }}
                    required
                  />
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "5px" }}>
                  <button type="submit" disabled={authLoading} style={{ background: "#10b981", color: "white", border: "none", padding: "10px 20px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "13px" }}>
                    {authLoading ? "Envoi..." : "S'inscrire (Requis : Validation e-mail)"}
                  </button>
                  <button type="button" onClick={() => setAuthMode("login")} style={{ background: "transparent", color: "#94a3b8", border: "none", cursor: "pointer", fontSize: "13px" }}>
                    Déjà inscrit ? Se connecter
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>

      {/* CONTENU DU FORUM (Masqué ou bloqué si non connecté) */}
      <div style={{ opacity: session ? 1 : 0.4, pointerEvents: session ? "auto" : "none" }}>
        {!session && (
          <div style={{ textAlign: "center", padding: "20px", background: "#7f1d1d", borderRadius: "8px", marginBottom: "20px", color: "white" }}>
            🔒 Vous devez vous authentifier ci-dessus pour interagir, créer des sujets ou répondre.
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {topics.map((t) => (
            <div key={t.id} style={{ background: "#0f172a", border: "1px solid #1e293b", padding: "20px", borderRadius: "10px" }}>
              <span style={{ background: "#1e293b", color: "#38bdf8", padding: "4px 10px", borderRadius: "4px", fontSize: "11px", border: "1px solid #334155" }}>
                {t.category}
              </span>
              <h3 style={{ margin: "10px 0 5px 0", fontSize: "16px" }}>{t.title}</h3>
              <span style={{ color: "#64748b", fontSize: "12px" }}>Par {t.author}</span>

              <div style={{ margin: "15px 0", paddingLeft: "15px", borderLeft: "2px solid #334155" }}>
                {t.replies.map((r) => (
                  <div key={r.id} style={{ fontSize: "13px", marginBottom: "8px" }}>
                    <strong style={{ color: "#38bdf8" }}>{r.author} : </strong> {r.text}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}