import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient"; // ⚠️ ASSOMPTION : supabaseClient.js est à la racine de /src.
// Si ton arborescence réelle est différente (ex: /src/lib/supabaseClient.js), corrige ce chemin.

/**
 * ANCIEN SYSTÈME (retiré) :
 * const SECRET_PASSWORD = "bokeone2026";
 * → Ce mot de passe était visible en clair dans le bundle JS envoyé au navigateur.
 *   N'importe qui pouvait l'extraire via l'inspecteur (Ctrl+Maj+I > Sources) en quelques secondes.
 *   Ce n'était PAS une sécurité, juste une porte fermée sans serrure.
 *
 * NOUVEAU SYSTÈME :
 * L'accès à l'espace Pro/Fondateurs est conditionné à :
 *   1. Une session Supabase Auth active (déjà en place dans ForumPage.jsx — même compte).
 *   2. Un champ `is_founder` (booléen) sur la table `profiles`, à créer côté Supabase
 *      (voir le fichier supabase_founder_migration.sql fourni séparément).
 *
 * Ceci correspond aussi à ta demande marketing : offrir un statut exclusif
 * (accès anticipé + badge) à tes 95 premiers abonnés Instagram une fois
 * qu'ils créent un compte sur la plateforme.
 */

export default function PremiumPage() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingAccess, setCheckingAccess] = useState(true);

  // États pour le générateur de contrat
  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [contractAmount, setContractAmount] = useState(600);
  const [contractGenerated, setContractGenerated] = useState(false);

  // États pour le simulateur de devis
  const [heures, setHeures] = useState(4);
  const [niveauPrestation, setNiveauPrestation] = useState(150);

  // Données simulées (à remplacer par de vraies requêtes Supabase quand le volume de ventes existera)
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

  useEffect(() => {
    let subscription;

    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
      if (session) await fetchProfile(session.user.id);
      else setCheckingAccess(false);
    }

    init();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session) await fetchProfile(session.user.id);
      else {
        setProfile(null);
        setCheckingAccess(false);
      }
    });
    subscription = authListener.subscription;

    return () => subscription && subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId) {
    setCheckingAccess(true);
    // Table `member_status` (voir supabase_02_member_status.sql) : lecture de SA propre ligne uniquement.
    const { data, error } = await supabase
      .from("member_status")
      .select("is_founder, is_pro, founder_number")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Erreur de récupération du statut :", error.message);
      setProfile(null);
    } else {
      setProfile(data); // null si aucune ligne = membre standard
    }
    setCheckingAccess(false);
  }

  const pseudo = session?.user?.user_metadata?.pseudo || session?.user?.email?.split("@")[0] || "";

  const devisTotal = heures * niveauPrestation;

  // --- ÉTAT 1 : chargement ---
  if (loading || checkingAccess) {
    return (
      <div style={{ padding: "40px", color: "white", textAlign: "center" }}>
        Vérification de votre accès...
      </div>
    );
  }

  // --- ÉTAT 2 : pas connecté ---
  if (!session) {
    return (
      <div style={{ padding: "30px", color: "white", maxWidth: "450px", margin: "40px auto", textAlign: "center", background: "#0f172a", border: "1px solid #334155", borderRadius: "12px" }}>
        <h2 style={{ color: "#67e8f9", fontSize: "18px", marginBottom: "8px" }}>💎 Espace Fondateurs & Pro Boke One</h2>
        <p style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "20px" }}>
          Cet espace est réservé aux membres connectés. Connecte-toi via l'onglet Forum
          (même compte) pour y accéder.
        </p>
      </div>
    );
  }

  // --- ÉTAT 3 : connecté mais pas fondateur/pro ---
  if (!profile?.is_founder && !profile?.is_pro) {
    return (
      <div style={{ padding: "30px", color: "white", maxWidth: "450px", margin: "40px auto", textAlign: "center", background: "#0f172a", border: "1px solid #334155", borderRadius: "12px" }}>
        <h2 style={{ color: "#67e8f9", fontSize: "18px", marginBottom: "8px" }}>🔒 Espace réservé</h2>
        <p style={{ color: "#94a3b8", fontSize: "13px" }}>
          Cet espace est réservé aux membres Fondateurs et aux comptes Pro.
          Si tu fais partie de nos premiers membres Instagram, contacte-nous
          pour activer ton statut Fondateur.
        </p>
      </div>
    );
  }

  // --- ÉTAT 4 : accès autorisé ---
  return (
    <div style={{ padding: "15px 20px", color: "white", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "20px", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", border: "1px solid #06b6d4", borderRadius: "10px", padding: "15px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h2 style={{ color: "#67e8f9", fontSize: "18px", margin: "0 0 5px 0" }}>
            ⚡ Dashboard {profile?.is_founder ? "Fondateur" : "Pro"} Boke One
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "12px", margin: 0 }}>
            Bienvenue {pseudo} — suivi des images, clics, ventes et contrats.
          </p>
        </div>
        {profile?.is_founder && (
          <div style={{ background: "#1e293b", border: "1px solid #f59e0b", padding: "8px 12px", borderRadius: "8px", fontSize: "12px", color: "#facc15", fontWeight: "bold" }}>
            🏅 Membre Fondateur — 0% commission
          </div>
        )}
      </div>

      <div style={{ background: "#422006", border: "1px solid #f59e0b", color: "#fde68a", borderRadius: "8px", padding: "10px 14px", marginBottom: "15px", fontSize: "12px" }}>
        ⚠️ Données de démonstration : les chiffres, œuvres et clients ci-dessous sont fictifs.
        Les vraies statistiques seront branchées lorsque des ventes réelles existeront.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "15px" }}>
        <div style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", padding: "15px", gridColumn: "1 / -1" }}>
          <h3 style={{ color: "#38bdf8", fontSize: "15px", marginTop: 0, marginBottom: "10px" }}>
            📈 Performances des Images & Ventes du Mois
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

          <div style={{ marginBottom: "15px" }}>
            <h4 style={{ fontSize: "13px", color: "#67e8f9", marginBottom: "8px" }}>🖼️ Œuvres publiées & clics / likes :</h4>
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

          <div>
            <h4 style={{ fontSize: "13px", color: "#67e8f9", marginBottom: "8px" }}>🛒 Historique des achats :</h4>
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
        </div>

        <div style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", padding: "15px" }}>
          <h3 style={{ color: "#38bdf8", fontSize: "14px", marginTop: 0, marginBottom: "10px" }}>
            📝 Générateur de Contrat & Cession
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "10px" }}>
            <input type="text" placeholder="Nom du Client / Marque" value={clientName} onChange={(e) => setClientName(e.target.value)}
              style={{ padding: "6px 10px", borderRadius: "6px", background: "#1e293b", border: "1px solid #475569", color: "white", fontSize: "11px" }} />
            <input type="text" placeholder="Intitulé du projet" value={projectName} onChange={(e) => setProjectName(e.target.value)}
              style={{ padding: "6px 10px", borderRadius: "6px", background: "#1e293b", border: "1px solid #475569", color: "white", fontSize: "11px" }} />
            <input type="number" placeholder="Montant HT (€)" value={contractAmount} onChange={(e) => setContractAmount(e.target.value)}
              style={{ padding: "6px 10px", borderRadius: "6px", background: "#1e293b", border: "1px solid #475569", color: "white", fontSize: "11px" }} />
          </div>
          <button
            onClick={() => {
              if (!clientName || !projectName) { alert("Veuillez remplir le nom du client et du projet."); return; }
              setContractGenerated(true);
            }}
            style={{ width: "100%", background: "#06b6d4", color: "#020617", border: "none", padding: "7px", borderRadius: "6px", fontWeight: "bold", fontSize: "12px", cursor: "pointer", marginBottom: "10px" }}
          >
            ⚡ Générer le Contrat officiel
          </button>
          {contractGenerated && (
            <div style={{ background: "#1e293b", padding: "8px", borderRadius: "6px", border: "1px solid #34d399", fontSize: "11px" }}>
              <p style={{ color: "#34d399", fontWeight: "bold", margin: "0 0 4px 0" }}>✅ Contrat généré pour {clientName} ({contractAmount}€ HT)</p>
              {/* NOTE : le vrai export PDF n'est pas encore implémenté — voir recommandation dans le message de conversation */}
            </div>
          )}
        </div>

        <div style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", padding: "15px" }}>
          <h3 style={{ color: "#38bdf8", fontSize: "14px", marginTop: 0, marginBottom: "8px" }}>
            📊 Simulateur de Devis
          </h3>
          <div style={{ marginBottom: "8px" }}>
            <label style={{ fontSize: "11px", color: "#cbd5e1" }}>Durée : {heures} heures</label>
            <input type="range" min="1" max="24" value={heures} onChange={(e) => setHeures(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#06b6d4", cursor: "pointer" }} />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ fontSize: "11px", color: "#cbd5e1" }}>Taux horaire : {niveauPrestation} €/h</label>
            <select value={niveauPrestation} onChange={(e) => setNiveauPrestation(Number(e.target.value))}
              style={{ width: "100%", padding: "6px", borderRadius: "6px", background: "#1e293b", border: "1px solid #475569", color: "white", fontSize: "11px", marginTop: "3px" }}>
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
