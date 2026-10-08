import React, { useState } from "react";

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [sentSuccess, setSentSuccess] = useState(false);

   // Numéro WhatsApp de contact (format international français)
  const whatsappNumber = "33753490292"; 
  const defaultMessage = "Bonjour BOKÉ ONE, je souhaite en savoir plus sur le salon et les œuvres d'élite.";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`;




  
  
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSentSuccess(true);
      setTimeout(() => {
        setSentSuccess(false);
        setEmailInput("");
        setIsOpen(false);
      }, 4000);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      
      {/* Fenêtre de chat / Conciergerie interactive */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-neutral-900 border-2 border-amber-500/40 rounded-3xl shadow-2xl p-5 space-y-4 animate-fadeIn text-neutral-200">
          
          {/* En-tête de la modale */}
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
              <div>
                <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider">Conciergerie BOKÉ ONE</h4>
                <span className="text-[10px] text-neutral-400">Support & Salon d'Élite</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-neutral-400 hover:text-white text-sm font-bold px-2 py-1"
            >
              ✕
            </button>
          </div>

          {/* Message du bot / Statut */}
          <div className="bg-neutral-950 p-3.5 rounded-2xl border border-neutral-800 space-y-2 text-xs">
            <p className="text-neutral-300 leading-relaxed">
              👋 Bonjour et bienvenue ! Nos équipes d'agents et de créateurs sont <strong className="text-amber-400">actuellement en rendez-vous ou en salon</strong>.
            </p>
            <p className="text-neutral-400 text-[11px]">
              📞 Vous pouvez joindre notre permanence WhatsApp au <strong className="text-emerald-400 font-mono">+{whatsappNumber}</strong> ou nous laisser votre e-mail pour être recontacté en priorité.
            </p>
          </div>

          {/* Bouton d'accès direct WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md"
          >
            <span>💬</span> Ouvrir la discussion WhatsApp ↗
          </a>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-neutral-800"></div>
            <span className="flex-shrink mx-2 text-[10px] text-neutral-400 uppercase">ou laissez votre e-mail</span>
            <div className="flex-grow border-t border-neutral-800"></div>
          </div>

          {/* Formulaire de capture d'e-mail si absent */}
          {sentSuccess ? (
            <div className="p-3 bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs rounded-xl text-center font-bold">
              ✅ Merci ! Votre message a bien été transmis à la conciergerie.
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-2">
              <input
                type="email"
                placeholder="Votre e-mail professionnel..."
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs transition shadow-md"
              >
                Être recontacté par un conseiller ⚡
              </button>
            </form>
          )}

        </div>
      )}

      {/* Bouton flou / déclencheur principal en bas à droite */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Ouvrir le chat WhatsApp"
        className="w-14 h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-2xl transition-transform transform hover:scale-110 border-2 border-amber-400/60 relative group"
      >
        {/* Bulle de notification rouge pour attirer l'œil */}
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full border-2 border-neutral-950 text-[9px] font-black flex items-center justify-center text-neutral-950">
          1
        </span>

        {/* Logo WhatsApp SVG officiel */}
        <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      </button>

    </div>
  );
}