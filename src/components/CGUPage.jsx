import React from "react";

export default function CGUPage() {
  return (
    <main className="mx-auto w-full max-w-4xl bg-neutral-950 p-6 sm:p-12 text-neutral-300 min-h-screen font-sans space-y-8">
      <header className="border-b border-neutral-800 pb-6">
        <span className="text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
          Cadre Juridique & Confiance
        </span>
        <h1 className="text-3xl font-black text-amber-400 mt-2">Conditions Générales d'Utilisation (CGU)</h1>
        <p className="text-xs text-neutral-400 mt-1">Dernière mise à jour : Octobre 2026</p>
      </header>

      <section className="space-y-6 text-xs sm:text-sm leading-relaxed">
        <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl space-y-3">
          <h2 className="text-base font-bold text-amber-400">1. Présentation de la Structure & Édition</h2>
          <p>
            La plateforme <strong>BOKÉ ONE</strong> (réseau d'élite et banque d'images nationale) est actuellement opérée sous un format d'association à vocation communautaire et culturelle, en transition programmée vers une structure de répartition de droits d'auteur et de prestations.
          </p>
          <p className="text-neutral-400">
            <strong>Siège administratif & de coordination :</strong> Avenue Louise, 1050 Bruxelles, Belgique.
            <br />
            <strong>Contact officiel :</strong> contact@boke-one.com | Support WhatsApp dédié disponible sur la plateforme.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-bold text-amber-400">2. Objet de la Plateforme & Accès Membre</h2>
          <p>
            BOKÉ ONE met en relation des créateurs d'élite (artistes, cinéastes, photographes) et des acheteurs professionnels ou institutionnels (agences, marques). L'accès à certaines sections stratégiques (Espace Pro, tunnels de vente en direct, statistiques de gains) requiert un statut de membre abonné ou validé.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-bold text-amber-400">3. Propriété Intellectuelle & Cessions de Droits</h2>
          <p>
            Toutes les œuvres exposées sur BOKÉ ONE (banque d'images, clips, prestations) sont protégées par les lois internationales sur la propriété intellectuelle. Les acquisitions de licences (stock numérique) ou les commandes de prestations en salon donnent lieu à une cession de droits encadrée (territoriale, temporelle ou exclusive selon les termes négociés). Toute revente ou utilisation non autorisée est strictement interdite.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-bold text-amber-400">4. Transactions, Commissions & Acomptes</h2>
          <p>
            Les transactions réalisées via la plateforme ou validées en salon impliquent un système de commissionnement transparent (15 % prélevés par la structure jusqu'à 100 €, puis 20 % au-delà). Les accords conclus en direct peuvent nécessiter le versement d'un acompte de sécurité (généralement 30 %) pour bloquer les plannings et valider les cessions immédiates.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-bold text-amber-400">5. Responsabilité & Juridiction</h2>
          <p>
            BOKÉ ONE s'engage à assurer la sécurité des données de ses membres et la fiabilité des outils de mise en relation. En cas de litige, les parties privilégieront une résolution amiable via la conciergerie. À défaut, les tribunaux compétents de Bruxelles (Belgique) seront saisis.
          </p>
        </div>
      </section>
    </main>
  );
}