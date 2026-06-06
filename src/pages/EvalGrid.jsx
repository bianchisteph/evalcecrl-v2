import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useTeacher } from '../context/TeacherContext';
import SessionSelector from '../components/SessionSelector';
import EvalSpreadsheet from '../components/EvalSpreadsheet';
import RadarChart from '../components/RadarChart';

export default function EvalGrid() {
  const { classId } = useParams();
  const { teacherId } = useTeacher();
  const navigate = useNavigate();

  const [classInfo, setClassInfo] = useState(null);
  const [students, setStudents] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [activeSession, setActiveSession] = useState('S1');
  const [loading, setLoading] = useState(true);
  const [radarStudent, setRadarStudent] = useState(null);

  useEffect(() => {
    loadClassData();
  }, [classId, teacherId]);

  useEffect(() => {
    if (students.length > 0) {
      loadEvaluations();
    }
  }, [activeSession, students]);

  const loadClassData = async () => {
    setLoading(true);
    try {
      // Charger la classe (avec vérification teacher_id)
      const { data: cls, error: clsErr } = await supabase
        .from('classes')
        .select('*')
        .eq('id', classId)
        .eq('teacher_id', teacherId)
        .single();

      if (clsErr) throw clsErr;
      setClassInfo(cls);

      // Charger les élèves
      const { data: studs, error: studErr } = await supabase
        .from('students')
        .select('*')
        .eq('class_id', classId)
        .order('last_name');

      if (studErr) throw studErr;
      setStudents(studs || []);
    } catch (err) {
      toast.error('Classe introuvable ou accès refusé');
      navigate('/classes');
    } finally {
      setLoading(false);
    }
  };

  const loadEvaluations = async () => {
    try {
      const studentIds = students.map((s) => s.id);

      const { data, error } = await supabase
        .from('evaluations')
        .select('*')
        .in('student_id', studentIds)
        .eq('session_name', activeSession);

      if (error) throw error;
      setEvaluations(data || []);
    } catch (err) {
      toast.error('Erreur chargement évaluations : ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="page-container text-center" style={{ paddingTop: '20vh' }}>
        <div className="text-muted">Chargement de la classe...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* En-tête */}
      <div className="page-header">
        <div className="flex items-center gap-md" style={{ flexWrap: 'wrap' }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => navigate('/classes')}
          >
            ← Retour
          </button>
          <div>
            <h1>
              📝 {classInfo?.name}
              <span
                className="text-muted text-sm"
                style={{ marginLeft: 12, fontWeight: 400 }}
              >
                {classInfo?.academic_year}
              </span>
            </h1>
            <p className="text-muted">
              Grille d'évaluation CECRL — {students.length} élève
              {students.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Sélecteur de session */}
      <div className="mb-lg">
        <SessionSelector
          activeSession={activeSession}
          onSelect={setActiveSession}
        />
      </div>

      {/* Grille d'évaluation */}
      {students.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <div className="empty-state-title">Aucun élève dans cette classe</div>
            <div className="empty-state-text">
              Retournez à la gestion de classe pour ajouter des élèves.
            </div>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/classes')}
            >
              ← Gérer la classe
            </button>
          </div>
        </div>
      ) : (
        <div className="card">
          <EvalSpreadsheet
            students={students}
            session={activeSession}
            evaluations={evaluations}
            onEvaluationsChange={(newEvals) => setEvaluations(newEvals)}
            onShowRadar={(student) => setRadarStudent(student)}
          />
        </div>
      )}

      {/* Modale Radar */}
      {radarStudent && (
        <RadarChart
          student={radarStudent}
          onClose={() => setRadarStudent(null)}
        />
      )}
    </div>
  );
}
