import { createContext, useContext, useState, useEffect } from 'react';

const TeacherContext = createContext(null);

/**
 * Provider pour le teacher_id actif.
 * Stocke le profil enseignant en localStorage pour persister entre les sessions.
 * GDPR-ready : ce contexte sera remplacé par auth.uid() dans la v2.
 */
export function TeacherProvider({ children }) {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  // Charger le profil depuis localStorage au démarrage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('evalcecrl_teacher');
      if (stored) {
        setTeacher(JSON.parse(stored));
      }
    } catch {
      localStorage.removeItem('evalcecrl_teacher');
    }
    setLoading(false);
  }, []);

  const selectTeacher = (teacherData) => {
    setTeacher(teacherData);
    localStorage.setItem('evalcecrl_teacher', JSON.stringify(teacherData));
  };

  const logout = () => {
    setTeacher(null);
    localStorage.removeItem('evalcecrl_teacher');
  };

  return (
    <TeacherContext.Provider
      value={{
        teacher,
        teacherId: teacher?.id || null,
        loading,
        selectTeacher,
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
