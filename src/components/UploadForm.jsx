import React, { useState } from "react";
import { supabase } from "../supabaseClient"; // ⚠️ ASSOMPTION structure - vérifie ce chemin si ton arbo diffère

export default function UploadForm({ onUploaded }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // SÉCURITÉ ANTI-FLOOD / ANTI-DDOS APPLICATIF (10 secondes minimum entre chaque publication)
    const now = Date.now();
    if (now - lastSubmitTime < 10000) {
      const waitSeconds = Math.ceil((10000 - (now - lastSubmitTime)) / 1000);
      alert(`🛡️ Protection anti-spam Boke One : Veuillez patienter ${waitSeconds} secondes avant de publier à nouveau.`);
      return;
    }

    if (!title || !file) {
      alert("Veuillez renseigner un titre et sélectionner une image.");
      return;
    }

    setLoading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from("photos")
        .getPublicUrl(fileName);

      const imageUrl = publicUrlData.publicUrl;

      const newPhoto = {
        id: Date.now(),
        title: title,
        author: author || "Créateur Boke One",
        price: price ? `${price} €` : "Sur demande",
        image_url: imageUrl,
        likes: 0
      };

      await supabase
        .from("photos")
        .insert([{ image_url: imageUrl }])
        .select();

      onUploaded(newPhoto);
      setLastSubmitTime(Date.now()); // Enregistre le timestamp pour l'anti-flood

      // Réinitialisation
      setTitle("");
      setAuthor("");
      setPrice("");
      setFile(null);
      alert("✨ Œuvre publiée et sécurisée avec succès sur Boke One !");
    } catch (error) {
      console.error("Erreur détaillée:", error);
      alert("Erreur lors de la publication : " + (error.message || "Erreur inconnue"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "12px", padding: "15px 20px", marginBottom: "25px" }}>
      <h3 style={{ color: "#38bdf8", fontSize: "15px", marginTop: 0, marginBottom: "12px" }}>
        ⚡ Publication rapide d'une nouvelle œuvre (Sécurisée)
      </h3>

      <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Votre Nom / Pseudo"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: "8px", background: "#1e293b", border: "1px solid #475569", color: "white", fontSize: "13px" }}
        />
        <input
          type="text"
          placeholder="Titre de la photo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: "8px", background: "#1e293b", border: "1px solid #475569", color: "white", fontSize: "13px" }}
        />
        <input
          type="text"
          placeholder="Prix (ex: 150)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: "8px", background: "#1e293b", border: "1px solid #475569", color: "white", fontSize: "13px" }}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ color: "#94a3b8", fontSize: "12px" }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ background: "#06b6d4", color: "#020617", border: "none", padding: "9px 15px", borderRadius: "8px", fontWeight: "bold", fontSize: "13px", cursor: "pointer" }}
        >
          {loading ? "Publication..." : "🚀 Publier"}
        </button>
      </form>
    </div>
  );
}