import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

// Profils initiaux style annuaire pro (avec matériel et équipement)
const mockProProfiles = [
  {
    id: "mock-1",
    pseudo: "Thomas Leroy",
    categorie: "Photographe",
    specialite: "Mode & Éditorial Haute Couture",
    materiel: "Sony A1 + 85mm f/1.4 GM, Éclairages Profoto B10",
    ville: "Paris, France",
    niveau: "Expert VIP",
    experience: "8 ans d'exp.",
    bio: "Spécialisé dans les shootings éditoriaux et campagnes publicitaires de mode.",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    instagram: "@thomas_photo",
  },
  {
    id: "mock-2",
    pseudo: "Sarah Benali",
    categorie: "Vidéaste",
    specialite: "Clips musicaux & Publicité",
    materiel: "FX6 + Optiques Cine Sigma Art, DJI Ronin RS3 Pro",
    ville: "Lyon, France",
    niveau: "Confirmé",
    experience: "5 ans d'exp.",
    bio: "Création de clips musicaux et de contenus immersifs pour marques.",
    avatar_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    instagram: "@sarah_cut",
  },
  {
    id: "mock-3",
    pseudo: "Marc Vander",
    categorie: "Photographe",
    specialite: "Drone & Paysages Extrêmes",
    materiel: "DJI Mavic 3 Pro, Nikon Z9 + 24-70mm f/2.8",
    ville: "Bruxelles, Belgique",
    niveau: "Membre Actif",
    experience: "4 ans d'exp.",
    bio: "Captures aériennes et reportages grands espaces haute résolution.",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    instagram: "@marvander",
  },
];

