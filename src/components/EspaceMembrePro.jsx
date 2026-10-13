import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function EspaceMembrePro({ onRequireLogin }) {
  const { isLoggedIn, user } = useAuth();
  const [activeModuleModal, setActiveModuleModal] = useState(null);

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

  return (
    <div className="bg-neutral-950 min-h-screen py-8 px-4 text-neutral-200 font-sans max-w-7xl mx-auto space-y-8">
      
      {/* En-tête Espace Pro */}
      <div className="border-b border-neutral-900 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full font-bold uppercase tracking-widest">
            ESPACE CLIENT & SAAS PRO
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
          <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-wider">Revenu Estimé Muel</p>
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
              Configurez l'identité légale de votre structure et gérez vos documents.
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
              Générez et téléchargez vos devis et factures conformes en quelques clics.
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
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-xl rounded-2xl p-6 shadow-2xl space-y-5 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white font-bold text-sm cursor-pointer"
            >
              ✕
            </button>

            {activeModuleModal === "script" && (
              <div className="space-y-4">
                <h3 className="text-base font-black text-amber-400 flex items-center gap-2">💬 Script &amp; Tunnel de Négociation Directe</h3>
                <p className="text-xs text-neutral-300">Utilisez ce trame guidée lors de vos échanges clients en direct :</p>
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
                    <input type="text" defaultValue="Boké Studio SARL" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400" />
                  </div>
                  <div>
                    <label className="text-neutral-400 block mb-1">Numéro SIRET</label>
                    <input type="text" defaultValue="892 341 000 00012" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 font-mono text-white outline-none focus:border-amber-400" />
                  </div>
                </div>
                <button onClick={() => { alert("Données d'entreprise enregistrées !"); closeModal(); }} className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold py-2.5 rounded-xl text-xs">
                  Enregistrer les modifications
                </button>
              </div>
            )}

            {activeModuleModal === "factures" && (
              <div className="space-y-4">
                <h3 className="text-base font-black text-amber-400 flex items-center gap-2">📄 Générateur Devis &amp; Facture PDF</h3>
                <div className="space-y-3 text-xs">
                  <input type="text" placeholder="Nom du client / Agence" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white" />
                  <input type="number" placeholder="Montant Prestation HT (€)" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white" />
                </div>
                <button onClick={() => { alert("Facture PDF générée et envoyée au client !"); closeModal(); }} className="w-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold py-2.5 rounded-xl text-xs">
                  Générer le PDF
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