import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../supabaseClient"; // ⚠️ ASSOMPTION structure : src/supabaseClient.js et ce fichier dans src/components/

// ─────────────────────────────────────────────────────────────
// À RENSEIGNER AVANT TOUTE PUBLICITÉ (données personnelles collectées) :
const PRIVACY_URL = ""; // ex: "https://bokeone-zeta.vercel.app/confidentialite"
const LEGAL_URL = "";   // ex: page des mentions légales
// Tant que ces URLs sont vides, aucun lien fantôme n'est affiché.
// ─────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "portrait-corporate", emoji: "💼", label: "Portrait Corporate", desc: "LinkedIn, entreprises, personal branding" },
  { id: "evenementiel", emoji: "📅", label: "Événementiel", desc: "Soirées, séminaires, concerts, cocktails" },
  { id: "contenu", emoji: "🎬", label: "Réalisation de contenu", desc: "Vidéos réseaux sociaux, clips, reels" },
  { id: "mariage-naissance", emoji: "💍", label: "Mariage & Naissance", desc: "Immortalisez vos plus beaux moments de vie" },
];

const TIMINGS = [
  { value: "urgent", label: "Urgent (moins de 7 jours)" },
  { value: "ce-mois-ci", label: "Ce mois-ci" },
  { value: "prochains-mois", label: "Dans les prochains mois" },
  { value: "non-defini", label: "Date pas encore définie" },
];

const BUDGETS = [
  { value: "", label: "Budget indicatif (optionnel)" },
  { value: "lt-200", label: "Moins de 200 €" },
  { value: "200-500", label: "200 – 500 €" },
  { value: "500-1000", label: "500 – 1 000 €" },
  { value: "gt-1000", label: "Plus de 1 000 €" },
  { value: "non-defini", label: "Je ne sais pas encore" },
];

const VALID_CATS = [...CATEGORIES.map((c) => c.id), "autre"];

function readTracking() {
  try {
    const p = new URLSearchParams(window.location.search);
    const clean = (v) => (v ? v.slice(0, 100) : null);
    return {
      utm_source: clean(p.get("utm_source")),
      utm_medium: clean(p.get("utm_medium")),
      utm_campaign: clean(p.get("utm_campaign")),
      cat: p.get("cat"),
    };
  } catch {
    return { utm_source: null, utm_medium: null, utm_campaign: null, cat: null };
  }
}

const EMPTY_FORM = {
  category: "",
  city: "",
  timing: "",
  budget: "",
  description: "",
  contact_name: "",
  contact_email: "",
  contact_phone: "",
  consent: false,
  website: "", // honeypot anti-robots (doit rester vide)
};

