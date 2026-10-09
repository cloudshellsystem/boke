import React from "react";

export default function SocialBar() {
  return (
    <aside aria-label="Réseaux sociaux et connecteurs" className="flex items-center gap-3 bg-neutral-900/80 border border-neutral-800 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl">
      <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 mr-1 hidden sm:inline">Réseau :</span>
      
      {/* WhatsApp */}
      <a 
        href="https://wa.me/33753490292?text=Bonjour%20BOKÉ%20ONE,%20je%20souhaite%20des%20informations." 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="text-neutral-400 hover:text-emerald-400 transition transform hover:scale-110 p-1"
      >
        💬
      </a>
      
      {/* LinkedIn */}
      <a 
        href="https://linkedin.com" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="LinkedIn"
        className="text-neutral-400 hover:text-amber-400 transition transform hover:scale-110 p-1"
      >
        💼
      </a>

      {/* Instagram / Galerie d'art */}
      <a 
        href="https://instagram.com" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Instagram"
        className="text-neutral-400 hover:text-pink-400 transition transform hover:scale-110 p-1"
      >
        📸
      </a>

      {/* Facebook */}
      <a 
        href="https://facebook.com" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Facebook"
        className="text-neutral-400 hover:text-blue-400 transition transform hover:scale-110 p-1"
      >
        👥
      </a>
    </aside>
  );
}