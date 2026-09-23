import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function CreatifsPage() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, []);

  async function fetchProfiles() {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      setProfiles(data || []);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: "30px" }}>
        <h2>👥 Créatifs</h2>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px" }}>
      <h2>👥 Créatifs inscrits</h2>

      <p>
        Découvrez les photographes, vidéastes,
        réalisateurs, modèles et créateurs de la communauté BOKE ONE.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {profiles.map((profile) => (
          <div
            key={profile.id}
            style={{
              background: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "12px",
              padding: "20px",
            }}
          >
            <div
              style={{
                textAlign: "center",
                marginBottom: "15px",
              }}
            >
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.pseudo}
                  style={{
                    width: "100px",
                                borderRadius: "50%",
                    background: "#1e293b",
                    margin: "auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "40px",
                  }}
                >
                  👤
                </div>
              )}
            </div>

            <h3>{profile.pseudo || "Créatif"}</h3>

            <p>
              📍 {profile.ville || "Ville non renseignée"}
            </p>

            <p>
              🎯 {profile.specialite || "Spécialité non renseignée"}
            </p>

            <p>
              ⭐ {profile.niveau || "Niveau non renseigné"}
            </p>

            <p>
              🌍 {profile.pays || "Pays non renseigné"}
            </p>

            <p>
              💼 {profile.experience || "Expérience non renseignée"}
            </p>

            <p>
              {profile.bio || "Aucune bio disponible"}
            </p>

            {profile.instagram && (
              <p>
                📸 Instagram : {profile.instagram}
              </p>
            )}

            {profile.site_web && (
              <p>
                🌐 Site : {profile.site_web}
              </p>
            )}

            <div
              style={{
            