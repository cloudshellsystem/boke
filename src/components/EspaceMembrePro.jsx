import React, { useState, useRef } from "react";
import { formatPrice } from "../lib/formatPrice";

export default function EspaceMembrePro({ userSession }) {
  const [activeTab, setActiveTab] = useState("notionLive");
  const [simulationAmount, setSimulationAmount] = useState(250);
  const [uploadMessage, setUploadMessage] = useState("");
  const fileInputRef = useRef(null);
  
  const [activeLeadId, setActiveLeadId] = useState(1);
  const [scriptStep, setScriptStep] = useState(1);

  // État pour le générateur de devis / factures rapide
  const [invoiceItem, setInvoiceItem] = useState("Cession de droits - Lumières de Conakry");
  const [invoicePrice, setInvoicePrice] = useState(250);
  const [invoiceGenerated, setInvoiceGenerated] = useState(false);

  // Statistiques globales du créateur (Vues, Likes, Gains totaux)
  const [creatorStats, setCreatorStats] = useState({
    totalViews: 14250,
    totalLikes: 3840,
    totalEarnings: 1850.00
  });

  const notionPageUrl = "https://brindle-baboon-751.notion.site/3f29868fa534809eaefadbd7532ef348?v=3f29868fa53480d6bd9e000c633bdf4f&pvs=73";

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
      itemImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=150",
      status: "Nouveau Lead (Panier actif)",
      depositPaid: false,
      notes: "Intéressé par une licence exclusive.",
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
      itemType: "Prestation Cinéaste / Réalisateur",
      itemTitle: "Campagne Publique Clip Brand",
      itemImage: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=150",
      status: "Contact débloqué (VIP)",
      depositPaid: true,
      notes: "Tournage prévu le mois prochain.",
      scriptSteps: {
        1: "« Bonjour Aissatou, notre réalisateur est idéal pour votre clip à Conakry. Pour 1 200 €, nous incluons le matériel 4K complet. On valide les dates ? »",
        2: "« Le devis vous paraît élevé ? N'oubliez pas que notre équipe locale gère les autorisations de tournage de A à Z, ce qui vous évite des semaines de démarches administratives. »",
        3: "« On valide l'acompte de 30% dès maintenant pour bloquer l'agenda du réalisateur le mois prochain ? »"
      }
    },
  ]);

  const currentActiveLead = mockLeads.find(l => l.id === activeLeadId) || mockLeads[0];

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setUploadMessage(`Succès : ${files.length} fichier(s) protégé(s).`);
      setTimeout(() => setUploadMessage(""), 5000);
    }
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const updateLeadStatus = (leadId, newStatus) => {
    setMockLeads(mockLeads.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
  };

  const toggleDeposit = (leadId) => {
    setMockLeads(mockLeads.map(l => l.id === leadId ? { ...l, depositPaid: !l.depositPaid } : l));
  };

  return (
    <div className="mx-auto w-full max-w-7xl bg-neutral-950 p-4 sm:p-8 text-neutral-200 min-h-screen font-sans">
      
      {/* En-tête avec statistiques globales (Vues, Likes, Gains) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 border-b border-neutral-800 pb-5">
        <div>
          <span className="text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
            Monétisation & Performance Créateur
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-amber-400 mt-1.5">Espace Vente & Statistiques Pro</h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
            Suivez l'impact de vos œuvres (vues, likes), vos gains cumulés et closez vos prospects en salon.
          </p>
        </div>

        {/* Mini dashboard stats haut de page */}
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
            📄 Devis & Factures
          </button>

          <button
            onClick={() => setActiveTab("calculator")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
              activeTab === "calculator" ? "bg-amber-500 text-neutral-950 shadow-md font-bold" : "bg-neutral-900 text-neutral-300 border border-neutral-800 hover:text-amber-400"
            }`}
          >
            🧮 Simulateur
          </button>

          <button
            onClick={() => setActiveTab("portfolio")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
              activeTab === "portfolio" ? "bg-amber-500 text-neutral-950 shadow-md font-bold" : "bg-neutral-900 text-neutral-300 border border-neutral-800 hover:text-amber-400"
            }`}
          >
            🔒 Sécuriser Catalogue
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
        
        {activeTab === "notionLive" && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* TUNNEL DE VENTE INTERACTIF */}
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

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-neutral-800 text-xs">
                <span className="text-neutral-400">Statut : <strong className="text-amber-400">{currentActiveLead.status}</strong></span>
                <button
                  onClick={() => toggleDeposit(currentActiveLead.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold border transition ${
                    currentActiveLead.depositPaid ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400" : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                  }`}
                >
                  {currentActiveLead.depositPaid ? "✅ Acompte 30% Reçu" : "⏳ En attente Acompte 30%"}
                </button>
              </div>
            </div>

            {/* Liste des prospects */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-4 border-b border-neutral-800 bg-neutral-950/50 flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">📋 Suivi des Prospects & Acomptes</span>
                <span className="text-xs text-neutral-400">{mockLeads.length} clients</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-neutral-300">
                  <thead className="bg-neutral-950 text-neutral-400 uppercase font-bold text-[10px] border-b border-neutral-800">
                    <tr>
                      <th className="p-3">Client</th>
                      <th className="p-3">Téléphone</th>
                      <th className="p-3">Acompte 30%</th>
                      <th className="p-3">Statut</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60">
                    {mockLeads.map((lead) => (
                      <tr key={lead.id} className={`hover:bg-neutral-800/40 transition ${activeLeadId === lead.id ? 'bg-amber-500/5' : ''}`}>
                        <td className="p-3 font-bold text-neutral-100">{lead.clientName}</td>
                        <td className="p-3 font-mono text-amber-400">{lead.phone}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${lead.depositPaid ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'}`}>
                            {lead.depositPaid ? "Payé (30%)" : "En attente"}
                          </span>
                        </td>
                        <td className="p-3 font-semibold text-amber-400">{lead.status}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => { setActiveLeadId(lead.id); setScriptStep(1); }}
                            className="px-3 py-1.5 bg-amber-500 text-neutral-950 rounded-xl font-bold text-xs hover:bg-amber-400 transition"
                          >
                            Ouvrir ⚡
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* NOUVEAU ONGLET : VUES, LIKES & REVENUS */}
        {activeTab === "stats" && (
          <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl space-y-5">
              <div className="border-b border-neutral-800 pb-3">
                <h3 className="text-base font-bold text-amber-400">📊 Statistiques Détaillées de vos Œuvres</h3>
                <p className="text-xs text-neutral-400 mt-0.5">Analysez l'engagement de votre audience et vos performances financières globales.</p>
              </div>

              {/* Cartes de statistiques globales */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 text-center space-y-1">
                  <span className="text-2xl">👀</span>
                  <span className="text-[10px] text-neutral-400 uppercase font-bold block">Nombre total de vues</span>
                  <span className="text-xl font-black text-amber-400">{creatorStats.totalViews.toLocaleString()}</span>
                  <span className="text-[10px] text-emerald-400 block">+12% cette semaine</span>
                </div>

                <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 text-center space-y-1">
                  <span className="text-2xl">❤️</span>
                  <span className="text-[10px] text-neutral-400 uppercase font-bold block">Nombre total de likes</span>
                  <span className="text-xl font-black text-rose-400">{creatorStats.totalLikes.toLocaleString()}</span>
                  <span className="text-[10px] text-emerald-400 block">+8% cette semaine</span>
                </div>

                <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 text-center space-y-1">
                  <span className="text-2xl">💵</span>
                  <span className="text-[10px] text-neutral-400 uppercase font-bold block">Gains totaux cumulés</span>
                  <span className="text-xl font-black text-emerald-400">{formatPrice(creatorStats.totalEarnings)}</span>
                  <span className="text-[10px] text-amber-400 block">Paiements validés</span>
                </div>
              </div>

              {/* Tableau des performances par œuvre */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden mt-4">
                <div className="p-3.5 border-b border-neutral-800 text-xs font-bold text-amber-400 uppercase">
                  Détail par Œuvre / Média
                </div>
                <div className="divide-y divide-neutral-800/60 text-xs">
                  <div className="p-3.5 flex items-center justify-between">
                    <div>
                      <strong className="text-neutral-100 block">Lumières de Conakry</strong>
                      <span className="text-neutral-400 text-[10px]">Banque d'images (Stock)</span>
                    </div>
                    <div className="flex items-center gap-4 text-right">
                      <div><span className="text-neutral-400 block text-[9px]">VUES</span><strong className="text-amber-400">8 400</strong></div>
                      <div><span className="text-neutral-400 block text-[9px]">LIKES</span><strong className="text-rose-400">2 150</strong></div>
                      <div><span className="text-neutral-400 block text-[9px]">GAINS</span><strong className="text-emerald-400">950,00 €</strong></div>
                    </div>
                  </div>

                  <div className="p-3.5 flex items-center justify-between">
                    <div>
                      <strong className="text-neutral-100 block">Campagne Publique Clip Brand</strong>
                      <span className="text-neutral-400 text-[10px]">Prestation Cinéaste</span>
                    </div>
                    <div className="flex items-center gap-4 text-right">
                      <div><span className="text-neutral-400 block text-[9px]">VUES</span><strong className="text-amber-400">5 850</strong></div>
                      <div><span className="text-neutral-400 block text-[9px]">LIKES</span><strong className="text-rose-400">1 690</strong></div>
                      <div><span className="text-neutral-400 block text-[9px]">GAINS</span><strong className="text-emerald-400">900,00 €</strong></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DEVIS & FACTURES */}
        {activeTab === "invoices" && (
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl max-w-2xl mx-auto space-y-5 animate-fadeIn">
            <div className="border-b border-neutral-800 pb-3">
              <h3 className="text-base font-bold text-amber-400">📄 Générateur de Devis / Facture Express</h3>
              <p className="text-xs text-neutral-400 mt-0.5">Validez l'accord commercial immédiatement sur place.</p>
            </div>

            <div className="space-y-4">
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
                  <span>Acompte de sécurité (30%) :</span>
                  <span className="font-bold text-amber-400">{formatPrice(invoicePrice * 0.30)}</span>
                </div>
              </div>

              <button
                onClick={() => setInvoiceGenerated(true)}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs transition shadow-md"
              >
                Générer et envoyer le lien de devis/facture ⚡
              </button>

              {invoiceGenerated && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-emerald-400 block">✅ Document généré avec succès !</span>
                  <p className="text-neutral-300">Le devis pour <strong>{invoiceItem}</strong> ({formatPrice(invoicePrice)}) a été converti en lien sécurisé.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CALCULATEUR */}
        {activeTab === "calculator" && (
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl max-w-xl mx-auto space-y-5">
            <h3 className="text-base font-bold text-amber-400">Calculateur de Revenus Créateur</h3>
            <p className="text-xs text-neutral-400">Simulez vos gains nets (15% de commission jusqu'à 100 €, puis 20%).</p>
            <input
              type="number"
              value={simulationAmount}
              onChange={(e) => setSimulationAmount(Number(e.target.value) || 0)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-neutral-100 font-bold text-base focus:outline-none focus:border-amber-500"
            />
            <div className="grid grid-cols-3 gap-3 bg-neutral-950 p-3.5 rounded-xl border border-neutral-800 text-center text-xs">
              <div><span className="text-neutral-400 block font-bold">Taux</span><span className="font-bold text-amber-400">{commissionRate}%</span></div>
              <div><span className="text-neutral-400 block font-bold">Frais</span><span className="font-bold text-red-400">- {formatPrice(commissionFee)}</span></div>
              <div><span className="text-neutral-400 block font-bold">Vous touchez</span><span className="font-bold text-emerald-400">{formatPrice(netCreator)}</span></div>
            </div>
          </div>
        )}

        {/* PORTFOLIO & STOCK */}
        {activeTab === "portfolio" && (
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl max-w-xl mx-auto text-center space-y-5">
            <h3 className="text-base font-bold text-amber-400">Protéger mon Catalogue & Médias</h3>
            <p className="text-xs text-neutral-400">Protégez instantanément vos œuvres avec un filigrane SVG invisible.</p>
            {uploadMessage && <div className="p-3 bg-emerald-500/10 text-emerald-400 text-xs rounded-xl font-bold">{uploadMessage}</div>}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple className="hidden" />
            <div onClick={triggerFileSelect} className="border-2 border-dashed border-neutral-800 hover:border-amber-500/50 p-6 rounded-2xl cursor-pointer bg-neutral-950">
              <p className="text-xs font-bold text-neutral-300">Cliquez pour importer et protéger vos fichiers</p>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}