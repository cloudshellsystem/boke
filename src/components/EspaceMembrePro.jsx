import React, { useState, useRef, useEffect } from "react";
import { formatPrice } from "../lib/formatPrice";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import DashboardCreatif from "./DashboardCreatif";
import PipelineKanban from "./PipelineKanban";
import AdminDashboard from "./AdminDashboard";
import Opportunities from "./Opportunities";

const MAX_LOGO_BYTES = 500 * 1024; // 500 Ko
const ALLOWED_LOGO_TYPES = ["image/png", "image/jpeg", "image/webp"];
const LOGO_DATA_URL = /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/;
const EMPTY_COMPANY = { name: "", siret: "", address: "", email: "", logoBase64: "" };

const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

// Échappe tout texte saisi avant de l'insérer dans le document imprimé
const esc = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

function issueErrorMessage(err, isEn) {
  const raw = String(err?.message || err || "");
  if (raw.includes("plan_required")) return isEn ? "Your plan does not allow document issuance (Pro or Elite required)." : "Votre offre ne permet pas d'émettre des documents (offre Pro ou Élite requise).";
  if (raw.includes("not_authenticated")) return isEn ? "Session expired. Please log in again." : "Session expirée. Reconnectez-vous puis réessayez.";
  if (raw.includes("invalid_amount")) return isEn ? "Invalid amount." : "Montant invalide.";
  if (/fetch|network|load failed/i.test(raw)) return isEn ? "Server connection failed: the document was not numbered. Try again." : "Connexion au serveur impossible : le document n'a pas été numéroté. Réessayez.";
  return isEn ? "Unable to issue the document right now. Try again." : "Impossible d'émettre le document pour le moment. Réessayez.";
}

// Écran de verrouillage épuré : gros cadenas + un seul bouton vers l'onglet "Tarifs" (/abonnes)
function AccessLockScreen({ isEn, isLoggedIn, onSeePricing, onLogin }) {
  return (
    <div className="mx-auto w-full max-w-4xl bg-neutral-950 p-8 text-neutral-200 min-h-[70vh] flex flex-col items-center justify-center text-center font-sans">
      <div className="bg-neutral-900 border border-amber-500/30 rounded-3xl shadow-2xl max-w-md w-full px-8 py-12 space-y-6">
        <div className="mx-auto w-28 h-28 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-6xl shadow-[0_0_40px_rgba(245,158,11,0.15)]">
          🔒
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white">
            {isEn ? "Pro Space" : "Espace Pro"}
          </h1>
          <p className="text-sm text-neutral-400 leading-relaxed">
            {isLoggedIn
              ? isEn
                ? "Your current plan does not include this area. Discover the plans that unlock invoicing, quotes and your pro tools."
                : "Votre offre actuelle ne comprend pas cet espace. Découvrez les offres qui débloquent la facturation, les devis et vos outils pro."
              : isEn
              ? "Sign in or create a free account to access your space."
              : "Connectez-vous ou créez un compte gratuit pour accéder à votre espace."}
          </p>
        </div>
        <button
          type="button"
          onClick={onSeePricing}
          className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 font-extrabold rounded-xl text-xs uppercase tracking-wider transition shadow-lg cursor-pointer"
        >
          {isEn ? "See pricing ➔" : "Voir les tarifs ➔"}
        </button>
        {!isLoggedIn && (
          <button type="button" onClick={onLogin} className="text-xs text-neutral-400 hover:text-amber-400 transition cursor-pointer">
            {isEn ? "Sign in / Create an account" : "Se connecter / Créer un compte"}
          </button>
        )}
      </div>
    </div>
  );
}

// Offre minimale par onglet : "essentiel" = Missions · "pro" = facturation, devis, CRM.
const TAB_REQUIREMENT = { missions: "essentiel", crm: "pro", companyConfig: "pro", invoices: "pro" };

