import React, { useState, useRef, useEffect } from "react";
import { formatPrice } from "../lib/formatPrice";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const MAX_LOGO_BYTES = 500 * 1024; // 500 Ko
const ALLOWED_LOGO_TYPES = ["image/png", "image/jpeg", "image/webp"];
const LOGO_DATA_URL = /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/;
const EMPTY_COMPANY = { name: "", siret: "", address: "", email: "", logoBase64: "" };

const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

const esc = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const OFFRES_TARIFS = [
  {
    id: 'decouverte',
    name: 'Découverte',
    price: 19,
    badge: 'Standard',
    badgeColor: 'border-green-500/40 bg-green-500/10 text-green-400',
    btnColor: 'bg-green-500 hover:bg-green-600 text-neutral-950',
    description: 'Idéal pour démarrer, publier vos premières offres et créer du réseau.',
    features: [
      '1 annonce de service / semaine',
      'Jusqu’à 3 photos par annonce',
      '2 offres d’emploi / opportunités',
      'Accès complet au forum public',
      'Profil créateur dans l’annuaire',
    ],
    cta: 'Démarrer avec Découverte'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 49,
    badge: 'Populaire',
    badgeColor: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
    btnColor: 'bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-neutral-950',
    popular: true,
    description: 'Pour les professionnels qui souhaitent structurer et automatiser leur activité.',
    features: [
      'Annonces & photos illimitées',
      'Espace Légal : Générateur de devis & factures',
      'Gestion automatique de la TVA & SIRET',
      'Offres d’emploi illimitées',
      'Support prioritaire par email & WhatsApp',
    ],
    cta: 'Passer à l’offre Pro'
  },
  {
    id: 'elite',
    name: 'Agence Élite',
    price: 129,
    badge: 'Complet',
    badgeColor: 'border-purple-500/40 bg-purple-500/10 text-purple-400',
    btnColor: 'bg-purple-600 hover:bg-purple-700 text-white',
    description: 'La suite complète pour piloter une agence, gérer des tunnels de vente et la comptabilité.',
    features: [
      'Toutes les fonctionnalités de l’offre Pro',
      'CRM de prospection & suivi clients',
      'Créateur de Tunnels de Vente',
      'Comptabilité avancée & export fiscal',
      'Accès API & intégrations personnalisées',
      'Badge VIP Élite sur le forum',
    ],
    cta: 'Rejoindre l’Agence Élite'
  }
];

function issueErrorMessage(err, isEn) {
  const raw = String(err?.message || err || "");
  if (raw.includes("plan_required")) return isEn ? "Your plan does not allow document issuance (Pro or Elite required)." : "Votre offre ne permet pas d'émettre des documents (offre Pro ou Élite requise).";
  if (raw.includes("not_authenticated")) return isEn ? "Session expired. Please log in again." : "Session expirée. Reconnectez-vous puis réessayez.";
  if (/fetch|network|load failed/i.test(raw)) return isEn ? "Server connection failed. Try again." : "Connexion au serveur impossible : le document n'a pas été numéroté. Réessayez.";
  return isEn ? "Unable to issue document right now." : "Impossible d'émettre le document pour le moment. Réessayez.";
}

