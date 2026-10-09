import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function MarketplaceHome() {
  const [activeTab, setActiveTab] = useState("demander"); // "demander" (besoin) ou "trouver" (créatifs)
  const [searchCategory, setSearchCategory] = useState("Tous");
  
  // Formulaire de besoin
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Portrait corporate");
  const [city, setCity] = useState("Paris / IDF");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [contact, setContact] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Données
  const [requestsList, setRequestsList] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    try {
      const { data, error } = await supabase
        .from("requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setRequestsList(data);
    } catch (err) {
      console.error("Erreur chargement demandes:", err);
    }
  }

  async function handleSubmitRequest(e) {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg("");

    try {
      const { error } = await supabase.from("requests").insert([
        {
          title,
          category,
          city,
          description,
          budget: budget ? parseFloat(budget) : null,
          contact_info: contact,
          status: "pending"
        }
      ]);

      if (error) {
        alert("Erreur : " + error.message);
      } else {
        setSuccessMsg("🎉 Votre besoin a été transmis aux créatifs qualifiés d'Île-de-France !");
        setTitle("");
        setDescription("");
        setBudget("");
        setContact("");
        fetchRequests();
      }
    } catch (err) {
      alert("Erreur technique : " + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  // Filtrage des demandes selon la catégorie choisie
  const filteredRequests = searchCategory === "Tous" 
    ? requestsList 
    : requestsList.filter(r => r.category === searchCategory);

  return (
    <div style={{ color: "white", padding: "20px", maxWidth: "1000px", margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      
      {/* 1. HERO SECTION : L'ACCENT SUR LA RÉSOLUTION DE PROBLÈMES */}
      <div style={{ textAlign: "center", padding: "40px 20px", background: "linear-gradient(135deg, #0b1329 0%, #0f172a 100%)", borderRadius: "12px", border: "1px solid #1e293b", marginBottom: "30px", boxShadow: "0 8px 25px rgba(0,0,0,0.4)" }}>
        <h1 style={{ fontSize: "28px", marginBottom: "12px", color: "#f8fafc", fontWeight: "700" }}>
          Trouvez le bon créatif en Île-de-France, instantanément.
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "15px", maxWidth: "600px", margin: "0 auto 20px auto", lineHeight: "1.5" }}>
          Entreprises, professionnels, particuliers : exprimez votre besoin créatif ou consultez les missions locales en cours. Le cœur de Boke One, c'est la mise en relation réussie.
        </p>
        
        {/* SÉLECTEUR D'ACTION PRINCIPAL (ONGLETS MVP) */}
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab("demander")}
            style={{
              background: activeTab === "demander" ? "#10b981" : "#1e293b",
              color: activeTab === "demander" ? "white" : "#cbd5e1",
              border: "1px solid #334155",
              padding: "10px 20px",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            ✏️ J'ai un besoin (Déposer une mission)
          </button>
          <button
            onClick={() => setActiveTab("trouver")}
            style={{
              background: activeTab === "trouver" ? "#06b6d4" : "#1e293b",
              color: activeTab === "trouver" ? "#0f172a" : "#cbd5e1",
              border: "1px solid #334155",
              padding: "10px 20px",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            🔍 Voir les besoins & offres en IDF ({requestsList.length})
          </button>
        </div>
      </div>

      {/* SECTION STORYTELLING / NOTRE VISION */}
      <div style={{ background: "#0f172a", border: "1px solid #1e293b", padding: "30px", borderRadius: "12px", marginBottom: "30px", boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
        <h3 style={{ fontSize: "20px", color: "#f59e0b", marginBottom: "15px", fontWeight: "bold" }}>
          ⚡ Pourquoi BOKÉ ONE est né ?
        </h3>
        <div style={{ color: "#cbd5e1", fontSize: "14px", lineHeight: "1.6" }}>
          <p style={{ marginBottom: "12px" }}>
            Né d'une volonté de casser les barrières du milieu artistique et institutionnel en Île-de-France, <strong>BOKÉ ONE</strong> part d'un constat simple : la mise en relation entre créateurs d'élite (photographes, vidéastes, modèles) et professionnels ou particuliers à la recherche de prestations haut de gamme manquait de fluidité et de transparence.
          </p>
          <p style={{ margin: 0 }}>
            Fini les intermédiaires opaques. Nous structurons un réseau d'excellence entièrement orienté vers la performance, la clarté juridique (SIRET) et l'efficacité sur le terrain. Une alternative moderne pensée pour ceux qui veulent du concret.
          </p>
        </div>
      </div>

      {/* MESSAGE DE SUCCÈS */}
      {successMsg && (
        <div style={{ background: "#065f46", color: "#d1fae5", padding: "15px", borderRadius: "8px", marginBottom: "25px", textAlign: "center", fontWeight: "bold", border: "1px solid #059669" }}>
          {successMsg}
        </div>
      )}

      {/* 2. VUE 1 : FORMULAIRE DE DÉPÔT DE BESOIN */}
      {activeTab === "demander" && (
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", padding: "30px", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ margin: "0 0 5px 0", color: "#38bdf8", fontSize: "20px" }}>Exprimez votre projet en Île-de-France</h3>
            <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8" }}>
              Décrivez votre attente : nos créatifs qualifiés (photographes, vidéastes, modèles) vous répondront directement.
            </p>
          </div>

          <form onSubmit={handleSubmitRequest} style={{ display: "grid", gap: "15px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "5px", fontWeight: "500" }}>Titre de votre recherche</label>
              <input
                type="text"
                placeholder="Ex: Recherche photographe pour soirée d'entreprise à Paris 8e"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: "100%", padding: "12px", background: "#1e293b", border: "1px solid #475569", color: "white", borderRadius: "6px", boxSizing: "border-box" }}
                required
              />
            </div>

            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: "220px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "5px", fontWeight: "500" }}>Spécialité</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ width: "100%", padding: "12px", background: "#1e293b", border: "1px solid #475569", color: "white", borderRadius: "6px" }}
                >
                  <option value="Portrait corporate">Portrait corporate</option>
                  <option value="Événementiel">Événementiel</option>
                  <option value="Réalisation de contenu">Réalisation de contenu</option>
                  <option value="Mariage & Naissance">Mariage & Naissance</option>
                </select>
              </div>

              <div style={{ flex: 1, minWidth: "220px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "5px", fontWeight: "500" }}>Lieu précis (IDF)</label>
                <input
                  type="text"
                  placeholder="Ex: Boulogne-Billancourt, Versailles..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={{ width: "100%", padding: "12px", background: "#1e293b", border: "1px solid #475569", color: "white", borderRadius: "6px", boxSizing: "border-box" }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "5px", fontWeight: "500" }}>Description détaillée</label>
              <textarea
                placeholder="Précisez la date, vos contraintes et le résultat attendu..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                style={{ width: "100%", padding: "12px", background: "#1e293b", border: "1px solid #475569", color: "white", borderRadius: "6px", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }}
                required
              />
            </div>

            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: "220px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "5px", fontWeight: "500" }}>Budget estimé (€)</label>
                <input
                  type="number"
                  placeholder="Ex: 350"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  style={{ width: "100%", padding: "12px", background: "#1e293b", border: "1px solid #475569", color: "white", borderRadius: "6px", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ flex: 1, minWidth: "220px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "5px", fontWeight: "500" }}>Votre contact (Email ou Téléphone)</label>
                <input
                  type="text"
                  placeholder="Pour que le créatif vous contacte"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  style={{ width: "100%", padding: "12px", background: "#1e293b", border: "1px solid #475569", color: "white", borderRadius: "6px", boxSizing: "border-box" }}
                  required
                />
              </div>
            </div>

            <div style={{ marginTop: "10px" }}>
              <button
                type="submit"
                disabled={submitting}
                style={{ background: "#10b981", color: "white", border: "none", padding: "12px 24px", fontWeight: "bold", borderRadius: "6px", cursor: "pointer", fontSize: "15px" }}
              >
                {submitting ? "Publication..." : "Valider et publier mon besoin en IDF"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. VUE 2 : CONSULTATION DES DEMANDES */}
      {activeTab === "trouver" && (
        <div>
          {/* Barre de filtrage par catégorie */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
            {["Tous", "Portrait corporate", "Événementiel", "Réalisation de contenu", "Mariage & Naissance"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSearchCategory(cat)}
                style={{
                  background: searchCategory === cat ? "#38bdf8" : "#1e293b",
                  color: searchCategory === cat ? "#0f172a" : "#cbd5e1",
                  border: "1px solid #334155",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <h3 style={{ fontSize: "18px", marginBottom: "15px", color: "#f8fafc" }}>
            Missions & Besoins actifs en Île-de-France ({filteredRequests.length})
          </h3>

          {filteredRequests.length === 0 ? (
            <div style={{ background: "#0f172a", border: "1px solid #1e293b", padding: "30px", borderRadius: "12px", textAlign: "center", color: "#94a3b8" }}>
              <p style={{ margin: "0 0 10px 0" }}>Aucun besoin trouvé pour cette catégorie.</p>
              <button 
                onClick={() => setActiveTab("demander")} 
                style={{ background: "#06b6d4", color: "#0f172a", border: "none", padding: "8px 16px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "13px" }}
              >
                Soyez le premier à poster un besoin !
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "15px" }}>
              {filteredRequests.map((req) => (
                <div key={req.id} style={{ background: "#0f172a", border: "1px solid #1e293b", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.2)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "10px" }}>
                    <span style={{ background: "#1e293b", color: "#38bdf8", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold", border: "1px solid #334155" }}>
                      {req.category}
                    </span>
                    <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                      📍 {req.city} {req.budget ? `• 💰 ${req.budget} €` : ""}
                    </span>
                  </div>
                  
                  <h4 style={{ margin: "0 0 8px 0", fontSize: "17px", color: "#f8fafc" }}>{req.title}</h4>
                  <p style={{ margin: "0 0 15px 0", fontSize: "14px", color: "#cbd5e1", lineHeight: "1.5" }}>{req.description}</p>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #1e293b", paddingTop: "12px", flexWrap: "wrap", gap: "10px" }}>
                    <span style={{ fontSize: "12px", color: "#10b981", fontWeight: "bold" }}>● En attente de mise en relation</span>
                    <button
                      onClick={() => alert(`Pour répondre à ce besoin, contactez l'initiateur : ${req.contact_info}`)}
                      style={{ background: "#3b82f6", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", fontWeight: "bold", fontSize: "12px", cursor: "pointer" }}
                    >
                      Répondre à cette mission
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}