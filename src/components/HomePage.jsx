// src/components/HomePage.jsx
import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import TarifsPage from "./TarifsPage"; // ⚡ Importation de la page des tarifs

const GALLERY_ITEMS = [
  {
    id: 1,
    title: "Tournage Cinéma Île-de-France",
    category: "Cinéma",
    type: "Vidéo",
    price: 120,
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600",
    creator: "Marc V. (Réalisateur / Chef Opérateur)",
    bio: "Spécialisé dans les tournages longs métrages et clips institutionnels en Île-de-France.",
    likesCount: 24,
  },
  {
    id: 2,
    title: "Architecture & Design Parisien",
    category: "Immobilier",
    type: "Photo",
    price: 90,
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600",
    creator: "Sophie L. (Photographe d'Architecture)",
    bio: "Mise en valeur de biens d'exception et d'ouvrages d'art par la lumière naturelle.",
    likesCount: 42,
  },
  {
    id: 3,
    title: "Vue Aérienne Drone 4K",
    category: "Drone",
    type: "Vidéo / Photo",
    price: 150,
    image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=600",
    creator: "Alexandre T. (Pilote Drone Certifié DGAC)",
    bio: "Captions aériennes spectaculaires 4K pour l'immobilier et l'événementiel.",
    likesCount: 18,
  },
];

const NEWS_ITEMS = [
  {
    id: 1,
    date: "Salon Pro 2026",
    title: "Ouverture des accréditations Élite & Pro - Salon de la Photo",
    summary: "Accédez en avant-première aux masterclasses et plannings exclusifs à la Grande Halle de la Villette.",
    fullContent: "Le grand Salon Photo & Vidéo bat actuellement son plein à la Grande Halle de la Villette ! Quatre jours exceptionnels dédiés à la pratique, aux masterclasses de pointe, aux tests de matériel en situation réelle (studio, macro, architecture) et aux rencontres exclusives avec l'élite de la création visuelle française.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1XoNi-N5iNRWgHCmnaTUXumu9Efqp6HbPOPjAq-ki1Q&s=10",
  },
  {
    id: 2,
    date: "Octobre 2026",
    title: "Mise à jour des certifications nationales de l'audiovisuel",
    summary: "Renforcement des protocoles de sécurité pour les tournages en espace public et en milieu aquatique.",
    fullContent: "Dans le cadre de notre démarche d'élite, cette mise à jour intègre de nouvelles normes obligatoires pour tous les prestataires du réseau Boké One intervenant sur le domaine public en Île-de-France.",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200",
  },
  {
    id: 3,
    date: "Nouveauté Réseau",
    title: "Lancement du module d'accréditation Drone S1-S3",
    summary: "Standardisation des demandes d'autorisation de vol centralisées sur Boké One.",
    fullContent: "Simplifiez vos démarches de tournage aérien : les télépilotes certifiés peuvent désormais générer leurs protocoles d'accord préfectoraux directement depuis l'espace membre.",
    image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=1200",
  },
];