export default function EspaceMembrePro({ onRequireLogin }) {
  const { isLoggedIn, loading: authLoading, user } = useAuth();
  const { lang } = useLanguage();
  const isEn = lang === "en";

  const [activeTab, setActiveTab] = useState("tarifs");
  const [userProfile, setUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Modals : Restitution / Closing & Pop-up d'information restreinte
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [restrictionModal, setRestrictionModal] = useState({ open: false, title: "", text: "" });

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

  const [scriptStep, setScriptStep] = useState(1);

  const [creatorStats] = useState({
    totalViews: 14250,
    totalLikes: 3840,
    totalEarnings: 1850.0,
  });

  const [mockLeads] = useState([
    {
      id: 1,
      scriptSteps: {
        1: isEn ? "« Hello Mr. Kaba, I see you closely follow the work 'Lights of Conakry'. For your 150€ budget, we guarantee an immediate rights assignment. Does this meet your expectations? »" : "« Bonjour M. Kaba, je vois que vous suivez de près l'œuvre « Lumières de Conakry ». Pour votre budget de 150 €, nous vous garantissons une cession de droits immédiate. Est-ce que cela correspond à vos attentes ? »",
        2: isEn ? "« I understand your need for reflection. Please note this license includes a 72h territorial exclusivity on Paris for your campaign. »" : "« Je comprends votre besoin de réflexion. Sachez que cette licence inclut une exclusivité territoriale de 72h sur Paris pour votre campagne. »",
        3: isEn ? "« Perfect, let's sign the digital order form right away! »" : "« Parfait, on signe le bon de commande numérique tout de suite ? »",
      },
    },
  ]);

  // Chargement du profil Supabase
  useEffect(() => {
    if (isLoggedIn && user) {
      supabase
        .from("profiles")
        .select("role, plan")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          if (data) setUserProfile(data);
          setLoadingProfile(false);
        });
    } else {
      setLoadingProfile(false);
    }
  }, [isLoggedIn, user]);

  const userPlan = userProfile?.plan || 'none';
  const hasProTier = ['pro', 'elite', 'admin'].includes(userPlan);
  const hasEliteTier = ['elite', 'admin'].includes(userPlan);

  const [notionUrl, setNotionUrl] = useState(null);
  useEffect(() => {
    if (!hasProTier) {
      setNotionUrl(null);
      return undefined;
    }
    let active = true;
    supabase
      .from("pro_resources")
      .select("url")
      .eq("key", "notion")
      .maybeSingle()
      .then(({ data }) => {
        if (!active) return;
        setNotionUrl(data?.url ?? null);
      });
    return () => {
      active = false;
    };
  }, [hasProTier]);

  const montantHT = round2(parseFloat(itemPrice) || 0);
  const montantTVA = hasTva ? round2(montantHT * (tvaRate / 100)) : 0;
  const montantTTC = round2(montantHT + montantTVA);

  const currentSnapshot = JSON.stringify({
    docType,
    c: [companyInfo.name, companyInfo.siret, companyInfo.address, companyInfo.email, companyInfo.logoBase64.length],
    k: [clientName, clientAddress],
    i: [itemTitle, montantHT],
    t: [hasTva, hasTva ? tvaRate : null],
  });
  const isIssuedCurrent = Boolean(issued && issued.snapshot === currentSnapshot);
  const currentActiveLead = mockLeads[0];

  if (authLoading || loadingProfile) {
    return (
      <div className="mx-auto w-full max-w-4xl bg-neutral-950 p-8 text-neutral-400 min-h-[70vh] flex items-center justify-center text-sm font-sans">
        {isEn ? "Checking your access..." : "Vérification de votre accès…"}
      </div>
    );
  }

  // Clic sur un onglet verrouillé -> déclenche la popup propre
  const handleTabClick = (tabKey, requiredTier) => {
    if (!isLoggedIn) {
      onRequireLogin();
      return;
    }

    if (requiredTier === 'pro' && !hasProTier) {
      setRestrictionModal({
        open: true,
        title: isEn ? "Pro Tier Required (49€)" : "Abonnement Pro requis (49€)",
        text: isEn 
          ? "This tool is strictly reserved for Pro and Elite subscribers. Subscribe now to unlock SIRET, logo and legal invoicing."
          : "Cet outil est strictement réservé aux abonnés Pro et Élite. Souscrivez à l'offre Pro pour générer vos devis, factures avec SIRET et logo."
      });
      return;
    }

    if (requiredTier === 'elite' && !hasEliteTier) {
      setRestrictionModal({
        open: true,
        title: isEn ? "Elite Agency Required (129€)" : "Offre Agence Élite requise (129€)",
        text: isEn 
          ? "This CRM & Sales script area is reserved for Elite Agency members."
          : "Cet espace CRM, Tunnels et Scripts de vente en direct est exclusivement réservé aux membres de l'offre Agence Élite."
      });
      return;
    }

    setActiveTab(tabKey);
  };

  const handleSelectOffer = (offer) => {
    if (!isLoggedIn) {
      onRequireLogin();
      return;
    }
    setSelectedPlan(offer);
  };

  const handleConfirmPayment = async () => {
    setIsProcessingPayment(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ plan: selectedPlan.id })
        .eq('id', user.id);

      if (error) throw error;

      alert(isEn ? `Payment successful! Welcome to the ${selectedPlan.name} plan.` : `Paiement réussi ! Bienvenue dans l'offre ${selectedPlan.name}.`);
      setSelectedPlan(null);
      window.location.reload();
    } catch (err) {
      alert((isEn ? "Error processing subscription: " : "Erreur lors de la validation de votre abonnement : ") + err.message);
    } finally {
      setIsProcessingPayment(false);
    }
  };

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
      setLogoError(isEn ? "Logo too heavy (500 Ko max)." : "Logo trop lourd (500 Ko maximum).");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string" && LOGO_DATA_URL.test(reader.result)) {
        setCompanyInfo((prev) => ({ ...prev, logoBase64: reader.result }));
      } else {
        setLogoError(isEn ? "Unable to read file." : "Impossible de lire ce fichier.");
      }
    };
    reader.readAsDataURL(file);
  };

  const validateBeforeIssue = () => {
    const problems = [];
    if (!companyInfo.name.trim()) problems.push(isEn ? "company name" : "le nom de l'entreprise");
    if (!/^\d{14}$/.test(companyInfo.siret.replace(/\s/g, ""))) problems.push(isEn ? "a valid SIRET (14 digits)" : "un SIRET valide (14 chiffres)");
    if (!companyInfo.address.trim()) problems.push(isEn ? "company address" : "l'adresse de l'entreprise");
    if (!clientName.trim()) problems.push(isEn ? "client name" : "le nom du client");
    if (!itemTitle.trim()) problems.push(isEn ? "service description" : "l'intitulé de la prestation");
    if (!(montantHT > 0)) problems.push(isEn ? "excl. tax amount greater than 0" : "un montant HT supérieur à 0");
    return problems;
  };

  const buildDocumentHtml = (info) => {
    const logoOk = LOGO_DATA_URL.test(companyInfo.logoBase64);
    const dateLabel = new Date(info.issuedAt).toLocaleDateString(isEn ? "en-GB" : "fr-FR");
    const isDevis = docType === "DEVIS";
    const legalLine = hasTva
      ? isDevis ? "Quote subject to VAT." : "Invoice subject to VAT."
      : "VAT not applicable, art. 293 B du CGI.";

    return `<!doctype html>
<html lang="${isEn ? "en" : "fr"}">
  <head>
    <meta charset="utf-8" />
    <title>${esc(docType)}_${esc(info.number)}</title>
    <style>
      @page { size: A4; margin: 15mm; }
      * { box-sizing: border-box; }
      body { font-family: Helvetica, Arial, sans-serif; padding: 0; margin: 0; color: #111; }
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
      </div>
      <div class="text-right">
        <div class="title">${esc(docType)}</div>
        <p class="muted">N° : ${esc(info.number)}</p>
        <p class="muted">Date : ${esc(dateLabel)}</p>
      </div>
    </div>
    <div class="box">
      <p style="font-size:11px; text-transform:uppercase; font-weight:bold; color:#777; margin:0 0 5px 0;">${isDevis ? "Billed to:" : "Invoiced to:"}</p>
      <p style="font-weight:bold; margin:0; font-size:15px;">${esc(clientName)}</p>
      <p style="font-size:12px; color:#555; margin:5px 0 0 0;">${esc(clientAddress)}</p>
    </div>
    <table>
      <thead>
        <tr>
          <th>${isEn ? "Service / Artwork Description" : "Description de la prestation / œuvre"}</th>
          <th class="text-right">${isEn ? "Amount Excl. Tax" : "Montant HT"}</th>
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
      <div class="total-row bold" style="border-top:2px solid #222; padding-top:8px; margin-top:8px; font-size:16px;">
        <span>Total TTC :</span> <span style="color:#d97706;">${esc(formatPrice(montantTTC))}</span>
      </div>
    </div>
    <div class="legal">${esc(legalLine)}<br/>BOKÉ ONE — Elite Network & National Image Bank</div>
  </body>
</html>`;
  };

  const printDocument = (info) => {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("sandbox", "allow-same-origin allow-modals");
    iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;opacity:0;";
    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
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
          p_payload: { company: companyInfo, client: { name: clientName, address: clientAddress }, item: { title: itemTitle } },
        });
        if (error) throw error;
        const row = Array.isArray(data) ? data[0] : data;
        info = { number: row.doc_number, issuedAt: row.issued_at, snapshot: currentSnapshot };
        setIssued(info);
      }
      printDocument(info);
      setPrintMessage({ type: "ok", text: `${docType === "DEVIS" ? "Quote" : "Invoice"} n° ${info.number} ready.` });
    } catch (err) {
      setPrintMessage({ type: "error", text: issueErrorMessage(err, isEn) });
    } finally {
      setPrinting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl bg-neutral-950 p-4 sm:p-8 text-neutral-200 min-h-screen font-sans">
      
      {/* En-tête Espace Pro & Statistiques */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 border-b border-neutral-800 pb-5">
        <div>
          <span className="text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
            {isEn ? "Pro Space & Official Invoicing (19€ / 49€ / 129€)" : "Espace Pro & Facturation Officielle (19€ / 49€ / 129€)"}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-amber-400 mt-1.5">
            {isEn ? "Pro Sales, Accounting & Compliance Area" : "Espace Vente, Compta & Conformité Pro"}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
            {isEn ? "Manage your subscriptions, generate your invoices and quotes in real-time." : "Gérez vos abonnements et générez vos factures et devis en temps réel."}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="bg-neutral-900 border border-neutral-800 px-3 py-2 rounded-2xl text-center">
            <span className="text-[9px] text-neutral-400 uppercase font-bold block">👀 {isEn ? "Views" : "Vues"}</span>
            <span className="text-sm font-black text-amber-400">{creatorStats.totalViews.toLocaleString()}</span>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 px-3 py-2 rounded-2xl text-center">
            <span className="text-[9px] text-neutral-400 uppercase font-bold block">❤️ Likes</span>
            <span className="text-sm font-black text-rose-400">{creatorStats.totalLikes.toLocaleString()}</span>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 px-3 py-2 rounded-2xl text-center">
            <span className="text-[9px] text-neutral-400 uppercase font-bold block">💰 {isEn ? "Earned" : "Total Gagné"}</span>
            <span className="text-sm font-black text-emerald-400">{formatPrice(creatorStats.totalEarnings)}</span>
          </div>
        </div>
      </div>

      {/* Navigation des onglets avec Verrouillage Sécurisé et Popups */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-2 border-b border-neutral-900">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab("tarifs")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === "tarifs" ? "bg-amber-500 text-neutral-950 shadow-md" : "bg-neutral-900 text-amber-400 border border-amber-500/40"
            }`}
          >
            ⭐ {isEn ? "Plans & Pricing" : "Offres & Tarifs"}
          </button>

          <button
            onClick={() => handleTabClick("notionLive", "elite")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1 cursor-pointer ${
              !hasEliteTier ? "opacity-60" : ""
            } ${activeTab === "notionLive" ? "bg-amber-500 text-neutral-950 shadow-md" : "bg-neutral-900 text-neutral-300 border border-neutral-800"}`}
          >
            <span>{!hasEliteTier && "🔒 "}💬</span> {isEn ? "Direct Sales (Script)" : "Vendre en Direct (Script)"}
          </button>
          
          <button
            onClick={() => handleTabClick("companyConfig", "pro")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap flex items-center gap-1 cursor-pointer ${
              !hasProTier ? "opacity-60" : ""
            } ${activeTab === "companyConfig" ? "bg-amber-500 text-neutral-950 shadow-md font-bold" : "bg-neutral-900 text-neutral-300 border border-neutral-800"}`}
          >
            {!hasProTier && "🔒 "}🏢 {isEn ? "My Company (SIRET & Logo)" : "Mon Entreprise (SIRET & Logo)"}
          </button>
          
          <button
            onClick={() => handleTabClick("invoices", "pro")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap flex items-center gap-1 cursor-pointer ${
              !hasProTier ? "opacity-60" : ""
            } ${activeTab === "invoices" ? "bg-amber-500 text-neutral-950 shadow-md font-bold" : "bg-neutral-900 text-neutral-300 border border-neutral-800"}`}
          >
            {!hasProTier && "🔒 "}📄 {isEn ? "Real-Time Editor & Invoices" : "Éditeur Temps Réel & Factures PDF"}
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

      {/* Contenu des onglets */}
      <div className="space-y-6">
        
        {/* ONGLET 1 : OFFRES & TARIFS (Visible pour TOUS) */}
        {activeTab === "tarifs" && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl font-bold text-white">
                {isEn ? "Choose your membership plan" : "Choisissez votre formule d'abonnement"}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400">
                {isEn ? "Unlock professional features instantly by selecting your tier below." : "Débloquez instantanément les fonctionnalités professionnelles en choisissant votre offre ci-dessous."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {OFFRES_TARIFS.map((offer) => {
                const isCurrent = userPlan === offer.id;

                return (
                  <div
                    key={offer.id}
                    className={`relative flex flex-col justify-between bg-neutral-900/90 border rounded-2xl p-6 transition duration-200 ${
                      offer.popular
                        ? 'border-amber-500/60 shadow-xl shadow-amber-500/10'
                        : 'border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    {offer.popular && (
                      <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-neutral-950 text-[10px] uppercase tracking-wider font-black px-3 py-1 rounded-full">
                        {isEn ? "Most popular" : "Le plus populaire"}
                      </span>
                    )}

                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-white">{offer.name}</h3>
                        <span className={`text-[11px] font-bold border px-2.5 py-1 rounded-lg ${offer.badgeColor}`}>
                          {offer.badge}
                        </span>
                      </div>

                      <div className="mb-4">
                        <span className="text-4xl font-black text-white">{offer.price}€</span>
                        <span className="text-xs text-neutral-400 font-medium"> / {isEn ? "month" : "mois"}</span>
                      </div>

                      <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
                        {offer.description}
                      </p>

                      <ul className="space-y-3 mb-8">
                        {offer.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                            <span className="text-amber-400 font-bold shrink-0">✓</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      disabled={isCurrent}
                      onClick={() => handleSelectOffer(offer)}
                      className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition cursor-pointer ${
                        isCurrent ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed' : offer.btnColor
                      }`}
                    >
                      {isCurrent ? (isEn ? "Current Plan" : "Offre Actuelle") : offer.cta}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ONGLET 2 : SCRIPTS DE VENTE */}
        {activeTab === "notionLive" && hasEliteTier && (
          <div className="bg-gradient-to-br from-neutral-950 via-neutral-900 to-amber-950/20 border-2 border-amber-500/40 p-6 rounded-3xl shadow-2xl space-y-5">
            <h2 className="text-xl font-black text-white">{isEn ? "Sales Funnel & Pro Script" : "Tunnel de Vente & Script Pro"}</h2>
            <p className="text-sm text-neutral-300 italic">{currentActiveLead.scriptSteps[scriptStep]}</p>
            <button
              onClick={() => setScriptStep((prev) => (prev < 3 ? prev + 1 : 1))}
              className="px-4 py-2 bg-amber-500 text-neutral-950 rounded-xl font-bold text-xs cursor-pointer"
            >
              {isEn ? "Next line ➔" : "Réplique suivante ➔"}
            </button>
          </div>
        )}

        {/* ONGLET 3 : CONFIGURATION ENTREPRISE */}
        {activeTab === "companyConfig" && hasProTier && (
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
                    accept="image/*"
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
                    value={companyInfo.siret}
                    placeholder="14 chiffres"
                    onChange={(e) => setCompanyInfo({ ...companyInfo, siret: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-neutral-100 text-xs outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">{isEn ? "Pro Email:" : "E-mail Pro :"}</label>
                  <input
                    type="text"
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
                  placeholder="Adresse complète"
                  onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-neutral-100 text-xs outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* ONGLET 4 : ÉDITEUR DE FACTURES ET DEVIS PDF */}
        {activeTab === "invoices" && hasProTier && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl space-y-4 h-fit">
              <div className="border-b border-neutral-800 pb-3 flex justify-between items-center">
                <h3 className="text-base font-bold text-amber-400">{isEn ? "Real-Time Editor" : "Saisie en Temps Réel"}</h3>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="bg-neutral-950 border border-amber-500 text-amber-400 font-bold px-3 py-1.5 rounded-xl text-xs outline-none cursor-pointer"
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
                    placeholder="Nom du client"
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">{isEn ? "Client Address:" : "Adresse du client :"}</label>
                  <input
                    type="text"
                    value={clientAddress}
                    placeholder="Adresse du client"
                    onChange={(e) => setClientAddress(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">{isEn ? "Service Description:" : "Intitulé de la prestation :"}</label>
                  <input
                    type="text"
                    value={itemTitle}
                    placeholder="Ex : Reportage photo"
                    onChange={(e) => setItemTitle(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">{isEn ? "Amount Excl. Tax (€):" : "Montant HT (€) :"}</label>
                  <input
                    type="number"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(Number(e.target.value) || 0)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-white font-bold text-sm outline-none focus:border-amber-500"
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
                        value={tvaRate}
                        onChange={(e) => setTvaRate(Number(e.target.value) || 0)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-white text-xs outline-none focus:border-amber-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handlePrintPDF}
                disabled={printing}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-neutral-950 font-black rounded-xl text-xs uppercase tracking-wider transition shadow-lg cursor-pointer mt-4"
              >
                {printing ? (isEn ? "⏳ Issuing..." : "⏳ Numérotation en cours…") : (isEn ? "🖨️ Download / Print Official PDF" : "🖨️ Télécharger / Imprimer en PDF officiel")}
              </button>

              {printMessage && (
                <p className={`text-xs font-bold text-center ${printMessage.type === "error" ? "text-red-400" : "text-emerald-400"}`}>
                  {printMessage.text}
                </p>
              )}
            </div>

            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
              <span className="text-3xl">📄</span>
              <h4 className="text-sm font-bold text-white">{isEn ? "Live PDF Preview" : "Aperçu instantané du PDF"}</h4>
              <p className="text-xs text-neutral-400 max-w-sm">
                {isEn ? "Your document is formatted according to legal standards with automatic sequential numbering." : "Votre document est mis en forme selon les normes légales avec numérotation séquentielle automatique."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1 : Information d'Abonnement Requis (Popup Propre & Nette) */}
      {restrictionModal.open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-amber-500/50 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔒</span>
                <h3 className="text-lg font-bold text-amber-400">{restrictionModal.title}</h3>
              </div>
              <button 
                onClick={() => setRestrictionModal({ open: false, title: "", text: "" })}
                className="text-neutral-400 hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              {restrictionModal.text}
            </p>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setRestrictionModal({ open: false, title: "", text: "" });
                  setActiveTab("tarifs");
                }}
                className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-neutral-950 font-bold rounded-xl text-xs uppercase tracking-wider hover:brightness-110 transition cursor-pointer"
              >
                {isEn ? "View Pricing & Subscribe ⚡" : "Voir les offres & S'abonner ⚡"}
              </button>
              <button
                onClick={() => setRestrictionModal({ open: false, title: "", text: "" })}
                className="w-full py-2 text-xs text-neutral-400 hover:text-white cursor-pointer"
              >
                {isEn ? "Close" : "Fermer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2 : Finalisation du Paiement / Closing */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-white">{isEn ? "Order Confirmation" : "Confirmation de commande"}</h3>
                <p className="text-xs text-neutral-400">Boké One Monthly Subscription</p>
              </div>
              <button 
                onClick={() => setSelectedPlan(null)}
                className="text-neutral-400 hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2">
              <div className="flex justify-between text-sm font-bold">
                <span>{selectedPlan.name} Plan</span>
                <span className="text-amber-400">{selectedPlan.price}€ / {isEn ? "month" : "mois"}</span>
              </div>
              <p className="text-xs text-neutral-400">{selectedPlan.description}</p>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-neutral-400">
                {isEn ? "By clicking confirm, you subscribe to the monthly plan which can be cancelled anytime." : "En cliquant sur valider, vous souscrivez à l'abonnement mensuel résiliable à tout moment."}
              </p>

              <button
                onClick={handleConfirmPayment}
                disabled={isProcessingPayment}
                className={`w-full py-3.5 rounded-xl font-bold text-sm cursor-pointer ${selectedPlan.btnColor}`}
              >
                {isProcessingPayment ? (isEn ? "Processing..." : "Traitement en cours...") : (isEn ? `Confirm & Pay ${selectedPlan.price}€` : `Valider et Payer ${selectedPlan.price}€`)}
              </button>

              <button
                onClick={() => setSelectedPlan(null)}
                className="w-full py-2 text-xs text-neutral-400 hover:text-white cursor-pointer"
              >
                {isEn ? "Cancel" : "Annuler"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}