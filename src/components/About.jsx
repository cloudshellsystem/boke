import React from "react";
import { useLanguage } from "../context/LanguageContext";

export default function About() {
  const { lang } = useLanguage();
  const isEn = lang === "en";

  return (
    <div className="bg-neutral-950 min-h-screen text-neutral-200 font-sans pb-20 pt-8">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        
        {/* EN-TÊTE ÉPURÉE (Pillule dorée uniquement) */}
        <div className="text-center pt-2">
          <span className="inline-block text-[11px] sm:text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 px-5 py-2 rounded-full font-black uppercase tracking-widest shadow-lg">
            {isEn ? "About Boké One" : "À propos de Boké One"}
          </span>
        </div>

        {/* ENCART STORYTELLING & PRÉSENTATION */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-6 sm:p-10 space-y-6 shadow-2xl backdrop-blur-md">
          
          <div className="space-y-4 text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
            <p>
              Après un constat simple évident que la France regorge de décors incroyables, de rues chargées d'histoire, de monuments iconiques et de domaines d'exception. Pourtant, chaque jour, des entreprises et des créateurs galèrent. Les clients ne trouvent pas les images locales dont ils ont besoin, et les meilleurs talents de nos régions passent trop de temps à chercher des clients ou à se battre avec la paperasse au lieu de créer.
            </p>
            
            <p className="font-semibold text-white">
              Boké One est né sur le terrain, pour briser ce plafond de verre.
            </p>

            <p>
              Nous ne sommes pas une banque d'images de plus. Nous sommes le réseau national qui connecte l'identité de nos territoires aux projets qui en ont besoin. Nous avons conçu cet espace pour être l'allié numéro un de ceux qui font vivre l'image en France.
            </p>

            <p>
              Nous avons décidé pour cette plateforme de ne pas faire de clichés génériques stockés à l'autre bout du monde. Nous mettons en avant la vraie signature visuelle de nos régions, notre population. Que vous soyez un photographe passionné par les oiseaux, un droniste expert en survol de châteaux ou une maquilleuse artistique de talent, Boké One met votre savoir-faire directement sous les yeux des recruteurs.
            </p>

            <p>
              Et comme votre temps est précieux, nous avons éliminé la friction. Boké One intègre un écosystème complet conçu pour booster votre activité, en mettant un tableau de missions pour décrocher des contrats, un outil de gestion pour générer vos devis et factures en deux clics, et une communauté soudée pour échanger sur notre forum ou en direct sur WhatsApp. C'est aujourd'hui la plateforme qu'il vous faut.
            </p>
          </div>

          {/* SIGNATURE */}
          <div className="pt-4 border-t border-neutral-800/60 flex justify-end">
            <span className="text-xs font-bold text-amber-400 italic tracking-wider">
              — L'équipe Boké One
            </span>
          </div>

          {/* CONTACT ADMINISTRATIF */}
          <div className="border-t border-neutral-800/80 pt-8 space-y-4 text-center">
            <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
              {isEn ? "Contact Administration" : "Écrire à l'Administration"}
            </h3>
            <p className="text-xs text-neutral-400 max-w-md mx-auto">
              {isEn
                ? "Questions about memberships, partnerships, or custom requests? Contact us directly."
                : "Une question sur les abonnements, une demande de partenariat ou un besoin spécifique de sélection d'auteurs ? Contactez-nous directement."}
            </p>

            <div className="flex justify-center pt-2">
              <a
                href="mailto:contact@bokeone.com"
                className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider transition shadow-xl inline-flex items-center gap-2 cursor-pointer"
              >
                ✉️ contact@bokeone.com
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}