const UPSELL = {
  essentiel: {
    plan: { fr: "Essentiel · 19 €/mois", en: "Essential · €19/month" },
    fr: ["Accédez aux missions disponibles", "20 photos au lieu de 3", "Entrez en contact avec des clients réels"],
    en: ["Access available missions", "20 photos instead of 3", "Reach real clients"],
  },
  pro: {
    plan: { fr: "Pro · 49 €/mois  ou  Élite · 129 €/mois", en: "Pro · €49/month  or  Elite · €129/month" },
    fr: ["Factures et devis PDF avec votre logo et SIRET", "CRM : pipeline, fiches clients, rappels", "Téléversement illimité et toutes les missions"],
    en: ["PDF invoices & quotes with your logo and SIRET", "CRM: pipeline, client records, reminders", "Unlimited uploads and all missions"],
  },
};

// Remplace le contenu d'un onglet verrouillé (le contenu protégé n'est même pas monté)
function LockedPanel({ need, isEn, onSeePricing }) {
  const u = UPSELL[need];
  return (
    <div className="bg-neutral-900 border border-amber-500/30 rounded-3xl px-6 py-14 text-center space-y-5 max-w-xl mx-auto">
      <div className="mx-auto w-24 h-24 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-5xl shadow-[0_0_40px_rgba(245,158,11,0.15)]">🔒</div>
      <h3 className="text-lg font-black text-white">{isEn ? "Locked feature" : "Fonctionnalité verrouillée"}</h3>
      <ul className="text-sm text-neutral-300 space-y-1">
        {(isEn ? u.en : u.fr).map((t) => <li key={t}>✦ {t}</li>)}
      </ul>
      <p className="text-xs font-bold text-amber-400">{isEn ? u.plan.en : u.plan.fr}</p>
      <button type="button" onClick={onSeePricing} className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-neutral-950 font-extrabold rounded-xl text-xs uppercase tracking-wider cursor-pointer">
        {isEn ? "See pricing ➔" : "Voir les tarifs ➔"}
      </button>
    </div>
  );
}

// Pop-up d'incitation affichée au clic sur un onglet verrouillé
function UpsellModal({ need, isEn, onSeePricing, onClose }) {
  const u = UPSELL[need];
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm bg-neutral-900 border border-amber-500/40 rounded-3xl p-6 space-y-4 text-center">
        <div className="text-4xl">🔒</div>
        <h3 className="text-base font-black text-amber-400">{isEn ? "Unlock this feature" : "Débloquez cette fonctionnalité"}</h3>
        <ul className="text-xs text-neutral-300 space-y-1 text-left">{(isEn ? u.en : u.fr).map((t) => <li key={t}>✦ {t}</li>)}</ul>
        <p className="text-xs font-bold text-white">{isEn ? u.plan.en : u.plan.fr}</p>
        <div className="flex gap-2">
          <button type="button" onClick={onSeePricing} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-neutral-950 text-xs font-black cursor-pointer">{isEn ? "See pricing" : "Voir les tarifs"}</button>
          <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 text-xs font-bold cursor-pointer">{isEn ? "Later" : "Plus tard"}</button>
        </div>
      </div>
    </div>
  );
}

