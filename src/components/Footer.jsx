import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const { lang } = useLanguage();
  const isEn = lang === "en";

  return (
    <footer className="bg-neutral-950 border-t border-neutral-900 py-8 px-4 text-neutral-400 text-xs relative z-30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Réseaux Sociaux - Design chic, circulaire, teintes dorées/ambre sans texte */}
        <div className="flex items-center gap-3 bg-neutral-900/80 border border-neutral-800 px-4 py-2 rounded-full">
          
          {/* Instagram */}
          <a
            href="https://instagram.com/bokeone"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="w-8 h-8 rounded-full border border-amber-500/30 bg-neutral-950 flex items-center justify-center text-amber-400 hover:bg-amber-500 hover:text-neutral-950 transition duration-300"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="w-8 h-8 rounded-full border border-amber-500/30 bg-neutral-950 flex items-center justify-center text-amber-400 hover:bg-amber-500 hover:text-neutral-950 transition duration-300"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </a>

          {/* Pinterest */}
          <a
            href="https://fr.pinterest.com/bokeone_photographes/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Pinterest"
            className="w-8 h-8 rounded-full border border-amber-500/30 bg-neutral-950 flex items-center justify-center text-amber-400 hover:bg-amber-500 hover:text-neutral-950 transition duration-300"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.399.165-1.493-.695-2.428-2.875-2.428-4.624 0-3.765 2.737-7.229 7.892-7.229 4.144 0 7.365 2.953 7.365 6.899 0 4.117-2.595 7.431-6.199 7.431-1.209 0-2.346-.628-2.738-1.368l-.746 2.845c-.27 1.045-1.002 2.352-1.493 3.153 1.121.344 2.316.531 3.551.531 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
            </svg>
          </a>

          {/* Facebook */}
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="w-8 h-8 rounded-full border border-amber-500/30 bg-neutral-950 flex items-center justify-center text-amber-400 hover:bg-amber-500 hover:text-neutral-950 transition duration-300"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
            </svg>
          </a>

        </div>

        {/* Liens Juridiques */}
        <div className="flex items-center gap-6 font-medium">
          <Link
            to="/cgu"
            className="hover:text-amber-400 transition cursor-pointer underline-offset-4 hover:underline"
          >
            {isEn ? "Terms & Conditions" : "CGU / CGV"}
          </Link>
          <Link
            to="/cgu"
            className="hover:text-amber-400 transition cursor-pointer underline-offset-4 hover:underline"
          >
            {isEn ? "Legal Mentions" : "Mentions Légales"}
          </Link>
        </div>

        {/* Branding & Crédits */}
        <div className="text-right text-[11px] text-neutral-500 space-y-0.5">
          <p>© {new Date().getFullYear()} Boké One. {isEn ? "All rights reserved." : "Tous droits réservés."}</p>
          <p className="text-amber-500/80 font-medium">Design Quartz & One</p>
        </div>

      </div>
    </footer>
  );
}