export default function HomePage() {
  const { lang } = useLanguage();
  const { isLoggedIn, login } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const isEn = lang === "en";

  const [searchQuery, setSearchQuery] = useState("");
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("gallery");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentNewsIndex((prevIndex) => (prevIndex + 1) % NEWS_ITEMS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const [likes, setLikes] = useState(
    GALLERY_ITEMS.reduce((acc, item) => ({ ...acc, [item.id]: item.likesCount }), {})
  );
  const [userLiked, setUserLiked] = useState({});

  const [selectedNews, setSelectedNews] = useState(null);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState(null);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLike = (id, e) => {
    e.stopPropagation();
    if (userLiked[id]) {
      setLikes((prev) => ({ ...prev, [id]: prev[id] - 1 }));
      setUserLiked((prev) => ({ ...prev, [id]: false }));
    } else {
      setLikes((prev) => ({ ...prev, [id]: prev[id] + 1 }));
      setUserLiked((prev) => ({ ...prev, [id]: true }));
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/creators?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate("/creators");
    }
  };

  const handleBuyItem = (item, e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      setAuthMode("register");
      setShowAuthModal(true);
      return;
    }
    addToCart(item);
    navigate("/cart");
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    login?.({ email });
    setShowAuthModal(false);
    alert(isEn ? "Successfully connected!" : "Connexion réussie ! Bienvenue sur Boké One.");
  };

  const handleForgotPassword = () => {
    if (!email) {
      alert(isEn ? "Please enter your email address first." : "Veuillez d'abord saisir votre adresse email dans le champ ci-dessus.");
      return;
    }
    alert(isEn ? `A password reset link has been sent to ${email}.` : `Un email de réinitialisation de mot de passe a été envoyé à ${email}.`);
  };

  const currentNews = NEWS_ITEMS[currentNewsIndex];

  return (
    <div className="bg-neutral-950 min-h-screen text-neutral-200 font-sans selection:bg-amber-500 selection:text-neutral-950 overflow-x-hidden">
      
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

        {/* Barre de sélection rapide des onglets de la page d'accueil */}
        <div className="flex items-center justify-center gap-3 border-b border-neutral-800 pb-4">
          <button
            type="button"
            onClick={() => setActiveTab("gallery")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === "gallery" ? "bg-amber-500 text-neutral-950 shadow-md" : "bg-neutral-900 text-neutral-300 border border-neutral-800"
            }`}
          >
            🖼️ {isEn ? "Gallery & News" : "Galerie & Actualités"}
          </button>
          
          {/* Onglet Tarifs (Anciennement Abonnés) */}
          <button
            type="button"
            onClick={() => setActiveTab("tarifs")}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
              activeTab === "tarifs" 
                ? "bg-amber-500 text-neutral-950 shadow-md font-black" 
                : "bg-neutral-900 text-neutral-300 border border-neutral-800 hover:border-neutral-700"
            }`}
          >
            ⭐ {isEn ? "Pricing" : "Tarifs"}
          </button>
        </div>

        {/* Zone d'affichage dynamique des onglets */}
        <main className="mt-6">
          {activeTab === "gallery" && (
            <div className="space-y-10">
              {/* 1. ACTUS DÉFILANTES */}
              <div className="max-w-3xl mx-auto space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-black uppercase tracking-widest text-amber-400 flex items-center gap-2">
                    <span>⚡</span> {isEn ? "Latest News & Updates" : "Actualités & Annonces Réseau"}
                  </h3>
                  {!isLoggedIn && (
                    <button 
                      type="button"
                      onClick={() => { setAuthMode("login"); setShowAuthModal(true); }}
                      className="text-xs text-amber-400 hover:underline font-bold cursor-pointer"
                    >
                      {isEn ? "Sign In / Register →" : "Connexion / Inscription →"}
                    </button>
                  )}
                </div>

                <div 
                  onClick={() => setSelectedNews(currentNews)}
                  className="bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 p-6 rounded-3xl shadow-xl cursor-pointer transition duration-300 relative overflow-hidden group flex flex-col sm:flex-row gap-6 items-center"
                >
                  <div className="w-full sm:w-48 h-32 rounded-2xl overflow-hidden shrink-0 border border-neutral-800">
                    <img 
                      src={currentNews.image} 
                      alt={currentNews.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                    />
                  </div>

                  <div className="flex-1 space-y-2 text-left">
                    <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold px-2.5 py-1 rounded-full uppercase">
                      {currentNews.date}
                    </span>
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition">
                      {currentNews.title}
                    </h4>
                    <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
                      {currentNews.summary}
                    </p>
                    <span className="text-[11px] text-amber-400 font-bold block pt-1 underline">
                      {isEn ? "Read full update →" : "Lire le résumé complet →"}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-4 flex gap-1.5">
                    {NEWS_ITEMS.map((_, idx) => (
                      <span
                        key={idx}
                        onClick={(e) => { e.stopPropagation(); setCurrentNewsIndex(idx); }}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          idx === currentNewsIndex ? "w-6 bg-amber-400" : "w-1.5 bg-neutral-700"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="max-w-3xl mx-auto border-t border-neutral-800/80 my-6"></div>

              {/* 2. RECHERCHE */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 sm:p-6 max-w-2xl mx-auto shadow-xl">
                <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder={isEn ? "Search by creator name, subscription, reference..." : "Rechercher par nom de presta, abonnement, référence..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-6 py-3 rounded-xl text-xs transition cursor-pointer shadow-md"
                  >
                    {isEn ? "SEARCH" : "RECHERCHER"}
                  </button>
                </form>
              </div>

              <div className="max-w-3xl mx-auto border-t border-neutral-800/80 my-6"></div>

              {/* 3. GALERIE */}
              <div className="space-y-6 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {GALLERY_ITEMS.map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => setSelectedGalleryItem(item)}
                      className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group cursor-pointer transition"
                    >
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
                          <span className="text-white font-black text-xl tracking-widest uppercase rotate-[-20deg]">
                            BOKÉ ONE
                          </span>
                        </div>

                        <span className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur-md text-amber-400 text-[10px] font-bold px-3 py-1 rounded-full border border-neutral-800">
                          {item.category} ({item.type})
                        </span>
                      </div>

                      <div className="p-5 space-y-4">
                        <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition">{item.title}</h3>
                        
                        <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
                          <span className="text-base font-black text-amber-400">{item.price} €</span>
                          
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={(e) => handleLike(item.id, e)}
                              className={`flex items-center gap-1.5 border px-3 py-1.5 rounded-xl text-xs transition cursor-pointer ${
                                userLiked[item.id]
                                  ? "bg-rose-500/20 border-rose-500 text-rose-400 font-bold"
                                  : "bg-neutral-950 hover:bg-neutral-800 border-neutral-800 text-neutral-300"
                              }`}
                            >
                              <span>❤️</span>
                              <span className="font-bold">{likes[item.id]}</span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => handleBuyItem(item, e)}
                              className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-4 py-1.5 rounded-xl text-xs transition cursor-pointer shadow"
                            >
                              {isEn ? "Buy" : "Acheter"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ⚡ ONGLET TARIFS INDÉPENDANT */}
          {activeTab === "tarifs" && <TarifsPage />}
        </main>

      </div>

      {/* MODALE NEWS */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl space-y-5 p-6 sm:p-8 relative">
            <button 
              type="button"
              onClick={() => setSelectedNews(null)}
              className="absolute top-4 right-4 bg-neutral-800 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold hover:bg-neutral-700 transition cursor-pointer"
            >
              ✕
            </button>
            <div className="space-y-1">
              <span className="text-xs text-amber-400 font-bold">{selectedNews.date}</span>
              <h2 className="text-xl sm:text-2xl font-black text-white">{selectedNews.title}</h2>
            </div>
            <div className="relative h-64 rounded-2xl overflow-hidden border border-neutral-800 shadow-inner">
              <img src={selectedNews.image} alt="Grande Halle de la Villette" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent flex items-end p-4">
                <span className="text-xs text-amber-300 font-medium">📍 Événement officiel - Grande Halle de la Villette, Paris</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">{selectedNews.fullContent}</p>
            <button 
              type="button"
              onClick={() => setSelectedNews(null)}
              className="w-full bg-amber-500 text-neutral-950 font-bold py-3.5 rounded-xl text-xs cursor-pointer hover:bg-amber-400 transition shadow-lg"
            >
              {isEn ? "Close news" : "Fermer l'actualité"}
            </button>
          </div>
        </div>
      )}

      {/* MODALE CRÉATEUR */}
      {selectedGalleryItem && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl space-y-4 p-6 relative">
            <button 
              type="button"
              onClick={() => setSelectedGalleryItem(null)}
              className="absolute top-4 right-4 bg-neutral-800 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold hover:bg-neutral-700 transition cursor-pointer"
            >
              ✕
            </button>
            <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1 rounded-full font-bold uppercase">
              {selectedGalleryItem.category} • {selectedGalleryItem.type}
            </span>
            <h2 className="text-lg font-black text-white">{selectedGalleryItem.title}</h2>
            <div className="relative h-48 rounded-2xl overflow-hidden border border-neutral-800">
              <img src={selectedGalleryItem.image} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <span className="text-white font-black text-lg tracking-widest uppercase">BOKÉ ONE</span>
              </div>
            </div>
            <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-2xl space-y-2">
              <h4 className="text-xs font-bold text-amber-400">{isEn ? "Creator:" : "Auteur / Créateur :"} {selectedGalleryItem.creator}</h4>
              <p className="text-xs text-neutral-300 leading-relaxed">{selectedGalleryItem.bio}</p>
            </div>
            <div className="flex gap-3">
              <button 
                type="button"
                onClick={() => { setSelectedGalleryItem(null); navigate("/creators"); }}
                className="flex-1 bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-neutral-200 font-bold py-3 rounded-xl text-xs transition cursor-pointer"
              >
                {isEn ? "View full profile" : "Voir le profil complet"}
              </button>
              <button 
                type="button"
                onClick={() => setSelectedGalleryItem(null)}
                className="bg-amber-500 text-neutral-950 font-bold px-6 py-3 rounded-xl text-xs cursor-pointer hover:bg-amber-400 transition"
              >
                {isEn ? "Close" : "Fermer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALE D'INSCRIPTION / CONNEXION */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 relative shadow-2xl">
            <button 
              type="button"
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 bg-neutral-800 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold hover:bg-neutral-700 transition cursor-pointer"
            >
              ✕
            </button>

            <div className="flex bg-neutral-950 p-1.5 rounded-2xl border border-neutral-800">
              <button
                type="button"
                onClick={() => setAuthMode("register")}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                  authMode === "register" ? "bg-amber-500 text-neutral-950 shadow" : "text-neutral-400 hover:text-white"
                }`}
              >
                {isEn ? "Register" : "S'inscrire"}
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                  authMode === "login" ? "bg-amber-500 text-neutral-950 shadow" : "text-neutral-400 hover:text-white"
                }`}
              >
                {isEn ? "Sign In" : "Se connecter"}
              </button>
            </div>

            <div className="space-y-1 text-center">
              <h3 className="text-lg font-black text-white">
                {authMode === "register" 
                  ? (isEn ? "Join the Boké One Network" : "Rejoignez le réseau Boké One")
                  : (isEn ? "Boké One Member Access" : "Accès Membre Boké One")}
              </h3>
              <p className="text-xs text-neutral-400">
                {authMode === "register" 
                  ? (isEn ? "Create your account to confirm purchases and book creators." : "Créez votre compte pour valider vos achats et réserver vos prestations.") 
                  : (isEn ? "Sign in to retrieve your cart and bookmarks." : "Connectez-vous pour retrouver votre panier et vos favoris.")}
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-neutral-300">
                  {isEn ? "Email address" : "Adresse email"}
                </label>
                <input
                  type="email"
                  required
                  placeholder="nom@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-neutral-300">
                    {isEn ? "Password" : "Mot de passe"}
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[10px] text-amber-400 hover:underline cursor-pointer font-semibold"
                  >
                    {isEn ? "Forgot password?" : "Mot de passe oublié ?"}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-4 pr-10 py-3 text-xs text-white outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs cursor-pointer select-none"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold py-3.5 rounded-xl text-xs transition cursor-pointer shadow-lg"
              >
                {authMode === "register" 
                  ? (isEn ? "Create Account" : "Créer mon compte") 
                  : (isEn ? "Sign In" : "Se connecter")}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}