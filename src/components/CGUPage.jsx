import React from "react";
import { useLanguage } from "../context/LanguageContext";

const CGU_TEXT = {
  fr: {
    badge: "Cadre Juridique & Confiance",
    title: "Conditions Générales d'Utilisation (CGU)",
    lastUpdate: "Dernière mise à jour : Octobre 2026",
    sec1Title: "1. Présentation de la Structure & Édition",
    sec1P1: "La plateforme BOKÉ ONE (réseau d'élite et banque d'images nationale) est éditée et opérée sous le numéro SIRET : 882 507 643 00022 (SIREN : 882 507 643), dédiée aux prestations artistiques, aux cessions de droits d'auteur et à la mise en relation professionnelle.",
    sec1HQ: "Siège administratif & de coordination :",
    sec1Address: "Avenue Louise, 1050 Bruxelles, Belgique.",
    sec1Contact: "Contact officiel :",
    sec1WhatsApp: "Support WhatsApp dédié disponible sur la plateforme.",
    sec2Title: "2. Objet de la Plateforme & Accès Membre",
    sec2Desc: "BOKÉ ONE met en relation des créateurs d'élite (artistes, cinéastes, photographes) et des acheteurs professionnels ou institutionnels (agences, marques). L'accès à certaines sections stratégiques (Espace Pro, tunnels de vente en direct, statistiques de gains) requiert un statut de membre abonné ou validé.",
    sec3Title: "3. Droit au Respect de la Vie Privée & Droit à l'Image",
    sec3Desc: "Chaque créateur/contributeur garantit être titulaire des autorisations d'exploitation du droit à l'image et du droit au respect de la vie privée des personnes, biens ou propriétés privées reconnaissables figurant dans ses œuvres (autorisations de captation, autorisations de vol drone 2026). BOKÉ ONE s'engage à respecter les réglementations sur la protection des données personnelles (RGPD).",
    sec4Title: "4. Propriété Intellectuelle & Cessions de Droits",
    sec4Desc: "Toutes les œuvres exposées sur BOKÉ ONE (banque d'images, clips, prestations) sont protégées par les lois internationales sur la propriété intellectuelle. Les acquisitions de licences (stock numérique) ou les commandes de prestations en salon donnent lieu à une cession de droits encadrée (territoriale, temporelle ou exclusive selon les termes négociés). Toute revente ou utilisation non autorisée est strictement interdite.",
    sec5Title: "5. Transactions, Commissions & Acomptes",
    sec5Desc: "Les transactions réalisées via la plateforme ou validées en salon impliquent un système de commissionnement transparent (15 % prélevés par la structure jusqu'à 100 €, puis 20 % au-delà). Les accords conclus en direct peuvent nécessiter le versement d'un acompte de sécurité (généralement 30 %) pour bloquer les plannings et valider les cessions immédiates.",
    sec6Title: "6. Protection Technique (Basse Résolution, RAW, Filigranes) & Exonération de Responsabilité",
    sec6Desc: "Afin de protéger le travail des créateurs, BOKÉ ONE applique volontairement un affichage en basse résolution et compresse les aperçus sur la plateforme, complétés par des filigranes dynamiques superposés et la désactivation des accès directs au téléchargement. Les œuvres ne sont proposées et délivrées dans leur format d'origine haute définition (RAW, fichiers natifs non compressés, Ultra-HD / 4K) qu'exclusivement lors de la finalisation de l'achat ou du paiement d'une licence valide. L'utilisateur et le créateur reconnaissent qu'aucune technologie web n'est totalement infaillible face aux tentatives d'extraction ou de capture d'écran frauduleuses. BOKÉ ONE ne pourra être tenu responsable des détournements réalisés par des tiers en dehors de son infrastructure, mais collaborera activement à l'identification de toute infraction.",
    sec7Title: "7. Responsabilité & Juridiction",
    sec7Desc: "BOKÉ ONE s'engage à assurer la sécurité des données de ses membres et la fiabilité des outils de mise en relation. En cas de litige, les parties privilégieront une résolution amiable via la conciergerie. À défaut, les tribunaux compétents de Bruxelles (Belgique) seront saisis."
  },
  en: {
    badge: "Legal Framework & Trust",
    title: "Terms of Service (ToS)",
    lastUpdate: "Last updated: October 2026",
    sec1Title: "1. Structure Presentation & Publishing",
    sec1P1: "The BOKÉ ONE platform (elite network & national image bank) is published and operated under SIRET number: 882 507 643 00022 (SIREN: 882 507 643), dedicated to artistic services, copyright transfers, and professional networking.",
    sec1HQ: "Administrative & coordination headquarters:",
    sec1Address: "Avenue Louise, 1050 Brussels, Belgium.",
    sec1Contact: "Official contact:",
    sec1WhatsApp: "Dedicated WhatsApp support available on the platform.",
    sec2Title: "2. Platform Purpose & Member Access",
    sec2Desc: "BOKÉ ONE connects elite creators (artists, filmmakers, photographers) with professional or institutional buyers (agencies, brands). Access to strategic sections (Pro Space, direct sales funnels, earnings statistics) requires subscriber or validated member status.",
    sec3Title: "3. Privacy Rights & Model Release",
    sec3Desc: "Each contributor guarantees possession of all necessary image rights, property releases, and privacy clearances for recognizable individuals or private properties featured in uploaded works (including 2026 drone flight clearances). BOKÉ ONE complies with GDPR personal data protection standards.",
    sec4Title: "4. Intellectual Property & Rights Transfers",
    sec4Desc: "All works showcased on BOKÉ ONE (image bank, video clips, services) are protected by international intellectual property laws. License acquisitions (digital stock) or event service bookings entail structured rights assignments (territorial, time-bound, or exclusive according to negotiated terms). Any unauthorized resale or use is strictly prohibited.",
    sec5Title: "5. Transactions, Commissions & Deposits",
    sec5Desc: "Transactions completed via the platform or validated on-site involve a transparent commission structure (15% platform fee up to €100, then 20% beyond). Direct agreements may require a security deposit (typically 30%) to lock schedules and confirm immediate transfers.",
    sec6Title: "6. Technical Protection (Low Resolution, RAW Files, Watermarks) & Limitation of Liability",
    sec6Desc: "To protect creators' work, BOKÉ ONE intentionally displays content in low resolution and compressed preview formats across the platform, combined with overlaid dynamic watermarks and disabled direct downloads. Original high-definition files (RAW, uncompressed native assets, Ultra-HD / 4K) are exclusively provided upon full purchase completion or payment of a valid license. Users and creators acknowledge that no web technology is completely immune to fraudulent extraction or screenshots. BOKÉ ONE cannot be held liable for third-party unauthorized captures outside its infrastructure, but will actively assist in identifying infringements.",
    sec7Title: "7. Liability & Jurisdiction",
    sec7Desc: "BOKÉ ONE is committed to ensuring member data security and networking tool reliability. In the event of a dispute, parties will prioritize an amicable resolution through conciergence. Otherwise, competent courts in Brussels (Belgium) shall have jurisdiction."
  }
};

