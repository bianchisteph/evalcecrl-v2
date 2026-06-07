---
name: code-review-checklist
description: Systematic quality checks to run before committing code. Use this skill after implementing any feature, bugfix, or refactoring.
---

# Skill: Code Review Checklist

Systematic quality checks to run before committing code.

## When to use
Use this skill after implementing any feature, bugfix, or refactoring — BEFORE presenting the result to the user.

## Mandatory Checks

### 🔒 Sécurité & GDPR
- [ ] Toutes les requêtes sur `classes` filtrent par `teacher_id`
- [ ] Les requêtes sur `students` passent par `class_id` (chaîné au teacher_id)
- [ ] Les requêtes sur `evaluations` passent par `student_id` (chaîné au teacher_id via class)
- [ ] Aucune donnée sensible (noms d'élèves) dans les logs console
- [ ] Variables d'environnement préfixées `VITE_` pour le côté client
- [ ] Le `.env` n'est PAS versionné (vérifié dans `.gitignore`)

### 🧱 Architecture
- [ ] Pas d'import circulaire
- [ ] Le composant est dans le bon dossier (`pages/` vs `components/`)
- [ ] Les constantes métier sont dans `utils/constants.js` (pas hardcodées)
- [ ] Les textes UI sont en français
- [ ] Les commentaires techniques sont en anglais

### 🎨 UI/UX
- [ ] Loading state géré (pas de flash de contenu)
- [ ] Empty state géré avec icône + titre + description
- [ ] Confirmation `window.confirm()` avant les suppressions
- [ ] Toast feedback (succès ET erreur)
- [ ] Animations d'entrée (`.animate-fade-in` ou `.animate-slide-up`)
- [ ] Responsive : testé à 768px

### 📊 Données
- [ ] Les niveaux CECRL sont limités à A1-C2 (pas de valeurs arbitraires)
- [ ] Les sessions sont limitées à S1-S6
- [ ] Upsert utilisé pour les évaluations (pas d'insert)
- [ ] `.select()` chaîné après insert/upsert pour récupérer les données

### ⚡ Performance
- [ ] Pas de requête Supabase dans un useEffect sans dépendances correctes
- [ ] Pas de re-render inutile (state localisé au composant qui en a besoin)
- [ ] Pas de `.sort()` en place (toujours `[...array].sort()`)
- [ ] Pas d'opération N+1 (batch les requêtes)
