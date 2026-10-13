import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const FOOTER_TEXT = {
  fr: {
    slogan: "Boké One — Réseau d'élite et banque d'images nationale.",
    rights: "© 2026 Boké One. Tous droits réservés.",
    cgu: "Conditions Générales d'Utilisation (CGU)",
    admin: "Administration",
    support: "Support & Contact",
  },
  en: {
    slogan: "Boké One — Elite network & national image bank.",
    rights: "© 2026 Boké One. All rights reserved.",
    cgu: "Terms of Service (ToS)",
    admin: "Administration",
    support: "Support & Contact",
  },
};

export default function Footer() {
  const { lang } = useLanguage();
  const t = FOOTER_TEXT[lang] || FOOTER_TEXT.fr;

  return (
    <footer className="bg-neutral-950 border-t border-neutral-900 text-neutral-400 py-12 mt-auto">
      <div className="mx-auto max-w-7xl px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Logo / Slogan de bas de page */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-1">
          <span className="text-sm font-bold text-neutral-200">Boké One</span>
          <p className="text-xs text-neutral-500 max-w-sm">{t.slogan}</p>
        </div>

        {/* Liens utiles et légaux */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium">
          <Link to="/cgu" className="hover:text-amber-400 transition">
            {t.cgu}
          </Link>
          <a href="mailto:admin@bokeone.com" className="hover:text-amber-400 transition">
            {t.admin}: admin@bokeone.com
          </a>
          <span className="text-neutral-700">|</span>
          <span className="text-neutral-500">{t.rights}</span>
        </div>

      </div>
    </footer>
  );
}