export default function EspaceMembrePro({ onRequireLogin }) {
  const { isLoggedIn, loading, hasProAccess, hasDiscoveryAccess, photoQuota, isAdmin, user } = useAuth();
  const { lang } = useLanguage();
  const isEn = lang === "en";
  const locale = isEn ? "en-GB" : "fr-FR";
  const navigate = useNavigate();

  const [upsell, setUpsell] = useState(null);
  const [photoCount, setPhotoCount] = useState(null);
  const [tab, setActiveTab] = useState("dashboard");

  const [companyInfo, setCompanyInfo] = useState(EMPTY_COMPANY);
  const [logoError, setLogoError] = useState("");
  const logoInputRef = useRef(null);

  const [docType, setDocType] = useState("FACTURE");
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [itemTitle, setItemTitle] = useState("");
  const [itemPrice, setItemPrice] = useState(0);

  const [hasTva, setHasTva] = useState(false);
  const [tvaRate, setTvaRate] = useState(20);

  const [issued, setIssued] = useState(null);
  const [printing, setPrinting] = useState(false);
  const [printMessage, setPrintMessage] = useState(null);

  const [creatorStats] = useState({ totalViews: 14250, totalLikes: 3840, totalEarnings: 1850.0 });

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

  const companyKey = user?.id ? `bokeone_company_${user.id}` : null;
  const [companyLoadedFor, setCompanyLoadedFor] = useState(null);
  useEffect(() => {
    if (!companyKey || companyLoadedFor === companyKey) return;
    try {
      const raw = localStorage.getItem(companyKey);
      if (raw) {
        const saved = JSON.parse(raw);
        setCompanyInfo({
          name: String(saved.name || ""),
          siret: String(saved.siret || ""),
          address: String(saved.address || ""),
          email: String(saved.email || ""),
          logoBase64: LOGO_DATA_URL.test(saved.logoBase64 || "") ? saved.logoBase64 : "",
        });
      }
    } catch {
      /* stockage indisponible */
    }
    setCompanyLoadedFor(companyKey);
  }, [companyKey, companyLoadedFor]);

  useEffect(() => {
    if (!companyKey || companyLoadedFor !== companyKey) return;
    try {
      localStorage.setItem(companyKey, JSON.stringify(companyInfo));
    } catch {
      /* quota dépassé */
    }
  }, [companyInfo, companyKey, companyLoadedFor]);

  const companyReady =
    companyInfo.name.trim().length > 0 &&
    /^\d{14}$/.test(companyInfo.siret.replace(/\s/g, "")) &&
    companyInfo.address.trim().length > 0;

  const prefillFromDeal = (deal) => {
    if (deal) {
      setDocType(deal.stage === "signe" ? "FACTURE" : "DEVIS");
      setClientName(deal.client_name || "");
      setItemTitle(deal.title || "");
      setItemPrice(Number(deal.amount_ht) || 0);
    }
    setPrintMessage(null);
    setActiveTab("invoices");
  };

  const montantHT = round2(parseFloat(itemPrice) || 0);
  const montantTVA = hasTva ? round2(montantHT * (tvaRate / 100)) : 0;
  const montantTTC = round2(montantHT + montantTVA);
  const docLabel = docType === "DEVIS" ? (isEn ? "QUOTE" : "DEVIS") : (isEn ? "INVOICE" : "FACTURE");

  const currentSnapshot = JSON.stringify({
    docType,
    c: [companyInfo.name, companyInfo.siret, companyInfo.address, companyInfo.email, companyInfo.logoBase64.length],
    k: [clientName, clientAddress],
    i: [itemTitle, montantHT],
    t: [hasTva, hasTva ? tvaRate : null],
  });
  const isIssuedCurrent = Boolean(issued && issued.snapshot === currentSnapshot);

  useEffect(() => {
    if (!loading && !isLoggedIn) onRequireLogin?.();
  }, [loading, isLoggedIn]);

  useEffect(() => {
    if (!user?.id) { setPhotoCount(null); return undefined; }
    let active = true;
    supabase
      .from("photos")
      .select("id", { count: "exact", head: true })
      .eq("owner_id", user.id)
      .then(({ count, error }) => { if (active) setPhotoCount(error ? null : count ?? 0); });
    return () => { active = false; };
  }, [user?.id]);

  const hasAccessTo = (tabId) => {
    const need = TAB_REQUIREMENT[tabId];
    if (!need) return true;
    return need === "essentiel" ? hasDiscoveryAccess : hasProAccess;
  };
  const goTab = (tabId) => {
    setActiveTab(tabId);
    if (!hasAccessTo(tabId)) setUpsell(TAB_REQUIREMENT[tabId]);
  };
  const tabLabelLock = (tabId) => (hasAccessTo(tabId) ? "" : " 🔒");

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-4xl bg-neutral-950 p-8 text-neutral-400 min-h-[70vh] flex items-center justify-center text-sm font-sans">
        {isEn ? "Checking your access..." : "Vérification de votre accès…"}
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <AccessLockScreen
        isEn={isEn}
        isLoggedIn={isLoggedIn}
        onSeePricing={() => navigate("/abonnes")}
        onLogin={() => onRequireLogin?.()}
      />
    );
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    setLogoError("");
    if (!file) return;
    if (!ALLOWED_LOGO_TYPES.includes(file.type)) {
      setLogoError(isEn ? "Format not supported: use PNG, JPG or WebP." : "Format non accepté : utilisez un PNG, JPG ou WebP.");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      setLogoError(isEn ? "Logo too heavy (500 KB max)." : "Logo trop lourd (500 Ko maximum).");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string" && LOGO_DATA_URL.test(reader.result)) {
        setCompanyInfo((prev) => ({ ...prev, logoBase64: reader.result }));
      } else {
        setLogoError(isEn ? "Unable to read this file." : "Impossible de lire ce fichier.");
      }
    };
    reader.onerror = () => setLogoError(isEn ? "Unable to read this file." : "Impossible de lire ce fichier.");
    reader.readAsDataURL(file);
  };

  const validateBeforeIssue = () => {
    const problems = [];
    if (!companyInfo.name.trim()) problems.push(isEn ? "company name" : "le nom de l'entreprise");
    if (!/^\d{14}$/.test(companyInfo.siret.replace(/\s/g, ""))) problems.push(isEn ? "a valid SIRET (14 digits)" : "un SIRET valide (14 chiffres)");
    if (!companyInfo.address.trim()) problems.push(isEn ? "company address" : "l'adresse de l'entreprise");
    if (!clientName.trim()) problems.push(isEn ? "client name" : "le nom du client");
    if (!itemTitle.trim()) problems.push(isEn ? "service description" : "l'intitulé de la prestation");
    if (!(montantHT > 0)) problems.push(isEn ? "an amount excl. VAT greater than 0" : "un montant HT supérieur à 0");
    if (hasTva && !(tvaRate >= 0 && tvaRate <= 100)) problems.push(isEn ? "a VAT rate between 0 and 100" : "un taux de TVA compris entre 0 et 100");
    return problems;
  };

  const buildDocumentHtml = (info) => {
    const T = isEn
      ? { to: docType === "DEVIS" ? "Prepared for:" : "Billed to:", desc: "Service / Artwork Description", ht: "Amount excl. VAT", totHt: "Total excl. VAT", vat: "VAT", totTtc: "Total incl. VAT", net: "Net payable", vatNone: "Not applicable, art. 293 B of the French Tax Code (CGI)", legalNone: "VAT not applicable, art. 293 B of the French Tax Code (CGI).", legalVat: docType === "DEVIS" ? "Quote subject to VAT." : "Invoice subject to VAT.", date: "Date", num: "No." }
      : { to: docType === "DEVIS" ? "Destiné à :" : "Facturé à :", desc: "Description de la prestation / œuvre", ht: "Montant HT", totHt: "Total HT", vat: "TVA", totTtc: "Total TTC", net: "Net à payer", vatNone: "Non applicable, art. 293 B du CGI", legalNone: "TVA non applicable, art. 293 B du CGI.", legalVat: docType === "DEVIS" ? "Devis assujetti à la TVA." : "Facture assujettie à la TVA.", date: "Date", num: "N°" };
    const logoOk = LOGO_DATA_URL.test(companyInfo.logoBase64);
    const dateLabel = new Date(info.issuedAt).toLocaleDateString(locale);

    return `<!doctype html>
<html lang="${isEn ? "en" : "fr"}">
  <head>
    <meta charset="utf-8" />
    <title>${esc(docLabel)}_${esc(info.number)}</title>
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
      .totals { margin-top: 30px; float: right; width: 300px; font-size: 14px; }
      .total-row { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 8px; }
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
        <div class="title">${esc(docLabel)}</div>
        <p class="muted">${esc(T.num)} : ${esc(info.number)}</p>
        <p class="muted">${esc(T.date)} : ${esc(dateLabel)}</p>
      </div>
    </div>

    <div class="box">
      <p style="font-size:11px; text-transform:uppercase; font-weight:bold; color:#777; margin:0 0 5px 0;">${esc(T.to)}</p>
      <p style="font-weight:bold; margin:0; font-size:15px;">${esc(clientName)}</p>
      <p style="font-size:12px; color:#555; margin:5px 0 0 0;">${esc(clientAddress)}</p>
    </div>

    <table>
      <thead>
        <tr><th>${esc(T.desc)}</th><th class="text-right">${esc(T.ht)}</th></tr>
      </thead>
      <tbody>
        <tr><td>${esc(itemTitle)}</td><td class="text-right bold">${esc(formatPrice(montantHT))}</td></tr>
      </tbody>
    </table>

    <div class="totals">
      <div class="total-row"><span>${esc(T.totHt)} :</span> <span class="bold">${esc(formatPrice(montantHT))}</span></div>
      ${
        hasTva
          ? `<div class="total-row"><span>${esc(T.vat)} (${esc(tvaRate)} \%) :</span> <span>${esc(formatPrice(montantTVA))}</span></div>
      <div class="total-row bold" style="border-top:2px solid #222; padding-top:8px; margin-top:8px; font-size:16px;">
        <span>${esc(T.totTtc)} :</span> <span style="color:#d97706;">${esc(formatPrice(montantTTC))}</span>
      </div>`
          : `<div class="total-row"><span>${esc(T.vat)} :</span> <span>${esc(T.vatNone)}</span></div>
      <div class="total-row bold" style="border-top:2px solid #222; padding-top:8px; margin-top:8px; font-size:16px;">
        <span>${esc(T.net)} :</span> <span style="color:#d97706;">${esc(formatPrice(montantHT))}</span>
      </div>`
      }
    </div>

    <div class="legal">
      ${esc(hasTva ? T.legalVat : T.legalNone)}<br/>
      BOKÉ ONE — ${isEn ? "Elite Network &amp; National Image Bank" : "Réseau d'Élite &amp; Banque d'Images Nationale"}
    </div>
  </body>
</html>`;
  };

  const printDocument = (info) => {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("sandbox", "allow-same-origin allow-modals");
    iframe.setAttribute("aria-hidden", "true");
    iframe.setAttribute("title", isEn ? "Document to print" : "Document à imprimer");
    iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;opacity:0;pointer-events:none;";
    iframe.onload = () => {
      setTimeout(() => {
        try {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        } catch (err) {
          console.error("Impression impossible :", err);
          setPrintMessage({ type: "error", text: isEn ? "Automatic printing failed. Use your browser menu to print." : "L'impression automatique a échoué. Utilisez le menu de votre navigateur pour imprimer." });
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
      setPrintMessage({ type: "error", text: `${isEn ? "Complete before issuing:" : "Complétez avant d'émettre :"} ${problems.join(", ")}.` });
      return;
    }

    setPrinting(true);
    try {
      let info = isIssuedCurrent ? issued : null;
      if (!info) {
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
            lang: isEn ? "en" : "fr",
          },
        });
        if (error) throw error;
        const row = Array.isArray(data) ? data[0] : data;
        if (!row || !row.doc_number) throw new Error("numero_manquant");
        info = { number: row.doc_number, issuedAt: row.issued_at, snapshot: currentSnapshot };
        setIssued(info);
      }

      printDocument(info);
      setPrintMessage({ type: "ok", text: isEn ? `${docType === "DEVIS" ? "Quote" : "Invoice"} no. ${info.number} ready to print.` : `${docType === "DEVIS" ? "Devis" : "Facture"} n° ${info.number} prêt à imprimer.` });
    } catch (err) {
      console.error("Émission impossible :", err);
      setPrintMessage({ type: "error", text: issueErrorMessage(err, isEn) });
    } finally {
      setPrinting(false);
    }
  };

  const tabClass = (id, accent) =>
    `px-3.5 py-2 rounded-xl text-xs transition whitespace-nowrap ${
      tab === id
        ? "bg-amber-500 text-neutral-950 shadow-md font-bold"
        : accent
        ? "bg-neutral-900 text-amber-400 border border-amber-500/40 font-bold"
        : "bg-neutral-900 text-neutral-300 border border-neutral-800 font-semibold"
    }`;

  return (
    <div className="mx-auto w-full max-w-7xl bg-neutral-950 p-4 sm:p-8 text-neutral-200 min-h-screen font-sans">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 border-b border-neutral-800 pb-5">
        <div>
          <span className="text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
            {isEn ? "Pro Space & Official Invoicing (49€ / 129€)" : "Espace Pro & Facturation Officielle (49€ / 129€)"}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-amber-400 mt-1.5">
            {isEn ? "Pro Sales, Accounting & Compliance Area" : "Espace Vente, Compta & Conformité Pro"}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
            {isEn ? "Generate your invoices and quotes in real-time with your logo, SIRET and VAT management." : "Générez vos factures et devis en temps réel avec votre logo, votre SIRET et la gestion de la TVA."}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2" title={isEn ? "Demo data" : "Données de démonstration"}>
          <div className="bg-neutral-900 border border-neutral-800 px-3 py-2 rounded-2xl text-center">
            <span className="text-[9px] text-neutral-400 uppercase font-bold block">👀 {isEn ? "Views" : "Vues"}</span>
            <span className="text-sm font-black text-amber-400">{creatorStats.totalViews.toLocaleString(locale)}</span>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 px-3 py-2 rounded-2xl text-center">
            <span className="text-[9px] text-neutral-400 uppercase font-bold block">❤️ Likes</span>
            <span className="text-sm font-black text-rose-400">{creatorStats.totalLikes.toLocaleString(locale)}</span>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 px-3 py-2 rounded-2xl text-center">
            <span className="text-[9px] text-neutral-400 uppercase font-bold block">💰 {isEn ? "Earned" : "Total Gagné"}</span>
            <span className="text-sm font-black text-emerald-400">{formatPrice(creatorStats.totalEarnings)}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 text-[11px] text-neutral-400">
        <span>
          📷 {isEn ? "Photo quota" : "Quota photos"} :{" "}
          <b className="text-amber-300">{photoCount === null ? "–" : photoCount} / {Number.isFinite(photoQuota) ? photoQuota : isEn ? "unlimited" : "illimité"}</b>
        </span>
        {Number.isFinite(photoQuota) && (
          <button type="button" onClick={() => navigate("/abonnes")} className="text-amber-400 hover:underline cursor-pointer">
            {isEn ? "Need more? See plans" : "Besoin de plus ? Voir les offres"}
          </button>
        )}
      </div>

      {upsell && <UpsellModal need={upsell} isEn={isEn} onSeePricing={() => navigate("/abonnes")} onClose={() => setUpsell(null)} />}

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-2 border-b border-neutral-900">
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => setActiveTab("dashboard")} className={tabClass("dashboard", true)}>
            📊 {isEn ? "Creative Dashboard" : "Dashboard du Créatif"}
          </button>
          <button type="button" onClick={() => goTab("missions")} className={tabClass("missions")}>
            💼 {isEn ? "Available missions" : "Missions disponibles"}{tabLabelLock("missions")}
          </button>
          <button type="button" onClick={() => goTab("crm")} className={tabClass("crm")}>
            🎯 {isEn ? "CRM & Sales" : "CRM & Vente"}{tabLabelLock("crm")}
          </button>
          {isAdmin && (
            <button type="button" onClick={() => setActiveTab("supervision")} className={tabClass("supervision")}>
              🛰️ {isEn ? "Supervision" : "Supervision"}
            </button>
          )}
          <button type="button" onClick={() => goTab("companyConfig")} className={tabClass("companyConfig")}>
            🏢 {isEn ? "My Company (SIRET & Logo)" : "Mon Entreprise (SIRET & Logo)"}{tabLabelLock("companyConfig")}
          </button>
          <button type="button" onClick={() => goTab("invoices")} className={tabClass("invoices")}>
            📄 {isEn ? "Real-Time Editor & Invoices" : "Éditeur Temps Réel & Factures PDF"}{tabLabelLock("invoices")}
          </button>
        </div>

        {notionUrl && (
          <a
            href={notionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-neutral-900 border border-amber-500/40 text-amber-300 hover:border-amber-400 transition flex items-center gap-1.5"
          >
            <span>🔗</span> Notion ↗
          </a>
        )}
      </div>

      <div className="space-y-6">
        {tab === "dashboard" && <DashboardCreatif isEn={isEn} locale={locale} />}

        {tab === "missions" && (hasAccessTo("missions") ? <Opportunities /> : <LockedPanel need="essentiel" isEn={isEn} onSeePricing={() => navigate("/abonnes")} />)}

        {["crm", "companyConfig", "invoices"].includes(tab) && !hasAccessTo(tab) && (
          <LockedPanel need="pro" isEn={isEn} onSeePricing={() => navigate("/abonnes")} />
        )}

        {tab === "crm" && hasAccessTo("crm") && (
          <PipelineKanban
            isEn={isEn}
            locale={locale}
            companyInfo={companyInfo}
            companyReady={companyReady}
            onInvoice={prefillFromDeal}
            onGoCompany={() => setActiveTab("companyConfig")}
          />
        )}

        {tab === "supervision" && isAdmin && <AdminDashboard isEn={isEn} locale={locale} />}

        {tab === "companyConfig" && hasAccessTo("companyConfig") && (
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl max-w-2xl mx-auto space-y-5">
            <h3 className="text-base font-bold text-amber-400">{isEn ? "Company Settings & Logo" : "Paramètres de votre Entreprise & Logo"}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">{isEn ? "Company Logo (PNG / JPG):" : "Logo de l'entreprise (PNG / JPG) :"}</label>
                <div className="flex items-center gap-4">
                  {companyInfo.logoBase64 && (
                    <img src={companyInfo.logoBase64} alt="Logo" className="h-14 w-14 object-contain rounded-xl bg-neutral-950 border border-neutral-800 p-1" />
                  )}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    ref={logoInputRef}
                    onChange={handleLogoUpload}
                    className="text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-neutral-950 cursor-pointer"
                  />
                </div>
                {logoError && <p className="text-xs text-red-400 mt-1">{logoError}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">{isEn ? "Company Name:" : "Nom de l'entreprise :"}</label>
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
                    inputMode="numeric"
                    value={companyInfo.siret}
                    placeholder={isEn ? "14 digits" : "14 chiffres"}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, siret: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-neutral-100 text-xs outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">{isEn ? "Pro Email:" : "E-mail Pro :"}</label>
                  <input
                    type="email"
                    value={companyInfo.email}
                    placeholder="contact@domaine.fr"
                    onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-neutral-100 text-xs outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">{isEn ? "Postal Address:" : "Adresse postale :"}</label>
                <input
                  type="text"
                  value={companyInfo.address}
                  placeholder={isEn ? "Full postal address" : "Adresse postale complète"}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-neutral-100 text-xs outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        )}

        {tab === "invoices" && hasAccessTo("invoices") && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl space-y-4 h-fit">
              <div className="border-b border-neutral-800 pb-3 flex justify-between items-center">
                <h3 className="text-base font-bold text-amber-400">✏️ {isEn ? "Real-Time Editor" : "Saisie en Temps Réel"}</h3>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="bg-neutral-950 border border-amber-500 text-amber-400 font-bold px-3 py-1.5 rounded-xl text-xs outline-none"
                >
                  <option value="FACTURE">{isEn ? "INVOICE" : "FACTURE"}</option>
                  <option value="DEVIS">{isEn ? "QUOTE" : "DEVIS"}</option>
                </select>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">{isEn ? "Client:" : "Client :"}</label>
                  <input
                    type="text"
                    value={clientName}
                    placeholder={isEn ? "Client or company name" : "Nom du client ou de la société"}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-neutral-100 text-xs outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">{isEn ? "Client Address:" : "Adresse du client :"}</label>
                  <input
                    type="text"
                    value={clientAddress}
                    placeholder={isEn ? "Client address" : "Adresse du client"}
                    onChange={(e) => setClientAddress(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-neutral-100 text-xs outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">{isEn ? "Service Description:" : "Intitulé de la prestation :"}</label>
                  <input
                    type="text"
                    value={itemTitle}
                    placeholder={isEn ? "E.g.: Photo shoot, 1 day" : "Ex : Reportage photo, 1 journée"}
                    onChange={(e) => setItemTitle(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-neutral-100 text-xs outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">{isEn ? "Amount excl. VAT (€):" : "Montant HT (€) :"}</label>
                  <input
                    type="number"
                    min="0"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(Number(e.target.value) || 0)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-neutral-100 font-bold text-sm outline-none focus:border-amber-500"
                  />
                </div>

                <div className="pt-2 border-t border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-neutral-300">{isEn ? "Apply VAT:" : "Appliquer la TVA :"}</label>
                    <input
                      type="checkbox"
                      checked={hasTva}
                      onChange={(e) => setHasTva(e.target.checked)}
                      className="w-4 h-4 accent-amber-500 cursor-pointer"
                    />
                  </div>
                  {hasTva && (
                    <div>
                      <label className="text-xs font-bold text-neutral-400 block mb-1">{isEn ? "VAT Rate (%):" : "Taux de TVA (%) :"}</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={tvaRate}
                        onChange={(e) => setTvaRate(Number(e.target.value) || 0)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-neutral-100 text-xs outline-none focus:border-amber-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handlePrintPDF}
                disabled={printing}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-neutral-950 font-black rounded-xl text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <span>
                  {printing
                    ? isEn ? "⏳ Issuing…" : "⏳ Numérotation en cours…"
                    : isEn ? "🖨️ Download / Print Official PDF" : "🖨️ Télécharger / Imprimer en PDF officiel"}
                </span>
              </button>

              {printMessage && (
                <p role={printMessage.type === "error" ? "alert" : "status"} className={`text-xs font-bold text-center ${printMessage.type === "error" ? "text-red-400" : "text-emerald-400"}`}>
                  {printMessage.text}
                </p>
              )}
              {issued && (
                <p className="text-[11px] text-neutral-500 text-center">
                  {isEn ? "Last number issued:" : "Dernier numéro émis :"} {issued.number}
                  {!isIssuedCurrent && (isEn ? " — document modified since: a new number will be assigned on next issue." : " — document modifié depuis : un nouveau numéro sera attribué à la prochaine émission.")}
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
                  {companyInfo.email && <p className="text-[10px] text-neutral-600">{companyInfo.email}</p>}
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-amber-600 uppercase tracking-wider block">{docLabel}</span>
                  <p className="text-[10px] text-neutral-600">
                    {isEn ? "No." : "N°"} : {isIssuedCurrent ? issued.number : isEn ? "assigned on issue" : "attribué à l'émission"}
                  </p>
                  <p className="text-[10px] text-neutral-600">
                    Date : {(isIssuedCurrent ? new Date(issued.issuedAt) : new Date()).toLocaleDateString(locale)}
                  </p>
                </div>
              </div>

              <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 text-xs">
                <span className="text-[9px] uppercase font-bold text-neutral-500 block">
                  {docType === "DEVIS" ? (isEn ? "Prepared for:" : "Destiné à :") : (isEn ? "Billed to:" : "Facturé à :")}
                </span>
                <h4 className="font-bold text-neutral-900">{clientName}</h4>
                <p className="text-neutral-600">{clientAddress}</p>
              </div>

              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-500 uppercase font-bold text-[10px]">
                    <th className="py-2">Description</th>
                    <th className="py-2 text-right">{isEn ? "Amount excl. VAT" : "Montant HT"}</th>
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
                    <span>{isEn ? "Total excl. VAT :" : "Total HT :"}</span>
                    <span className="font-bold">{formatPrice(montantHT)}</span>
                  </div>
                  {hasTva ? (
                    <>
                      <div className="flex justify-between text-neutral-600">
                        <span>{isEn ? "VAT" : "TVA"} ({tvaRate}%) :</span>
                        <span>{formatPrice(montantTVA)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-black text-neutral-950 pt-1.5 border-t border-neutral-200">
                        <span>{isEn ? "Total incl. VAT :" : "Total TTC :"}</span>
                        <span className="text-amber-600">{formatPrice(montantTTC)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between text-sm font-black text-neutral-950 pt-1.5 border-t border-neutral-200">
                      <span>{isEn ? "Net payable :" : "Net à payer :"}</span>
                      <span className="text-amber-600">{formatPrice(montantHT)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-[9px] text-neutral-500 pt-3 border-t border-neutral-200 text-center">
                {hasTva
                  ? docType === "DEVIS" ? (isEn ? "Quote subject to VAT." : "Devis assujetti à la TVA.") : (isEn ? "Invoice subject to VAT." : "Facture assujettie à la TVA.")
                  : isEn ? "VAT not applicable, art. 293 B of the French Tax Code (CGI)." : "TVA non applicable, art. 293 B du CGI."}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}