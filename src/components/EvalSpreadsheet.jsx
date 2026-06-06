import { useState } from 'react';
import { SKILLS, CECRL_LEVELS } from '../utils/constants';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

export default function EvalSpreadsheet({
  students,
  session,
  evaluations,
  onEvaluationsChange,
  onShowRadar,
}) {
  const [saving, setSaving] = useState(false);

  // Créer une map student_id -> evaluation
  const evalMap = {};
  evaluations.forEach((ev) => {
    evalMap[ev.student_id] = ev;
  });

  // State local pour les modifications non sauvegardées
  const [localChanges, setLocalChanges] = useState({});

  const getSkillValue = (studentId, skillKey) => {
    // Priorité aux modifications locales
    if (localChanges[studentId]?.[skillKey] !== undefined) {
      return localChanges[studentId][skillKey];
    }
    return evalMap[studentId]?.[skillKey] || '';
  };

  const handleChange = (studentId, skillKey, value) => {
    setLocalChanges((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [skillKey]: value,
      },
    }));
  };

  const hasChanges = Object.keys(localChanges).length > 0;

  const handleSave = async () => {
    setSaving(true);
    try {
      // Construire les enregistrements à upsert
      const records = students
        .map((student) => {
          const existing = evalMap[student.id] || {};
          const changes = localChanges[student.id] || {};
          const merged = { ...existing, ...changes };

          // Vérifier s'il y a au moins une compétence renseignée
          const hasAnySkill = SKILLS.some((s) => merged[s.key]);
          if (!hasAnySkill && !Object.keys(changes).length) return null;

          return {
            student_id: student.id,
            session_name: session,
            skill_listening: merged.skill_listening || null,
            skill_reading: merged.skill_reading || null,
            skill_speaking_continuous: merged.skill_speaking_continuous || null,
            skill_speaking_interaction: merged.skill_speaking_interaction || null,
            skill_writing: merged.skill_writing || null,
          };
        })
        .filter(Boolean);

      if (records.length === 0) {
        toast('Aucune évaluation à sauvegarder', { icon: 'ℹ️' });
        setSaving(false);
        return;
      }

      const { data, error } = await supabase
        .from('evaluations')
        .upsert(records, { onConflict: 'student_id,session_name' })
        .select();

      if (error) throw error;

      // Mettre à jour les évaluations parentes
      onEvaluationsChange(data);
      setLocalChanges({});
      toast.success(`${records.length} évaluation(s) sauvegardée(s)`);
    } catch (err) {
      toast.error('Erreur de sauvegarde : ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const sortedStudents = [...students].sort((a, b) =>
    a.last_name.localeCompare(b.last_name)
  );

  return (
    <div className="animate-fade-in">
      <div className="table-wrapper">
        <table className="eval-grid-table">
          <thead>
            <tr>
              <th>Élève</th>
              {SKILLS.map((skill) => (
                <th key={skill.key} title={skill.label}>
                  {skill.short}
                </th>
              ))}
              <th>📊</th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.map((student) => (
              <tr key={student.id}>
                <td>
                  {student.last_name} {student.first_name}
                </td>
                {SKILLS.map((skill) => (
                  <td key={skill.key}>
                    <select
                      className="select select-compact"
                      value={getSkillValue(student.id, skill.key)}
                      onChange={(e) =>
                        handleChange(student.id, skill.key, e.target.value)
                      }
                    >
                      <option value="">—</option>
                      {CECRL_LEVELS.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </td>
                ))}
                <td>
                  <button
                    className="btn btn-ghost btn-sm btn-icon"
                    onClick={() => onShowRadar(student)}
                    title="Voir la progression"
                  >
                    📊
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-md" style={{ flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
        <span className="text-muted text-sm">
          {sortedStudents.length} élève{sortedStudents.length > 1 ? 's' : ''} ·
          Session {session}
          {hasChanges && (
            <span style={{ color: 'var(--accent-warning)', marginLeft: 8 }}>
              ● Modifications non sauvegardées
            </span>
          )}
        </span>
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saving || !hasChanges}
        >
          {saving ? 'Sauvegarde...' : '💾 Sauvegarder la grille'}
        </button>
      </div>
    </div>
  );
}
