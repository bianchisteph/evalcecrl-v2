import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useTeacher } from '../context/TeacherContext';

export default function TeacherSelect() {
  const { selectTeacher, teacher } = useTeacher();
  const navigate = useNavigate();

  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [creating, setCreating] = useState(false);

  // Rediriger si déjà connecté
  useEffect(() => {
    if (teacher) {
      navigate('/classes');
    }
  }, [teacher, navigate]);

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('id, name, email')
        .order('name');

      if (error) throw error;
      setTeachers(data || []);
    } catch (err) {
      toast.error('Erreur de connexion à la base de données');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (t) => {
    selectTeacher(t);
    toast.success(`Bienvenue, ${t.name} !`);
    navigate('/classes');
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setCreating(true);
    try {
      const { data, error } = await supabase
        .from('teachers')
        .insert({
          name: newName.trim(),
          email: newEmail.trim() || null,
        })
        .select()
        .single();

      if (error) throw error;

      selectTeacher(data);
      toast.success(`Profil créé ! Bienvenue, ${data.name}`);
      navigate('/classes');
    } catch (err) {
      if (err.message?.includes('duplicate')) {
        toast.error('Cet email est déjà utilisé');
      } else {
        toast.error('Erreur : ' + err.message);
      }
    } finally {
      setCreating(false);
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
      <div className="animate-slide-up" style={{ width: '100%', maxWidth: 480 }}>
        {/* Logo & Titre */}
        <div className="text-center mb-lg">
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>📊</div>
          <h1 style={{ marginBottom: 'var(--space-xs)' }}>EvalCECRL</h1>
          <p className="text-muted">
            Suivi des compétences CECRL — Lycée professionnel
          </p>
        </div>

        {/* Carte de sélection */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              {showCreate ? 'Créer un profil' : 'Sélectionner un profil'}
            </h2>
          </div>

          {loading ? (
            <div className="text-center text-muted" style={{ padding: '40px 0' }}>
              Connexion à la base de données...
            </div>
          ) : showCreate ? (
            /* Formulaire de création */
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label htmlFor="teacher-name">Nom complet *</label>
                <input
                  id="teacher-name"
                  type="text"
                  className="input"
                  placeholder="Ex: Marie Dupont"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  autoFocus
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="teacher-email">Email (optionnel)</label>
                <input
                  id="teacher-email"
                  type="email"
                  className="input"
                  placeholder="Ex: m.dupont@lycee.fr"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>
              <div className="flex gap-sm">
                <button
                  type="button"
                  className="btn btn-secondary w-full"
                  onClick={() => setShowCreate(false)}
                >
                  ← Retour
                </button>
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={creating || !newName.trim()}
                >
                  {creating ? 'Création...' : 'Créer le profil'}
                </button>
              </div>
            </form>
          ) : (
            /* Liste des enseignants */
            <div>
              {teachers.length > 0 ? (
                <ul className="sidebar-list" style={{ marginBottom: 'var(--space-md)' }}>
                  {teachers.map((t) => (
                    <li
                      key={t.id}
                      className="sidebar-item"
                      onClick={() => handleSelect(t)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && handleSelect(t)}
                    >
                      <div className="flex items-center gap-sm">
                        <div className="navbar-avatar">
                          {t.name
                            .split(' ')
                            .map((w) => w[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                            {t.name}
                          </div>
                          {t.email && (
                            <div className="text-sm text-muted">{t.email}</div>
                          )}
                        </div>
                      </div>
                      <span style={{ color: 'var(--text-muted)' }}>→</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="empty-state" style={{ padding: 'var(--space-lg) 0' }}>
                  <div className="empty-state-icon">👋</div>
                  <div className="empty-state-title">Aucun profil trouvé</div>
                  <div className="empty-state-text">
                    Créez votre premier profil enseignant pour commencer.
                  </div>
                </div>
              )}
              <button
                className="btn btn-primary w-full"
                onClick={() => setShowCreate(true)}
              >
                + Créer un nouveau profil
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-muted text-sm mt-lg">
          Données sécurisées · Architecture GDPR-ready
        </div>
      </div>
    </div>
  );
}
