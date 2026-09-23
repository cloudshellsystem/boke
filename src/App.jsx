import React, { useState, useEffect } from "react";
import Gallery from "./components/Gallery";
import UploadForm from "./components/UploadForm";
import CreatifsPage from "./components/CreatifsPage";
import PremiumPage from "./components/PremiumPage";
import ForumPage from "./components/ForumPage"; // Crée ce composant ou intègre-le ci-dessous

export default function App() {
  const [activeTab, setActiveTab] = useState("gallery");
  
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

  return (
    <div style={{ background: "#020617", minHeight: "100vh", color: "white", paddingBottom: "30px", fontSize: "14px" }}>
      {/* En-tête / Header avec Logo Officiel */}
      <header style={{ textAlign: "center", padding: "15px 10px", background: "#0f172a", borderBottom: "2px solid #06b6d4" }}>
        
        <div style={{ marginBottom: "12px", display: "flex", justifyContent: "center" }}>
          <img 
            src="/logo1-output.png" 
            alt="Boke One Logo" 
            style={{ 
              maxHeight: "65px", 
              width: "auto", 
              objectFit: "contain",
              filter: "drop-shadow(0 0 8px rgba(6, 182, 212, 0.4))",
              pointerEvents: "none"
            }} 
          />
        </div>

        <nav style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
          <button onClick={() => setActiveTab("gallery")} style={navButtonStyle(activeTab === "gallery")}>
            🖼️ Galerie ({photos.length})
          </button>
          <button onClick={() => setActiveTab("creatifs")} style={navButtonStyle(activeTab === "creatifs")}>
            👥 Profils
          </button>
          <button onClick={() => setActiveTab("premium")} style={navButtonStyle(activeTab === "premium")}>
            💎 Premium / Pro
          </button>
          <button onClick={() => setActiveTab("forum")} style={navButtonStyle(activeTab === "forum")}>
            💬 Forum
          </button>
        </nav>
      </header>

      <main style={{ maxWidth: "1400px", margin: "20px auto", padding: "0 15px" }}>
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
    boxShadow: isActive ? "0 0 12px rgba(103, 232, 249, 0.4)" : "none",
    transition: "all 0.2s",
  };
}