export default function CreatifsPage() {
  const [profiles, setProfiles] = useState(mockProProfiles);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategorie, setSelectedCategorie] = useState("");
  
  // État pour le formulaire d'ajout de profil
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPseudo, setNewPseudo] = useState("");
  const [newCategorie, setNewCategorie] = useState("Photographe");
  const [newSpecialite, setNewSpecialite] = useState("");
  const [newMateriel, setNewMateriel] = useState("");
  const [newVille, setNewVille] = useState("");
  const [newBio, setNewBio] = useState("");

  useEffect(() => {
    fetchSupabaseProfiles();
  }, []);

  async function fetchSupabaseProfiles() {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        setProfiles([...data, ...mockProProfiles]);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleCreateProfile(e) {
    e.preventDefault();
    if (!newPseudo || !newSpecialite) {
      alert("Veuillez remplir au moins votre nom et votre spécialité.");
      return;
    }

    const newProfileObj = {
      id: `local-${Date.now()}`,
      pseudo: newPseudo,
      categorie: newCategorie,
      specialite: newSpecialite,
      materiel: newMateriel || "Non renseigné",
      ville: newVille || "France",
      niveau: "Nouveau Membre",
      experience: "1 an d'exp.",
      bio: newBio || "Créateur passionné sur Boke One.",
      avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    };

    setProfiles([newProfileObj, ...profiles]);
    setShowAddForm(false);
    setNewPseudo("");
    setNewSpecialite("");
    setNewMateriel("");
    setNewVille("");
    setNewBio("");
    alert("🎉 Votre profil pro a été ajouté à l'annuaire !");
  }

  // Filtrage généraliste
  const filteredProfiles = profiles.filter((profile) => {
    const pseudo = profile.pseudo || "";
    const ville = profile.ville || "";
    const specialite = profile.specialite || "";
    const categorie = profile.categorie || "Photographe";
    const materiel = profile.materiel || "";

    const matchesSearch = 
      pseudo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ville.toLowerCase().includes(searchTerm.toLowerCase()) ||
      specialite.toLowerCase().includes(searchTerm.toLowerCase()) ||
      materiel.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategorie = 
      selectedCategorie === "" || categorie.toLowerCase() === selectedCategorie.toLowerCase();

    return matchesSearch && matchesCategorie;
  });

  return (
    <div style={{ padding: "10px 15px", color: "white", maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ marginBottom: "15px", textAlign: "center", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div style={{ textAlign: "left" }}>
          <h2 style={{ color: "#67e8f9", fontSize: "18px", margin: "0 0 4px 0" }}>👥 Annuaire Professionnel des Talents</h2>
          <p style={{ color: "#94a3b8", fontSize: "12px", margin: 0 }}>
            Trouvez les meilleurs photographes et experts par matériel ou spécialité.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            background: "#0891b2",
            color: "white",
            border: "none",
            padding: "8px 14px",
            borderRadius: "6px",
            fontWeight: "bold",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          {showAddForm ? "✕ Fermer" : "➕ Créer mon Profil Pro"}
        </button>
      </div>

      {/* Formulaire d'inscription de profil rapide */}
      {showAddForm && (
        <form
          onSubmit={handleCreateProfile}
          style={{
            background: "#0f172a",
            border: "1px solid #06b6d4",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <h3 style={{ color: "#67e8f9", fontSize: "14px", margin: 0 }}>📝 Fiche Technique Professionnelle</h3>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="Votre Nom / Pseudo"
              value={newPseudo}
              onChange={(e) => setNewPseudo(e.target.value)}
              style={{ flex: 1, minWidth: "180px", padding: "8px", borderRadius: "6px", background: "#1e293b", border: "1px solid #475569", color: "white", fontSize: "12px" }}
            />
            <select
              value={newCategorie}
              onChange={(e) => setNewCategorie(e.target.value)}
              style={{ padding: "8px", borderRadius: "6px", background: "#1e293b", border: "1px solid #475569", color: "white", fontSize: "12px", cursor: "pointer" }}
            >
              <option value="Photographe">Photographe</option>
              <option value="Vidéaste">Vidéaste</option>
              <option value="Studio">Studio / DA</option>
              <option value="Drone">Pilote Drone</option>
            </select>
            <input
              type="text"
              placeholder="Ville (ex: Paris, France)"
              value={newVille}
              onChange={(e) => setNewVille(e.target.value)}
              style={{ flex: 1, minWidth: "150px", padding: "8px", borderRadius: "6px", background: "#1e293b", border: "1px solid #475569", color: "white", fontSize: "12px" }}
            />
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="Spécificité (ex: Portrait Studio, Mariage, Mode...)"
              value={newSpecialite}
              onChange={(e) => setNewSpecialite(e.target.value)}
              style={{ flex: 1, minWidth: "200px", padding: "8px", borderRadius: "6px", background: "#1e293b", border: "1px solid #475569", color: "white", fontSize: "12px" }}
            />
            <input
              type="text"
              placeholder="Matériel & Équipement (ex: Sony A7IV + 24-70mm)"
              value={newMateriel}
              onChange={(e) => setNewMateriel(e.target.value)}
              style={{ flex: 1, minWidth: "200px", padding: "8px", borderRadius: "6px", background: "#1e293b", border: "1px solid #475569", color: "white", fontSize: "12px" }}
            />
          </div>

          <input
            type="text"
            placeholder="Courte biographie ou description de vos services"
            value={newBio}
            onChange={(e) => setNewBio(e.target.value)}
            style={{ padding: "8px", borderRadius: "6px", background: "#1e293b", border: "1px solid #475569", color: "white", fontSize: "12px" }}
          />

          <button
            type="submit"
            style={{ background: "#06b6d4", color: "#020617", border: "none", padding: "8px", borderRadius: "6px", fontWeight: "bold", fontSize: "12px", cursor: "pointer", alignSelf: "flex-end" }}
          >
            Enregistrer mon profil
          </button>
        </form>
      )}

      {/* Barre de recherche et filtre généraliste */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "15px",
          background: "#0f172a",
          padding: "10px 15px",
          borderRadius: "8px",
          border: "1px solid #334155",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="🔍 Rechercher par nom, ville, ou matériel (ex: Sony, Paris)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: "1",
            minWidth: "220px",
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #475569",
            background: "#1e293b",
            color: "white",
            outline: "none",
            fontSize: "12px",
          }}
        />

        {/* Filtre généraliste propre */}
        <select
          value={selectedCategorie}
          onChange={(e) => setSelectedCategorie(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #475569",
            background: "#1e293b",
            color: "white",
            outline: "none",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          <option value="">Tous les métiers (Général)</option>
          <option value="Photographe">Photographe</option>
          <option value="Vidéaste">Vidéaste</option>
          <option value="Studio">Studio / DA</option>
          <option value="Drone">Pilote Drone</option>
        </select>
      </div>

      {/* Liste des profils pros */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {filteredProfiles.length === 0 ? (
          <div style={{ textAlign: "center", padding: "20px", color: "#94a3b8", fontSize: "12px" }}>
            <p>Aucun profil ne correspond à votre recherche.</p>
          </div>
        ) : (
          filteredProfiles.map((profile) => (
            <div
              key={profile.id}
              style={{
                background: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "8px",
                padding: "12px 15px",
                display: "flex",
                alignItems: "center",
                gap: "15px",
                flexWrap: "wrap",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              {/* Avatar */}
              <div style={{ flexShrink: 0 }}>
                <img
                  src={profile.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
                  alt={profile.pseudo}
                  style={{
                    width: "55px",
                    height: "55px",
                    objectFit: "cover",
                    borderRadius: "50%",
                    border: "2px solid #06b6d4",
                  }}
                />
              </div>

              {/* Infos détaillées (Spécialité + Matériel) */}
              <div style={{ flex: "1", minWidth: "220px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                  <h3 style={{ fontSize: "14px", color: "#67e8f9", margin: 0 }}>
                    {profile.pseudo}
                  </h3>
                  <span style={{ fontSize: "10px", background: "#1e293b", color: "#38bdf8", border: "1px solid #475569", padding: "1px 6px", borderRadius: "4px" }}>
                    {profile.categorie || "Photographe"}
                  </span>
                </div>

                <p style={{ color: "#34d399", fontSize: "12px", fontWeight: "bold", margin: "0 0 3px 0" }}>
                  🎯 {profile.specialite}
                </p>

                <p style={{ color: "#facc15", fontSize: "11px", margin: "0 0 3px 0" }}>
                  📷 <strong>Matériel :</strong> {profile.materiel || "Non spécifié"}
                </p>

                <p style={{ color: "#94a3b8", fontSize: "11px", margin: "0 0 3px 0" }}>
                  📍 {profile.ville || "France"} | 💼 {profile.experience || "Expérience pro"}
                </p>

                <p style={{ color: "#cbd5e1", fontSize: "11px", fontStyle: "italic", margin: 0 }}>
                  "{profile.bio}"
                </p>
              </div>

              {/* Bouton Contacter */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <a
                  href={`mailto:contact@bokeone.com?subject=Contact%20professionnel%20-%20${encodeURIComponent(profile.pseudo)}`}
                  style={{
                    background: "#0891b2",
                    color: "white",
                    padding: "6px 12px",
                    borderRadius: "5px",
                    fontSize: "11px",
                    textDecoration: "none",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  💬 Contacter
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}