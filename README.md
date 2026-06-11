# EvalCECRL V2

Application web de suivi des compétences CECRL pour les enseignants d'anglais en lycée professionnel.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Fonctionnalités

- **Gestion multi-enseignants** : Chaque professeur gère ses propres classes et données
- **Gestion des classes** : Création de classes avec année scolaire, ajout/suppression d'élèves
- **Grille d'évaluation CECRL** : Saisie de masse des niveaux (A1→C2) pour 5 compétences langagières
- **6 sessions d'évaluation** : S1 à S6, réparties sur 3 ans de formation
- **Graphiques radar** : Visualisation de la progression d'un élève avec superposition des sessions
- **Architecture GDPR-ready & Sécurisée** : Isolation stricte par enseignant via authentification et politiques RLS actives

## 📚 Compétences évaluées

| Code | Compétence |
|------|-----------|
| CO | Écouter (Compréhension Orale) |
| CE | Lire (Compréhension Écrite) |
| EOC | S'exprimer en continu (Expression Orale en Continu) |
| EOI | Prendre part à une conversation (Expression Orale en Interaction) |
| EE | Écrire (Expression Écrite) |

## 🛠 Stack technique

- **Frontend** : React 19 + Vite
- **Base de données** : PostgreSQL via Supabase
- **Graphiques** : Chart.js + react-chartjs-2
- **Hébergement** : Vercel (gratuit) + Supabase (gratuit)

## 🚀 Démarrage rapide

### 1. Cloner le projet

```bash
git clone https://github.com/votre-user/evalcecrl-v2.git
cd evalcecrl-v2
```

### 2. Configurer Supabase

```bash
cp .env.example .env
# Éditez .env avec vos clés Supabase
```

### 3. Installer et lancer

```bash
npm install
npm run dev
```

L'application s'ouvre sur `http://localhost:5173`

## 📖 Documentation

- [Guide de déploiement complet](docs/deploy_guide.md)
- [Schéma SQL](supabase/schema.sql)

## 📁 Structure du projet

```
src/
├── main.jsx                 # Point d'entrée
├── App.jsx                  # Router
├── index.css                # Design system
├── lib/supabase.js          # Client Supabase
├── context/TeacherContext.jsx  # Contexte enseignant
├── utils/constants.js       # Constantes métier
├── pages/
│   ├── TeacherSelect.jsx    # Écran 1 : Connexion / Inscription
│   ├── ClassManage.jsx      # Écran 2 : Gestion classes
│   └── EvalGrid.jsx         # Écran 3 : Grille d'évaluation
└── components/
    ├── Layout.jsx           # Shell de l'app
    ├── StudentTable.jsx     # Tableau CRUD élèves
    ├── EvalSpreadsheet.jsx  # Grille tableur
    ├── SessionSelector.jsx  # Onglets sessions
    └── RadarChart.jsx       # Graphique radar
```

## 🔒 Architecture GDPR-ready

Le modèle de données est conçu pour être "Privacy by Design" :

- **Isolation** : Toutes les requêtes filtrent par `teacher_id`
- **RLS** : Policies Supabase actives par défaut sur toutes les tables (chaque utilisateur accède uniquement à ses données)
- **Chiffrement** : Colonnes `encrypted_*` prêtes pour la v2
- **Cascade** : `ON DELETE CASCADE` sur toutes les FK (droit à l'oubli)

## 📝 License

MIT
