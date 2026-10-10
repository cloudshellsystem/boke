import React, { useState, useRef, useEffect } from "react";
import { formatPrice } from "../lib/formatPrice";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

// ───────────────────────── Utilitaires ─────────────────────────
const MAX_LOGO_BYTES = 500 * 1024; // 500 Ko
const ALLOWED_LOGO_TYPES = ["image/png", "image/jpeg", "image/webp"];
const LOGO_DATA_URL = /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/;
const EMPTY_COMPANY = { name: "", siret: "", address: "", email: "", logoBase64: "" };

const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

// Échappe tout texte saisi par l'utilisateur avant de le placer dans le document imprimé
// (évite l'injection de HTML/scripts dans la fenêtre d'impression).
const esc = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

function issueErrorMessage(err) {
  const raw = String(err?.message || err || "");
  if (raw.includes("plan_required")) return "Votre offre ne permet pas d'émettre des documents (offre Pro ou Élite requise).";
  if (raw.includes("not_authenticated")) return "Session expirée. Reconnectez-vous puis réessayez.";
  if (raw.includes("invalid_amount")) return "Montant invalide.";
  if (/fetch|network|load failed/i.test(raw)) return "Connexion au serveur impossible : le document n'a pas été numéroté. Réessayez.";
  return "Impossible d'émettre le document pour le moment. Réessayez.";
}

// ───────────────────────── Écran de verrouillage ─────────────────────────
function LockedScreen({ text, action }) {
  return (
    <div className="mx-auto w-full max-w-4xl bg-neutral-950 p-8 text-neutral-200 min-h-[70vh] flex flex-col items-center justify-center text-center font-sans">
      <div className="bg-neutral-900 border-2 border-amber-500/40 p-8 rounded-3xl shadow-2xl max-w-lg space-y-6">
        <div className="w-16 h-16 bg-amber-500/15 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-3xl">
          🔒
        </div>
        <div className="space-y-2">
          <span className="text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
            Espace Réservé & Sécurisé (Offre Pro 49€ / 129€)
          </span>
          <h1 className="text-2xl font-black text-amber-400">Espace Vente, Compta & Conformité Pro</h1>
          <p className="text-xs sm:text-sm text-neutral-400">{text}</p>
        </div>
        {action}
      </div>
    </div>
  );
}

