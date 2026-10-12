import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function About() {
  const { lang } = useLanguage();
  const isEn = lang === "en";

  return (
    <div className="bg-neutral-950 min-h-screen text-neutral-200 font-sans pb-20 pt-8">
      <div className="max-w-4xl mx-auto px-4 space-y-10">
        
        {/* EN-TÊTE SOBRE & ÉPURÉE */}
        <div className="text-center space-y-3">
          <span className="inline-block text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full font-bold uppercase tracking-widest">
            {isEn ? "THE NATIONAL NETWORK" : "LE RÉSEAU NATIONAL"}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {isEn ? "About Boké One" : "À propos de Boké One"}
          </h1>
        </div>

        {/* CONTENU PRINCIPAL DE PRÉSENTATION */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl">
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            {isEn
              ? "Boké One stands as a national network and image bank, designed to connect talented photographers, directors, and visual creators with demanding buyers and projects seeking uncompromising quality."
              : "Boké One s'impose comme le réseau et la banque d'images nationale de référence, conçue pour rassembler les créateurs, photographes et artistes visuels les plus talentueux. Nous faisons le lien entre des signatures visuelles d'exception et des projets exigeants en quête d'une qualité sans compromis."}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800 space-y-2">
              <span className="text-xl">🎯</span>
              <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                {isEn ? "EXCELLENCE & CURATION" : "EXIGENCE ET RIGUEUR"}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {isEn
                  ? "Every portfolio hosted on our platform is carefully reviewed to guarantee professional excellence across all visual mediums."
                  : "Chaque portfolio hébergé sur notre plateforme fait l'objet d'une sélection rigoureuse afin de garantir l'excellence professionnelle sur tous les supports visuels."}
              </p>
            </div>

            <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800 space-y-2">
              <span className="text-xl">🛡️</span>
              <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                {isEn ? "SECURE COLLABORATION" : "COLLABORATION SÉCURISÉE"}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {isEn
                  ? "A centralized ecosystem built to streamline communications, secure transactions, and simplify administrative processes for buyers and creators."
                  : "Un écosystème centralisé pensé pour fluidifier les échanges, sécuriser les transactions et simplifier les démarches administratives des professionnels."}
              </p>
            </div>
          </div>

          {/* FORMULAIRE / CONTACT DIRECT ADMIN */}
          <div className="border-t border-neutral-800/80 pt-8 space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider text-center">
              {isEn ? "Contact Administration" : "Écrire à l'Administration"}
            </h3>
            <p className="text-xs text-neutral-400 text-center max-w-md mx-auto">
              {isEn
                ? "Questions about memberships, partnership requests, or custom curation? Contact us directly."
                : "Une question sur les abonnements, une demande de partenariat ou un besoin spécifique de sélection d'auteurs ? Contactez-nous directement."}
            </p>

            <div className="flex justify-center pt-2">
              <a
                href="mailto:kultordi@gmail.com"
                className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider transition shadow-xl inline-flex items-center gap-2"
              >
                ✉️ kultordi@gmail.com
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}