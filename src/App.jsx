import React, { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import UploadForm from "./components/UploadForm";
import ProfileForm from "./components/ProfileForm";
import Gallery from "./components/Gallery";
import CreatifsPage from "./components/CreatifsPage";
import "./App.css";

export default function App() {
  const [photos, setPhotos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activePage, setActivePage] = useState("home");

  useEffect(() => {
    fetchPhotos();
  }, []);

  async function fetchPhotos() {
    try {
      const { data, error } = await supabase
        .from("photos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erreur Supabase:", error);
      } else if (data) {
        setPhotos(data);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des photos:", err);
    }
  }

  const filteredPhotos = photos.filter((photo) =>
    (photo.title || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: "#020817", color: "white", paddingBottom: "50px" }}>
      <header style={{ textAlign: "center", padding: "30px" }}>
        <img src="/logo1-output.png" alt="BOKE ONE" style={{ maxWidth: "500px", width: "100%" }} />

        <h2 style={{ color: "#67e8f9", letterSpacing: "8px", marginTop: "10px" }}>
          CREATORS CONNECTED
        </h2>

        <nav style={{ display: "flex", justifyContent: "center", gap: "15px", flexWrap: "wrap", marginTop: "20px" }}>
          <button onClick={() => setActivePage("home")} style={{ padding: "8px 16px", cursor: "pointer" }}>🏠 Accueil</button>
          <button onClick={() => setActivePage("gallery")} style={{ padding: "8px 16px", cursor: "pointer" }}>📷 Galerie</button>
          <button onClick={() => setActivePage("collab")} style={{ padding: "8px 16px", cursor: "pointer" }}>🤝 Collaborations</button>
          <button onClick={() => setActivePage("profile")} style={{ padding: "8px 16px", cursor: "pointer" }}>👤 Profils</button>
          <button onClick={() => setActivePage("messages")} style={{ padding: "8px 16px", cursor: "pointer" }}>💬 Messages</button>
          <button onClick={() => setActivePage("premium")} style={{ padding: "8px 16px", cursor: "pointer" }}>💎 Premium</button>
        </nav>
      </header>

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
        {activePage === "home" && (
          <>
            <UploadForm onUploaded={fetchPhotos} />
            <div style={{ marginTop: "30px" }}>
              <Gallery photos={filteredPhotos} />
            </div>
          </>
        )}

        {activePage === "gallery" && (
          <Gallery photos={filteredPhotos} />
        )}

        {activePage === "profile" && <ProfileForm />}
        {activePage === "collab" && <CreatifsPage />}

        {activePage === "messages" && (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>💬 Messages</h2>
            <p>Espace de messagerie bientôt disponible.</p>
          </div>
        )}

        {activePage === "premium" && (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>💎 Premium</h2>
            <p>Espace exclusif pour les membres premium.</p>
          </div>
        )}
      </main>
    </div>
  );
}