// ───────────────────────── Composant principal ─────────────────────────
export default function EspaceMembrePro({ onRequireLogin }) {
  // ⚠️ RÈGLE DES HOOKS : tous les hooks sont appelés ICI, avant tout `return`.
  // (L'ancienne version appelait useState après le return du cadenas : plantage React
  //  dès que l'état de connexion changeait.)
  const { isLoggedIn, loading, hasProAccess } = useAuth();

  const [activeTab, setActiveTab] = useState("notionLive");

  // 🏢 Paramètres Entreprise du Créateur (volontairement VIDES : aucun faux SIRET pré-rempli)
  const [companyInfo, setCompanyInfo] = useState(EMPTY_COMPANY);
  const [logoError, setLogoError] = useState("");
  const logoInputRef = useRef(null);

  // 📄 État du document en temps réel
  const [docType, setDocType] = useState("FACTURE");
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [itemTitle, setItemTitle] = useState("");
  const [itemPrice, setItemPrice] = useState(0);

  // 💶 Gestion de la TVA
  const [hasTva, setHasTva] = useState(false);
  const [tvaRate, setTvaRate] = useState(20);

  // 🔢 Émission / numérotation
  const [issued, setIssued] = useState(null); // { number, issuedAt, snapshot }
  const [printing, setPrinting] = useState(false);
  const [printMessage, setPrintMessage] = useState(null); // { type: "error" | "ok", text }

  const [activeLeadId, setActiveLeadId] = useState(1);
  const [scriptStep, setScriptStep] = useState(1);

  // Données de démonstration (non réelles)
  const [creatorStats] = useState({
    totalViews: 14250,
    totalLikes: 3840,
    totalEarnings: 1850.0,
  });

  const [mockLeads] = useState([
    {
      id: 1,
      clientName: "Agence Horizon",
      contactPerson: "M. Kaba (Directeur Artistique)",
      status: "Nouveau Lead (Panier actif)",
      scriptSteps: {
        1: "« Bonjour M. Kaba, je vois que vous suivez de près l'œuvre « Lumières de Conakry ». Pour votre budget de 150 €, nous vous garantissons une cession de droits immédiate. Est-ce que cela correspond à vos attentes ? »",
        2: "« Je comprends votre besoin de réflexion. Sachez que cette licence inclut une exclusivité territoriale de 72h sur Paris pour votre campagne. »",
        3: "« Parfait, on signe le bon de commande numérique tout de suite ? »",
      },
    },
  ]);

  // Lien Notion : servi uniquement aux comptes Pro/Élite (table pro_resources + RLS),
  // il n'est plus écrit en clair dans le code JavaScript.
  const [notionUrl, setNotionUrl] = useState(null);
  useEffect(() => {
    if (!hasProAccess) {
      setNotionUrl(null);
      return undefined;
    }
    let active = true;
    supabase
      .from("pro_resources")
      .select("url")
      .eq("key", "notion")
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) console.warn("Ressource Notion indisponible :", error.message);
        setNotionUrl(data?.url ?? null);
      });
    return () => {
      active = false;
    };
  }, [hasProAccess]);

  // ───────── Calculs (pas des hooks) ─────────
  const montantHT = round2(parseFloat(itemPrice) || 0);
  const montantTVA = hasTva ? round2(montantHT * (tvaRate / 100)) : 0;
  const montantTTC = round2(montantHT + montantTVA);

  // Empreinte du contenu du document : si l'utilisateur modifie quoi que ce soit après
  // l'émission, le numéro précédent n'est PAS réutilisé pour un document différent.
  const currentSnapshot = JSON.stringify({
    docType,
    c: [companyInfo.name, companyInfo.siret, companyInfo.address, companyInfo.email, companyInfo.logoBase64.length],
    k: [clientName, clientAddress],
    i: [itemTitle, montantHT],
    t: [hasTva, hasTva ? tvaRate : null],
  });
  const isIssuedCurrent = Boolean(issued && issued.snapshot === currentSnapshot);

  const currentActiveLead = mockLeads.find((l) => l.id === activeLeadId) || mockLeads[0];

  // ───────── Contrôle d'accès (après TOUS les hooks) ─────────
  // L'affichage ci-dessous reflète les droits serveur ; la vraie barrière est la RLS /
  // la fonction issue_document() côté Supabase (voir supabase_05_unified.sql).
  if (loading) {
    return (
      <div className="mx-auto w-full max-w-4xl bg-neutral-950 p-8 text-neutral-400 min-h-[70vh] flex items-center justify-center text-sm font-sans">
        Vérification de votre accès…
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <LockedScreen
        text="Cet espace est strictement réservé aux abonnés Pro. Connectez-vous pour accéder à vos outils de facturation avec SIRET, logo et TVA."
        action={
          <button
            type="button"
            onClick={onRequireLogin}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold rounded-xl text-xs uppercase tracking-wider transition shadow-lg cursor-pointer"
          >
            Se connecter / S'abonner ⚡
          </button>
        }
      />
    );
  }

  if (!hasProAccess) {
    return (
      <LockedScreen
        text="Votre offre actuelle ne donne pas accès à cet espace. Il est réservé aux abonnés Pro (49 €) et Élite (129 €)."
        action={
          <a
            href="mailto:contact@bokeone.com?subject=Passer%20%C3%A0%20l'offre%20Pro%20ou%20%C3%89lite"
            className="block w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold rounded-xl text-xs uppercase tracking-wider transition shadow-lg cursor-pointer"
          >
            Passer à l'offre Pro / Élite ⚡
          </a>
        }
      />
    );
  }

  // ───────── Logo ─────────
  const handleLogoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    setLogoError("");
    if (!file) return;
    if (!ALLOWED_LOGO_TYPES.includes(file.type)) {
      setLogoError("Format non accepté : utilisez un PNG, JPG ou WebP.");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      setLogoError("Logo trop lourd (500 Ko maximum).");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string" && LOGO_DATA_URL.test(reader.result)) {
        setCompanyInfo((prev) => ({ ...prev, logoBase64: reader.result }));
      } else {
        setLogoError("Impossible de lire ce fichier.");
      }
    };
    reader.onerror = () => setLogoError("Impossible de lire ce fichier.");
    reader.readAsDataURL(file);
  };

  // ───────── Validation avant émission ─────────
  const validateBeforeIssue = () => {
    const problems = [];
    if (!companyInfo.name.trim()) problems.push("le nom de l'entreprise");
    if (!/^\d{14}$/.test(companyInfo.siret.replace(/\s/g, ""))) problems.push("un SIRET valide (14 chiffres)");
    if (!companyInfo.address.trim()) problems.push("l'adresse de l'entreprise");
    if (!clientName.trim()) problems.push("le nom du client");
    if (!itemTitle.trim()) problems.push("l'intitulé de la prestation");
    if (!(montantHT > 0)) problems.push("un montant HT supérieur à 0");
    if (hasTva && !(tvaRate >= 0 && tvaRate <= 100)) problems.push("un taux de TVA compris entre 0 et 100");
    return problems;
  };

  // ───────── Document imprimable (HTML échappé, rendu dans un iframe isolé) ─────────
  const buildDocumentHtml = (info) => {
    const logoOk = LOGO_DATA_URL.test(companyInfo.logoBase64);
    const dateLabel = new Date(info.issuedAt).toLocaleDateString("fr-FR");
    const isDevis = docType === "DEVIS";
    const legalLine = hasTva
      ? isDevis ? "Devis émis assujetti à la TVA." : "Facture émise assujettie à la TVA."
      : "TVA non applicable, art. 293 B du CGI.";

    return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <title>${esc(docType)}_${esc(info.number)}</title>
    <style>
      @page { size: A4; margin: 15mm; }
      * { box-sizing: border-box; }
      body { font-family: Helvetica, Arial, sans-serif; padding: 0; margin: 0; color: #111; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .header { display: flex; justify-content: space-between; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 20px; }
      .title { font-size: 24px; font-weight: bold; color: #d97706; text-transform: uppercase; }
      .box { background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; font-size: 14px; }
      th { text-transform: uppercase; font-size: 11px; color: #666; background: #f1f1f1; }
      .text-right { text-align: right; }
      .totals { margin-top: 30px; float: right; width: 280px; font-size: 14px; }
      .total-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
      .bold { font-weight: bold; }
      .legal { margin-top: 50px; font-size: 11px; color: #666; text-align: center; border-top: 1px solid #eee; padding-top: 15px; clear: both; }
      .muted { font-size: 12px; color: #555; margin: 2px 0; }
    </style>
  </head>
  <body>
    <div class="header">
      <div>
        ${logoOk ? `<img src="${companyInfo.logoBase64}" alt="" style="height:50px; max-width:150px; object-fit:contain; margin-bottom:10px;" />` : ""}
        <h3 style="margin:0 0 6px 0;">${esc(companyInfo.name)}</h3>
        <p class="muted">${esc(companyInfo.address)}</p>
        <p class="muted">SIRET : ${esc(companyInfo.siret)}</p>
        ${companyInfo.email ? `<p class="muted">${esc(companyInfo.email)}</p>` : ""}
      </div>
      <div class="text-right">
        <div class="title">${esc(docType)}</div>
        <p class="muted">N° : ${esc(info.number)}</p>
        <p class="muted">Date : ${esc(dateLabel)}</p>
      </div>
    </div>

    <div class="box">
      <p style="font-size:11px; text-transform:uppercase; font-weight:bold; color:#777; margin:0 0 5px 0;">${isDevis ? "Destiné à :" : "Facturé à :"}</p>
      <p style="font-weight:bold; margin:0; font-size:15px;">${esc(clientName)}</p>
      <p style="font-size:12px; color:#555; margin:5px 0 0 0;">${esc(clientAddress)}</p>
    </div>

    <table>
      <thead>
        <tr>
          <th>Description de la prestation / œuvre</th>
          <th class="text-right">Montant HT</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${esc(itemTitle)}</td>
          <td class="text-right bold">${esc(formatPrice(montantHT))}</td>
        </tr>
      </tbody>
    </table>

    <div class="totals">
      <div class="total-row"><span>Total HT :</span> <span class="bold">${esc(formatPrice(montantHT))}</span></div>
      ${
        hasTva
          ? `
        <div class="total-row"><span>TVA (${esc(tvaRate)} %) :</span> <span>${esc(formatPrice(montantTVA))}</span></div>
        <div class="total-row bold" style="border-top:2px solid #222; padding-top:8px; margin-top:8px; font-size:16px;">
          <span>Total TTC :</span> <span style="color:#d97706;">${esc(formatPrice(montantTTC))}</span>
        </div>`
          : `
        <div class="total-row"><span>TVA :</span> <span>Non applicable, art. 293 B du CGI</span></div>
        <div class="total-row bold" style="border-top:2px solid #222; padding-top:8px; margin-top:8px; font-size:16px;">
          <span>Net à payer :</span> <span style="color:#d97706;">${esc(formatPrice(montantHT))}</span>
        </div>`
      }
      <div class="total-row" style="color:#b45309; margin-top:8px; font-size:13px;">
        <span>Acompte exigé (30 %) :</span> <span>${esc(formatPrice(round2(montantTTC * 0.3)))}</span>
      </div>
    </div>

    <div class="legal">
      ${esc(legalLine)}<br/>
      BOKÉ ONE — Réseau d'Élite &amp; Banque d'Images Nationale
    </div>
  </body>
</html>`;
  };

  // Impression dans un iframe invisible : seul le document est imprimé (pas la page du site),
  // sans fenêtre popup (donc pas bloqué par les anti-popups), scripts désactivés par sandbox.
  const printDocument = (info) => {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("sandbox", "allow-same-origin allow-modals");
    iframe.setAttribute("aria-hidden", "true");
    iframe.setAttribute("title", "Document à imprimer");
    iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;opacity:0;pointer-events:none;";
    iframe.onload = () => {
      setTimeout(() => {
        try {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        } catch (err) {
          console.error("Impression impossible :", err);
          setPrintMessage({ type: "error", text: "L'impression automatique a échoué. Ouvrez le menu de votre navigateur et choisissez Imprimer." });
        }
      }, 150);
    };
    iframe.srcdoc = buildDocumentHtml(info);
    document.body.appendChild(iframe);
    setTimeout(() => iframe.remove(), 120000);
  };

  const handlePrintPDF = async () => {
    if (printing) return;
    setPrintMessage(null);

    const problems = validateBeforeIssue();
    if (problems.length > 0) {
      setPrintMessage({ type: "error", text: `Complétez avant d'émettre : ${problems.join(", ")}.` });
      return;
    }

    setPrinting(true);
    try {
      let info = isIssuedCurrent ? issued : null;

      if (!info) {
        // Numéro attribué par le SERVEUR, de façon atomique et séquentielle (FAC-0001, FAC-0002…)
        const { data, error } = await supabase.rpc("issue_document", {
          p_doc_type: docType,
          p_client_name: clientName.trim(),
          p_total_ht: montantHT,
          p_vat_rate: hasTva ? Number(tvaRate) : null,
          p_total_ttc: montantTTC,
          p_payload: {
            company: { name: companyInfo.name, siret: companyInfo.siret, address: companyInfo.address, email: companyInfo.email },
            client: { name: clientName, address: clientAddress },
            item: { title: itemTitle, price_ht: montantHT },
            vat: hasTva ? { rate: Number(tvaRate), amount: montantTVA } : { exemption: "293 B CGI" },
          },
        });
        if (error) throw error;
        const row = Array.isArray(data) ? data[0] : data;
        if (!row || !row.doc_number) throw new Error("numero_manquant");
        info = { number: row.doc_number, issuedAt: row.issued_at, snapshot: currentSnapshot };
        setIssued(info);
      }

      printDocument(info);
      setPrintMessage({ type: "ok", text: `${docType === "DEVIS" ? "Devis" : "Facture"} n° ${info.number} prêt à imprimer.` });
    } catch (err) {
      console.error("Émission impossible :", err);
      setPrintMessage({ type: "error", text: issueErrorMessage(err) });
    } finally {
      setPrinting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl bg-neutral-950 p-4 sm:p-8 text-neutral-200 min-h-screen font-sans">
      
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 border-b border-neutral-800 pb-5">
        <div>
          <span className="text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
            Espace Pro & Facturation Officielle (49€ / 129€)
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-amber-400 mt-1.5">Espace Vente, Compta & Conformité Pro</h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
            Générez vos factures et devis en temps réel avec votre logo, votre SIRET et la gestion de la TVA.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2" title="Données de démonstration">
          <div className="bg-neutral-900 border border-neutral-800 px-3 py-2 rounded-2xl text-center">
            <span className="text-[9px] text-neutral-400 uppercase font-bold block">👀 Vues</span>
            <span className="text-sm font-black text-amber-400">{creatorStats.totalViews.toLocaleString()}</span>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 px-3 py-2 rounded-2xl text-center">
            <span className="text-[9px] text-neutral-400 uppercase font-bold block">❤️ Likes</span>
            <span className="text-sm font-black text-rose-400">{creatorStats.totalLikes.toLocaleString()}</span>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 px-3 py-2 rounded-2xl text-center">
            <span className="text-[9px] text-neutral-400 uppercase font-bold block">💰 Total Gagné</span>
            <span className="text-sm font-black text-emerald-400">{formatPrice(creatorStats.totalEarnings)}</span>
          </div>
        </div>
      </div>

      {/* Navigation des onglets */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-2 border-b border-neutral-900">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab("notionLive")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === "notionLive" ? "bg-amber-500 text-neutral-950 shadow-md" : "bg-neutral-900 text-amber-400 border border-amber-500/40 hover:bg-neutral-800"
            }`}
          >
            <span>💬</span> Vendre en Direct (Script)
          </button>
          
          <button
            onClick={() => setActiveTab("companyConfig")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
              activeTab === "companyConfig" ? "bg-amber-500 text-neutral-950 shadow-md font-bold" : "bg-neutral-900 text-neutral-300 border border-neutral-800 hover:text-amber-400"
            }`}
          >
            🏢 Mon Entreprise (SIRET & Logo)
          </button>

          <button
            onClick={() => setActiveTab("invoices")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
              activeTab === "invoices" ? "bg-amber-500 text-neutral-950 shadow-md font-bold" : "bg-neutral-900 text-neutral-300 border border-neutral-800 hover:text-amber-400"
            }`}
          >
            📄 Éditeur Temps Réel & Factures PDF
          </button>

          <button
            onClick={() => setActiveTab("compliance")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
              activeTab === "compliance" ? "bg-amber-500 text-neutral-950 shadow-md font-bold" : "bg-neutral-900 text-neutral-300 border border-neutral-800 hover:text-amber-400"
            }`}
          >
            🛡️ Conformité Drone 2026
          </button>
        </div>

        {notionUrl && (
        <a
          href={notionUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-2 rounded-xl text-xs font-semibold bg-neutral-900 border border-amber-500/40 text-amber-300 hover:border-amber-400 transition flex items-center gap-1.5 whitespace-nowrap"
        >
          <span>🔗</span> Notion ↗
        </a>
        )}
      </div>

      {/* Contenu dynamique */}
      <div className="space-y-6">
        
        {activeTab === "notionLive" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-gradient-to-br from-neutral-950 via-neutral-900 to-amber-950/20 border-2 border-amber-500/40 p-6 rounded-3xl shadow-2xl space-y-5">
              <h2 className="text-xl font-black text-white">Tunnel de Vente & Script Pro</h2>
              <p className="text-sm text-neutral-300 italic">{currentActiveLead.scriptSteps[scriptStep]}</p>
              <button
                onClick={() => setScriptStep(prev => (prev < 3 ? prev + 1 : 1))}
                className="px-4 py-2 bg-amber-500 text-neutral-950 rounded-xl font-bold text-xs cursor-pointer"
              >
                Réplique suivante ➔
              </button>
            </div>
          </div>
        )}

        {activeTab === "companyConfig" && (
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl max-w-2xl mx-auto space-y-5 animate-fadeIn">
            <div className="border-b border-neutral-800 pb-3">
              <h3 className="text-base font-bold text-amber-400">🏢 Paramètres de votre Entreprise & Logo</h3>
              <p className="text-xs text-neutral-400">Téléversez votre logo et renseignez vos informations légales.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">Logo de l'entreprise (PNG / JPG) :</label>
                <div className="flex items-center gap-4">
                  {companyInfo.logoBase64 && (
                    <img src={companyInfo.logoBase64} alt="Aperçu logo" className="h-14 w-14 object-contain rounded-xl bg-neutral-950 border border-neutral-800 p-1" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    ref={logoInputRef}
                    onChange={handleLogoUpload}
                    className="text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-neutral-950 hover:file:bg-amber-400 cursor-pointer"
                  />
                </div>
                {logoError && <p className="text-xs text-red-400 mt-1">{logoError}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">Nom de l'entreprise :</label>
                <input
                  type="text"
                  value={companyInfo.name}
                  placeholder="Ex : Studio Lumière"
                  onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-neutral-100 text-xs outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">SIRET :</label>
                  <input
                    type="text"
                    value={companyInfo.siret}
                  placeholder="14 chiffres"
                    onChange={(e) => setCompanyInfo({ ...companyInfo, siret: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-neutral-100 text-xs outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">E-mail Pro :</label>
                  <input
                    type="text"
                    value={companyInfo.email}
                  placeholder="contact@votre-domaine.fr"
                    onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-neutral-100 text-xs outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">Adresse postale :</label>
                <input
                  type="text"
                  value={companyInfo.address}
                  placeholder="Adresse postale complète"
                  onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-neutral-100 text-xs outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "invoices" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
            
            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl space-y-4 h-fit">
              <div className="border-b border-neutral-800 pb-3 flex justify-between items-center">
                <h3 className="text-base font-bold text-amber-400">✏️ Saisie en Temps Réel</h3>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="bg-neutral-950 border border-amber-500 text-amber-400 font-bold px-3 py-1.5 rounded-xl text-xs outline-none"
                >
                  <option value="FACTURE">FACTURE</option>
                  <option value="DEVIS">DEVIS</option>
                </select>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">Client :</label>
                  <input
                    type="text"
                    value={clientName}
                  placeholder="Nom du client ou de la société"
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-neutral-100 text-xs outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">Adresse du client :</label>
                  <input
                    type="text"
                    value={clientAddress}
                  placeholder="Adresse du client"
                    onChange={(e) => setClientAddress(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-neutral-100 text-xs outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">Intitulé de la prestation :</label>
                  <input
                    type="text"
                    value={itemTitle}
                  placeholder="Ex : Reportage photo, 1 journée"
                    onChange={(e) => setItemTitle(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-neutral-100 text-xs outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">Montant HT (€) :</label>
                  <input
                    type="number"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(Number(e.target.value) || 0)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-neutral-100 font-bold text-sm outline-none focus:border-amber-500"
                  />
                </div>

                <div className="pt-2 border-t border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-neutral-300">Appliquer la TVA :</label>
                    <input
                      type="checkbox"
                      checked={hasTva}
                      onChange={(e) => setHasTva(e.target.checked)}
                      className="w-4 h-4 accent-amber-500 cursor-pointer"
                    />
                  </div>
                  {hasTva && (
                    <div>
                      <label className="text-xs font-bold text-neutral-400 block mb-1">Taux de TVA (%) :</label>
                      <input
                        type="number"
                        value={tvaRate}
                        onChange={(e) => setTvaRate(Number(e.target.value) || 0)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-neutral-100 text-xs outline-none focus:border-amber-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handlePrintPDF}
                disabled={printing}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-neutral-950 font-black rounded-xl text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <span>{printing ? "⏳ Numérotation en cours…" : "🖨️ Télécharger / Imprimer en PDF officiel"}</span>
              </button>

              {printMessage && (
                <p role={printMessage.type === "error" ? "alert" : "status"} className={`text-xs font-bold text-center ${printMessage.type === "error" ? "text-red-400" : "text-emerald-400"}`}>
                  {printMessage.text}
                </p>
              )}
              {issued && (
                <p className="text-[11px] text-neutral-500 text-center">
                  Dernier numéro émis : {issued.number}
                  {!isIssuedCurrent && " — document modifié depuis : un nouveau numéro sera attribué à la prochaine émission."}
                </p>
              )}
            </div>

            <div className="bg-white text-neutral-900 p-6 rounded-2xl shadow-2xl space-y-5 font-sans h-fit">
              <div className="flex justify-between items-start border-b border-neutral-200 pb-4">
                <div>
                  {companyInfo.logoBase64 && (
                    <img src={companyInfo.logoBase64} alt="Logo" className="h-12 w-28 object-contain mb-2 rounded" />
                  )}
                  <h2 className="text-base font-black text-neutral-900">{companyInfo.name}</h2>
                  <p className="text-[10px] text-neutral-600">{companyInfo.address}</p>
                  <p className="text-[10px] text-neutral-600">SIRET : {companyInfo.siret}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-amber-600 uppercase tracking-wider block">{docType}</span>
                  <p className="text-[10px] text-neutral-600">N° : {isIssuedCurrent ? issued.number : "attribué à l'émission"}</p>
                  <p className="text-[10px] text-neutral-600">Date : {(isIssuedCurrent ? new Date(issued.issuedAt) : new Date()).toLocaleDateString("fr-FR")}</p>
                </div>
              </div>

              <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 text-xs">
                <span className="text-[9px] uppercase font-bold text-neutral-500 block">Destiné à :</span>
                <h4 className="font-bold text-neutral-900">{clientName}</h4>
                <p className="text-neutral-600">{clientAddress}</p>
              </div>

              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-500 uppercase font-bold text-[10px]">
                    <th className="py-2">Description</th>
                    <th className="py-2 text-right">Montant HT</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 font-medium text-neutral-900">{itemTitle}</td>
                    <td className="py-2 text-right font-bold">{formatPrice(montantHT)}</td>
                  </tr>
                </tbody>
              </table>

              <div className="flex justify-end pt-3 border-t border-neutral-200 text-xs">
                <div className="w-56 space-y-1.5">
                  <div className="flex justify-between text-neutral-600">
                    <span>Total HT :</span>
                    <span className="font-bold">{formatPrice(montantHT)}</span>
                  </div>
                  {hasTva ? (
                    <>
                      <div className="flex justify-between text-neutral-600">
                        <span>TVA ({tvaRate}%) :</span>
                        <span>{formatPrice(montantTVA)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-black text-neutral-950 pt-1.5 border-t border-neutral-200">
                        <span>Total TTC :</span>
                        <span className="text-amber-600">{formatPrice(montantTTC)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between text-sm font-black text-neutral-950 pt-1.5 border-t border-neutral-200">
                      <span>Net à payer :</span>
                      <span className="text-amber-600">{formatPrice(montantHT)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-amber-700 font-bold pt-1 text-[11px]">
                    <span>Acompte (30%) :</span>
                    <span>{formatPrice((hasTva ? montantTTC : montantHT) * 0.30)}</span>
                  </div>
                </div>
              </div>

              <div className="text-[9px] text-neutral-500 pt-3 border-t border-neutral-200 text-center">
                {hasTva ? 'Facture assujettie à la TVA.' : 'TVA non applicable, art. 293 B du CGI.'}
              </div>
            </div>

          </div>
        )}

        {activeTab === "compliance" && (
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl max-w-3xl mx-auto space-y-4">
            <h3 className="text-base font-bold text-amber-400">🛡️ Conformité Drone 2026</h3>
            <p className="text-xs text-neutral-300">Certifications BAPD, CATT, CATS rattachées à votre compte pro.</p>
          </div>
        )}

      </div>
    </div>
  );
}