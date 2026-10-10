import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Ajustez selon votre chemin d'import

export default function ForumPage({ user }) {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Formulaire nouveau sujet
  const [showNewTopicModal, setShowNewTopicModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newYoutubeUrl, setNewYoutubeUrl] = useState('');

  // Formulaire nouvelle réponse
  const [newReplyContent, setNewReplyContent] = useState('');

  useEffect(() => {
    fetchTopics();
  }, []);

  // 1. Récupérer le flux des sujets approuvés
  const fetchTopics = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('forum_feed')
      .select('*')
      .order('last_activity_at', { ascending: false });

    if (!error) setTopics(data || []);
    setLoading(false);
  };

  // 2. Ouvrir un sujet, incrémenter les vues et charger ses réponses
  const handleSelectTopic = async (topic) => {
    setSelectedTopic(topic);
    
    // Appel de la fonction RPC pour incrémenter les vues
    await supabase.rpc('increment_topic_views', { p_topic_id: topic.id });

    // Charger les réponses approuvées de ce sujet
    const { data } = await supabase
      .from('forum_replies_feed')
      .select('*')
      .eq('topic_id', topic.id)
      .order('created_at', { ascending: true });

    setReplies(data || []);
  };

  // 3. Poster un nouveau sujet (statut 'en_attente' par défaut)
  const handleCreateTopic = async (e) => {
    e.preventDefault();
    if (!user) return alert('Veuillez vous connecter pour publier.');

    const { error } = await supabase.from('forum_topics').insert([
      {
        title: newTitle,
        content: newContent,
        image_url: newImageUrl || null,
        youtube_url: newYoutubeUrl || null,
        author_id: user.id,
        status: 'en_attente'
      }
    ]);

    if (error) {
      alert('Erreur lors de la publication : ' + error.message);
    } else {
      alert('Votre sujet a été publié et est en attente de modération.');
      setShowNewTopicModal(false);
      setNewTitle('');
      setNewContent('');
      setNewImageUrl('');
      setNewYoutubeUrl('');
      fetchTopics();
    }
  };

  // 4. Poster une réponse
  const handleCreateReply = async (e) => {
    e.preventDefault();
    if (!user || !selectedTopic) return;

    const { error } = await supabase.from('forum_replies').insert([
      {
        topic_id: selectedTopic.id,
        author_id: user.id,
        content: newReplyContent,
        status: 'en_attente'
      }
    ]);

    if (error) {
      alert('Erreur : ' + error.message);
    } else {
      alert('Votre réponse a été envoyée et est en attente de modération.');
      setNewReplyContent('');
    }
  };

  // Helper pour afficher les badges de plan
  const renderBadge = (plan) => {
    switch (plan) {
      case 'admin': return <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">Admin</span>;
      case 'elite': return <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">Agence Élite</span>;
      case 'pro': return <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">Pro</span>;
      case 'decouverte': return <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">Découverte</span>;
      default: return <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded">Membre</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Forum Boké One</h1>
        {user && (
          <button
            onClick={() => setShowNewTopicModal(true)}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-700"
          >
            + Nouveau Sujet
          </button>
        )}
      </div>

      {/* Modal Nouveau Sujet */}
      {showNewTopicModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <form onSubmit={handleCreateTopic} className="bg-white p-6 rounded-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Créer un sujet de discussion</h2>
            <input
              type="text"
              placeholder="Titre du sujet"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full border p-2 mb-3 rounded"
              required
            />
            <textarea
              placeholder="Votre message (max 1000 caractères)..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              maxLength={1000}
              className="w-full border p-2 mb-3 rounded h-32"
              required
            />
            <input
              type="url"
              placeholder="Lien image optionnel (https://...)"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              className="w-full border p-2 mb-3 rounded"
            />
            <input
              type="url"
              placeholder="Lien YouTube optionnel"
              value={newYoutubeUrl}
              onChange={(e) => setNewYoutubeUrl(e.target.value)}
              className="w-full border p-2 mb-3 rounded"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewTopicModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Annuler
              </button>
              <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded">
                Soumettre pour validation
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Vue Liste ou Détail */}
      {!selectedTopic ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <p className="p-6 text-center text-gray-500">Chargement du forum...</p>
          ) : topics.length === 0 ? (
            <p className="p-6 text-center text-gray-500">Aucun sujet approuvé pour le moment.</p>
          ) : (
            diviserFlux(topics, handleSelectTopic, renderBadge)
          )}
        </div>
      ) : (
        <div>
          <button
            onClick={() => setSelectedTopic(null)}
            className="mb-4 text-orange-600 font-semibold hover:underline"
          >
            ← Retour aux discussions
          </button>
          
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-2xl font-bold">{selectedTopic.title}</h2>
              {renderBadge(selectedTopic.author_plan)}
            </div>
            <p className="text-sm text-gray-500 mb-4">Par {selectedTopic.author_name} — {new Date(selectedTopic.created_at).toLocaleDateString()}</p>
            <p className="text-gray-800 mb-4 whitespace-pre-line">{selectedTopic.content}</p>
            
            {selectedTopic.image_url && (
              <img src={selectedTopic.image_url} alt="Illustration" className="max-h-80 rounded mb-4 object-cover" />
            )}
            
            <div className="text-xs text-gray-400">Vues : {selectedTopic.views_count}</div>
          </div>

          {/* Réponses */}
          <h3 className="text-xl font-bold mb-4">Réponses</h3>
          <div className="space-y-4 mb-6">
            {replies.map((r) => (
              <div key={r.id} className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-sm">{r.author_name}</span>
                  {renderBadge(r.author_plan)}
                </div>
                <p className="text-gray-700">{r.content}</p>
              </div>
            ))}
          </div>

          {/* Formulaire Réponse */}
          {user ? (
            <form onSubmit={handleCreateReply} className="bg-white p-4 rounded-lg shadow">
              <textarea
                placeholder="Rédiger une réponse (max 1000 caractères)..."
                value={newReplyContent}
                onChange={(e) => setNewReplyContent(e.target.value)}
                maxLength={1000}
                className="w-full border p-2 mb-3 rounded h-24"
                required
              />
              <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded">
                Répondre (soumis à modération)
              </button>
            </form>
          ) : (
            <p className="text-gray-500 italic">Connectez-vous pour participer à la discussion.</p>
          )}
        </div>
      )}
    </div>
  );
}

function diviserFlux(topics, onSelect, renderBadge) {
  return topics.map((t) => (
    <div
      key={t.id}
      onClick={() => onSelect(t)}
      className="p-4 border-b hover:bg-gray-50 cursor-pointer flex justify-between items-center"
    >
      <div>
        <h3 className="font-bold text-lg text-gray-800">{t.title}</h3>
        <p className="text-sm text-gray-500">Par {t.author_name} • {t.replies_count} réponses • {t.views_count} vues</p>
      </div>
      <div>{renderBadge(t.author_plan)}</div>
    </div>
  ));
}