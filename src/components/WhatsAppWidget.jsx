import React, { useState } from "react";

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const whatsappNumber = "33753490292";

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      setSubmitted(true);
    }
  };

  const handleOpenWhatsApp = () => {
    const text = `Bonjour, c'est ${name} (${email}). Je souhaite contacter la permanence BOKÉ ONE.`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-4 text-neutral-100 backdrop-blur-md animate-fade-in">
          <div className="flex items-center justify-between mb-3 border-b border-neutral-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Permanence WhatsApp Active</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-white font-bold">✕</button>
          </div>

          {!submitted ? (
            <form onSubmit={handleLeadSubmit} className="space-y-2.5">
              <p className="text-[11px] text-neutral-300 leading-relaxed">
                Veuillez renseigner vos coordonnées pour entrer en contact direct avec l'équipe de permanence (France / Bruxelles) :
              </p>
              <div>
                <label className="text-[10px] uppercase font-bold text-neutral-400">Votre Nom</label>
                <input
                  type="text"
                  required
                  placeholder="Nom ou Entité"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-400 mt-0.5"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-neutral-400">Votre E-mail</label>
                <input
                  type="email"
                  required
                  placeholder="votre.email@domaine.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-400 mt-0.5"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-400 to-amber-500 text-neutral-950 text-xs font-bold py-2 rounded-xl hover:brightness-110 transition shadow-md mt-1"
              >
                Valider & Ouvrir WhatsApp
              </button>
            </form>
          ) : (
            <div className="text-center py-4 space-y-3">
              <p className="text-xs font-bold text-emerald-400">✓ Coordonnées enregistrées !</p>
              <p className="text-[11px] text-neutral-300">Vous pouvez maintenant lancer la discussion sécurisée avec la permanence.</p>
              <button
                onClick={handleOpenWhatsApp}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg"
              >
                <span>💬</span> Lancer la discussion WhatsApp
              </button>
            </div>
          )}
        </div>
      )}

      {/* Bouton Bulle WhatsApp avec mention "Connecté" au survol ou en badge */}
      <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <span className="hidden group-hover:inline-block bg-neutral-900/90 border border-neutral-800 text-emerald-400 text-[11px] font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-md transition-all">
          ● Connecté (Permanence)
        </span>
        <button
          className="relative h-12 w-12 rounded-full bg-emerald-500 text-neutral-950 shadow-2xl flex items-center justify-center hover:scale-105 transition border-2 border-neutral-950"
          aria-label="Contact WhatsApp Permanence"
        >
          <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-neutral-950 animate-ping"></span>
          <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-neutral-950"></span>
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
        </button>
      </div>
    </div>
  );
}