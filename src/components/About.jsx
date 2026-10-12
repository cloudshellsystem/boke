import React from 'react';

export default function AboutPage() {
  return (
    <div className="bg-neutral-950 min-h-screen py-16 px-6 font-sans text-neutral-200">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* En-tête */}
        <div className="text-center space-y-4">
          <span className="text-amber-400 text-xs font-bold uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
            Storytelling & Vision
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white">
            Boké One : Le Hub Centralisé des Créateurs Visuels
          </h1>
          <p className="text-neutral-400 text-base max-w-2xl mx-auto">
            La solution tout-en-un qui simplifie la vie des photographes et fait gagner du temps aux acheteurs d'images professionnels.
          </p>
        </div>

        {/* Le Constat */}
        <div className="bg-neutral-900/50 border border-neutral-800 p-8 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold text-amber-400">Le Constat : Un workflow trop fragmenté</h2>
          <p className="text-sm text-neutral-300 leading-relaxed">
            Aujourd'hui, un photographe ou un vidéaste professionnel passe une part considérable de son temps à naviguer entre une multitude d'outils isolés : <strong>Imagen AI</strong> pour le tri et le pré-traité, <strong>Lightroom</strong> pour le développement, <strong>Pixieset</strong> pour la livraison de galeries, des services de transfert pour les gros fichiers, et un logiciel tiers pour ses devis et factures.
          </p>
          <p className="text-sm text-neutral-300 leading-relaxed">
            Côté acheteurs (directeurs artistiques de magazines comme <em>PHOTO</em> ou <em>Polka</em>, responsables de réseaux comme <em>PHOX</em>, agences), la recherche de talents est fastidieuse : Instagram manque de filtres professionnels, de prix clairs et d'un accès immédiat aux portfolios exploitables en basse résolution.
          </p>
        </div>

        {/* La Mission Boké One */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-neutral-900/30 border border-neutral-800 p-6 rounded-2xl space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>📷</span> Pour les Artistes & Photographes
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Un Book Pro certifié et prêt à prospecter. Présentez vos séries pour des concours (comme <em>Polka</em>) ou vos clients en un lien unique, gérez vos devis et factures, et suivez vos statistiques sur une seule et même plateforme.
            </p>
          </div>

          <div className="bg-neutral-900/30 border border-neutral-800 p-6 rounded-2xl space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🎯</span> Pour les Acheteurs & Agences
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Consultez des fiches fluides et synthétiques en basse résolution. Filtrez instantanément par spécialité métier (Packshot, Mode, Reportage, Drone), accédez à une grille tarifaire transparente et réservez en direct.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}