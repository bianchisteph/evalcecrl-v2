import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { supabase } from '../lib/supabase';
import { SKILLS, SESSIONS, SESSION_COLORS, CECRL_TO_NUMBER } from '../utils/constants';

// Enregistrer les composants Chart.js nécessaires
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function RadarChart({ student, onClose }) {
  const [allEvals, setAllEvals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllEvaluations();
  }, [student.id]);

  const loadAllEvaluations = async () => {
    try {
      const { data, error } = await supabase
        .from('evaluations')
        .select('*')
        .eq('student_id', student.id)
        .order('session_name');

      if (error) throw error;
      setAllEvals(data || []);
    } catch (err) {
      console.error('Erreur chargement évaluations :', err);
    } finally {
      setLoading(false);
    }
  };

  // Préparer les données Chart.js
  const labels = SKILLS.map((s) => s.label);

  const datasets = allEvals.map((ev) => {
    const colors = SESSION_COLORS[ev.session_name];
    const sessionInfo = SESSIONS.find((s) => s.id === ev.session_name);

    return {
      label: sessionInfo?.label || ev.session_name,
      data: SKILLS.map((skill) => {
        const val = ev[skill.key];
        return val ? CECRL_TO_NUMBER[val] : 0;
      }),
      backgroundColor: colors?.bg || 'rgba(99, 102, 241, 0.1)',
      borderColor: colors?.border || 'rgba(99, 102, 241, 0.8)',
      borderWidth: 2,
      pointBackgroundColor: colors?.border || 'rgba(99, 102, 241, 0.8)',
      pointBorderColor: '#fff',
      pointBorderWidth: 1,
      pointRadius: 4,
      pointHoverRadius: 6,
    };
  });

  const chartData = { labels, datasets };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#cbd5e1',
          font: { family: 'Inter', size: 12 },
          padding: 16,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: '#1e1b4b',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(99, 102, 241, 0.3)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: (ctx) => {
            const levels = ['', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
            return `${ctx.dataset.label}: ${levels[ctx.raw] || '—'}`;
          },
        },
      },
    },
    scales: {
      r: {
        min: 0,
        max: 6,
        ticks: {
          stepSize: 1,
          color: '#64748b',
          font: { size: 10 },
          backdropColor: 'transparent',
          callback: (value) => {
            const levels = ['', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
            return levels[value] || '';
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.06)',
        },
        angleLines: {
          color: 'rgba(255, 255, 255, 0.08)',
        },
        pointLabels: {
          color: '#cbd5e1',
          font: { family: 'Inter', size: 12, weight: 500 },
        },
      },
    },
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal modal-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">
            📊 Progression — {student.first_name} {student.last_name}
          </h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        {loading ? (
          <div className="text-center text-muted" style={{ padding: '60px 0' }}>
            Chargement des évaluations...
          </div>
        ) : allEvals.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📉</div>
            <div className="empty-state-title">Aucune évaluation</div>
            <div className="empty-state-text">
              Cet élève n'a pas encore d'évaluation enregistrée.
            </div>
          </div>
        ) : (
          <div style={{ maxWidth: 550, margin: '0 auto' }}>
            <Radar data={chartData} options={chartOptions} />

            {/* Légende détaillée des sessions */}
            <div className="mt-lg">
              <h4 style={{ fontSize: '0.9rem', marginBottom: 'var(--space-sm)', color: 'var(--text-secondary)' }}>
                Détail par session
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-sm)' }}>
                {allEvals.map((ev) => {
                  const sessionInfo = SESSIONS.find((s) => s.id === ev.session_name);
                  return (
                    <div
                      key={ev.session_name}
                      style={{
                        padding: 'var(--space-sm)',
                        background: 'var(--bg-card)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.8rem',
                      }}
                    >
                      <div className="font-medium" style={{ marginBottom: 4 }}>
                        {sessionInfo?.short}
                      </div>
                      <div className="flex gap-xs" style={{ flexWrap: 'wrap' }}>
                        {SKILLS.map((skill) => {
                          const val = ev[skill.key];
                          return val ? (
                            <span
                              key={skill.key}
                              className={`badge badge-${val.toLowerCase()}`}
                              title={skill.label}
                            >
                              {skill.short}: {val}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
