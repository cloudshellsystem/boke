import React, { useState } from "react";

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const whatsappNumber = "33753490292";
  const defaultMessage = "Bonjour BOKÉ ONE, je souhaite en savoir plus sur les œuvres d'élite.";

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`, "_blank");
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2">
      
      {/* 🔹 Mini-pictos ronds discrets alignés à gauche du bouton WhatsApp */}
      <div className="flex items-center gap-1.5 bg-neutral-900/90 border border-neutral-800 px-2.5 py-1.5 rounded-full shadow-2xl backdrop-blur-md">
        
        {/* Instagram */}
        <a 
          href="https://instagram.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-7 h-7 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-pink-400 hover:border-pink-500 transition transform hover:scale-110 shadow-sm"
          title="Instagram"
        >
          <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
        </a>

        {/* LinkedIn */}
        <a 
          href="https://linkedin.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-7 h-7 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-amber-400 hover:border-amber-500 transition transform hover:scale-110 shadow-sm"
          title="LinkedIn"
        >
          <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
        </a>

        {/* Pinterest */}
        <a 
          href="https://pinterest.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-7 h-7 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-red-400 hover:border-red-500 transition transform hover:scale-110 shadow-sm"
          title="Pinterest"
        >
          <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.331 1.363-.053.225-.172.273-.395.164-1.478-.688-2.404-2.852-2.404-4.594 0-3.745 2.721-7.185 7.843-7.185 4.128 0 7.331 2.942 7.331 6.879 0 4.102-2.589 7.41-6.183 7.41-1.207 0-2.339-.627-2.728-1.36l-.744 2.836c-.269 1.034-1.001 2.332-1.492 3.123 1.121.346 2.315.534 3.551.534 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/></svg>
        </a>

        {/* Facebook */}
        <a 
          href="https://facebook.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-7 h-7 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-blue-400 hover:border-blue-500 transition transform hover:scale-110 shadow-sm"
          title="Facebook"
        >
          <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
        </a>

      </div>

      {/* 💬 Bouton WhatsApp Flottant */}
      <div className="relative">
        {isOpen && (
          <div className="absolute bottom-16 right-0 w-80 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-4 text-neutral-100 backdrop-blur-md">
            <div className="flex items-center justify-between mb-3 border-b border-neutral-800 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Conciergerie BOKÉ ONE</span>
              <button onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-white font-bold">✕</button>
            </div>
            {!submitted ? (
              <form onSubmit={handleEmailSubmit} className="space-y-3">
                <p className="text-xs text-neutral-300">Laissez votre e-mail pour être recontacté par la permanence à Bruxelles :</p>
                <input
                  type="email"
                  required
                  placeholder="votre.email@domaine.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-amber-400"
                />
                <button type="submit" className="w-full bg-amber-400 text-neutral-950 text-xs font-bold py-2 rounded-xl">
                  Envoyer ma demande
                </button>
              </form>
            ) : (
              <p className="text-xs font-bold text-emerald-400 text-center py-3">✓ Demande transmise avec succès !</p>
            )}
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="h-12 w-12 rounded-full bg-emerald-500 text-neutral-950 shadow-2xl flex items-center justify-center hover:scale-105 transition border-2 border-neutral-950"
          aria-label="Contact WhatsApp"
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
        </button>
      </div>

    </div>
  );
}