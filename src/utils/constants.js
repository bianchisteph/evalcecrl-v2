/**
 * Constantes métier EvalCECRL
 */

// Niveaux CECRL (ordonnés)
export const CECRL_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

// Mapping numérique pour les graphiques radar
export const CECRL_TO_NUMBER = {
  A1: 1,
  A2: 2,
  B1: 3,
  B2: 4,
  C1: 5,
  C2: 6,
};

// Sessions d'évaluation
export const SESSIONS = [
  { id: 'S1', label: 'S1 — Année 1 · Milieu', short: 'S1' },
  { id: 'S2', label: 'S2 — Année 1 · Fin', short: 'S2' },
  { id: 'S3', label: 'S3 — Année 2 · Milieu', short: 'S3' },
  { id: 'S4', label: 'S4 — Année 2 · Fin', short: 'S4' },
  { id: 'S5', label: 'S5 — Année 3 · Milieu', short: 'S5' },
  { id: 'S6', label: 'S6 — Année 3 · Fin', short: 'S6' },
];

// Compétences langagières (clés DB → labels FR)
export const SKILLS = [
  { key: 'skill_listening', label: 'Écouter', short: 'CO' },
  { key: 'skill_reading', label: 'Lire', short: 'CE' },
  { key: 'skill_speaking_continuous', label: 'S\'exprimer en continu', short: 'EOC' },
  { key: 'skill_speaking_interaction', label: 'Prendre part à une conversation', short: 'EOI' },
  { key: 'skill_writing', label: 'Écrire', short: 'EE' },
];

// Couleurs pour les sessions sur les graphiques radar
export const SESSION_COLORS = {
  S1: { bg: 'rgba(99, 102, 241, 0.15)', border: 'rgba(99, 102, 241, 0.8)' },
  S2: { bg: 'rgba(139, 92, 246, 0.15)', border: 'rgba(139, 92, 246, 0.8)' },
  S3: { bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.8)' },
  S4: { bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.8)' },
  S5: { bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.8)' },
  S6: { bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.8)' },
};

// Année scolaire courante (auto-calculée)
export function getCurrentAcademicYear() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed
  // Si on est entre septembre et décembre, l'année scolaire est year/year+1
  if (month >= 8) {
    return `${year}-${year + 1}`;
  }
  return `${year - 1}-${year}`;
}
