import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function EspaceMembrePro({ onRequireLogin }) {
  const { isLoggedIn, user } = useAuth();
  const [activeModuleModal, setActiveModuleModal] = useState(null);

  // États pour le profil entreprise et logo
  const [companyName, setCompanyName] = useState("Boké Studio SARL");
  const [siret, setSiret] = useState("892 341 000 00012");
  const [companyLogo, setCompanyLogo] = useState(null);

  // États pour le générateur de factures / devis interactif
  const [docType, setDocType] = useState("facture");
  const [clientName, setClientName] = useState("Agence Luxe Paris");
  const [itemDescription, setItemDescription] = useState("Licence exclusive & Droits - Collection Boké One");
  const [amountHT, setAmountHT] = useState(250);

  // Gestion de l'upload du logo personnel
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="bg-neutral-950 min-h-[70vh] flex flex-col items-center justify-center p-6 text-center font-sans text-neutral-200">
        <div className="max-w-md bg-neutral-900/60 border border-amber-500/30 p-8 rounded-2xl space-y-4 shadow-2xl">
          <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto text-amber-400 text-2xl font-bold">
            🔒
          </div>
          <h2 className="text-xl font-black text-white">Espace Pro Réservé</h2>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Veuillez vous connecter pour accéder à votre tableau de bord SaaS, vos scripts de vente et votre CRM.
          </p>
          <button
            onClick={onRequireLogin}
            className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black py-3 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer shadow-lg"
          >
            Se Connecter / Découvrir les formules
          </button>
        </div>
      </div>
    );
  }

  const closeModal = () => setActiveModuleModal(null);

  // Calculs financiers pour le devis / facture
  const tvaAmount = Number(amountHT) * 0.20;
  const totalTTC = Number(amountHT) + tvaAmount;
  const docNumber = docType === "facture" ? "FAC-2026-089" : "DEV-2026-042";

  return (
    <div className="bg-neutral-950 min-h-screen py-8 px-4 text-neutral-200 font-sans max-w-7xl mx-auto space-y-8">
      
      {/* En-tête Espace Pro */}
      <div className="border-b border-neutral-900 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full font-bold uppercase tracking-widest">
            ESPACE CLIENT &amp; SAAS PRO
          </span>
          <h1 className="text-2xl font-black text-white mt-2">Centre d'Outillage Produit &amp; Gestion</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Connecté en tant que <span className="text-amber-400 font-bold">{user?.email}</span> — Formule : <span className="uppercase text-emerald-400 font-bold">{user?.subscription_status || 'Pro'}</span>
          </p>
        </div>
      </div>

      {/* Métriques clés */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-neutral-900/40 border border-neutral-800 p-5 rounded-2xl">
          <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-wider">Ventes Cumulées</p>
          <p className="text-2xl font-black text-white mt-1">14 250 €</p>
        </div>
        <div className="bg-neutral-900/40 border border-neutral-800 p-5 rounded-2xl">
          <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-wider">Vues &amp; Contacts Pros</p>
          <p className="text-2xl font-black text-white mt-1">3 840</p>
        </div>
        <div className="bg-neutral-900/40 border border-neutral-800 p-5 rounded-2xl">
          <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-wider">Revenu Estimé Mensuel</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">1 850,00 €</p>
        </div>
      </div>

      {/* Titre de section */}
      <div>
        <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
          <span>📁</span> Modules et Fonctionnalités
        </h3>
      </div>

      {/* Grille des modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Module 1 : Back-Office Admin */}
        <div className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-neutral-700 transition">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                ⚙️ Tableau de Bord Admin
              </h4>
              <span className="text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-black uppercase">
                SUPER-ADMIN
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Gestion centralisée du site : modération du forum, actualités, annuaire des créateurs et produits.
            </p>
          </div>
          <Link
            to="/admin"
            className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black py-3 rounded-xl text-xs uppercase tracking-wider transition text-center shadow-lg block"
          >
            ACCÉDER AU BACK-OFFICE ↗
          </Link>
        </div>

        {/* Module 2 : Vendre en Direct */}
        <div className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-neutral-700 transition">
          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              💬 Vendre en Direct (Script)
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Accédez à vos scripts de vente et tunnels de négociation client en direct.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveModuleModal("script")}
            className="w-full bg-neutral-800 hover:bg-neutral-700 text-amber-400 font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer border border-neutral-700"
          >
            OUVRIR LE MODULE ↗
          </button>
        </div>

        {/* Module 3 : Mon Entreprise */}
        <div className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-neutral-700 transition">
          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              📊 Mon Entreprise (SIRET &amp; Logo)
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Configurez l'identité légale de votre structure et importez votre logo personnel.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveModuleModal("entreprise")}
            className="w-full bg-neutral-800 hover:bg-neutral-700 text-amber-400 font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer border border-neutral-700"
          >
            GÉRER MON ENTREPRISE ↗
          </button>
        </div>

        {/* Module 4 : Éditeur Temps Réel & Factures PDF */}
        <div className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-neutral-700 transition">
          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              📄 Éditeur Temps Réel &amp; Factures PDF
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Générez et téléchargez vos devis et factures conformes intégrant votre logo.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveModuleModal("factures")}
            className="w-full bg-neutral-800 hover:bg-neutral-700 text-amber-400 font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer border border-neutral-700"
          >
            CRÉER UNE FACTURE ↗
          </button>
        </div>

        {/* Module 5 : CRM Prospection */}
        <div className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-neutral-700 transition">
          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              👑 CRM Prospection &amp; Tunnels
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Pilotez vos opportunités commerciales, vos relances clients et vos dossiers.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveModuleModal("crm")}
            className="w-full bg-neutral-800 hover:bg-neutral-700 text-amber-400 font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer border border-neutral-700"
          >
            ACCÉDER AU CRM ↗
          </button>
        </div>

      </div>

      {/* MODAL UNIFIÉE D'OUVERTURE DES MODULES */}
      {activeModuleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-xl rounded-2xl p-6 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white font-bold text-sm cursor-pointer"
            >
              ✕
            </button>

            {activeModuleModal === "script" && (
              <div className="space-y-4">
                <h3 className="text-base font-black text-amber-400 flex items-center gap-2">💬 Script &amp; Tunnel de Négociation Directe</h3>
                <p className="text-xs text-neutral-300">Utilisez cette trame guidée lors de vos échanges clients en direct :</p>
                <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl text-xs space-y-2 font-mono text-neutral-300">
                  <p>1. Phase d'écoute : « Quel est le concept recherché pour votre projet média ? »</p>
                  <p>2. Proposition : « Nous mettons à disposition la licence d'utilisation Boké One avec droits exclusifs. »</p>
                  <p>3. Closing : « Souhaitez-vous recevoir la facture d'acompte directement par e-mail ? »</p>
                </div>
              </div>
            )}

            {activeModuleModal === "entreprise" && (
              <div className="space-y-4">
                <h3 className="text-base font-black text-amber-400 flex items-center gap-2">📊 Mon Entreprise (Configuration SIRET &amp; Logo)</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-neutral-400 block mb-1">Raison Sociale / Nom commercial</label>
                    <input 
                      type="text" 
                      value={companyName} 
                      onChange={(e) => setCompanyName(e.target.value)} 
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400" 
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 block mb-1">Numéro SIRET</label>
                    <input 
                      type="text" 
                      value={siret} 
                      onChange={(e) => setSiret(e.target.value)} 
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 font-mono text-white outline-none focus:border-amber-400" 
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 block mb-1">Votre Logo d'Entreprise (Format image)</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleLogoUpload} 
                      className="w-full text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-neutral-950 hover:file:bg-amber-400 cursor-pointer"
                    />
                    {companyLogo && (
                      <div className="mt-3 p-3 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center gap-4">
                        <img src={companyLogo} alt="Aperçu logo" className="h-10 w-auto object-contain" />
                        <span className="text-[11px] text-emerald-400 font-bold">Logo chargé avec succès !</span>
                      </div>
                    )}
                  </div>
                </div>
                <button onClick={() => { alert("Données d'entreprise et logo enregistrés avec succès !"); closeModal(); }} className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold py-2.5 rounded-xl text-xs cursor-pointer">
                  Enregistrer les modifications
                </button>
              </div>
            )}

            {activeModuleModal === "factures" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-black text-amber-400 flex items-center gap-2">📄 Éditeur de Devis &amp; Facture PDF</h3>
                  {companyLogo && <img src={companyLogo} alt="Logo" className="h-8 w-auto object-contain" />}
                </div>
                <p className="text-xs text-neutral-400">Renseignez les détails pour générer immédiatement votre document officiel avec votre entête.</p>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-neutral-400 block mb-1">Type de document</label>
                    <select value={docType} onChange={(e) => setDocType(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white outline-none">
                      <option value="facture">Facture officielle</option>
                      <option value="devis">Devis commercial</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-neutral-400 block mb-1">Nom du client / Agence</label>
                    <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white outline-none" />
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-neutral-400 block mb-1">Description</label>
                    <input type="text" value={itemDescription} onChange={(e) => setItemDescription(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white outline-none" />
                  </div>
                  <div>
                    <label className="text-neutral-400 block mb-1">Montant HT (€)</label>
                    <input type="number" value={amountHT} onChange={(e) => setAmountHT(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white outline-none font-mono" />
                  </div>
                </div>

                {/* Aperçu financier */}
                <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 space-y-1 text-xs font-mono">
                  <div className="flex justify-between text-neutral-400"><span>Émetteur : {companyName} (SIRET: {siret})</span></div>
                  <div className="flex justify-between text-neutral-400"><span>N° : {docNumber}</span></div>
                  <div className="flex justify-between text-neutral-400"><span>Sous-total HT :</span><span>{Number(amountHT || 0).toFixed(2)} €</span></div>
                  <div className="flex justify-between text-neutral-400"><span>TVA (20%) :</span><span>{tvaAmount.toFixed(2)} €</span></div>
                  <div className="flex justify-between text-sm font-bold text-amber-400 border-t border-neutral-800 pt-2 mt-1"><span>Total TTC :</span><span>{totalTTC.toFixed(2)} €</span></div>
                </div>

                <button onClick={() => { alert(`📄 Votre ${docType} (${docNumber}) avec l'entête ${companyName} a été généré avec succès pour ${clientName} (${totalTTC.toFixed(2)} € TTC) !`); closeModal(); }} className="w-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer shadow-lg">
                  Télécharger le {docType === "facture" ? "Facture PDF" : "Devis PDF"}
                </button>
              </div>
            )}

            {activeModuleModal === "crm" && (
              <div className="space-y-4">
                <h3 className="text-base font-black text-amber-400 flex items-center gap-2">👑 Pipeline CRM &amp; Prospects</h3>
                <div className="space-y-2 text-xs">
                  <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 flex justify-between items-center">
                    <span>Agence Luxe Paris (5 000 €)</span>
                    <span className="text-emerald-400 font-bold">En négociation</span>
                  </div>
                  <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 flex justify-between items-center">
                    <span>Studio Mode Production (2 400 €)</span>
                    <span className="text-amber-400 font-bold">Devis envoyé</span>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={closeModal}
                className="w-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold py-2.5 rounded-xl text-xs cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}