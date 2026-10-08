import React from "react";

export default function Footer({ onNavigate }) {
  return (
    <footer className="w-full bg-neutral-950 border-t border-neutral-900 text-neutral-400 py-10 px-6 sm:px-12 font-sans mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Colonne 1 : Identité & Confiance */}
        <div className="space-y-2">
          <h3 className="text-sm font-black text-amber-400 tracking-wider uppercase">BOKÉ ONE</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Réseau d'élite & Banque d'images nationale. Plateforme de mise en relation exclusive pour créateurs et professionnels.
          </p>
          <p className="text-[11px] text-neutral-500">
            Coopération administrative : Avenue Louise, 1050 Bruxelles, Belgique.
          </p>
        </div>

        {/* Colonne 2 : Cadre Légal & Confiance */}
        <div className="space-y-2 md:text-right">
          <h4 className="text-xs font-bold text-neutral-200 uppercase tracking-wider">Cadre Légal</h4>
          <ul className="space-y-1 text-xs">
            <li>
              <button onClick={() => onNavigate && onNavigate("cgu")} className="hover:text-amber-400 transition text-neutral-400">
                Conditions Générales (CGU / CGV)
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate && onNavigate("mentions")} className="hover:text-amber-400 transition text-neutral-400">
                Mentions Légales & Statut
              </button>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t border-neutral-900/60 mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500">
        <p>© 2026 BOKÉ ONE. Association en transition vers une structure de répartition.</p>
        <p className="mt-1 sm:mt-0 text-amber-500/80 font-medium">Design Quartz & Or ⚡</p>
      </div>
    </footer>
  );
}