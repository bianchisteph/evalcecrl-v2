import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useTeacher } from '../context/TeacherContext';
import { getCurrentAcademicYear } from '../utils/constants';
import StudentTable from '../components/StudentTable';

export default function ClassManage() {
  const { teacherId } = useTeacher();
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Formulaire nouvelle classe
  const [showNewClass, setShowNewClass] = useState(false);
  const [className, setClassName] = useState('');
  const [classYear, setClassYear] = useState(getCurrentAcademicYear());
  const [creatingClass, setCreatingClass] = useState(false);

  // Charger les classes du professeur
  useEffect(() => {
    if (teacherId) loadClasses();
  }, [teacherId]);

  const loadClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('teacher_id', teacherId)
        .order('academic_year', { ascending: false })
        .order('name');

      if (error) throw error;
      setClasses(data || []);

      // Sélectionner la première classe si aucune n'est sélectionnée
      if (data?.length > 0 && !selectedClass) {
        selectClass(data[0]);
      }
    } catch (err) {
      toast.error('Erreur chargement classes : ' + err.message);
    } finally {
      setLoadingClasses(false);
    }
  };

  const selectClass = async (cls) => {
    setSelectedClass(cls);
    setLoadingStudents(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('class_id', cls.id)
        .order('last_name');

      if (error) throw error;
      setStudents(data || []);
    } catch (err) {
      toast.error('Erreur chargement élèves : ' + err.message);
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!className.trim()) return;

    setCreatingClass(true);
    try {
      const { data, error } = await supabase
        .from('classes')
        .insert({
          teacher_id: teacherId,
          name: className.trim(),
          academic_year: classYear.trim(),
        })
        .select()
        .single();

      if (error) throw error;

      setClasses([data, ...classes]);
      selectClass(data);
      setClassName('');
      setShowNewClass(false);
      toast.success(`Classe "${data.name}" créée`);
    } catch (err) {
      toast.error('Erreur : ' + err.message);
    } finally {
      setCreatingClass(false);
    }
  };

  const handleDeleteClass = async (cls) => {
    if (
      !window.confirm(
        `Supprimer la classe "${cls.name}" et tous ses élèves/évaluations ?`
      )
    ) {
      return;
    }

    try {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', cls.id)
        .eq('teacher_id', teacherId); // Sécurité : filtrage teacher_id

      if (error) throw error;

      const updated = classes.filter((c) => c.id !== cls.id);
      setClasses(updated);

      if (selectedClass?.id === cls.id) {
        if (updated.length > 0) {
          selectClass(updated[0]);
        } else {
          setSelectedClass(null);
          setStudents([]);
        }
      }

      toast.success(`Classe "${cls.name}" supprimée`);
    } catch (err) {
      toast.error('Erreur : ' + err.message);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📚 Mes classes</h1>
        <p>Gérez vos classes et les listes d'élèves</p>
      </div>

      <div className="split-layout">
        {/* Sidebar — Liste des classes */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Classes</h3>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowNewClass(!showNewClass)}
            >
              {showNewClass ? '✕' : '+ Nouvelle'}
            </button>
          </div>

          {/* Formulaire nouvelle classe */}
          {showNewClass && (
            <form
              onSubmit={handleCreateClass}
              className="animate-slide-up"
              style={{
                marginBottom: 'var(--space-md)',
                padding: 'var(--space-md)',
                background: 'var(--bg-input)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div className="form-group">
                <label htmlFor="class-name">Nom de la classe</label>
                <input
                  id="class-name"
                  type="text"
                  className="input"
                  placeholder="Ex: 2BPM1"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  autoFocus
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="class-year">Année scolaire</label>
                <input
                  id="class-year"
                  type="text"
                  className="input"
                  placeholder="Ex: 2025-2026"
                  value={classYear}
                  onChange={(e) => setClassYear(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary w-full btn-sm"
                disabled={creatingClass || !className.trim()}
              >
                {creatingClass ? 'Création...' : 'Créer la classe'}
              </button>
            </form>
          )}

          {/* Liste */}
          {loadingClasses ? (
            <div className="text-center text-muted" style={{ padding: '20px 0' }}>
              Chargement...
            </div>
          ) : classes.length === 0 ? (
            <div className="empty-state" style={{ padding: 'var(--space-lg) 0' }}>
              <div className="empty-state-icon">📂</div>
              <div className="empty-state-text">
                Aucune classe. Cliquez sur "+ Nouvelle" pour commencer.
              </div>
            </div>
          ) : (
            <ul className="sidebar-list">
              {classes.map((cls) => (
                <li
                  key={cls.id}
                  className={`sidebar-item ${selectedClass?.id === cls.id ? 'active' : ''}`}
                  onClick={() => selectClass(cls)}
                >
                  <div>
                    <span className="font-medium">{cls.name}</span>
                    <span className="sidebar-item-year" style={{ marginLeft: 8 }}>
                      {cls.academic_year}
                    </span>
                  </div>
                  <button
                    className="btn btn-ghost btn-sm btn-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClass(cls);
                    }}
                    title="Supprimer la classe"
                    style={{ opacity: 0.5 }}
                  >
                    🗑
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Zone principale — Élèves */}
        <div className="card">
          {selectedClass ? (
            <>
              <div className="card-header">
                <div>
                  <h3 className="card-title">
                    {selectedClass.name}
                    <span
                      className="text-muted text-sm font-medium"
                      style={{ marginLeft: 8 }}
                    >
                      {selectedClass.academic_year}
                    </span>
                  </h3>
                </div>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => navigate(`/eval/${selectedClass.id}`)}
                  disabled={students.length === 0}
                  title={
                    students.length === 0
                      ? 'Ajoutez des élèves avant d\'évaluer'
                      : 'Évaluer cette classe'
                  }
                >
                  📝 Évaluer
                </button>
              </div>

              {loadingStudents ? (
                <div className="text-center text-muted" style={{ padding: '40px 0' }}>
                  Chargement des élèves...
                </div>
              ) : (
                <StudentTable
                  students={students}
                  classId={selectedClass.id}
                  onStudentsChange={setStudents}
                />
              )}
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">👈</div>
              <div className="empty-state-title">Sélectionnez une classe</div>
              <div className="empty-state-text">
                Choisissez une classe dans la liste ou créez-en une nouvelle.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