export default function HomePage({ onNavigate, requestSignal }) {
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | success
  const [error, setError] = useState("");
  const tracking = useRef(readTracking());

  // Pré-sélection via lien de pub : ?cat=mariage-naissance&utm_source=instagram
  useEffect(() => {
    const c = tracking.current.cat;
    if (c && VALID_CATS.includes(c)) setForm((f) => ({ ...f, category: c }));
  }, []);

  // Ouverture depuis le bouton du header (App.jsx)
  useEffect(() => {
    if (requestSignal && requestSignal.count > 0) openForm(requestSignal.cat || undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestSignal?.count]);

  // Verrou du scroll + touche Echap quand le formulaire est ouvert
  useEffect(() => {
    if (!formOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setFormOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [formOpen]);

  function openForm(catId) {
    setError("");
    setStatus("idle");
    if (catId) setForm((f) => ({ ...f, category: catId }));
    setFormOpen(true);
  }

  function setField(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Honeypot : un robot remplit ce champ caché -> on simule le succès sans rien enregistrer
    if (form.website) {
      setStatus("success");
      return;
    }

    const desc = form.description.trim();
    const name = form.contact_name.trim();
    const city = form.city.trim();
    const email = form.contact_email.trim();

    if (!form.category || !form.timing) return setError("Merci de choisir un type de besoin et une échéance.");
    if (city.length < 2) return setError("Merci d'indiquer une ville.");
    if (desc.length < 10) return setError("Décrivez votre besoin en quelques mots (10 caractères minimum).");
    if (name.length < 2) return setError("Merci d'indiquer votre prénom.");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setError("Adresse e-mail invalide.");
    if (!form.consent) return setError("Merci d'accepter l'utilisation de vos informations pour être mis en relation.");

    // Limitation basique côté navigateur (la vraie protection anti-spam demandera un captcha côté serveur)
    try {
      const last = Number(localStorage.getItem("bo_last_request") || 0);
      if (Date.now() - last < 60000) {
        return setError("Vous venez de déposer un besoin. Patientez une minute avant d'en déposer un autre.");
      }
    } catch {
      /* stockage indisponible : on continue */
    }

    setSubmitting(true);
    const t = tracking.current;
    const payload = {
      category: form.category,
      city,
      timing: form.timing,
      budget: form.budget || null,
      description: desc,
      contact_name: name,
      contact_email: email,
      contact_phone: form.contact_phone.trim() || null,
      consent: true,
      utm_source: t.utm_source,
      utm_medium: t.utm_medium,
      utm_campaign: t.utm_campaign,
    };

    // Pas de .select() : la table n'autorise que l'insertion pour le public
    const { error: dbError } = await supabase.from("requests").insert([payload]);
    setSubmitting(false);

    if (dbError) {
      console.error("Erreur dépôt de besoin :", dbError);
      setError("Une erreur est survenue. Réessayez dans un instant.");
      return;
    }

    try {
      localStorage.setItem("bo_last_request", String(Date.now()));
    } catch {
      /* ignoré */
    }
    setStatus("success");
    setForm({ ...EMPTY_FORM });
  }

  return (
    <div className="bo-home">
      <style>{CSS}</style>

      {/* ───────── 1. ABOVE THE FOLD ───────── */}
      <section className="bo-hero">
        <p className="bo-eyebrow">📍 Île-de-France · Photographes, vidéastes & créatifs</p>
        <h1 className="bo-h1">Trouvez un photographe ou un vidéaste en Île-de-France.</h1>
        <p className="bo-sub">
          Portrait corporate, événementiel, contenu vidéo, mariage &amp; naissance.
          Décrivez votre besoin en 2 minutes : nous vous mettons en relation avec un créatif adapté.
        </p>

        <button type="button" className="bo-cta" onClick={() => openForm()}>
          ＋ Déposer un besoin <span className="bo-cta-free">C'est gratuit</span>
        </button>

        <p className="bo-micro">Gratuit et sans engagement · Vos coordonnées ne sont pas publiées</p>

        <button type="button" className="bo-link" onClick={() => onNavigate("creatifs")}>
          Vous êtes photographe, vidéaste ou modèle ? Rejoignez l'annuaire →
        </button>
      </section>

      {/* ───────── 2. CATÉGORIES ───────── */}
      <section className="bo-section" aria-labelledby="bo-cats-title">
        <h2 id="bo-cats-title" className="bo-h2">Quel est votre besoin ?</h2>
        <div className="bo-grid">
          {CATEGORIES.map((c) => (
            <button key={c.id} type="button" className="bo-card" onClick={() => openForm(c.id)}>
              <span className="bo-card-emoji" aria-hidden="true">{c.emoji}</span>
              <span className="bo-card-title">{c.label}</span>
              <span className="bo-card-desc">{c.desc}</span>
              <span className="bo-card-go">Déposer ce besoin →</span>
            </button>
          ))}
        </div>
        <p className="bo-other">
          Autre besoin (modèle, décor, retouche…) ?{" "}
          <button type="button" className="bo-inline" onClick={() => openForm("autre")}>
            Décrivez-le-nous
          </button>
        </p>
      </section>

      {/* ───────── 3. COMMENT ÇA MARCHE ───────── */}
      <section className="bo-section" aria-labelledby="bo-how-title">
        <h2 id="bo-how-title" className="bo-h2">Comment ça marche</h2>
        <div className="bo-grid bo-steps">
          <div className="bo-step"><span className="bo-num">1</span><strong>Décrivez votre besoin</strong><p>Type de prestation, ville, échéance : quelques champs suffisent.</p></div>
          <div className="bo-step"><span className="bo-num">2</span><strong>Nous identifions un créatif adapté</strong><p>Nous étudions votre demande et sollicitons les profils de l'annuaire qui correspondent.</p></div>
          <div className="bo-step"><span className="bo-num">3</span><strong>Vous échangez et choisissez</strong><p>Vous êtes mis en relation puis décidez librement avec qui travailler.</p></div>
        </div>
      </section>

      {/* ───────── 4. CÔTÉ CRÉATIFS ───────── */}
      <section className="bo-section bo-band">
        <h2 className="bo-h2">Vous êtes créatif ?</h2>
        <p className="bo-band-text">
          Photographe, vidéaste, modèle, plasticien, peintre, décorateur… Référencez votre activité
          et soyez trouvé par des personnes qui ont un besoin concret.
          Les premiers créatifs inscrits obtiennent le statut <strong>Membre Fondateur</strong> (badge et conditions privilégiées).
        </p>
        <button type="button" className="bo-btn-secondary" onClick={() => onNavigate("creatifs")}>
          Rejoindre l'annuaire
        </button>
      </section>

      {/* ───────── 5. PORTFOLIOS ───────── */}
      <section className="bo-section bo-band">
        <h2 className="bo-h2">Explorer les portfolios</h2>
        <p className="bo-band-text">Découvrez le travail des créatifs de la communauté, likez, échangez ou contactez l'auteur.</p>
        <button type="button" className="bo-btn-secondary" onClick={() => onNavigate("gallery")}>
          🖼️ Voir la galerie
        </button>
      </section>

      {/* ───────── PIED DE PAGE ───────── */}
      <footer className="bo-footer">
        <span>© Boke One · Île-de-France</span>
        <span> · <a href="mailto:contact@bokeone.com">contact@bokeone.com</a></span>
        {LEGAL_URL && <span> · <a href={LEGAL_URL}>Mentions légales</a></span>}
        {PRIVACY_URL && <span> · <a href={PRIVACY_URL}>Confidentialité</a></span>}
      </footer>

      {/* ───────── FORMULAIRE DE DÉPÔT DE BESOIN (modale) ───────── */}
      {formOpen && (
        <div
          className="bo-overlay"
          onMouseDown={(e) => e.target === e.currentTarget && setFormOpen(false)}
        >
          <div className="bo-modal" role="dialog" aria-modal="true" aria-labelledby="bo-form-title">
            <button type="button" className="bo-close" onClick={() => setFormOpen(false)} aria-label="Fermer">✕</button>

            {status === "success" ? (
              <div className="bo-success">
                <div style={{ fontSize: 44 }}>✅</div>
                <h3 className="bo-form-title">Votre besoin est enregistré</h3>
                <p>
                  Nous l'étudions et revenons vers vous par e-mail (ou par téléphone si vous l'avez indiqué)
                  dès qu'un créatif correspondant est identifié.
                </p>
                <button type="button" className="bo-cta bo-cta-small" onClick={() => setFormOpen(false)}>Fermer</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <h3 id="bo-form-title" className="bo-form-title">Déposer un besoin</h3>
                <p className="bo-form-sub">Gratuit · sans engagement · quelques champs seulement.</p>

                <label className="bo-label">Type de besoin *
                  <select className="bo-input" value={form.category} onChange={(e) => setField("category", e.target.value)} required>
                    <option value="">Choisir…</option>
                    {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
                    <option value="autre">Autre besoin</option>
                  </select>
                </label>

                <div className="bo-row">
                  <label className="bo-label">Ville *
                    <input className="bo-input" type="text" placeholder="Paris, Saint-Denis, Versailles…" value={form.city} onChange={(e) => setField("city", e.target.value)} maxLength={100} />
                  </label>
                  <label className="bo-label">Pour quand ? *
                    <select className="bo-input" value={form.timing} onChange={(e) => setField("timing", e.target.value)}>
                      <option value="">Choisir…</option>
                      {TIMINGS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </label>
                </div>

                <label className="bo-label">Votre besoin en quelques mots *
                  <textarea className="bo-input" rows={4} placeholder="Ex : reportage photo pour un séminaire de 80 personnes, le 14 à Nanterre, livraison sous 3 jours…" value={form.description} onChange={(e) => setField("description", e.target.value)} maxLength={2000} />
                </label>

                <label className="bo-label">Budget indicatif
                  <select className="bo-input" value={form.budget} onChange={(e) => setField("budget", e.target.value)}>
                    {BUDGETS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
                  </select>
                </label>

                <div className="bo-row">
                  <label className="bo-label">Prénom *
                    <input className="bo-input" type="text" autoComplete="given-name" value={form.contact_name} onChange={(e) => setField("contact_name", e.target.value)} maxLength={100} />
                  </label>
                  <label className="bo-label">E-mail *
                    <input className="bo-input" type="email" autoComplete="email" value={form.contact_email} onChange={(e) => setField("contact_email", e.target.value)} maxLength={200} />
                  </label>
                </div>

                <label className="bo-label">Téléphone (optionnel, utile si c'est urgent)
                  <input className="bo-input" type="tel" autoComplete="tel" value={form.contact_phone} onChange={(e) => setField("contact_phone", e.target.value)} maxLength={30} />
                </label>

                {/* Honeypot : invisible pour les humains */}
                <div style={{ position: "absolute", left: "-9999px" }} aria-hidden="true">
                  <label>Site web<input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => setField("website", e.target.value)} /></label>
                </div>

                <label className="bo-check">
                  <input type="checkbox" checked={form.consent} onChange={(e) => setField("consent", e.target.checked)} />
                  <span>
                    J'accepte que mes informations soient utilisées pour étudier mon besoin et me mettre en relation avec des professionnels
                    {PRIVACY_URL && <> (<a href={PRIVACY_URL} target="_blank" rel="noreferrer">politique de confidentialité</a>)</>}. *
                  </span>
                </label>

                {error && <p className="bo-error" role="alert">{error}</p>}

                <button type="submit" className="bo-cta" disabled={submitting}>
                  {submitting ? "Envoi en cours…" : "Envoyer mon besoin"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const CSS = `
.bo-home { color:#f8fafc; max-width:1100px; margin:0 auto; }
.bo-hero { text-align:center; padding:clamp(28px,7vw,72px) 8px clamp(24px,5vw,48px);
  background:radial-gradient(ellipse at 50% 0%, rgba(6,182,212,.18), transparent 65%); border-radius:20px; }
.bo-eyebrow { color:#67e8f9; font-size:13px; font-weight:600; margin:0 0 14px; }
.bo-h1 { font-size:clamp(28px,6vw,48px); line-height:1.12; margin:0 auto 16px; max-width:820px; font-weight:800; letter-spacing:-.5px; }
.bo-sub { color:#cbd5e1; font-size:clamp(15px,2.6vw,18px); line-height:1.55; max-width:680px; margin:0 auto 26px; }
.bo-cta { display:inline-flex; align-items:center; justify-content:center; gap:10px; min-height:56px; padding:14px 28px;
  background:#22c55e; color:#052e16; border:none; border-radius:14px; font-size:18px; font-weight:800; cursor:pointer;
  box-shadow:0 10px 30px rgba(34,197,94,.35); transition:transform .15s, box-shadow .15s; max-width:100%; }
.bo-cta:hover { transform:translateY(-2px); box-shadow:0 14px 34px rgba(34,197,94,.45); }
.bo-cta:focus-visible, .bo-card:focus-visible, .bo-btn-secondary:focus-visible { outline:3px solid #fff; outline-offset:3px; }
.bo-cta:disabled { opacity:.6; cursor:wait; transform:none; }
.bo-cta-free { background:#052e16; color:#86efac; font-size:12px; padding:3px 9px; border-radius:999px; font-weight:700; }
.bo-cta-small { min-height:44px; font-size:15px; padding:10px 22px; box-shadow:none; }
.bo-micro { color:#94a3b8; font-size:13px; margin:14px 0 6px; }
.bo-link { background:none; border:none; color:#67e8f9; font-size:14px; cursor:pointer; padding:10px; text-decoration:underline; text-underline-offset:3px; }
.bo-section { padding:clamp(24px,5vw,44px) 8px 0; }
.bo-h2 { font-size:clamp(20px,3.6vw,28px); margin:0 0 18px; text-align:center; font-weight:800; }
.bo-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(230px,1fr)); gap:14px; }
.bo-card { display:flex; flex-direction:column; gap:6px; text-align:left; padding:20px; background:#0f172a; color:#f8fafc;
  border:1px solid #334155; border-radius:16px; cursor:pointer; transition:transform .15s, border-color .15s, box-shadow .15s; font-family:inherit; }
.bo-card:hover { transform:translateY(-3px); border-color:#06b6d4; box-shadow:0 10px 26px rgba(6,182,212,.18); }
.bo-card-emoji { font-size:30px; }
.bo-card-title { font-size:18px; font-weight:800; }
.bo-card-desc { color:#94a3b8; font-size:14px; line-height:1.45; }
.bo-card-go { color:#22c55e; font-size:13px; font-weight:700; margin-top:6px; }
.bo-other { text-align:center; color:#94a3b8; font-size:14px; margin:16px 0 0; }
.bo-inline { background:none; border:none; color:#67e8f9; cursor:pointer; text-decoration:underline; font-size:14px; padding:0; }
.bo-step { background:#0f172a; border:1px solid #334155; border-radius:16px; padding:20px; }
.bo-step p { color:#94a3b8; font-size:14px; line-height:1.5; margin:8px 0 0; }
.bo-num { display:inline-flex; width:30px; height:30px; border-radius:50%; background:#06b6d4; color:#020617; font-weight:800; align-items:center; justify-content:center; margin-right:10px; }
.bo-band { text-align:center; }
.bo-band-text { color:#cbd5e1; font-size:15px; line-height:1.6; max-width:700px; margin:0 auto 18px; }
.bo-btn-secondary { background:#1e293b; color:#67e8f9; border:1px solid #06b6d4; border-radius:12px; padding:12px 24px; font-size:15px; font-weight:700; cursor:pointer; }
.bo-btn-secondary:hover { background:#0e7490; color:#fff; }
.bo-footer { text-align:center; color:#64748b; font-size:12px; padding:40px 8px 10px; }
.bo-footer a { color:#94a3b8; }
.bo-overlay { position:fixed; inset:0; background:rgba(2,6,23,.88); backdrop-filter:blur(5px); z-index:1200; display:flex; align-items:flex-start; justify-content:center; overflow-y:auto; padding:12px; }
.bo-modal { position:relative; background:#0f172a; border:1px solid #334155; border-radius:18px; width:100%; max-width:580px; padding:24px 20px; margin:auto; box-shadow:0 20px 60px rgba(0,0,0,.7); }
.bo-close { position:absolute; top:12px; right:12px; width:36px; height:36px; border-radius:50%; background:#1e293b; color:#fff; border:1px solid #475569; cursor:pointer; font-size:15px; }
.bo-form-title { margin:0 0 4px; font-size:22px; padding-right:40px; }
.bo-form-sub { color:#94a3b8; font-size:13px; margin:0 0 16px; }
.bo-label { display:block; font-size:13px; font-weight:600; color:#cbd5e1; margin-bottom:12px; flex:1; }
.bo-input { display:block; width:100%; margin-top:5px; padding:12px; border-radius:10px; background:#1e293b; border:1px solid #475569; color:#fff; font-size:16px; font-family:inherit; }
.bo-input:focus { outline:2px solid #06b6d4; border-color:#06b6d4; }
.bo-row { display:flex; gap:12px; flex-wrap:wrap; }
.bo-row .bo-label { min-width:200px; }
.bo-check { display:flex; gap:10px; align-items:flex-start; font-size:12.5px; color:#94a3b8; line-height:1.45; margin:6px 0 14px; }
.bo-check input { margin-top:3px; width:18px; height:18px; flex-shrink:0; }
.bo-check a { color:#67e8f9; }
.bo-error { background:#450a0a; border:1px solid #ef4444; color:#fecaca; border-radius:8px; padding:10px 12px; font-size:13px; margin:0 0 12px; }
.bo-modal .bo-cta { width:100%; }
.bo-success { text-align:center; padding:10px 0; }
.bo-success p { color:#cbd5e1; font-size:14px; line-height:1.55; margin:8px 0 18px; }
.bo-success .bo-cta { width:auto; }
@media (prefers-reduced-motion: reduce) { .bo-cta, .bo-card { transition:none; } }
`;
