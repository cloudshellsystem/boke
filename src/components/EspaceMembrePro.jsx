import React, { useState, useRef } from "react";
import { formatPrice } from "../lib/formatPrice";

export default function EspaceMembrePro({ userSession, onRequireLogin }) {
  const [activeTab, setActiveTab] = useState("notionLive");
  const [simulationAmount, setSimulationAmount] = useState(250);
  const [uploadMessage, setUploadMessage] = useState("");
  const fileInputRef = useRef(null);
  
  const [activeLeadId, setActiveLeadId] = useState(1);
  const [scriptStep, setScriptStep] = useState(1);

  // État pour le générateur de devis / factures rapide
  const [invoiceItem, setInvoiceItem] = useState("Cession de droits - Lumières de Conakry");
  const [invoicePrice, setInvoicePrice] = useState(250);
  const [clientNameInput, setClientNameInput] = useState("Agence Horizon");
  const [invoiceGenerated, setInvoiceGenerated] = useState(false);

  // Statistiques globales du créateur
  const [creatorStats, setCreatorStats] = useState({
    totalViews: 14250,
    totalLikes: 3840,
    totalEarnings: 1850.00
  });

  const notionPageUrl = "https://brindle-baboon-751.notion.site/3f29868fa534809eaefadbd7532ef348?v=3f29868fa53480d6bd9e000c633bdf4f&pvs=73";

  // 🔒 ÉCRAN DE VERROUILLAGE SI NON CONNECTÉ
  if (!userSession) {
    return (
      <div className="mx-auto w-full max-w-4xl bg-neutral-950 p-8 text-neutral-200 min-h-[70vh] flex flex-col items-center justify-center text-center font-sans">
        <div className="bg-neutral-900 border-2 border-amber-500/40 p-8 rounded-3xl shadow-2xl max-w-lg space-y-6">
          <div className="w-16 h-16 bg-amber-500/15 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-3xl">
            🔒
          </div>
          <div className="space-y-2">
            <span className="text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Espace Réservé & Sécurisé
            </span>
            <h1 className="text-2xl font-black text-amber-400">Espace Vente, Compta & Conformité Pro</h1>
            <p className="text-xs sm:text-sm text-neutral-400">
              Cet espace est strictement réservé aux créateurs abonnés aux offres Pro (49 € / 129 €) de BOKÉ ONE. Connectez-vous pour accéder à vos tunnels de vente, vos factures et vos examens Drone 2026.
            </p>
          </div>

          <button
            onClick={onRequireLogin}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold rounded-xl text-xs uppercase tracking-wider transition shadow-lg"
          >
            Se connecter / S'abonner ⚡
          </button>
        </div>
      </div>
    );
  }

  const calculateCommission = (amount) => {
    const val = parseFloat(amount) || 0;
    const rate = val <= 100 ? 0.15 : 0.20;
    const fee = val * rate;
    const net = val - fee;
    return { commissionRate: rate * 100, commissionFee: fee, netCreator: net };
  };

  const { commissionRate, commissionFee, netCreator } = calculateCommission(simulationAmount);

  const [mockLeads, setMockLeads] = useState([
    {
      id: 1,
      clientName: "Agence Horizon",
      address: "10 Rue de la République, 75001 Paris",
      contactPerson: "M. Kaba (Directeur Artistique)",
      phone: "+33 6 12 34 56 78",
      contactEmail: "kaba@agencehorizon.com",
      itemType: "Banque d'images (Stock)",
      itemTitle: "Lumières de Conakry",
      status: "Nouveau Lead (Panier actif)",
      depositPaid: false,
      scriptSteps: {
        1: "« Bonjour M. Kaba, je vois que vous suivez de près l'œuvre « Lumières de Conakry ». Pour votre budget de 150 €, nous vous garantissons une cession de droits immédiate. Est-ce que cela correspond à vos attentes ? »",
        2: "« Je comprends votre besoin de réflexion. Sachez que cette licence inclut une exclusivité territoriale de 72h sur Paris pour votre campagne. Si nous validons aujourd'hui, je vous offre les frais de transfert HD. »",
        3: "« Parfait, on signe le bon de commande numérique tout de suite ? Je vous envoie le lien de paiement sécurisé et les fichiers originaux sont à vous dans la minute. »"
      }
    },
    {
      id: 2,
      clientName: "Production Media Group",
      address: "Avenue du Port, Kaloum, Conakry",
      contactPerson: "Aissatou Sow (Chargée de Production)",
      phone: "+224 620 99 88 77",
      contactEmail: "a.sow@mediagroup.gn",
      itemType: "Prestation Cinéaste / Télépilote Drone",
      itemTitle: "Campagne Publique Clip Brand",
      status: "Contact débloqué (VIP)",
      depositPaid: true,
      scriptSteps: {
        1: "« Bonjour Aissatou, notre télépilote certifié BAPD/CATS 2026 est idéal pour votre tournage. Pour 1 200 €, nous incluons le matériel 4K et l'autorisation préfectorale. On valide les dates ? »",
        2: "« Le devis vous paraît élevé ? N'oubliez pas que nos pilotes sont 100% en règle avec les normes européennes 2026, ce qui vous garantit zéro risque d'amende administrative. »",
        3: "« On valide l'acompte de 30% dès maintenant pour bloquer l'agenda du réalisateur le mois prochain ? »"
      }
    },
  ]);

  const currentActiveLead = mockLeads.find(l => l.id === activeLeadId) || mockLeads[0];

  const updateLeadStatus = (leadId, newStatus) => {
    setMockLeads(mockLeads.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
  };

  const toggleDeposit = (leadId) => {
    setMockLeads(mockLeads.map(l => l.id === leadId ? { ...l, depositPaid: !l.depositPaid } : l));
  };

  // 📄 FONCTION DE GÉNÉRATION ET TÉLÉCHARGEMENT DU PDF / DOCUMENT OFFICIEL
  const handleDownloadPDF = () => {
    const invoiceContent = `
=========================================
BOKÉ ONE — FACTURE OFFICIELLE & CESSION DE DROITS
=========================================
Date : ${new Date().toLocaleDateString("fr-FR")}
Client : ${clientNameInput}
-----------------------------------------
Prestation / Œuvre : ${invoiceItem}
Montant Total HT : ${formatPrice(invoicePrice)}
Acompte exigé (30%) : ${formatPrice(invoicePrice * 0.30)}
-----------------------------------------
Statut : Validé et Enregistré (Régime Pro)
Conformité norme européenne 2026 incluse.
=========================================
    `;

    const blob = new Blob([invoiceContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Facture_BokeOne_${clientNameInput.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setInvoiceGenerated(true);
  };

  return (
    <div className="mx-auto w-full max-w-7xl bg-neutral-950 p-4 sm:p-8 text-neutral-200 min-h-screen font-sans">
      
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 border-b border-neutral-800 pb-5">
        <div>
          <span className="text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
            Monétisation, Facturation & Normes 2026
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-amber-400 mt-1.5">Espace Vente, Compta & Conformité Pro</h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
            Générez vos factures avec en-tête officiel, vos devis, et gérez vos examens Drone 2026.
          </p>
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-3 gap-2">
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
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "notionLive" ? "bg-amber-500 text-neutral-950 shadow-md" : "bg-neutral-900 text-amber-400 border border-amber-500/40 hover:bg-neutral-800"
            }`}
          >
            <span>💬</span> Vendre en Direct (Script)
          </button>
          
          <button
            onClick={() => setActiveTab("stats")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
              activeTab === "stats" ? "bg-amber-500 text-neutral-950 shadow-md font-bold" : "bg-neutral-900 text-neutral-300 border border-neutral-800 hover:text-amber-400"
            }`}
          >
            📊 Vues, Likes & Revenus
          </button>

          <button
            onClick={() => setActiveTab("invoices")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
              activeTab === "invoices" ? "bg-amber-500 text-neutral-950 shadow-md font-bold" : "bg-neutral-900 text-neutral-300 border border-neutral-800 hover:text-amber-400"
            }`}
          >
            📄 Devis & Factures PDF
          </button>

          <button
            onClick={() => setActiveTab("compliance")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
              activeTab === "compliance" ? "bg-amber-500 text-neutral-950 shadow-md font-bold" : "bg-neutral-900 text-neutral-300 border border-neutral-800 hover:text-amber-400"
            }`}
          >
            🛡️ Conformité & Examens Drone 2026
          </button>
        </div>

        <a
          href={notionPageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-2 rounded-xl text-xs font-semibold bg-neutral-900 border border-amber-500/40 text-amber-300 hover:border-amber-400 transition flex items-center gap-1.5 whitespace-nowrap"
        >
          <span>🔗</span> Notion ↗
        </a>
      </div>

      {/* Contenu dynamique */}
      <div className="space-y-6">
        
        {/* ONGLET TUNNEL DE VENTE */}
        {activeTab === "notionLive" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-gradient-to-br from-neutral-900 via-neutral-900 to-amber-950/20 border-2 border-amber-500/40 p-6 rounded-3xl shadow-2xl space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
                <div>
                  <span className="text-[10px] bg-amber-500 text-neutral-950 px-2.5 py-0.5 rounded-full font-extrabold uppercase">
                    🚀 Tunnel de Vente — Étape {scriptStep} sur 3
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white mt-1">{currentActiveLead.clientName}</h2>
                  <p className="text-xs text-amber-400 font-medium">Interlocuteur : {currentActiveLead.contactPerson}</p>
                </div>

                <div className="flex items-center gap-2 bg-neutral-950 p-2 rounded-xl border border-neutral-800">
                  <span className="text-[10px] text-neutral-400 uppercase font-bold px-1">Client :</span>
                  {mockLeads.map((lead) => (
                    <button
                      key={lead.id}
                      onClick={() => { setActiveLeadId(lead.id); setScriptStep(1); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        activeLeadId === lead.id ? "bg-amber-500 text-neutral-950" : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800"
                      }`}
                    >
                      {lead.clientName.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-neutral-950/80 p-3.5 rounded-2xl border border-neutral-800">
                  <span className="text-[10px] text-neutral-400 uppercase font-bold block mb-1">📞 Téléphone Direct</span>
                  <a href={`tel:${currentActiveLead.phone}`} className="text-amber-400 font-bold text-sm hover:underline">{currentActiveLead.phone}</a>
                </div>
                <div className="bg-neutral-950/80 p-3.5 rounded-2xl border border-neutral-800">
                  <span className="text-[10px] text-neutral-400 uppercase font-bold block mb-1">📧 E-mail Pro</span>
                  <a href={`mailto:${currentActiveLead.contactEmail}`} className="text-amber-400 font-bold text-sm hover:underline truncate block">{currentActiveLead.contactEmail}</a>
                </div>
                <div className="bg-neutral-950/80 p-3.5 rounded-2xl border border-neutral-800">
                  <span className="text-[10px] text-neutral-400 uppercase font-bold block mb-1">📍 Adresse</span>
                  <span className="text-neutral-200 text-xs font-medium block truncate">{currentActiveLead.address}</span>
                </div>
              </div>

              <div className="bg-neutral-950 p-5 rounded-2xl border border-amber-500/30 space-y-4 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">
                    {scriptStep === 1 && "1️⃣ Accroche (Accueil) :"}
                    {scriptStep === 2 && "2️⃣ Gestion d'objection (Hésitation) :"}
                    {scriptStep === 3 && "3️⃣ Closing final :"}
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3].map((step) => (
                      <button
                        key={step}
                        onClick={() => setScriptStep(step)}
                        className={`w-6 h-6 rounded-full text-[10px] font-bold transition flex items-center justify-center ${
                          scriptStep === step ? "bg-amber-500 text-neutral-950" : "bg-neutral-900 text-neutral-400 border border-neutral-800"
                        }`}
                      >
                        {step}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-sm sm:text-base text-neutral-100 font-medium italic leading-relaxed">
                  {currentActiveLead.scriptSteps[scriptStep]}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-neutral-800/80">
                  <span className="text-xs text-neutral-400">Le client hésite ? Enchaînez :</span>
                  {scriptStep < 3 ? (
                    <button
                      onClick={() => setScriptStep(prev => prev + 1)}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-xl font-bold text-xs transition shadow-md"
                    >
                      <span>Réplique suivante ➔</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => updateLeadStatus(currentActiveLead.id, "Vente Conclue 🔥")}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-xs transition shadow-md"
                    >
                      <span>🔥 Valider le Closing !</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ONGLET STATS */}
        {activeTab === "stats" && (
          <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl space-y-5">
              <div className="border-b border-neutral-800 pb-3">
                <h3 className="text-base font-bold text-amber-400">📊 Statistiques Détaillées de vos Œuvres</h3>
                <p className="text-xs text-neutral-400 mt-0.5">Analysez l'engagement de votre audience et vos performances financières.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 text-center space-y-1">
                  <span className="text-2xl">👀</span>
                  <span className="text-[10px] text-neutral-400 uppercase font-bold block">Nombre total de vues</span>
                  <span className="text-xl font-black text-amber-400">{creatorStats.totalViews.toLocaleString()}</span>
                </div>

                <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 text-center space-y-1">
                  <span className="text-2xl">❤️</span>
                  <span className="text-[10px] text-neutral-400 uppercase font-bold block">Nombre total de likes</span>
                  <span className="text-xl font-black text-rose-400">{creatorStats.totalLikes.toLocaleString()}</span>
                </div>

                <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 text-center space-y-1">
                  <span className="text-2xl">💵</span>
                  <span className="text-[10px] text-neutral-400 uppercase font-bold block">Gains totaux cumulés</span>
                  <span className="text-xl font-black text-emerald-400">{formatPrice(creatorStats.totalEarnings)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ONGLET DEVIS & FACTURES PDF */}
        {activeTab === "invoices" && (
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl max-w-2xl mx-auto space-y-5 animate-fadeIn">
            <div className="border-b border-neutral-800 pb-3">
              <h3 className="text-base font-bold text-amber-400">📄 Générateur de Facture / Devis PDF (En-tête officiel)</h3>
              <p className="text-xs text-neutral-400 mt-0.5">Téléchargez instantanément votre facture officielle avec en-tête pour vos clients.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">Nom du Client / Agence :</label>
                <input
                  type="text"
                  value={clientNameInput}
                  onChange={(e) => setClientNameInput(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-neutral-100 text-xs font-medium focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">Intitulé de l'œuvre ou prestation :</label>
                <input
                  type="text"
                  value={invoiceItem}
                  onChange={(e) => setInvoiceItem(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-neutral-100 text-xs font-medium focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">Montant Total (€) :</label>
                <input
                  type="number"
                  value={invoicePrice}
                  onChange={(e) => setInvoicePrice(Number(e.target.value) || 0)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-neutral-100 font-bold text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>Montant HT :</span>
                  <span className="font-bold text-neutral-200">{formatPrice(invoicePrice)}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Acompte de sécurité requis (30%) :</span>
                  <span className="font-bold text-amber-400">{formatPrice(invoicePrice * 0.30)}</span>
                </div>
              </div>

              <button
                onClick={handleDownloadPDF}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black rounded-xl text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2"
              >
                <span>📥 Télécharger la Facture / Devis PDF officiel</span>
              </button>

              {invoiceGenerated && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-emerald-400 block">✅ Document PDF généré et téléchargé avec succès !</span>
                  <p className="text-neutral-300">Le fichier pour <strong>{clientNameInput}</strong> ({formatPrice(invoicePrice)}) a été téléchargé sur votre appareil.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ONGLET CONFORMITÉ & EXAMENS DRONE 2026 */}
        {activeTab === "compliance" && (
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl max-w-3xl mx-auto space-y-6 animate-fadeIn">
            <div className="border-b border-neutral-800 pb-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-base font-bold text-amber-400">🛡️ Registre de Conformité & Examens Drone 2026</h3>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold uppercase">
                  Profil Vérifié BOKÉ ONE
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Déposez vos certifications européennes BAPD, CATT, CATS et documents juridiques.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-neutral-200">📜 BAPD 2026</span>
                  <span className="text-[10px] text-emerald-400 font-bold">Validé</span>
                </div>
                <p className="text-[10px] text-neutral-400">Brevet d'Aptitude Pilote de Drone (Open A1/A3-A2)</p>
              </div>

              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-neutral-200">🎓 CATT 2026</span>
                  <span className="text-[10px] text-emerald-400 font-bold">Validé</span>
                </div>
                <p className="text-[10px] text-neutral-400">Certificat Théorique Télépilote (Scénarios Nationaux/STS)</p>
              </div>

              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-neutral-200">🏆 CATS 2026</span>
                  <span className="text-[10px] text-amber-400 font-bold">À déposer</span>
                </div>
                <p className="text-[10px] text-neutral-400">Certificat d'Aptitude Théorique Scénarios Européens</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}