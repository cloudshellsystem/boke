import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const INITIAL_THREADS = [
  {
    id: 1,
    category: 'Général',
    title: 'Bienvenue sur le Forum Officiel Boké One',
    content: 'Bonjour à tous les créateurs, photographes et télépilotes de drone ! Cet espace est le vôtre.',
    type: 'Discussion',
    author: 'Admin Boké One',
    date: '10 oct. à 02:44'
  },
  {
    id: 2,
    category: 'Présentation',
    title: 'Présentation : Pilote de drone certifié BAPD / CATT',
    content: 'Salut la communauté ! Je rejoins Boké One pour proposer mes services de prises de vue aériennes.',
    type: 'Discussion',
    author: 'Thomas D.',
    date: '9 oct. à 21:44'
  }
];

export default function ForumPage({ onRequireLogin }) {
  const { isLoggedIn, user } = useAuth();
  const [threads, setThreads] = useState(INITIAL_THREADS);
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Général');
  const [newContent, setNewContent] = useState('');

  const handleCreateThread = (e) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    const newThread = {
      id: Date.now(),
      category: newCategory,
      title: newTitle,
      content: newContent,
      type: 'Discussion',
      author: user?.email?.split('@')[0] || 'Membre Boké One',
      date: 'À l’instant'
    };

    setThreads([newThread, ...threads]);
    setNewTitle('');
    setNewContent('');
    setShowNewThreadModal(false);
  };

  return (
    <div className="bg-neutral-950 text-neutral-100 min-h-screen p-4 md:p-8 space-y-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* En-tête sans compteurs fictifs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              💬 Forum Communautaire (France)
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Partagez vos projets, échangez vos astuces et collaborez avec d'autres créateurs.
            </p>
          </div>

          {!isLoggedIn ? (
            <button
              onClick={() => onRequireLogin?.()}
              className="bg-amber-500 hover:bg-amber-400 text-neutral-950 px-5 py-2.5 rounded-xl font-black text-xs transition cursor-pointer"
            >
              Se connecter pour publier ➔
            </button>
          ) : (
            <button
              onClick={() => setShowNewThreadModal(true)}
              className="bg-amber-500 hover:bg-amber-400 text-neutral-950 px-5 py-2.5 rounded-xl font-black text-xs transition cursor-pointer"
            >
              + Nouveau Sujet
            </button>
          )}
        </div>

        {/* Modal Nouveau Sujet */}
        {showNewThreadModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-w-lg w-full space-y-4">
              <h2 className="text-lg font-black text-white">Lancer une nouvelle discussion</h2>
              <form onSubmit={handleCreateThread} className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-neutral-400">Catégorie</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white"
                  >
                    <option value="Général">Général</option>
                    <option value="Présentation">Présentation</option>
                    <option value="Matériel & Drone">Matériel & Drone</option>
                    <option value="Missions & Offres">Missions & Offres</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-neutral-400">Titre</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-neutral-400">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewThreadModal(false)}
                    className="px-4 py-2 text-xs text-neutral-400 hover:text-white font-bold"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-400 text-neutral-950 px-4 py-2 rounded-xl text-xs font-black"
                  >
                    Publier
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Liste des Sujets */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 text-[10px] font-bold text-neutral-400 uppercase tracking-wider p-4 border-b border-neutral-800">
            <div className="col-span-6">Sujets / Catégories</div>
            <div className="col-span-2 hidden md:block">Type</div>
            <div className="col-span-2">Auteur</div>
            <div className="col-span-2 text-right">Date</div>
          </div>

          <div className="divide-y divide-neutral-800">
            {threads.map((thread) => (
              <div key={thread.id} className="grid grid-cols-12 p-4 items-center text-xs hover:bg-neutral-800/40 transition">
                <div className="col-span-6 space-y-1">
                  <span className="bg-amber-500/10 text-amber-500 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/20 mr-2">
                    {thread.category}
                  </span>
                  <span className="font-bold text-white">{thread.title}</span>
                  <p className="text-[11px] text-neutral-400 line-clamp-1">{thread.content}</p>
                </div>
                <div className="col-span-2 hidden md:block text-neutral-400">{thread.type}</div>
                <div className="col-span-2 font-bold text-amber-500/90">{thread.author}</div>
                <div className="col-span-2 text-right text-neutral-500 text-[11px]">{thread.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}