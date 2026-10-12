import React from "react";
import { useLanguage } from "../context/LanguageContext";

export default function About() {
  const { lang } = useLanguage();
  const isEn = lang === "en";

  return (
    <div className="bg-neutral-950 min-h-screen text-neutral-200 font-sans pb-20 pt-10">
      <div className="max-w-5xl mx-auto px-4 space-y-12">
        
        {/* En-tête style Hub Centralisé */}
        <div className="text-center space-y-4">
          <span className="text-[10px] bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
            {isEn ? "The National Network" : "Le Réseau National"}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {isEn ? "About Boké One" : "À propos de Boké One"}
          </h1>
          <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full mt-2"></div>
        </div>

        {/* Bloc Contenu Stylisé */}
        <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 backdrop-blur-md">
          
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-amber-400 flex items-center gap-2">
              <span>⚡</span> {isEn ? "An Elite Vision for Creation" : "Une vision d'élite de la création"}
            </h3>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
              {isEn
                ? "Boké One stands as the premier national network and image bank, designed to unite the most talented creators, directors, and photographers. We bridge the gap between elite visual artists and ambitious projects requiring uncompromising quality."
                : "Boké One s'impose comme le réseau d'élite et la banque d'images nationale de référence, conçue pour rassembler les créateurs, réalisateurs et photographes les plus talentueux. Nous faisons le lien entre des artistes visuels d'exception et des projets exigeants en quête d'une qualité sans compromis."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-800">
            <div className="bg-neutral-950/60 border border-neutral-800/60 p-6 rounded-2xl space-y-3">
              <span className="text-2xl">🎯</span>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                {isEn ? "Rigorous Standards" : "Exigence et Rigueur"}
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {isEn
                  ? "Every portfolio hosted on our platform undergoes careful curation to guarantee professional excellence across all visual mediums."
                  : "Chaque portfolio hébergé sur notre plateforme fait l'objet d'une sélection rigoureuse afin de garantir l'excellence professionnelle sur tous les supports visuels."}
              </p>
            </div>

            <div className="bg-neutral-950/60 border border-neutral-800/60 p-6 rounded-2xl space-y-3">
              <span className="text-2xl">🛡️</span>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                {isEn ? "Secure Collaboration" : "Collaboration Sécurisée"}
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {isEn
                  ? "A centralized ecosystem built for direct exchanges, transparent pricing, and streamlined administrative workflows."
                  : "Un écosystème centralisé pensé pour fluidifier les échanges, sécuriser les transactions et simplifier les démarches administratives des professionnels."}
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}