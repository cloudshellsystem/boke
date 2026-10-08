import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const CREATORS_DATA = [
  { id: 1, name: "Dominique Diallo", specialty: "Photographe de Mariage", city: "Conakry", coverage: "Rayon de 100 km", gear: "Sony A7IV + 24-70mm f/2.8", bio: "Passionné par la capture de moments authentiques et d'émotions pures à travers la Guinée.", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" },
  { id: 2, name: "Mamadou Camara", specialty: "Cinéaste / Réalisateur", city: "Kamsar", coverage: "National & International", gear: "FX6 + DJI Ronin RS3 Pro", bio: "Réalisation de clips vidéo, de documentaires institutionnels et de courts-métrages de haute qualité.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" },
  { id: 3, name: "Mariama Sylla", specialty: "Vidéaste Événementiel", city: "Kindia", coverage: "Région de Kindia & Conakry", gear: "Canon R5 + Éclairage Aputure", bio: "Création de contenus dynamiques pour les réseaux sociaux, interviews et couvertures d'événements corporatifs.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" },
  { id: 4, name: "Ibrahima Barry", specialty: "Photographe Mode & Studio", city: "Conakry", coverage: "Conakry centre", gear: "Fujifilm GFX 50S II", bio: "Spécialiste du portrait studio et des campagnes publicitaires pour de grandes marques locales.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" },
  { id: 5, name: "Fatou Sow", specialty: "Drone & Reportage Aérien", city: "Labé", coverage: "Moyenne-Guinée", gear: "DJI Mavic 3 Cine", bio: "Captions aériennes spectaculaires pour l'immobilier, le tourisme et les documentaires.", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150" },
  { id: 6, name: "Alpha Oumar Bah", specialty: "Photographe Culinaire & Produit", city: "Conakry", coverage: "Grand Conakry", gear: "Nikon Z8 + Objectifs Macro", bio: "Mise en valeur des produits locaux et de la gastronomie guinéenne avec un éclairage soigné.", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150" }
];

export default function CreatorDirectory({ onRequireLogin }) {
  const { isLoggedIn } = useAuth();
  const { addToCart, cart } = useCart();
  const [selectedCreator, setSelectedCreator] = useState(null);

  // Si l'utilisateur n'est pas connecté, on bloque l'accès à l'annuaire
  if (!isLoggedIn) {
    return (
      <div className="bg-neutral-950 min-h-[80vh] flex flex-col items-center justify-center p-6 text-center text-neutral-200">
        <div className="max-w-md bg-neutral-900 border border-neutral-800 p-8 rounded-3xl shadow-2xl">
          <span className="text-4xl mb-4 block">🔒</span>
          <h2 className="text-2xl font-black text-amber-400 mb-3">Accès Réservé</h2>
          <p className="text-sm text-neutral-400 mb-6">L'annuaire national des créateurs est strictement réservé à nos membres connectés.</p>
          <button onClick={onRequireLogin} className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold py-3 px-6 rounded-xl transition">
            Se connecter / S'inscrire
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-950 min-h-screen p-6 text-neutral-200 font-sans">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-black text-amber-400 mb-3">Annuaire National des Créateurs</h1>
          <p className="text-sm text-neutral-400 max-w-xl mx-auto">Trouvez les meilleurs talents pour propulser vos projets visuels.</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CREATORS_DATA.map((creator) => {
            const isInCart = cart.some((item) => item.id === creator.id);
            return (
              <div key={creator.id} className="rounded-2xl border border-neutral-900 bg-neutral-900/40 p-5 flex flex-col justify-between hover:border-amber-500/30 transition">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <img src={creator.avatar} alt={creator.name} className="h-14 w-14 rounded-full object-cover border border-amber-500/20" />
                    <div>
                      <h3 className="text-lg font-bold text-neutral-100">{creator.name}</h3>
                      <p className="text-xs text-amber-400 font-semibold">{creator.specialty}</p>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-xs text-neutral-400 mb-4 bg-neutral-950/40 p-3 rounded-xl border border-neutral-900">
                    <p><strong className="text-neutral-300">Ville :</strong> {creator.city}</p>
                    <p><strong className="text-neutral-300">Déplacement :</strong> {creator.coverage}</p>
                    <p><strong className="text-neutral-300">Matériel :</strong> {creator.gear}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-neutral-900 pt-4 mt-2">
                  <button onClick={() => setSelectedCreator(creator)} className="rounded-xl bg-neutral-900 border border-neutral-800 px-4 py-2 text-xs font-semibold text-neutral-300 hover:text-amber-400 transition">
                    Profil complet
                  </button>
                  <button onClick={() => addToCart(creator)} disabled={isInCart} className="rounded-xl bg-amber-500 hover:bg-amber-400 px-4 py-2 text-xs font-bold text-neutral-950 disabled:opacity-40 transition">
                    {isInCart ? "Ajouté" : "Réserver"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {selectedCreator && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-lg w-full p-6 text-neutral-200 relative shadow-2xl">
              <button onClick={() => setSelectedCreator(null)} className="absolute top-4 right-4 text-neutral-400 hover:text-white font-bold text-lg">✕</button>
              <div className="flex items-center gap-4 mb-6">
                <img src={selectedCreator.avatar} className="h-16 w-16 rounded-full object-cover border border-amber-500/30" />
                <div>
                  <h2 className="text-xl font-bold text-amber-400">{selectedCreator.name}</h2>
                  <p className="text-xs text-neutral-300">{selectedCreator.specialty} • {selectedCreator.city}</p>
                </div>
              </div>
              <div className="space-y-4 text-xs text-neutral-300 border-t border-neutral-800 pt-4">
                <div>
                  <strong className="text-neutral-500 block uppercase mb-1">Biographie</strong>
                  <p>{selectedCreator.bio}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                  <div>
                    <strong className="text-neutral-500 block uppercase mb-0.5">Zone de Déplacement</strong>
                    <span>{selectedCreator.coverage}</span>
                  </div>
                  <div>
                    <strong className="text-neutral-500 block uppercase mb-0.5">Matériel Principal</strong>
                    <span>{selectedCreator.gear}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}