import React, { useState, useEffect } from "react";
import Gallery from "./components/Gallery";
import UploadForm from "./components/UploadForm";
import CreatifsPage from "./components/CreatifsPage";
import PremiumPage from "./components/PremiumPage";
import ForumPage from "./components/ForumPage";
import HomePage from "./components/HomePage";

// Onglets : l'accueil (landing marketplace) est désormais la page d'arrivée
const TABS = [
  { id: "home", label: "🏠 Accueil" },
  { id: "gallery", label: "🖼️ Portfolios" },
  { id: "creatifs", label: "👥 Créatifs" },
  { id: "forum", label: "💬 Forum" },
  { id: "premium", label: "💎 Espace Pro" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  // Signal envoyé à HomePage pour ouvrir le formulaire depuis le bouton du header
  const [requestSignal, setRequestSignal] = useState({ count: 0, cat: null });

  const [photos, setPhotos] = useState([
    {
      id: 1,
      title: "Portrait Studio Mode & Lumière",
      author: "Marc Vancans",
      price: "180 €",
      image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      likes: 42
    },
    {
      id: 2,
      title: "Regard Serein - Noir & Blanc",
      author: "Sophie Laurent",
      price: "120 €",
      image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
      likes: 76
    },
    {
      id: 3,
      title: "Échappée Sauvage en Montagne",
      author: "Lucas Explore",
      price: "250 €",
      image_url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
      likes: 129
    },
    {
      id: 4,
      title: "Néon Cyberpunk Tokyo",
      author: "Kenji Sato",
      price: "300 €",
      image_url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
      likes: 95
    },
    {
      id: 5,
      title: "Architecture Minimaliste & Lignes",
      author: "Elena Rostova",
      price: "150 €",
      image_url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
      likes: 64
    },
    {
      id: 6,
      title: "Vague Océanique Puissante",
      author: "Tom Surf",
      price: "220 €",
      image_url: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=800&q=80",
      likes: 112
    }
  ]);

  // SÉCURITÉ : Désactivation globale du clic droit et du glisser-déposer pour empêcher le vol d'images
  useEffect(() => {
    const handleContextMenu = (e) => {
      if (e.target.tagName === "IMG") {
        e.preventDefault();
      }
    };

    const handleDragStart = (e) => {
      if (e.target.tagName === "IMG") {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("dragstart", handleDragStart);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("dragstart", handleDragStart);
    };
  }, []);

  function handleNewPhoto(newPhoto) {
    setPhotos([newPhoto, ...photos]);
  }

  function goTo(tab) {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openRequestForm() {
    setActiveTab("home");
    setRequestSignal((s) => ({ count: s.count + 1, cat: null }));
  }

  return (
    <div style={{ background: "#020617", minHeight: "100vh", color: "white", paddingBottom: "30px", fontSize: "14px" }}>
      <header style={{ padding: "10px 14px 0", background: "#0f172a", borderBottom: "2px solid #06b6d4" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
          <img
            src="/logo1-output.png"
            alt="Boke One - retour à l'accueil"
            onClick={() => goTo("home")}
            style={{ maxHeight: "48px", width: "auto", objectFit: "contain", cursor: "pointer", filter: "drop-shadow(0 0 8px rgba(6, 182, 212, 0.4))" }}
          />
          <button
            onClick={openRequestForm}
            style={{ background: "#22c55e", color: "#052e16", border: "none", padding: "10px 16px", borderRadius: "10px", fontWeight: 800, fontSize: "13px", cursor: "pointer", whiteSpace: "nowrap" }}
          >
            ＋ Déposer un besoin
          </button>
        </div>

        <nav style={{ maxWidth: "1400px", margin: "10px auto 0", display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "10px", scrollbarWidth: "none" }}>
          {TABS.map((t) => (
            <button key={t.id} onClick={() => goTo(t.id)} style={navButtonStyle(activeTab === t.id)}>
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main style={{ maxWidth: "1400px", margin: "20px auto", padding: "0 15px" }}>
        {activeTab === "home" && <HomePage onNavigate={goTo} requestSignal={requestSignal} />}

        {activeTab === "gallery" && (
          <>
            <UploadForm onUploaded={handleNewPhoto} />
            <Gallery photos={photos} />
          </>
        )}

        {activeTab === "creatifs" && <CreatifsPage />}

        {activeTab === "premium" && <PremiumPage />}

        {activeTab === "forum" && <ForumPage />}
      </main>
    </div>
  );
}

function navButtonStyle(isActive) {
  return {
    background: isActive ? "#0891b2" : "#1e293b",
    color: "white",
    border: isActive ? "2px solid #67e8f9" : "1px solid #475569",
    padding: "8px 16px",
    borderRadius: "8px",
    fontWeight: "bold",
    fontSize: "13px",
    cursor: "pointer",
    whiteSpace: "nowrap",
    flexShrink: 0,
    boxShadow: isActive ? "0 0 12px rgba(103, 232, 249, 0.4)" : "none",
    transition: "all 0.2s",
  };
}