export default function CGUPage() {
  const { lang } = useLanguage();
  const t = CGU_TEXT[lang];

  return (
    <main className="mx-auto w-full max-w-4xl bg-neutral-950 p-6 sm:p-12 text-neutral-300 min-h-screen font-sans space-y-8">
      <header className="border-b border-neutral-800 pb-6">
        <span className="text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
          {t.badge}
        </span>
        <h1 className="text-3xl font-black text-amber-400 mt-2">{t.title}</h1>
        <p className="text-xs text-neutral-400 mt-1">{t.lastUpdate}</p>
      </header>

      <section className="space-y-6 text-xs sm:text-sm leading-relaxed">
        <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl space-y-3">
          <h2 className="text-base font-bold text-amber-400">{t.sec1Title}</h2>
          <p>{t.sec1P1}</p>
          <p className="text-neutral-400">
            <strong>{t.sec1HQ}</strong> {t.sec1Address}
            <br />
            <strong>{t.sec1Contact}</strong> contact@boke-one.com | {t.sec1WhatsApp}
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-bold text-amber-400">{t.sec2Title}</h2>
          <p>{t.sec2Desc}</p>
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-bold text-amber-400">{t.sec3Title}</h2>
          <p>{t.sec3Desc}</p>
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-bold text-amber-400">{t.sec4Title}</h2>
          <p>{t.sec4Desc}</p>
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-bold text-amber-400">{t.sec5Title}</h2>
          <p>{t.sec5Desc}</p>
        </div>

        <div className="bg-neutral-900/60 border border-neutral-800 p-5 rounded-2xl space-y-3">
          <h2 className="text-base font-bold text-amber-400">{t.sec6Title}</h2>
          <p className="text-neutral-300">{t.sec6Desc}</p>
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-bold text-amber-400">{t.sec7Title}</h2>
          <p>{t.sec7Desc}</p>
        </div>
      </section>
    </main>
  );
}