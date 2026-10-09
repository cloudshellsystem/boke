import React, { useState, useRef } from "react";
import { formatPrice } from "../lib/formatPrice";

export default function EspaceMembrePro({ userSession, onRequireLogin }) {
  const [activeTab, setActiveTab] = useState("notionLive");
  
  // 🏢 Paramètres Entreprise du Créateur (SIRET, Logo, etc.)
  const [companyInfo, setCompanyInfo] = useState({
    name: "Studio Créatif & Drone Pro",
    siret: "882 507 643 00022",
    address: "Avenue Louise, 1050 Bruxelles, Belgique",
    email: "contact@bokéone.com",
    logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100"
  });

  // 📄 État du document (Facture ou Devis)
  const [docType, setDocType] = useState("FACTURE"); // "FACTURE" ou "DEVIS"
  const [clientName, setClientName] = useState("Agence Horizon");
  const [clientAddress, setClientAddress] = useState("10 Rue de la République, 75001 Paris");
  const [itemTitle, setItemTitle] = useState("Cession de droits - Lumières de Conakry");
  const [itemPrice, setItemPrice] = useState(250);

  const [activeLeadId, setActiveLeadId] = useState(1);
  const [scriptStep, setScriptStep] = useState(1);

  // Statistiques globales du créateur
  const [creatorStats] = useState({
    totalViews: 14250,
    totalLikes: 3840,
    totalEarnings: 1850.00
  });

  const notionPageUrl = "https://brindle-baboon-751.notion.site/3f29868fa534809eaefadbd7532ef348?v=3f29868fa53480d6bd9e000c633bdf4f&pvs=73";

  // Mode contournement local pour les tests
  const isBypassedForTest = true; 

  if (!userSession && !isBypassedForTest) {
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
            <p className="text-xs sm:text-sm text-neutral-400">
              Cet espace est strictement réservé aux abonnés Pro. Connectez-vous pour accéder à vos outils de facturation avec SIRET et logo.
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

  const [mockLeads, setMockLeads] = useState([
    {
      id: 1,
      clientName: "Agence Horizon",
      address: "10 Rue de la République, 75001 Paris",
      contactPerson: "M. Kaba (Directeur Artistique)",
      phone: "+33 6 12 34 56 78",
      contactEmail: "kaba@agencehorizon.com",
      status: "Nouveau Lead (Panier actif)",
      depositPaid: false,
      scriptSteps: {
        1: "« Bonjour M. Kaba, je vois que vous suivez de près l'œuvre « Lumières de Conakry ». Pour votre budget de 150 €, nous vous garantissons une cession de droits immédiate. Est-ce que cela correspond à vos attentes ? »",
        2: "« Je comprends votre besoin de réflexion. Sachez que cette licence inclut une exclusivité territoriale de 72h sur Paris pour votre campagne. Si nous validons aujourd'hui, je vous offre les frais de transfert HD. »",
        3: "« Parfait, on signe le bon de commande numérique tout de suite ? Je vous envoie le lien de paiement sécurisé et les fichiers originaux sont à vous dans la minute. »"
      }
    }
  ]);

  const currentActiveLead = mockLeads.find(l => l.id === activeLeadId) || mockLeads[0];

  const updateLeadStatus = (leadId, newStatus) => {
    setMockLeads(mockLeads.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
  };

  // 🖨️ Impression propre en format PDF via le navigateur
  const handlePrintPDF = () => {
    window.print();
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
            Configurez votre entreprise (SIRET, logo) et générez vos devis et factures PDF conformes.
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
            📄 Éditeur de Factures & Devis PDF
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
              </div>

              <div className="bg-neutral-950 p-5 rounded-2xl border border-amber-500/30 space-y-4">
                <p className="text-sm sm:text-base text-neutral-100 font-medium italic leading-relaxed">
                  {currentActiveLead.scriptSteps[scriptStep]}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
                  <span className="text-xs text-neutral-400">Le client hésite ? Enchaînez :</span>
                  {scriptStep < 3 ? (
                    <button
                      onClick={() => setScriptStep(prev => prev + 1)}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-xl font-bold text-xs transition"
                    >
                      Réplique suivante ➔
                    </button>
                  ) : (
                    <button
                      onClick={() => updateLeadStatus(currentActiveLead.id, "Vente Conclue 🔥")}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-xs transition"
                    >
                      🔥 Valider le Closing !
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ONGLET CONFIGURATION ENTREPRISE (SIRET & LOGO) */}
        {activeTab === "companyConfig" && (
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl max-w-2xl mx-auto space-y-5 animate-fadeIn">
            <div className="border-b border-neutral-800 pb-3">
              <h3 className="text-base font-bold text-amber-400">🏢 Paramètres de votre Entreprise (En-tête officiel)</h3>
              <p className="text-xs text-neutral-400 mt-0.5">Ces informations apparaîtront automatiquement sur tous vos devis et factures PDF.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">Nom de l'entreprise ou Nom d'auteur :</label>
                <input
                  type="text"
                  value={companyInfo.name}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-neutral-100 text-xs font-medium focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">Numéro SIRET / TVA :</label>
                  <input
                    type="text"
                    value={companyInfo.siret}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, siret: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-neutral-100 text-xs font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">E-mail Professionnel :</label>
                  <input
                    type="text"
                    value={companyInfo.email}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-neutral-100 text-xs font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">Adresse postale :</label>
                <input
                  type="text"
                  value={companyInfo.address}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-neutral-100 text-xs font-medium focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">URL du Logo (ou image en ligne) :</label>
                <input
                  type="text"
                  value={companyInfo.logoUrl}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, logoUrl: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-neutral-100 text-xs font-medium focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-bold">
                ✅ Paramètres enregistrés. Ils s'appliqueront immédiatement lors de la génération de vos factures.
              </div>
            </div>
          </div>
        )}

        {/* ONGLET ÉDITEUR DE FACTURE & DEVIS PDF */}
        {activeTab === "invoices" && (
          <div className="space-y-6 max-w-3xl mx-auto animate-fadeIn">
            
            {/* Formulaire de saisie */}
            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl space-y-4">
              <div className="border-b border-neutral-800 pb-3 flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold text-amber-400">📄 Éditeur de Devis & Factures Pro</h3>
                  <p className="text-xs text-neutral-400">Renseignez les détails du document à générer.</p>
                </div>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="bg-neutral-950 border border-amber-500 text-amber-400 font-bold px-3 py-1.5 rounded-xl text-xs outline-none"
                >
                  <option value="FACTURE">FACTURE</option>
                  <option value="DEVIS">DEVIS</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">Nom du Client / Agence :</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-neutral-100 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">Adresse du Client :</label>
                  <input
                    type="text"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-neutral-100 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">Intitulé de la prestation ou de l'œuvre :</label>
                <input
                  type="text"
                  value={itemTitle}
                  onChange={(e) => setItemTitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-neutral-100 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">Montant Total HT (€) :</label>
                <input
                  type="number"
                  value={itemPrice}
                  onChange={(e) => setItemPrice(Number(e.target.value) || 0)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-neutral-100 font-bold text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Aperçu Visuel du Document Officiel avec En-tête */}
            <div className="bg-white text-neutral-900 p-8 rounded-2xl shadow-2xl space-y-6 font-sans">
              
              {/* En-tête du document */}
              <div className="flex justify-between items-start border-b border-neutral-200 pb-6">
                <div className="space-y-1">
                  {companyInfo.logoUrl && (
                    <img src={companyInfo.logoUrl} alt="Logo" className="h-12 w-12 object-contain rounded-lg mb-2 border border-neutral-200" />
                  )}
                  <h2 className="text-lg font-black text-neutral-900">{companyInfo.name}</h2>
                  <p className="text-xs text-neutral-600">{companyInfo.address}</p>
                  <p className="text-xs text-neutral-600">SIRET : {companyInfo.siret}</p>
                  <p className="text-xs text-neutral-600">{companyInfo.email}</p>
                </div>

                <div className="text-right space-y-1">
                  <span className="text-xl font-black text-amber-600 uppercase tracking-wider block">{docType}</span>
                  <p className="text-xs text-neutral-600">Date : {new Date().toLocaleDateString("fr-FR")}</p>
                  <p className="text-xs text-neutral-600">Réf : BOKÉ-{Math.floor(100000 + Math.random() * 900000)}</p>
                </div>
              </div>

              {/* Infos Client */}
              <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-neutral-500 block">Facturé / Destiné à :</span>
                <h4 className="font-bold text-sm text-neutral-900">{clientName}</h4>
                <p className="text-xs text-neutral-600">{clientAddress}</p>
              </div>

              {/* Tableau de la prestation */}
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-300 text-neutral-500 uppercase font-bold text-[10px]">
                    <th className="py-2">Description</th>
                    <th className="py-2 text-right">Montant HT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  <tr>
                    <td className="py-3 font-medium text-neutral-900">{itemTitle}</td>
                    <td className="py-3 text-right font-bold">{formatPrice(itemPrice)}</td>
                  </tr>
                </tbody>
              </table>

              {/* Totaux */}
              <div className="flex justify-end pt-4 border-t border-neutral-200">
                <div className="w-64 space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-600">
                    <span>Total HT :</span>
                    <span className="font-bold">{formatPrice(itemPrice)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>TVA (Non applicable, art. 293 B du CGI) :</span>
                    <span>0,00 €</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-neutral-950 pt-2 border-t border-neutral-300">
                    <span>Total Net à payer :</span>
                    <span className="text-amber-600">{formatPrice(itemPrice)}</span>
                  </div>
                  <div className="flex justify-between text-amber-700 font-bold pt-1">
                    <span>Acompte exigé (30%) :</span>
                    <span>{formatPrice(itemPrice * 0.30)}</span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-neutral-500 pt-6 border-t border-neutral-200 text-center">
                BOKÉ ONE — Réseau d'Élite & Banque d'Images Nationale • Conforme aux normes européennes 2026.
              </div>
            </div>

            {/* Bouton de téléchargement / impression PDF */}
            <button
              onClick={handlePrintPDF}
              className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black rounded-2xl text-xs uppercase tracking-wider transition shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>🖨️ Télécharger / Imprimer la Facture en PDF officiel</span>
            </button>
          </div>
        )}

        {/* ONGLET CONFORMITÉ & EXAMENS DRONE 2026 */}
        {activeTab === "compliance" && (
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl max-w-3xl mx-auto space-y-6 animate-fadeIn">
            <div className="border-b border-neutral-800 pb-4">
              <h3 className="text-base font-bold text-amber-400">🛡️ Registre de Conformité & Examens Drone 2026</h3>
              <p className="text-xs text-neutral-400">Certifications BAPD, CATT, CATS intégrées à votre profil pro.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2">
                <span className="text-xs font-bold text-neutral-200 block">📜 BAPD 2026</span>
                <span className="text-[10px] text-emerald-400 font-bold block">Validé</span>
              </div>
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2">
                <span className="text-xs font-bold text-neutral-200 block">🎓 CATT 2026</span>
                <span className="text-[10px] text-emerald-400 font-bold block">Validé</span>
              </div>
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2">
                <span className="text-xs font-bold text-neutral-200 block">🏆 CATS 2026</span>
                <span className="text-[10px] text-amber-400 font-bold block">À déposer</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}