import React, { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";

const CFG_KEY = "boke_pro_company";
const loadCfg = () => {
  try {
    return JSON.parse(localStorage.getItem(CFG_KEY)) || {};
  } catch {
    return {};
  }
};

const fmt = (n) => n.toFixed(2).replace(".", ",") + " €";

export default function EspaceMembrePro({ onRequireLogin }) {
  // 1. Déclaration de tous les Hooks React au tout début
  const { isLoggedIn, hasProAccess, loading } = useAuth();
  const fileRef = useRef(null);

  const [company, setCompany] = useState(() => ({
    regime: "entreprise", // "entreprise" ou "mda"
    name: "",
    siret: "",
    numMda: "",
    address: "",
    logo: "",
    ...loadCfg(),
  }));

  const [tvaEnabled, setTvaEnabled] = useState(false);
  const [tvaRate] = useState(20);
  const [client, setClient] = useState("");
  const [invoiceNo, setInvoiceNo] = useState(
    () => "FA-" + new Date().toISOString().slice(0, 10).replace(/-/g, "") + "-001"
  );
  const [lines, setLines] = useState([{ id: 1, desc: "", qty: 1, price: 0 }]);

  // 2. Gestion de l'état de chargement d'authentification
  if (loading) {
    return (
      <div className="bg-neutral-950 min-h-screen flex items-center justify-center text-amber-500 font-bold text-xs tracking-wide">
        Vérification des accès en cours...
      </div>
    );
  }

  // 3. Verrouillage de sécurité : bloque l'accès si non connecté ou pas Pro/Élite
  if (!isLoggedIn || !hasProAccess) {
    return (
      <div className="bg-neutral-950 min-h-screen flex items-center justify-center p-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 max-w-md text-center space-y-4 shadow-2xl">
          <div className="text-4xl">🔒</div>
          <h2 className="text-lg font-black text-white">Espace réservé aux membres Pro & Élite</h2>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Passez à l'offre Pro ou Élite pour générer vos factures professionnelles, éditer vos devis et configurer votre comptabilité.
          </p>
          <button
            onClick={() => onRequireLogin?.()}
            className="bg-amber-500 hover:bg-amber-400 text-neutral-950 px-5 py-2.5 rounded-xl font-black text-xs transition cursor-pointer shadow"
          >
            Se connecter / S'abonner
          </button>
        </div>
      </div>
    );
  }

  // Helper pour mettre à jour et sauvegarder les infos de l'entreprise
  const updateCompany = (patch) => {
    const next = { ...company, ...patch };
    setCompany(next);
    try {
      localStorage.setItem(CFG_KEY, JSON.stringify(next));
    } catch {
      /* quota local storage */
    }
  };

  const onLogo = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateCompany({ logo: reader.result });
    reader.readAsDataURL(file);
  };

  const updateLine = (id, patch) =>
    setLines((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  const addLine = () =>
    setLines((ls) => [...ls, { id: Date.now(), desc: "", qty: 1, price: 0 }]);
  const removeLine = (id) =>
    setLines((ls) => (ls.length > 1 ? ls.filter((l) => l.id !== id) : ls));

  const subtotal = lines.reduce((s, l) => s + (Number(l.qty) || 0) * (Number(l.price) || 0), 0);
  const tva = tvaEnabled ? (subtotal * tvaRate) / 100 : 0;
  const total = subtotal + tva;

  const inputCls =
    "w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 outline-none focus:border-amber-500/50";

  return (
    <div className="bg-neutral-950 min-h-screen text-neutral-200 font-sans">
      {/* Configuration CSS pour l'impression native du PDF */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #invoice-print, #invoice-print * { visibility: visible !important; }
          #invoice-print {
            position: absolute; left: 0; top: 0; width: 100%;
            background: #fff !important; color: #000 !important;
            border: none !important; box-shadow: none !important; padding: 24px;
          }
          @page { margin: 12mm; }
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ---------- Formulaire de saisie ---------- */}
        <div className="space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-black text-white">🏢 Mon entreprise & Régime comptable</h3>
            
            <div>
              <label className="text-xs font-bold text-neutral-400 block mb-1">Régime fiscal / Profil :</label>
              <select
                value={company.regime}
                onChange={(e) => updateCompany({ regime: e.target.value })}
                className={inputCls}
              >
                <option value="entreprise">Entreprise / Micro-entreprise (SIRET & TVA standard)</option>
                <option value="mda">Maison des Artistes / AGESSA (Artiste-Auteur)</option>
              </select>
            </div>

            <input className={inputCls} placeholder="Raison sociale / Nom complet" value={company.name} onChange={(e) => updateCompany({ name: e.target.value })} />
            
            {company.regime === "mda" ? (
              <div className="grid grid-cols-2 gap-2">
                <input className={inputCls} placeholder="N° Maison des Artistes" value={company.numMda} onChange={(e) => updateCompany({ numMda: e.target.value })} />
                <input className={inputCls} placeholder="SIRET" value={company.siret} onChange={(e) => updateCompany({ siret: e.target.value })} />
              </div>
            ) : (
              <input className={inputCls} placeholder="SIRET (14 chiffres)" value={company.siret} onChange={(e) => updateCompany({ siret: e.target.value })} />
            )}

            <textarea rows={2} className={inputCls} placeholder="Adresse" value={company.address} onChange={(e) => updateCompany({ address: e.target.value })} />
            
            <div className="flex items-center gap-3">
              <input ref={fileRef} type="file" accept="image/*" onChange={onLogo} className="hidden" />
              <button type="button" onClick={() => fileRef.current?.click()} className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer">
                📁 Importer le logo
              </button>
              {company.logo && (
                <>
                  <img src={company.logo} alt="Logo" className="h-10 rounded object-contain" />
                  <button type="button" onClick={() => updateCompany({ logo: "" })} className="text-xs text-red-400 hover:underline cursor-pointer">Retirer</button>
                </>
              )}
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-black text-white">🧾 Facture</h3>
            <input className={inputCls} placeholder="N° de facture" value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} />
            <input className={inputCls} placeholder="Nom du client" value={client} onChange={(e) => setClient(e.target.value)} />
            
            {lines.map((l) => (
              <div key={l.id} className="grid grid-cols-12 gap-2">
                <input className={inputCls + " col-span-6"} placeholder="Description" value={l.desc} onChange={(e) => updateLine(l.id, { desc: e.target.value })} />
                <input type="number" min="0" className={inputCls + " col-span-2"} value={l.qty} onChange={(e) => updateLine(l.id, { qty: e.target.value })} />
                <input type="number" min="0" step="0.01" className={inputCls + " col-span-3"} value={l.price} onChange={(e) => updateLine(l.id, { price: e.target.value })} />
                <button type="button" onClick={() => removeLine(l.id)} className="col-span-1 text-neutral-500 hover:text-red-400 cursor-pointer">✕</button>
              </div>
            ))}
            
            <button type="button" onClick={addLine} className="text-xs text-amber-400 hover:underline font-bold cursor-pointer">+ Ajouter une ligne</button>
            
            <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer pt-2">
              <input type="checkbox" checked={tvaEnabled} onChange={(e) => setTvaEnabled(e.target.checked)} className="accent-amber-500" />
              Assujetti à la TVA ({tvaRate} %)
            </label>
            
            <button
              type="button"
              onClick={() => window.print()}
              className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 py-2.5 rounded-xl font-black text-xs transition shadow cursor-pointer"
            >
              🖨️ Imprimer / PDF
            </button>
          </div>
        </div>

        {/* ---------- Aperçu temps réel et document imprimable ---------- */}
        <div id="invoice-print" className="bg-white text-neutral-900 rounded-2xl p-8 shadow-xl text-sm">
          <div className="flex justify-between items-start gap-4">
            <div>
              {company.logo && <img src={company.logo} alt="Logo" className="h-14 mb-2 object-contain" />}
              <p className="font-black text-base">{company.name || "Votre entreprise"}</p>
              <p className="whitespace-pre-line text-xs text-neutral-600">{company.address}</p>
              {company.regime === "mda" ? (
                <p className="text-xs text-neutral-600">N° MDA : {company.numMda || "—"} | SIRET : {company.siret || "—"}</p>
              ) : (
                company.siret && <p className="text-xs text-neutral-600">SIRET : {company.siret}</p>
              )}
            </div>
            <div className="text-right">
              <p className="font-black text-lg text-amber-600">FACTURE</p>
              <p className="text-xs text-neutral-600">N° {invoiceNo}</p>
              <p className="text-xs text-neutral-600">{new Date().toLocaleDateString("fr-FR")}</p>
            </div>
          </div>

          <div className="mt-6 bg-neutral-50 p-3 rounded-xl border border-neutral-200">
            <p className="text-[10px] uppercase text-neutral-500 font-bold">Facturé à</p>
            <p className="font-bold">{client || "—"}</p>
          </div>

          <table className="w-full mt-6 text-xs">
            <thead>
              <tr className="border-b border-neutral-300 text-left text-neutral-500">
                <th className="py-2">Description</th>
                <th className="py-2 text-right">Qté</th>
                <th className="py-2 text-right">PU</th>
                <th className="py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((l) => (
                <tr key={l.id} className="border-b border-neutral-100">
                  <td className="py-2">{l.desc || "—"}</td>
                  <td className="py-2 text-right">{l.qty}</td>
                  <td className="py-2 text-right">{fmt(Number(l.price) || 0)}</td>
                  <td className="py-2 text-right">{fmt((Number(l.qty) || 0) * (Number(l.price) || 0))}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 ml-auto w-56 space-y-1 text-xs">
            <div className="flex justify-between"><span>Total HT</span><span>{fmt(subtotal)}</span></div>
            {tvaEnabled && <div className="flex justify-between"><span>TVA {tvaRate} %</span><span>{fmt(tva)}</span></div>}
            <div className="flex justify-between font-black text-sm border-t border-neutral-300 pt-1">
              <span>{tvaEnabled ? "Total TTC" : "Total à payer"}</span><span className="text-amber-600">{fmt(total)}</span>
            </div>
          </div>

          <div className="mt-8 text-[11px] text-neutral-600 italic border-t border-neutral-200 pt-3">
            {company.regime === "mda" ? (
              <p>Dispense de précompte (Artiste-Auteur). Droits d'auteur régis par le Code de la Propriété Intellectuelle.</p>
            ) : !tvaEnabled ? (
              <p>TVA non applicable, art. 293 B du CGI.</p>
            ) : (
              <p>Facture émise assujettie à la TVA.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}