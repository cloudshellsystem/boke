import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function AuthForm({ onAuthSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState('client');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { role }
          }
        });
        if (error) throw error;
        setMessage('Inscription réussie ! Vérifiez vos e-mails ou connectez-vous.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (onAuthSuccess) onAuthSuccess();
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-quartz-900 border border-quartz-800 p-8 rounded-2xl shadow-2xl backdrop-blur-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-quartz-100">
          {isSignUp ? 'Rejoindre Boké One' : 'Connexion Espace Pro'}
        </h2>
        <p className="text-quartz-400 text-xs mt-1">Accédez à votre cockpit créatif et à votre CRM</p>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-amber-ember-500/10 border border-amber-ember-500/30 text-amber-ember-400 text-xs rounded-xl text-center">
          {message}
        </div>
      )}

      <form onSubmit={handleAuth} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-quartz-300 uppercase mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-quartz-950 border border-quartz-800 rounded-xl text-quartz-100 text-sm focus:outline-none focus:border-amber-ember-500"
            placeholder="votre@email.com"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-quartz-300 uppercase mb-1">Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-quartz-950 border border-quartz-800 rounded-xl text-quartz-100 text-sm focus:outline-none focus:border-amber-ember-500"
            placeholder="••••••••"
          />
        </div>

        {isSignUp && (
          <div>
            <label className="block text-xs font-bold text-quartz-300 uppercase mb-1">Type de Profil</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 bg-quartz-950 border border-quartz-800 rounded-xl text-quartz-100 text-sm focus:outline-none focus:border-amber-ember-500"
            >
              <option value="client">Client / Agence</option>
              <option value="creatif_abonne">Créatif Abonné</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-amber-ember-600 to-amber-ember-500 text-quartz-950 font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:scale-[1.02] transition"
        >
          {loading ? 'Chargement...' : (isSignUp ? "S'inscrire" : "Se connecter")}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-xs text-amber-ember-400 hover:underline font-semibold"
        >
          {isSignUp ? "Déjà un compte ? Connectez-vous" : "Pas de compte ? Inscrivez-vous"}
        </button>
      </div>
    </div>
  );
}