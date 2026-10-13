import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function EspaceMembrePro() {
  const { user, isAdmin, isElite } = useAuth();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 p-6 md:p-10 space-y-8 font-sans">
      
      {/* En-tête de l'Espace Pro */}
      <header className="border-b border-neutral-800 pb-6 space-y-2">
        <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full font-bold uppercase tracking-widest">
          ESPACE PRO & FACTURATION OFFICIELLE
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Espace Vente, Compta & Conformité Pro
        </h1>
        <p className="text-xs text-neutral-400">
          Gérez vos abonnements et géneréz vos factures et devis en temps réel.
        </p>
      </header>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-1">
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">☕ VUES</span>
          <p className="text-2xl font-black text-white">14 250</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-1">
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">❤️ LIKES</span>
          <p className="text-2xl font-black text-rose-500">3 840</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-1">
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">💰 TOTAL GAGNÉ</span>
          <p className="text-2xl font-black text-emerald-400">1 850,00 €</p>
        </div>
      </div>

      {/* Titre des modules */}
      <div className="pt-4">
        <h2 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
          <span>📁</span> MODULES ET FONCTIONNALITÉS
        </h2>
      </div>

      {/* Grille des modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* CARTE 1 : TABLEAU DE BORD ADMIN (Remplace Offres & Tarifs) */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between min-h-[220px]">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>⚙️</span> Tableau de Bord Admin
              </h3>
              {isAdmin && (
                <span className="bg-amber-500/20 text-amber-400 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-amber-500/30">
                  Super-Admin
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Gestion centralisée du site : modération du forum, actualités, annuaire des créateurs et produits.
            </p>
          </div>

          <div className="pt-4">
            {isAdmin ? (
              <Link
                to="/admin"
                className="block w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black py-3 rounded-xl text-xs uppercase tracking-wider text-center transition cursor-pointer"
              >
                Accéder au Back-Office ↗
              </Link>
            ) : (
              <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
                <span>🔒</span> Contenu Verrouillé
              </div>
            )}
          </div>
        </div>

        {/* CARTE 2 : VENDRE EN DIRECT */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between min-h-[220px]">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>💬</span> Vendre en Direct (Script)
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Accédez à vos scripts de vente et tunnels de négociation client en direct.
            </p>
          </div>

          <div className="pt-4">
            {isElite ? (
              <button className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-3 rounded-xl text-xs uppercase transition cursor-pointer">
                Ouvrir le Module ↗
              </button>
            ) : (
              <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
                <span>🔒</span> Contenu Verrouillé
              </div>
            )}
          </div>
        </div>

        {/* CARTE 3 : MON ENTREPRISE */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between min-h-[220px]">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>📊</span> Mon Entreprise (SIRET & Logo)
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Configurez l'identité légale de votre structure et gérez vos documents.
            </p>
          </div>

          <div className="pt-4">
            {isElite ? (
              <button className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-3 rounded-xl text-xs uppercase transition cursor-pointer">
                Gérer mon Entreprise ↗
              </button>
            ) : (
              <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
                <span>🔒</span> Contenu Verrouillé
              </div>
            )}
          </div>
        </div>

        {/* CARTE 4 : ÉDITEUR TEMPS RÉEL & FACTURES PDF */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between min-h-[220px]">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>📄</span> Éditeur Temps Réel & Factures PDF
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Générez et téléchargez vos devis et factures conformes en quelques clics.
            </p>
          </div>

          <div className="pt-4">
            {isElite ? (
              <button className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-3 rounded-xl text-xs uppercase transition cursor-pointer">
                Créer une Facture ↗
              </button>
            ) : (
              <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
                <span>🔒</span> Contenu Verrouillé
              </div>
            )}
          </div>
        </div>

        {/* CARTE 5 : CRM PROSPECTION & TUNNELS */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between min-h-[220px]">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>👑</span> CRM Prospection & Tunnels
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Pilotez vos opportunités commerciales, vos relances clients et vos dossiers.
            </p>
          </div>

          <div className="pt-4">
            {isElite ? (
              <button className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-3 rounded-xl text-xs uppercase transition cursor-pointer">
                Accéder au CRM ↗
              </button>
            ) : (
              <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
                <span>🔒</span> Contenu Verrouillé
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}