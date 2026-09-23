import React, { useState } from "react";

export default function Gallery({ photos }) {
  const [likesState, setLikesState] = useState(
    photos.reduce((acc, p) => ({ ...acc, [p.id]: p.likes || 0 }), {})
  );
  const [userLikedState, setUserLikedState] = useState({});
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Nouvel état pour gérer la fenêtre de choix d'achat / paiement
  const [buyingPhoto, setBuyingPhoto] = useState(null);
  const [paymentStep, setPaymentStep] = useState("choice"); // "choice", "stripe", "paypal", "success"

  const [commentsState, setCommentsState] = useState({
    1: [
      { author: "Sophie Laurent", text: "Magnifique gestion de la lumière dorée !" },
      { author: "Marc Vancans", text: "Quel setup as-tu utilisé pour ce cliché ?" }
    ]
  });
  const [newCommentInput, setNewCommentInput] = useState("");

  const handleLike = (id) => {
    const alreadyLiked = userLikedState[id];
    if (alreadyLiked) {
      setLikesState((prev) => ({ ...prev, [id]: prev[id] - 1 }));
      setUserLikedState((prev) => ({ ...prev, [id]: false }));
    } else {
      setLikesState((prev) => ({ ...prev, [id]: prev[id] + 1 }));
      setUserLikedState((prev) => ({ ...prev, [id]: true }));
    }
  };

  const handleAddComment = (id, e) => {
    e.preventDefault();
    if (!newCommentInput.trim()) return;

    const currentComments = commentsState[id] || [];
    setCommentsState({
      ...commentsState,
      [id]: [...currentComments, { author: "Vous (Membre Boke One)", text: newCommentInput.trim() }]
    });
    setNewCommentInput("");
  };

  return (
    <>
      {/* Grille principale */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "25px" }}>
        {photos.map((photo) => {
          const currentLikes = likesState[photo.id] || 0;
          const isLiked = userLikedState[photo.id] || false;
          const photoComments = commentsState[photo.id] || [];

          return (
            <div 
              key={photo.id} 
              style={{ 
                background: "#0f172a", 
                border: "1px solid #334155", 
                borderRadius: "14px", 
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}
            >
              {/* Image avec Filigrane en diagonale */}
              <div 
                onClick={() => setSelectedPhoto(photo)}
                style={{ position: "relative", width: "100%", height: "220px", background: "#000", cursor: "pointer", overflow: "hidden" }}
              >
                <img 
                  src={photo.image_url} 
                  alt={photo.title} 
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                  style={{ width: "100%", height: "100%", objectFit: "cover", userSelect: "none" }} 
                />

                <div style={{
                  position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  pointerEvents: "none", transform: "rotate(-25deg)", opacity: "0.35"
                }}>
                  <span style={{ fontSize: "26px", fontWeight: "900", color: "#ffffff", letterSpacing: "4px", textTransform: "uppercase", textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>
                    BOKE ONE
                  </span>
                </div>
              </div>

              {/* Infos */}
              <div style={{ padding: "12px 15px" }}>
                <h4 style={{ margin: "0 0 4px 0", fontSize: "14px", color: "#f8fafc", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {photo.title}
                </h4>
                <p style={{ margin: "0 0 10px 0", fontSize: "12px", color: "#94a3b8" }}>
                  Par {photo.author || "Créateur Boke One"} • <strong style={{ color: "#34d399" }}>{photo.price}</strong>
                </p>

                <button 
                  onClick={() => { setBuyingPhoto(photo); setPaymentStep("choice"); }}
                  style={{ 
                    width: "100%", background: "linear-gradient(135deg, #0891b2, #06b6d4)", 
                    color: "#020617", border: "none", padding: "8px", borderRadius: "8px", 
                    fontWeight: "bold", fontSize: "12px", cursor: "pointer", marginBottom: "10px"
                  }}
                >
                  🛒 Acheter / Contacter
                </button>
              </div>

              {/* Encart Social */}
              <div style={{ background: "#1e293b", borderTop: "1px solid #334155", padding: "8px 15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button 
                  onClick={() => handleLike(photo.id)}
                  style={{ background: "transparent", border: "none", color: isLiked ? "#f43f5e" : "#38bdf8", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontWeight: "bold", fontSize: "12px" }}
                >
                  {isLiked ? "❤️" : "🤍"} {currentLikes} J'aime
                </button>

                <button 
                  onClick={() => setSelectedPhoto(photo)}
                  style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontSize: "12px" }}
                >
                  💬 {photoComments.length} Commentaires & Tuto
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* MODALE DÉTAILS / COMMENTAIRES */}
      {selectedPhoto && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(2, 6, 23, 0.85)", backdropFilter: "blur(5px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "16px", maxWidth: "750px", width: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 10px 30px rgba(0,0,0,0.8)", display: "flex", flexDirection: "column", position: "relative" }}>
            
            <button onClick={() => setSelectedPhoto(null)} style={{ position: "absolute", top: "15px", right: "15px", background: "#1e293b", color: "white", border: "1px solid #475569", borderRadius: "50%", width: "32px", height: "32px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>

            <div style={{ position: "relative", width: "100%", height: "350px", background: "#000", overflow: "hidden" }}>
              <img src={selectedPhoto.image_url} alt={selectedPhoto.title} onContextMenu={(e) => e.preventDefault()} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", transform: "rotate(-25deg)", opacity: "0.4" }}>
                <span style={{ fontSize: "40px", fontWeight: "900", color: "#ffffff", letterSpacing: "6px", textTransform: "uppercase", textShadow: "0 2px 6px rgba(0,0,0,0.9)" }}>BOKE ONE</span>
              </div>
            </div>

            <div style={{ padding: "20px" }}>
              <h2 style={{ margin: "0 0 5px 0", color: "white", fontSize: "20px" }}>{selectedPhoto.title}</h2>
              <p style={{ margin: "0 0 15px 0", color: "#94a3b8", fontSize: "14px" }}>
                Créé par <strong style={{ color: "#38bdf8" }}>{selectedPhoto.author || "Créateur Boke One"}</strong> • <span style={{ color: "#34d399", fontWeight: "bold" }}>{selectedPhoto.price}</span>
              </p>

              <button 
                onClick={() => { setSelectedPhoto(null); setBuyingPhoto(selectedPhoto); setPaymentStep("choice"); }}
                style={{ width: "100%", background: "linear-gradient(135deg, #0891b2, #06b6d4)", color: "#020617", border: "none", padding: "10px", borderRadius: "8px", fontWeight: "bold", fontSize: "14px", cursor: "pointer", marginBottom: "20px" }}
              >
                🛒 Acheter / Contacter le créateur
              </button>

              <div style={{ background: "#1e293b", padding: "12px", borderRadius: "8px", marginBottom: "20px", border: "1px solid #334155" }}>
                <h4 style={{ margin: "0 0 6px 0", color: "#38bdf8", fontSize: "13px" }}>💡 Tuto & Paramètres de prise de vue</h4>
                <p style={{ margin: 0, color: "#cbd5e1", fontSize: "12px", lineHeight: "1.5" }}>
                  Exposition naturelle optimisée, travail de composition rigoureux. Retouche professionnelle aux tons cinématographiques.
                </p>
              </div>

              <h4 style={{ margin: "0 0 10px 0", color: "white", fontSize: "14px" }}>💬 Commentaires ({commentsState[selectedPhoto.id]?.length || 0})</h4>
              <div style={{ maxHeight: "150px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px", marginBottom: "15px" }}>
                {(!commentsState[selectedPhoto.id] || commentsState[selectedPhoto.id].length === 0) ? (
                  <p style={{ color: "#64748b", margin: 0, fontStyle: "italic", fontSize: "12px" }}>Aucun commentaire pour le moment.</p>
                ) : (
                  commentsState[selectedPhoto.id].map((c, i) => (
                    <div key={i} style={{ background: "#1e293b", padding: "8px 12px", borderRadius: "8px" }}>
                      <span style={{ color: "#38bdf8", fontWeight: "bold", fontSize: "12px" }}>{c.author}</span>
                      <p style={{ margin: "4px 0 0 0", color: "#e2e8f0", fontSize: "12px" }}>{c.text}</p>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={(e) => handleAddComment(selectedPhoto.id, e)} style={{ display: "flex", gap: "8px" }}>
                <input type="text" placeholder="Écrire un commentaire..." value={newCommentInput} onChange={(e) => setNewCommentInput(e.target.value)} style={{ flex: 1, background: "#1e293b", border: "1px solid #475569", borderRadius: "8px", padding: "8px 12px", color: "white", fontSize: "12px" }} />
                <button type="submit" style={{ background: "#06b6d4", color: "#020617", border: "none", borderRadius: "8px", padding: "8px 15px", fontWeight: "bold", fontSize: "12px", cursor: "pointer" }}>Envoyer</button>
              </form>
            </div>

          </div>
        </div>
      )}

      {/* MODALE DE PAIEMENT / ACHAT SÉCURISÉ (Stripe, PayPal, Lien personnalisé) */}
      {buyingPhoto && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(2, 6, 23, 0.9)", backdropFilter: "blur(6px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1100, padding: "20px" }}>
          <div style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "16px", maxWidth: "480px", width: "100%", padding: "25px", boxShadow: "0 15px 40px rgba(0,0,0,0.9)", position: "relative" }}>
            
            <button onClick={() => setBuyingPhoto(null)} style={{ position: "absolute", top: "15px", right: "15px", background: "#1e293b", color: "white", border: "1px solid #475569", borderRadius: "50%", width: "30px", height: "30px", fontSize: "14px", fontWeight: "bold", cursor: "pointer" }}>✕</button>

            <h3 style={{ margin: "0 0 5px 0", color: "white", fontSize: "18px" }}>Acquisition de l'œuvre</h3>
            <p style={{ margin: "0 0 20px 0", color: "#94a3b8", fontSize: "13px" }}>
              {buyingPhoto.title} • <strong style={{ color: "#34d399" }}>{buyingPhoto.price}</strong>
            </p>

            {paymentStep === "choice" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <p style={{ margin: "0 0 5px 0", color: "#cbd5e1", fontSize: "13px" }}>Choisissez votre mode de paiement sécurisé :</p>
                
                {/* Option Stripe */}
                <button 
                  onClick={() => setPaymentStep("stripe")}
                  style={{ background: "#635bff", color: "white", border: "none", padding: "12px", borderRadius: "8px", fontWeight: "bold", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                >
                  💳 Payer par Carte (Stripe sécurisé)
                </button>

                {/* Option PayPal */}
                <button 
                  onClick={() => setPaymentStep("paypal")}
                  style={{ background: "#0070ba", color: "white", border: "none", padding: "12px", borderRadius: "8px", fontWeight: "bold", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                >
                  🅿️ Payer via PayPal
                </button>

                {/* Option Lien généré / Demande manuelle */}
                <button 
                  onClick={() => alert("Demande de lien de paiement envoyée au créateur ! Vous recevrez un accès sécurisé par e-mail dès validation.")}
                  style={{ background: "#1e293b", color: "#38bdf8", border: "1px solid #334155", padding: "12px", borderRadius: "8px", fontWeight: "bold", fontSize: "13px", cursor: "pointer" }}
                >
                  🔗 Demander un lien personnalisé (Accès manuel)
                </button>
              </div>
            )}

            {paymentStep === "stripe" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ background: "#1e293b", padding: "12px", borderRadius: "8px", border: "1px solid #334155" }}>
                  <span style={{ color: "#a5b4fc", fontSize: "12px", display: "block", marginBottom: "8px" }}>Simulateur de Paiement Carte (Stripe)</span>
                  <input type="text" placeholder="Numéro de carte (4242...)" defaultValue="4242 4242 4242 4242" style={{ width: "100%", background: "#0f172a", border: "1px solid #475569", borderRadius: "6px", padding: "8px", color: "white", fontSize: "12px", marginBottom: "8px" }} />
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input type="text" placeholder="MM/AA" defaultValue="12/28" style={{ flex: 1, background: "#0f172a", border: "1px solid #475569", borderRadius: "6px", padding: "8px", color: "white", fontSize: "12px" }} />
                    <input type="text" placeholder="CVC" defaultValue="123" style={{ flex: 1, background: "#0f172a", border: "1px solid #475569", borderRadius: "6px", padding: "8px", color: "white", fontSize: "12px" }} />
                  </div>
                </div>
                <button 
                  onClick={() => setPaymentStep("success")}
                  style={{ background: "#635bff", color: "white", border: "none", padding: "12px", borderRadius: "8px", fontWeight: "bold", fontSize: "13px", cursor: "pointer" }}
                >
                  Valider le paiement de {buyingPhoto.price}
                </button>
                <button onClick={() => setPaymentStep("choice")} style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "12px" }}>← Retour aux choix</button>
              </div>
            )}

            {paymentStep === "paypal" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ background: "#1e293b", padding: "12px", borderRadius: "8px", border: "1px solid #334155", textAlign: "center" }}>
                  <p style={{ color: "white", fontSize: "13px", margin: "0 0 10px 0" }}>Connectez-vous à votre compte PayPal pour régler l'œuvre.</p>
                  <input type="email" placeholder="votre-email@paypal.com" defaultValue="client@bokeone.com" style={{ width: "100%", background: "#0f172a", border: "1px solid #475569", borderRadius: "6px", padding: "8px", color: "white", fontSize: "12px" }} />
                </div>
                <button 
                  onClick={() => setPaymentStep("success")}
                  style={{ background: "#0070ba", color: "white", border: "none", padding: "12px", borderRadius: "8px", fontWeight: "bold", fontSize: "13px", cursor: "pointer" }}
                >
                  Payer avec PayPal
                </button>
                <button onClick={() => setPaymentStep("choice")} style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "12px" }}>← Retour aux choix</button>
              </div>
            )}

            {paymentStep === "success" && (
              <div style={{ textAlign: "center", padding: "10px 0" }}>
                <div style={{ fontSize: "40px", marginBottom: "10px" }}>🎉</div>
                <h4 style={{ color: "#34d399", fontSize: "16px", margin: "0 0 8px 0" }}>Paiement validé avec succès !</h4>
                <p style={{ color: "#cbd5e1", fontSize: "12px", lineHeight: "1.5", margin: "0 0 20px 0" }}>
                  Votre accès sécurisé et votre lien de téléchargement HD ont été générés et débloqués. Un e-mail récapitulatif vous a été envoyé.
                </p>
                <button 
                  onClick={() => setBuyingPhoto(null)}
                  style={{ background: "linear-gradient(135deg, #0891b2, #06b6d4)", color: "#020617", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", fontSize: "13px", cursor: "pointer" }}
                >
                  Accéder à mon téléchargement
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}