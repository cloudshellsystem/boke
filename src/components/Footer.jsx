import React from "react";

export default function Footer({ onNavigate }) {
  return (
    <footer className="w-full bg-neutral-950 border-t border-neutral-900 text-neutral-400 py-8 px-6 sm:px-12 font-sans mt-auto relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Identité & Confiance */}
        <div className="space-y-1 text-center md:text-left">
          <h3 className="text-xs font-black text-amber-400 tracking-wider uppercase">BOKÉ ONE</h3>
          <p className="text-[11px] text-neutral-400">
            Association en transition • Avenue Louise, 1050 Bruxelles, Belgique.
          </p>
        </div>

        {/* 🔹 LES MINI-PICTOS RONDS DISCRETS EN BAS (Alignés à droite, juste à côté du WhatsApp) */}
        <div className="flex items-center gap-2 bg-neutral-900/90 border border-neutral-800 px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md">
          
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

        {/* Liens légaux */}
        <div className="flex items-center gap-6 text-xs">
          <button onClick={() => onNavigate && onNavigate("cgu")} className="hover:text-amber-400 transition text-neutral-400">
            CGU / CGV
          </button>
          <button onClick={() => onNavigate && onNavigate("mentions")} className="hover:text-amber-400 transition text-neutral-400">
            Mentions Légales
          </button>
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t border-neutral-900/60 mt-6 pt-4 flex items-center justify-between text-[11px] text-neutral-500">
        <p>© 2026 BOKÉ ONE. Tous droits réservés.</p>
        <p className="text-amber-500/80 font-medium">Design Quartz & Or ⚡</p>
      </div>
    </footer>
  );
}