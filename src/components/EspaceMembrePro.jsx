// src/components/EspaceMembrePro.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function EspaceMembrePro() {
  const [session, setSession] = useState(null);
  const [selections, setSelections] = useState([]);
  const [loading, setLoading] = useState(true);

  const TAXE_COMMISSION_AGENCE = 20; // 20% de commission d'apport d'affaires pour l'agence
  const FORFAIT_VALEUR_PROJECT = 1500; // Tarif forfaitaire d'un projet de shooting

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchSelectionsDuCreative(session.user.id);
      else setLoading(false);
    });
  }, []);

  const fetchSelectionsDuCreative = async (creativeId) => {
    const { data, error } = await supabase
      .from('pre_selections')
      .select('*')
      .eq('creative_id', creativeId)
      .order('created_at', { ascending: false });

    setLoading(false);
    if (!error && data) setSelections(data);
  };

  // Calculs comptables automatisés pour votre agence
  const volumeAffairesBrut = selections.length * FORFAIT_VALEUR_PROJECT;
  const margeAgencePrelevee = (volumeAffairesBrut * TAXE_COMMISSION_AGENCE) / 100;
  const versementNetCreateur = volumeAffairesBrut - margeAgencePrelevee;

  if (loading) return <p className="text-center text-xs text-slate-500 font-mono py-12 animate-pulse">Chargement de la comptabilité...</p>;

  return (
    <div className="w-full bg-[#090d16] rounded-2xl border border-slate-800/80 p-6 font-sans text-slate-100 animate-fade-in">
      
      {/* En-tête de section */}
      <div className="border-b border-slate-800/60 pb-4 mb-6">
        <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block">Espace PRO · Commissions</span>
        <h2 className="text-xl font-black text-white mt-1">Suivi de vos Ventes & Facturation</h2>
      </div>

      {/* BLOCS DE TRAITEMENT FINANCIER DE MARGE */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-xs">
        <div className="bg-[#0e1424] border border-slate-800 p-4 rounded-xl shadow-lg">
          <span className="text-slate-500 font-bold uppercase text-[9px] tracking-wider block">Volume d'Affaires Cumulé</span>
          <div className="text-2xl font-black text-white mt-1">{volumeAffairesBrut.toLocaleString()} €</div>
          <p className="text-[10px] text-slate-500 mt-1">Basé sur {selections.length} shooting(s) réservé(s).</p>
        </div>
        
        <div className="bg-[#0e1424] border border-amber-500/20 p-4 rounded-xl shadow-lg bg-gradient-to-b from-[#0e1424] to-amber-500/5">
          <span className="text-amber-500 font-bold uppercase text-[9px] tracking-wider block">Commission Agence ({TAXE_COMMISSION_AGENCE}%)</span>
          <div className="text-2xl font-black text-amber-400 mt-1">-{margeAgencePrelevee.toLocaleString()} €</div>
          <p className="text-[10px] text-slate-500 mt-1">Prélèvement de sécurité de la plateforme BOké ONE.</p>
        </div>

        <div className="bg-[#0e1424] border border-emerald-500/20 p-4 rounded-xl shadow-lg bg-gradient-to-b from-[#0e1424] to-emerald-500/5">
          <span className="text-emerald-400 font-bold uppercase text-[9px] tracking-wider block">Votre Solde Net Encaissable</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">+{versementNetCreateur.toLocaleString()} €</div>
          <p className="text-[10px] text-emerald-500/70 mt-1 font-medium">Fonds sécurisés prêts pour transfert.</p>
        </div>
      </div>

      {/* LOG DE SUIVI CLIENTS */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <span>📁</span> Historique des pré-sélections et transactions clients
        </h3>

        {selections.length === 0 ? (
          <p className="text-center text-xs text-slate-500 py-10 bg-[#0e1424] border border-slate-800/40 rounded-xl italic">
            Aucun historique de vente ou de réservation disponible. Activez votre prospection dans votre Cockpit !
          </p>
        ) : (
          <div className="bg-[#0e1424] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#070b12] border-b border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[9px]">
                  <th className="p-4">Rendu Image</th>
                  <th className="p-4">Identifiant Client</th>
                  <th className="p-4">Date Enregistrement</th>
                  <th className="p-4 text-right">Valeur Projet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-slate-300 font-medium font-mono">
                {selections.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/10 transition-colors">
                    <td className="p-4">
                      <img src={item.image_url} alt="Sélection" className="w-10 h-8 object-cover rounded border border-slate-800 shadow" />
                    </td>
                    <td className="p-4 text-slate-400 truncate max-w-[120px]">{item.client_id}</td>
                    <td className="p-4 text-slate-500">{new Date(item.created_at).toLocaleDateString('fr-FR')}</td>
                    <td className="p-4 text-right font-black text-emerald-400 font-sans">{FORFAIT_VALEUR_PROJECT} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
