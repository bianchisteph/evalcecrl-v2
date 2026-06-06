import { useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

export default function StudentTable({ students, classId, onStudentsChange }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;

    setAdding(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .insert({
          class_id: classId,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
        })
        .select()
        .single();

      if (error) throw error;

      onStudentsChange([...students, data]);
      setFirstName('');
      setLastName('');
      toast.success(`${data.first_name} ${data.last_name} ajouté(e)`);
    } catch (err) {
      toast.error('Erreur lors de l\'ajout : ' + err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (student) => {
    if (!window.confirm(`Supprimer ${student.first_name} ${student.last_name} et toutes ses évaluations ?`)) {
      return;
    }

    setDeletingId(student.id);
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', student.id);

      if (error) throw error;

      onStudentsChange(students.filter((s) => s.id !== student.id));
      toast.success('Élève supprimé(e)');
    } catch (err) {
      toast.error('Erreur : ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Formulaire d'ajout rapide */}
      <form onSubmit={handleAdd} className="flex gap-sm mb-md" style={{ flexWrap: 'wrap' }}>
        <input
          type="text"
          className="input"
          placeholder="Nom"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          style={{ flex: '1 1 140px', minWidth: 120 }}
          required
        />
        <input
          type="text"
          className="input"
          placeholder="Prénom"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          style={{ flex: '1 1 140px', minWidth: 120 }}
          required
        />
        <button
          type="submit"
          className="btn btn-primary btn-sm"
          disabled={adding || !firstName.trim() || !lastName.trim()}
        >
          {adding ? '...' : '+ Ajouter'}
        </button>
      </form>

      {/* Liste des élèves */}
      {students.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👩‍🎓</div>
          <div className="empty-state-title">Aucun élève</div>
          <div className="empty-state-text">
            Ajoutez des élèves avec le formulaire ci-dessus.
          </div>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th style={{ width: 40 }}>#</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th style={{ width: 60 }}></th>
              </tr>
            </thead>
            <tbody>
              {students
                .sort((a, b) => a.last_name.localeCompare(b.last_name))
                .map((student, idx) => (
                  <tr key={student.id} className="animate-slide-in">
                    <td className="text-muted">{idx + 1}</td>
                    <td className="font-medium">{student.last_name}</td>
                    <td>{student.first_name}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm btn-icon"
                        onClick={() => handleDelete(student)}
                        disabled={deletingId === student.id}
                        title="Supprimer"
                      >
                        {deletingId === student.id ? '...' : '✕'}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {students.length > 0 && (
        <div className="text-muted text-sm mt-sm">
          {students.length} élève{students.length > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
