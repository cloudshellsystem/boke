import React from "react";
import { useLanguage } from "../context/LanguageContext";

/* ------------------------------------------------------------------
   PALETTE BOKEH (RGB) : ambre, champagne, or profond, reflet quartz
------------------------------------------------------------------- */
const AMBER = "251,191,36";
const GOLD = "245,158,11";
const CHAMPAGNE = "253,230,138";
const QUARTZ = "147,170,255";

/* Halo diffus : grandes lueurs d'ambiance, très floues */
const halo = (rgb, a) =>
  `radial-gradient(circle at 50% 50%, rgba(${rgb},${a}) 0%, rgba(${rgb},${a * 0.45}) 40%, transparent 70%)`;

/* Disque bokeh : centre doux + anneau plus lumineux sur le bord
   (comme le vrai bokeh d'un objectif à grande ouverture) */
const disc = (rgb, a) =>
  `radial-gradient(circle at 50% 50%, rgba(${rgb},${a * 0.45}) 0%, rgba(${rgb},${a * 0.7}) 62%, rgba(${rgb},${a * 1.2}) 80%, rgba(${rgb},0) 83%)`;

/* Configuration des orbs :
   s = taille (clamp responsive), x/y = position, b = classe blur,
   d = durée animation (s), dl = délai (s) */
const ORBS = [
  // --- Grandes lueurs d'ambiance ---
  { s: "clamp(320px,55vw,640px)", x: "-12%", y: "-8%",  bg: halo(AMBER, 0.28),   b: "blur-3xl", d: 22, dl: 0 },
  { s: "clamp(280px,48vw,560px)", x: "62%",  y: "18%",  bg: halo(QUARTZ, 0.2),   b: "blur-3xl", d: 26, dl: -6 },
  { s: "clamp(300px,52vw,600px)", x: "18%",  y: "68%",  bg: halo(GOLD, 0.22),    b: "blur-3xl", d: 24, dl: -3 },
  { s: "clamp(220px,36vw,420px)", x: "78%",  y: "76%",  bg: halo(QUARTZ, 0.16),  b: "blur-3xl", d: 28, dl: -10 },

  // --- Disques bokeh (avec anneau lumineux) ---
  { s: "clamp(70px,11vw,150px)",  x: "8%",   y: "22%",  bg: disc(AMBER, 0.3),     b: "blur-[2px]", d: 14, dl: -2 },
  { s: "clamp(40px,6vw,80px)",    x: "24%",  y: "8%",   bg: disc(CHAMPAGNE, 0.28), b: "blur-[1px]", d: 11, dl: -5 },
  { s: "clamp(90px,14vw,190px)",  x: "82%",  y: "6%",   bg: disc(GOLD, 0.24),     b: "blur-sm",    d: 17, dl: -7 },
  { s: "clamp(50px,7vw,100px)",   x: "70%",  y: "42%",  bg: disc(QUARTZ, 0.22),   b: "blur-[2px]", d: 13, dl: -1 },
  { s: "clamp(60px,9vw,120px)",   x: "4%",   y: "52%",  bg: disc(CHAMPAGNE, 0.24), b: "blur-sm",    d: 16, dl: -9 },
  { s: "clamp(34px,5vw,64px)",    x: "90%",  y: "62%",  bg: disc(AMBER, 0.3),     b: "blur-[1px]", d: 10, dl: -4 },
  { s: "clamp(80px,12vw,170px)",  x: "46%",  y: "86%",  bg: disc(GOLD, 0.22),     b: "blur-sm",    d: 19, dl: -8 },
  { s: "clamp(44px,6vw,90px)",    x: "14%",  y: "88%",  bg: disc(QUARTZ, 0.2),    b: "blur-[2px]", d: 12, dl: -6 },
];

export default function About() {
  const { lang } = useLanguage();
  const isEn = lang === "en";

  return (
    <div className="relative isolate overflow-hidden bg-neutral-950 min-h-screen text-neutral-200 font-sans pb-20 pt-8">
      {/* Animation légère (transform/opacity uniquement = GPU, très fluide) */}
      <style>{`
        @keyframes bokeh-drift {
          0%   { transform: translate3d(0, 0, 0) scale(1);       opacity: .85; }
          50%  { transform: translate3d(10px, -22px, 0) scale(1.06); opacity: 1; }
          100% { transform: translate3d(0, 0, 0) scale(1);       opacity: .85; }
        }
        .bokeh-orb { animation: bokeh-drift var(--d) ease-in-out var(--dl) infinite; will-change: transform, opacity; }
        @media (prefers-reduced-motion: reduce) {
          .bokeh-orb { animation: none; }
        }
      `}</style>

      {/* ============ COUCHE BOKEH (arrière-plan) ============ */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        {ORBS.map((o, i) => (
          <div
            key={i}
            className={`bokeh-orb absolute rounded-full ${o.b}`}
            style={{
              width: o.s,
              height: o.s,
              left: o.x,
              top: o.y,
              background: o.bg,
              "--d": `${o.d}s`,
              "--dl": `${o.dl}s`,
            }}
          />
        ))}

        {/* Vignettage : assombrit les bords/centre pour garantir la lisibilité */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,10,10,0.55)_0%,rgba(10,10,10,0.25)_55%,rgba(10,10,10,0.7)_100%)]" />

        {/* Voile de profondeur haut/bas */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/40 via-transparent to-neutral-950/60" />
      </div>

      {/* ============ CONTENU (premier plan) ============ */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 space-y-8">
        
        {/* EN-TÊTE ÉPURÉE (Pillule dorée uniquement) */}
        <div className="text-center pt-2">
          <span className="inline-block text-[11px] sm:text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 px-5 py-2 rounded-full font-black uppercase tracking-widest shadow-lg backdrop-blur-sm">
            {isEn ? "About Boké One" : "À propos de Boké One"}
          </span>
        </div>

        {/* ENCART STORYTELLING & PRÉSENTATION */}
        <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-3xl p-6 sm:p-10 space-y-6 shadow-2xl shadow-black/50 backdrop-blur-md">
          
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
                className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider transition shadow-xl shadow-amber-500/20 inline-flex items-center gap-2 cursor-pointer"
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