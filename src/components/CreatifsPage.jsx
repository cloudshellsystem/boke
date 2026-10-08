import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const CREATORS_DATA = [
  { id: 1, name: "Lucas Bernard", specialty: "Photographe de Mariage & Mode", city: "Paris (75)", coverage: "Île-de-France & National", gear: "Sony A1 + Objectifs G-Master", bio: "Photographe professionnel basé à Paris, spécialisé dans les mariages d'exception et la mode éditoriale.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" },
  { id: 2, name: "Chloé Moreau", specialty: "Cinéaste & Réalisatrice", city: "Lyon (69)", coverage: "Auvergne-Rhône-Alpes", gear: "RED Komodo 6K + Dji Ronin", bio: "Créatrice de contenus visuels et documentaires, passionnée par la mise en valeur des marques et des paysages.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" },
  { id: 3, name: "Thomas Leroy", specialty: "Vidéaste Événementiel & Corporate", city: "Marseille (13)", coverage: "Sud de la France & Monaco", gear: "Canon EOS R5 C + Audio Sennheiser", bio: "Réalisation de films d'entreprise, couvertures d'événements et clips promotionnels dynamiques.", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150" },
  { id: 4, name: "Sarah Gauthier", specialty: "Photographe Portrait & Studio", city: "Bordeaux (33)", coverage: "Nouvelle-Aquitaine", gear: "Fujifilm GFX 100S + Éclairage Profoto", bio: "Spécialiste du portrait artistique, corporate et des shootings en lumière naturelle ou contrôlée.", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" },
  { id: 5, name: "Mehdi Benali", specialty: "Drone & Reportage Aérien", city: "Nice (06)", coverage: "Provence-Alpes-Côte d'Azur", gear: "DJI Inspire 3 + X9-8K Air", bio: "Pilote de drone professionnel certifié DGAC, spécialisé dans l'immobilier de luxe et le tourisme.", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150" },
  { id: 6, name: "Camille Rousseau", specialty: "Photographe Culinaire & Lifestyle", city: "Nantes (44)", coverage: "Grand Ouest & Paris", gear: "Nikon Z8 + Macro S-Line", bio: "Mise en scène et capture de projets culinaires pour les chefs, restaurants et marques agroalimentaires.", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150" }
];

export default function CreatorDirectory({ onRequireLogin }) {
  const { isLoggedIn } = useAuth();
  const { addToCart, cart } = useCart();
  const [selectedCreator, setSelectedCreator] = useState(null);

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
          <p className="text-sm text-neutral-400 max-w-xl mx-auto">Trouvez les meilleurs talents en France pour propulser vos projets visuels.</p>
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
      </div>
    </div>
  );
}