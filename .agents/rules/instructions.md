# EvalCECRL V2 — Instructions Antigravity

## 🎯 Contexte Projet

EvalCECRL V2 est une application de suivi des compétences CECRL (Cadre Européen Commun de Référence pour les Langues) destinée aux enseignants d'anglais en lycée professionnel français. L'app permet d'évaluer les élèves sur 5 compétences langagières (CO, CE, EOC, EOI, EE) à travers 6 sessions sur 3 ans de formation.

## 🏗 Architecture & Stack

| Couche | Technologie | Version |
|--------|-------------|---------|
| Runtime | React | 19.x |
| Build | Vite | 8.x |
| Router | react-router-dom | 7.x |
| BDD | PostgreSQL / Supabase | - |
| Graphiques | Chart.js + react-chartjs-2 | 4.x / 5.x |
| Notifications | react-hot-toast | 2.x |
| CSS | Vanilla CSS (Design System custom) | - |
| Déploiement | Vercel + Supabase | - |

## 📁 Structure de Fichiers

```
src/
├── main.jsx                    → Point d'entrée, providers (BrowserRouter, TeacherProvider, Toaster)
├── App.jsx                     → Routes protégées (/, /classes, /eval/:classId)
├── index.css                   → Design system complet (tokens, composants, utilities)
├── lib/supabase.js             → Client Supabase avec mock client fallback
├── context/TeacherContext.jsx  → Context + hook useTeacher (localStorage-backed)
├── utils/constants.js          → Constantes métier CECRL (niveaux, sessions, skills, couleurs)
├── pages/
│   ├── TeacherSelect.jsx       → Sélection/création de profil enseignant
│   ├── ClassManage.jsx         → Gestion classes + liste élèves (split-layout)
│   └── EvalGrid.jsx            → Grille d'évaluation tableur + radar modale
│   └── components/
│       ├── Layout.jsx              → Navbar + shell applicatif
│       ├── StudentTable.jsx        → CRUD élèves (ajout inline, suppression)
│       ├── EvalSpreadsheet.jsx     → Grille de saisie bulk avec upsert
│       ├── SessionSelector.jsx     → Onglets S1-S6
│       └── RadarChart.jsx          → Graphique radar Chart.js (modale)
```

## 🔑 Règles Strictes

### Code
1. **Français partout en UI** : Tous les textes visibles par l'utilisateur DOIVENT être en français
2. **Anglais pour le code** : Variables, fonctions, commentaires techniques en anglais
3. **Composants fonctionnels uniquement** : Pas de class components, pas de HOCs
4. **Hooks React standards** : useState, useEffect, useContext, useParams, useNavigate — pas de bibliothèques tierces pour le state management
5. **Imports explicites** : Toujours déstructurer les imports React (`import { useState } from 'react'`)
6. **Pas de TypeScript** : Le projet est en JavaScript pur (JSX). Ne pas ajouter de types TS
7. **Export default pour les composants** : `export default function ComponentName()`

### Supabase
8. **Toujours filtrer par teacher_id** : Chaque requête sur `classes` DOIT inclure `.eq('teacher_id', teacherId)` pour l'isolation GDPR
9. **Upsert pour les évaluations** : Utiliser `.upsert(records, { onConflict: 'student_id,session_name' })` — jamais d'insert simple
10. **ON DELETE CASCADE** : Ne jamais supprimer manuellement les enfants — le schema SQL gère les cascades
11. **Gestion d'erreur systématique** : Chaque appel Supabase dans un try/catch avec `toast.error()`

### CSS / Design
12. **Pas de Tailwind** : Utiliser les classes CSS du design system dans `index.css`
13. **Design tokens** : Utiliser les variables CSS (`--accent`, `--bg-card`, `--space-md`, etc.)
14. **Glassmorphism** : Maintenir le thème sombre avec `backdrop-filter: blur()` et `rgba()`
15. **Animations** : Utiliser les classes `.animate-fade-in`, `.animate-slide-up`, `.animate-slide-in`

### Patterns
16. **Toast pour le feedback** : `toast.success()` pour les succès, `toast.error()` pour les erreurs — jamais d'alert()
17. **État de chargement** : Toujours afficher un indicateur pendant les requêtes async
18. **Empty states** : Toujours gérer l'état vide avec la structure `.empty-state` > `.empty-state-icon` + `.empty-state-title` + `.empty-state-text`
19. **Confirmation avant suppression** : `window.confirm()` obligatoire avant tout DELETE

## 🗃 Modèle de Données

```
teachers (1) ──→ classes (N) ──→ students (N) ──→ evaluations (N)
    │                │                 │                 │
    ├─ id (UUID PK)  ├─ id (UUID PK)  ├─ id (UUID PK)  ├─ id (UUID PK)
    ├─ name          ├─ teacher_id FK  ├─ class_id FK   ├─ student_id FK
    ├─ email         ├─ name           ├─ first_name    ├─ session_name (S1-S6)
    └─ created_at    ├─ academic_year  ├─ last_name     ├─ skill_listening (A1-C2)
                     └─ created_at     └─ created_at    ├─ skill_reading
                                                        ├─ skill_speaking_continuous
                                                        ├─ skill_speaking_interaction
                                                        ├─ skill_writing
                                                        ├─ created_at
                                                        └─ updated_at (trigger)
```

**Contrainte clé** : `UNIQUE(student_id, session_name)` sur `evaluations` — permet l'upsert.

## 🔮 Roadmap V2 (Contexte pour les Décisions)

- Supabase Auth (remplacement du localStorage)
- Activation des RLS policies (déjà écrites dans schema.sql)
- Chiffrement des données élèves (colonnes `encrypted_*` prêtes)
- Export PDF des bulletins
- Mode hors-ligne / PWA

## ⚠️ Pièges Connus

1. **Variables d'environnement** : Préfixe `VITE_` obligatoire pour l'accès côté client
2. **Mock client Supabase** : `lib/supabase.js` crée un client factice si `.env` n'est pas configuré — ne pas casser ce fallback
3. **Tri des élèves** : Le tri par `last_name` est fait côté composant ET côté Supabase — attention aux doublons de tri
4. **Session_name** : Valeurs strictement limitées à S1-S6 (CHECK constraint en DB)
5. **Niveaux CECRL** : Valeurs strictement limitées à A1, A2, B1, B2, C1, C2 (CHECK constraint en DB)
