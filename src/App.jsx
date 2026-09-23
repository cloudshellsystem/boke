import React, { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import UploadForm from "./components/UploadForm";
import ProfileForm from "./components/ProfileForm";
import "./App.css";

export default function App() {
  const [photos, setPhotos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activePage, setActivePage] = useState("home");

  useEffect(() => {
    fetchPhotos();
  }, []);

  async function fetchPhotos() {
    const { data } = await supabase
      .from("photos")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setPhotos(data);
  }

  const filteredPhotos = photos.filter((photo) =>
    (photo.title || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: "#020817", color: "white" }}>
      <header style={{ textAlign: "center", padding: "30px" }}>
        <img src="/logo1-output.png" alt="BOKE ONE" style={{ maxWidth: "500px", width: "100%" }} />

        <h2 style={{ color: "#67e8f9", letterSpacing: "8px" }}>
          CREATORS CONNECTED
        </h2>

        <nav style={{ display: "flex", justifyContent: "center", gap: "15px", flexWrap: "wrap" }}>
          <button onClick={() => setActivePage("home")}>🏠 Accueil</button>
          <button onClick={() => setActivePage("gallery")}>📷 Galerie</button>
          <button onClick={() => setActivePage("collab")}>🤝 Collaborations</button>
          <button onClick={() => setActivePage("profile")}>👤 Profils</button>
          <button onClick={() => setActivePage("messages")}>💬 Messages</button>
          <button onClick={() => setActivePage("premium")}>💎 Premium</button>
        </nav>

        <p>Page active : {activePage}</p>
      </header>

      {activePage === "profile" && <ProfileForm />}

      {(activePage === "home" || activePage === "gallery") && (
        <>
          <UploadForm onUploaded={fetchPhotos} />
          {filteredPhotos.map((photo) => (
            <div key={photo.id}>{photo.title}</div>
          ))}
        </>
      )}

      {activePage === "collab" && <h2>🤝 Collaborations</h2>}
      {activePage === "messages" && <h2>💬 Messages</h2>}
      {activePage === "premium" && <h2>💎 Premium</h2>}
    </div>
  );
}
