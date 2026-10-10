import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function AdminForumModeration() {
  const [pendingTopics, setPendingTopics] = useState([]);
  const [pendingReplies, setPendingReplies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingContent();
  }, []);

  const fetchPendingContent = async () => {
    setLoading(true);

    // 1. Charger les sujets en attente
    const { data: topics } = await supabase
      .from('forum_topics')
      .select('*, profiles(full_name, plan, role)')
      .eq('status', 'en_attente')
      .order('created_at', { ascending: false });

    // 2. Charger les réponses en attente
    const { data: replies } = await supabase
      .from('forum_replies')
      .select('*, profiles(full_name, plan, role), forum_topics(title)')
      .eq('status', 'en_attente')
      .order('created_at', { ascending: false });

    setPendingTopics(topics || []);
    setPendingReplies(replies || []);
    setLoading(false);
  };

  // Approuver un sujet
  const approveTopic = async (id) => {
    const { error } = await supabase
      .from('forum_topics')
      .update({ status: 'approuve' })
      .eq('id', id);

    if (!error) fetchPendingContent();
  };

  // Rejeter/Supprimer un sujet
  const rejectTopic = async (id) => {
    const { error } = await supabase
      .from('forum_topics')
      .delete()
      .eq('id', id);

    if (!error) fetchPendingContent();
  };

  // Approuver une réponse
  const approveReply = async (id) => {
    const { error } = await supabase
      .from('forum_replies')
      .update({ status: 'approuve' })
      .eq('id', id);

    if (!error) fetchPendingContent();
  };

  // Rejeter/Supprimer une réponse
  const rejectReply = async (id) => {
    const { error } = await supabase
      .from('forum_replies')
      .delete()
      .eq('id', id);

    if (!error) fetchPendingContent();
  };

  if (loading) return <p className="p-6 text-center text-gray-500">Chargement des éléments en attente...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 font-sans">
      <h1 className="text-3xl font-bold text-gray-800">Modération du Forum — Boké One</h1>

      {/* Section Sujets en attente */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4 text-orange-600">Sujets en attente ({pendingTopics.length})</h2>
        {pendingTopics.length === 0 ? (
          <p className="text-gray-500 italic">Aucun sujet en attente de modération.</p>
        ) : (
          <div className="space-y-4">
            {pendingTopics.map((topic) => (
              <div key={topic.id} className="p-4 border rounded-lg bg-gray-50 flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-gray-800">{topic.title}</h3>
                  <p className="text-sm text-gray-600">{topic.content}</p>
                  <div className="text-xs text-gray-400">
                    Auteur : {topic.profiles?.full_name || 'Membre'} ({topic.profiles?.plan || 'Gratuit'}) — {new Date(topic.created_at).toLocaleString()}
                  </div>
                  {topic.image_url && <a href={topic.image_url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 underline block">Voir image</a>}
                  {topic.youtube_url && <a href={topic.youtube_url} target="_blank" rel="noreferrer" className="text-xs text-red-500 underline block">Voir vidéo YouTube</a>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => approveTopic(topic.id)} className="bg-green-600 text-white px-3 py-1 text-sm rounded hover:bg-green-700">Approuver</button>
                  <button onClick={() => rejectTopic(topic.id)} className="bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700">Refuser</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section Réponses en attente */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4 text-orange-600">Réponses en attente ({pendingReplies.length})</h2>
        {pendingReplies.length === 0 ? (
          <p className="text-gray-500 italic">Aucune réponse en attente de modération.</p>
        ) : (
          <div className="space-y-4">
            {pendingReplies.map((reply) => (
              <div key={reply.id} className="p-4 border rounded-lg bg-gray-50 flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-semibold bg-gray-200 text-gray-700 px-2 py-0.5 rounded">Sujet : {reply.forum_topics?.title}</span>
                  <p className="text-sm text-gray-800 mt-1">{reply.content}</p>
                  <div className="text-xs text-gray-400">
                    Auteur : {reply.profiles?.full_name || 'Membre'} — {new Date(reply.created_at).toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => approveReply(reply.id)} className="bg-green-600 text-white px-3 py-1 text-sm rounded hover:bg-green-700">Approuver</button>
                  <button onClick={() => rejectReply(reply.id)} className="bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700">Refuser</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}