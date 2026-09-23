import React, { useState } from "react";

const SECRET_PASSWORD = "bokeone2026";

export default function PremiumPage() {
  const [passwordInput, setPasswordInput] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // États pour le générateur de contrat
  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [contractAmount, setContractAmount] = useState(600);
  const [contractGenerated, setContractGenerated] = useState(false);

  // États pour le simulateur de devis
  const [heures, setHeures] = useState(4);
  const [niveauPrestation, setNiveauPrestation] = useState(150);

  // Données simulées détaillées pour les images et les achats du mois
  const [imageStats] = useState([
    { id: 1, title: "ITIL Foundation 4", vues: 342, likes: 48, statut: "Actif" },
    { id: 2, title: "Schéma Réseau Techno", vues: 215, likes: 29, statut: "Actif" },
    { id: 3, title: "Coucher de soleil Boke One", vues: 589, likes: 92, statut: "Populaire" },
  ]);

  const [salesHistory] = useState([
    { id: 101, oeuvre: "Coucher de soleil Boke One", client: "L'Oréal Paris", montant: "350 €", date: "18 Mars 2026" },
    { id: 102, oeuvre: "ITIL Foundation 4 (Licence Pro)", client: "Tech Solutions Inc.", montant: "600 €", date: "12 Mars 2026" },
    { id: 103, oeuvre: "Pack 3 Tirages Éditoriaux", client: "Studio Vogue", montant: "500 €", date: "04 Mars 2026" },
  ]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === SECRET_PASSWORD) {
      setIsUnlocked(true);
      setErrorMsg("");
    } else {
      setErrorMsg("Mot de passe incorrect. Indice : bokeone2026");
    }
  };

  const devisTotal = heures * niveauPrestation;

  if (!isUnlocked) {
    return (
      <div style={{ padding: "30px", color: "white", maxWidth: "450px", margin: "40px auto", textAlign: "center", background: "#0f172a", border: "1px solid #334155", borderRadius: "12px" }}>
        <h2 style={{ color: "#67e8f9", fontSize: "18px", marginBottom: "8px" }}>💎 Espace Exclusif VIP Boke One</h2>
        <p style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "20px" }}>
          Zone sécurisée réservée aux créateurs accrédités. Entrez le mot de passe.
        </p>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input
            type="password"
            placeholder="Mot de passe secret..."
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            style={{ padding: "10px", borderRadius: "8px", background: "#1e293b", border: "1px solid #475569", color: "white", fontSize: "14px", textAlign: "center", outline: "none" }}
          />
          <button
            type="submit"
            style={{ background: "#06b6d4", color: "#020617", border: "none", padding: "10px", borderRadius: "8px", fontWeight: "bold", fontSize: "14px", cursor: "pointer" }}
          >
            🔓 Déverrouiller le Dashboard Pro
          </button>
        </form>

        {errorMsg && <p style={{ color: "#f87171", fontSize: "12px", marginTop: "12px" }}>{errorMsg}</p>}
      </div>
    );
  }

  return (
    <div style={{ padding: "15px 20px", color: "white", maxWidth: "1200px", margin: "0 auto" }}>
      {/* En-tête du Dashboard */}
      <div style={{ marginBottom: "20px", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", border: "1px solid #06b6d4", borderRadius: "10px", padding: "15px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h2 style={{ color: "#67e8f9", fontSize: "18px", margin: "0 0 5px 0" }}>⚡ Dashboard Pro & Espace VIP Boke One</h2>
          <p style={{ color: "#94a3b8", fontSize: "12px", margin: 0 }}>
            Suivi détaillé des images, clics, ventes et contrats du mois.
          </p>
        </div>
        <div style={{ background: "#1e293b", border: "1px solid #334155", padding: "8px 12px", borderRadius: "8px", fontSize: "12px", color: "#34d399", fontWeight: "bold" }}>
          🟢 Statut : Compte Pro Vérifié
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "15px" }}>
        
        {/* BLOC 1 : Statistiques des Ventes & Détail des Images */}
        <div style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", padding: "15px", gridColumn: "1 / -1" }}>
          <h3 style={{ color: "#38bdf8", fontSize: "15px", marginTop: 0, marginBottom: "10px" }}>
            📈 Performances des Images & Ventes du Mois (Mars 2026)
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px", marginBottom: "15px" }}>
            <div style={{ background: "#1e293b", padding: "12px", borderRadius: "8px", border: "1px solid #475569", textAlign: "center" }}>
              <span style={{ fontSize: "11px", color: "#94a3b8" }}>Chiffre d'Affaires Total</span>
              <div style={{ fontSize: "20px", fontWeight: "bold", color: "#34d399", marginTop: "4px" }}>1 450 € HT</div>
            </div>
            <div style={{ background: "#1e293b", padding: "12px", borderRadius: "8px", border: "1px solid #475569", textAlign: "center" }}>
              <span style={{ fontSize: "11px", color: "#94a3b8" }}>Nombre total d'achats</span>
              <div style={{ fontSize: "20px", fontWeight: "bold", color: "#67e8f9", marginTop: "4px" }}>3 ventes validées</div>
            </div>
          </div>

          {/* Tableau des Noms d'images, Clics et Likes */}
          <div style={{ marginBottom: "15px" }}>
            <h4 style={{ fontSize: "13px", color: "#67e8f9", marginBottom: "8px" }}>🖼️ Noms des images publiées & Nombre de clics / likes :</h4>
            <div style={{ background: "#1e293b", borderRadius: "8px", overflow: "hidden", border: "1px solid #475569" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "#0f172a", color: "#94a3b8", borderBottom: "1px solid #475569" }}>
                    <th style={{ padding: "8px 12px" }}>Nom de l'œuvre</th>
                    <th style={{ padding: "8px 12px" }}>Clics / Vues</th>
                    <th style={{ padding: "8px 12px" }}>Likes / Favoris</th>
                    <th style={{ padding: "8px 12px" }}>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {imageStats.map((img) => (
                    <tr key={img.id} style={{ borderBottom: "1px solid #334155" }}>
                      <td style={{ padding: "8px 12px", fontWeight: "bold", color: "white" }}>{img.title}</td>
                      <td style={{ padding: "8px 12px", color: "#38bdf8" }}>👁️ {img.vues} vues</td>
                      <td style={{ padding: "8px 12px", color: "#f43f5e" }}>❤️ {img.likes} likes</td>
                      <td style={{ padding: "8px 12px", color: "#34d399" }}>{img.statut}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tableau des Achats faits par les clients */}
          <div>
            <h4 style={{ fontSize: "13px", color: "#67e8f9", marginBottom: "8px" }}>🛒 Historique des achats réalisés sur vos photos :</h4>
            <div style={{ background: "#1e293b", borderRadius: "8px", overflow: "hidden", border: "1px solid #475569" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "#0f172a", color: "#94a3b8", borderBottom: "1px solid #475569" }}>
                    <th style={{ padding: "8px 12px" }}>Œuvre achetée</th>
                    <th style={{ padding: "8px 12px" }}>Client / Acheteur</th>
                    <th style={{ padding: "8px 12px" }}>Montant</th>
                    <th style={{ padding: "8px 12px" }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {salesHistory.map((sale) => (
                    <tr key={sale.id} style={{ borderBottom: "1px solid #334155" }}>
                      <td style={{ padding: "8px 12px", fontWeight: "bold", color: "white" }}>{sale.oeuvre}</td>
                      <td style={{ padding: "8px 12px", color: "#facc15" }}>{sale.client}</td>
                      <td style={{ padding: "8px 12px", color: "#34d399", fontWeight: "bold" }}>{sale.montant}</td>
                      <td style={{ padding: "8px 12px", color: "#94a3b8" }}>{sale.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Demande de Comptable */}
          <div style={{ marginTop: "15px", background: "#1e293b", padding: "12px", borderRadius: "8px", border: "1px solid #06b6d4", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <span style={{ fontSize: "12px", fontWeight: "bold", color: "#facc15" }}>💡 Déclaration fiscale simplifiée</span>
              <p style={{ fontSize: "11px", color: "#cbd5e1", margin: "2px 0 0 0" }}>Besoin d'un accompagnement pour déclarer vos ventes mensuelles auprès de l'administration ?</p>
            </div>
            <button
              onClick={() => alert("Demande transmise à notre cabinet comptable partenaire.")}
              style={{ background: "#0891b2", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}
            >
              📊 Demander un comptable
            </button>
          </div>
        </div>

        {/* BLOC 2 : Générateur de Contrat Pro sur-mesure */}
        <div style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", padding: "15px" }}>
          <h3 style={{ color: "#38bdf8", fontSize: "14px", marginTop: 0, marginBottom: "10px" }}>
            📝 Générateur de Contrat & Cession
          </h3>
          <p style={{ color: "#94a3b8", fontSize: "11px", marginBottom: "10px" }}>
            Rédigez un contrat conforme avec les règles de cession de droits.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "10px" }}>
            <input
              type="text"
              placeholder="Nom du Client / Marque"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              style={{ padding: "6px 10px", borderRadius: "6px", background: "#1e293b", border: "1px solid #475569", color: "white", fontSize: "11px" }}
            />
            <input
              type="text"
              placeholder="Intitulé du projet (ex: Shooting Studio)"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              style={{ padding: "6px 10px", borderRadius: "6px", background: "#1e293b", border: "1px solid #475569", color: "white", fontSize: "11px" }}
            />
            <input
              type="number"
              placeholder="Montant HT (€)"
              value={contractAmount}
              onChange={(e) => setContractAmount(e.target.value)}
              style={{ padding: "6px 10px", borderRadius: "6px", background: "#1e293b", border: "1px solid #475569", color: "white", fontSize: "11px" }}
            />
          </div>

          <button
            onClick={() => {
              if (!clientName || !projectName) {
                alert("Veuillez remplir le nom du client et du projet.");
                return;
              }
              setContractGenerated(true);
            }}
            style={{ width: "100%", background: "#06b6d4", color: "#020617", border: "none", padding: "7px", borderRadius: "6px", fontWeight: "bold", fontSize: "12px", cursor: "pointer", marginBottom: "10px" }}
          >
            ⚡ Générer le Contrat officiel
          </button>

          {contractGenerated && (
            <div style={{ background: "#1e293b", padding: "8px", borderRadius: "6px", border: "1px solid #34d399", fontSize: "11px" }}>
              <p style={{ color: "#34d399", fontWeight: "bold", margin: "0 0 4px 0" }}>✅ Contrat généré pour {clientName} ({contractAmount}€ HT)</p>
              <button
                onClick={() => alert(`Téléchargement du contrat "${projectName}" en cours...`)}
                style={{ background: "#047857", color: "white", border: "none", padding: "4px 8px", borderRadius: "4px", fontSize: "10px", cursor: "pointer", fontWeight: "bold" }}
              >
                📥 Télécharger le PDF du Contrat
              </button>
            </div>
          )}
        </div>

        {/* BLOC 3 : Simulateur de Devis */}
        <div style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", padding: "15px" }}>
          <h3 style={{ color: "#38bdf8", fontSize: "14px", marginTop: 0, marginBottom: "8px" }}>
            📊 Simulateur de Devis
          </h3>
          <p style={{ color: "#94a3b8", fontSize: "11px", marginBottom: "10px" }}>
            Estimez rapidement le tarif d'une prestation selon votre temps.
          </p>

          <div style={{ marginBottom: "8px" }}>
            <label style={{ fontSize: "11px", color: "#cbd5e1" }}>Durée : {heures} heures</label>
            <input
              type="range"
              min="1"
              max="24"
              value={heures}
              onChange={(e) => setHeures(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#06b6d4", cursor: "pointer" }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label style={{ fontSize: "11px", color: "#cbd5e1" }}>Taux horaire : {niveauPrestation} €/h</label>
            <select
              value={niveauPrestation}
              onChange={(e) => setNiveauPrestation(Number(e.target.value))}
              style={{ width: "100%", padding: "6px", borderRadius: "6px", background: "#1e293b", border: "1px solid #475569", color: "white", fontSize: "11px", marginTop: "3px" }}
            >
              <option value={100}>Standard (100 €/h)</option>
              <option value={150}>Confirmé (150 €/h)</option>
              <option value={250}>Expert / Publicité (250 €/h)</option>
            </select>
          </div>

          <div style={{ background: "#1e293b", padding: "8px", borderRadius: "6px", textAlign: "center", border: "1px solid #06b6d4" }}>
            <span style={{ fontSize: "11px", color: "#94a3b8" }}>Total estimé :</span>
            <div style={{ fontSize: "16px", fontWeight: "bold", color: "#34d399" }}>{devisTotal} € HT</div>
          </div>
        </div>

      </div>
    </div>
  );
}