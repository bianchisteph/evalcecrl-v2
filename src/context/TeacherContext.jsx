import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const TeacherContext = createContext(null);

/**
 * Provider pour le profil enseignant actif.
 * Synchronisé avec Supabase Auth.
 */
export function TeacherProvider({ children }) {
  const [session, setSession] = useState(null);
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  // Charger le profil enseignant depuis la table publique
  const fetchTeacherProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      setTeacher(data);
    } catch (err) {
      console.error('Erreur lors de la récupération du profil enseignant :', err);
      setTeacher(null);
    }
  };

  useEffect(() => {
    // 1. Récupérer la session active actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchTeacherProfile(session.user.id).finally(() => setLoading(false));
      } else {
        setTeacher(null);
        setLoading(false);
      }
    });

    // 2. Écouter les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        if (newSession?.user) {
          setLoading(true);
          await fetchTeacherProfile(newSession.user.id);
          setLoading(false);
        } else {
          setTeacher(null);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err) {
      console.error('Erreur lors de la déconnexion :', err);
    } finally {
      setTeacher(null);
      setLoading(false);
    }
  };

  return (
    <TeacherContext.Provider
      value={{
        session,
        teacher,
        teacherId: teacher?.id || null,
        loading,
        logout,
      }}
    >
      {children}
    </TeacherContext.Provider>
  );
}

/**
 * Hook pour accéder au contexte enseignant.
 */
export function useTeacher() {
  const ctx = useContext(TeacherContext);
  if (!ctx) {
    throw new Error('useTeacher doit être utilisé dans un TeacherProvider');
  }
  return ctx;
}
