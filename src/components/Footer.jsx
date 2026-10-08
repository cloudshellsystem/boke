import React from "react";

export default function Footer({ onNavigate }) {
  return (
    <footer className="w-full bg-neutral-950 border-t border-neutral-900 text-neutral-400 py-10 px-6 sm:px-12 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        {/* Colonne 1 : Identité & Confiance */}
        <div className="space-y-3">
          <h3 className="text-sm font-black text-amber-400 tracking-wider uppercase">BOKÉ ONE</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Réseau d'élite & Banque d'images nationale. Plateforme de mise en relation exclusive pour créateurs et professionnels, axée sur la performance et la conversion.
          </p>
          <p className="text-[11px] text-neutral-400">
            Coopération administrative : Avenue Louise, 1050 Bruxelles, Belgique.
          </p>
        </div>

        {/* Colonne 2 : Liens Stratégiques & Connexions */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-neutral-200 uppercase tracking-wider">Connecteurs & Réseau</h4>
          <div className="flex flex-wrap gap-3 text-xs">
            <a 
              href="https://wa.me/32400000000" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>💬</span> WhatsApp Direct
            </a>
            <span className="text-neutral-700">•</span>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>💼</span> LinkedIn Pro
            </a>
            <span className="text-neutral-700">•</span>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>👥</span> Facebook
            </a>
          </div>
        </div>

        {/* Colonne 3 : Mentions Légales & CGU */}
        <div className="space-y-3 md:text-right">
          <h4 className="text-xs font-bold text-neutral-200 uppercase tracking-wider">Cadre Légal & Confiance</h4>
          <ul className="space-y-1.5 text-xs">
            <li>
              <button 
                onClick={() => onNavigate && onNavigate("cgv")} 
                className="hover:text-amber-400 transition"
              >
                Conditions Générales (CGU / CGV)
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate && onNavigate("mentions")} 
                className="hover:text-amber-400 transition"
              >
                Mentions Légales & Statut
              </button>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t border-neutral-900 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-400">
        <p>© 2026 BOKÉ ONE. Tous droits réservés. Association en transition vers une structure de répartition.</p>
        <p className="mt-2 sm:mt-0 text-amber-500/80 font-medium">Design Quartz & Or ⚡</p>
      </div>
    </footer>
  );
}