import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useTeacher } from '../context/TeacherContext';

export default function TeacherSelect() {
  const { teacher } = useTeacher();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  // Rediriger vers l'espace de gestion des classes si déjà connecté
  useEffect(() => {
    if (teacher) {
      navigate('/classes');
    }
  }, [teacher, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // Flux Connexion
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });
        if (error) throw error;
        toast.success('Connexion réussie !');
      } else {
        // Flux Inscription
        if (!name.trim()) {
          toast.error('Le nom complet est obligatoire pour l\'inscription.');
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
          options: {
            data: {
              name: name.trim(),
            },
          },
        });

        if (error) throw error;

        // Si la confirmation par email est activée sur Supabase, informer l'utilisateur
        if (data?.user && data.session === null) {
          toast.success('Compte créé ! Veuillez vérifier votre boîte mail pour confirmer votre inscription.');
          setIsLogin(true);
        } else {
          toast.success('Compte créé et connecté avec succès !');
        }
      }
    } catch (err) {
      toast.error(err.message || 'Une erreur est survenue.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1,
        padding: 'var(--space-md)',
      }}
    >
      <div className="animate-slide-up" style={{ width: '100%', maxWidth: 450 }}>
        {/* Logo & Titre */}
        <div className="text-center mb-lg">
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>📊</div>
          <h1 style={{ marginBottom: 'var(--space-xs)' }}>EvalCECRL</h1>
          <p className="text-muted">
            Suivi des compétences CECRL — Lycée professionnel
          </p>
        </div>

        {/* Carte d'authentification */}
        <div className="card">
          {/* Onglets Connexion / Inscription */}
          <div className="flex gap-sm mb-lg" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 'var(--space-sm)' }}>
            <button
              type="button"
              className={`btn ${isLogin ? 'btn-primary' : 'btn-ghost'} w-full`}
              onClick={() => {
                setIsLogin(true);
                setPassword('');
              }}
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              Connexion
            </button>
            <button
              type="button"
              className={`btn ${!isLogin ? 'btn-primary' : 'btn-ghost'} w-full`}
              onClick={() => {
                setIsLogin(false);
                setPassword('');
              }}
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              Créer un compte
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group animate-slide-in">
                <label htmlFor="reg-name">Nom complet *</label>
                <input
                  id="reg-name"
                  type="text"
                  className="input"
                  placeholder="Marie Dupont"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  autoComplete="name"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="auth-email">Email *</label>
              <input
                id="auth-email"
                type="email"
                className="input"
                placeholder="m.dupont@lycee.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="auth-password">Mot de passe *</label>
              <input
                id="auth-password"
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full mt-md"
              disabled={loading}
              style={{ padding: 'var(--space-md)' }}
            >
              {loading ? 'Traitement en cours...' : isLogin ? 'Se connecter' : 'Créer mon compte'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center text-muted text-sm mt-lg">
          Données sécurisées par Row-Level Security · Architecture GDPR-ready
        </div>
      </div>
    </div>
  );
}
