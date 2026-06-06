# Guide de Déploiement — EvalCECRL V2

Déployez l'application en moins de 10 minutes avec Supabase (gratuit) + Vercel (gratuit).

---

## Prérequis

- Un compte [Supabase](https://supabase.com) (gratuit)
- Un compte [Vercel](https://vercel.com) (gratuit)
- Un compte [GitHub](https://github.com) (gratuit)
- Node.js 18+ installé localement (pour le développement)

---

## Étape 1 — Créer le projet Supabase (3 min)

1. Rendez-vous sur [app.supabase.com](https://app.supabase.com)
2. Cliquez sur **"New Project"**
3. Configurez :
   - **Name** : `evalcecrl`
   - **Database Password** : choisissez un mot de passe fort (notez-le)
   - **Region** : sélectionnez **West EU (Ireland)** ou **Central EU (Frankfurt)** pour la conformité RGPD
4. Cliquez sur **"Create new project"** et attendez ~2 minutes

---

## Étape 2 — Créer les tables SQL (2 min)

1. Dans votre projet Supabase, allez dans **SQL Editor** (menu de gauche)
2. Cliquez sur **"New query"**
3. Copiez-collez l'intégralité du contenu du fichier [`supabase/schema.sql`](../supabase/schema.sql)
4. Cliquez sur **"Run"** (ou `Ctrl+Enter`)
5. Vérifiez que le message indique "Success. No rows returned" (c'est normal pour un DDL)

### Vérification

Allez dans **Table Editor** — vous devez voir 4 tables :
- `teachers`
- `classes`
- `students`
- `evaluations`

---

## Étape 3 — Récupérer les clés API (1 min)

1. Allez dans **Settings** > **API**
2. Notez ces 2 valeurs :
   - **Project URL** : `https://xxxxx.supabase.co`
   - **anon public key** : `eyJhbGciOiJIUz...` (la clé `anon`, pas la clé `service_role`)

---

## Étape 4 — Configurer le projet local (1 min)

1. Copiez le fichier `.env.example` vers `.env` :
   ```bash
   cp .env.example .env
   ```

2. Éditez `.env` avec vos clés Supabase :
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUz...
   ```

3. Installez les dépendances et lancez en local :
   ```bash
   npm install
   npm run dev
   ```

4. Ouvrez `http://localhost:5173` — l'application doit s'afficher !

---

## Étape 5 — Déployer sur Vercel (3 min)

### Option A : Via GitHub (recommandé)

1. Poussez votre code sur un repo GitHub :
   ```bash
   git init
   git add .
   git commit -m "Initial commit - EvalCECRL V2"
   git remote add origin https://github.com/votre-user/evalcecrl-v2.git
   git push -u origin main
   ```

2. Sur [vercel.com](https://vercel.com) :
   - Cliquez **"Add New Project"**
   - Importez votre repo GitHub
   - Vercel détecte automatiquement Vite

3. Ajoutez les **variables d'environnement** :
   - `VITE_SUPABASE_URL` → votre URL Supabase
   - `VITE_SUPABASE_ANON_KEY` → votre clé anon

4. Cliquez **"Deploy"** — C'est terminé ! 🎉

### Option B : Via Vercel CLI

```bash
npm install -g vercel
vercel --prod
```

Suivez les instructions et ajoutez les variables d'environnement quand demandé.

---

## Étape 6 — Configurer les accès Supabase (optionnel mais recommandé)

Par défaut, Supabase permet l'accès public via la clé `anon`. Pour le MVP, c'est suffisant. Mais pour plus de sécurité :

1. Allez dans **Settings** > **API** > **API Settings**
2. Ajoutez l'URL de votre site Vercel dans **Additional Redirect URLs**

---

## Résumé des coûts

| Service | Plan | Coût |
|---------|------|------|
| Supabase | Free Tier | 0 € (500 MB, 2 projets) |
| Vercel | Hobby | 0 € (100 GB bandwidth) |
| GitHub | Free | 0 € |
| **Total** | | **0 €/mois** |

---

## Dépannage

### "Erreur de connexion à la base de données"
→ Vérifiez que vos variables `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` sont correctes dans `.env` (local) ou dans les settings Vercel (production).

### "Permission denied" sur les tables
→ Assurez-vous que les RLS (Row Level Security) sont **désactivées** pour le MVP. Dans Supabase > Authentication > Policies, les tables ne doivent pas avoir de policies actives.

### Le build échoue sur Vercel
→ Vérifiez que le framework est bien détecté comme "Vite" et que les variables d'environnement commencent par `VITE_`.

---

## Évolution future (v2)

Pour passer à une version authentifiée :
1. Activer Supabase Auth
2. Décommenter les RLS policies dans `schema.sql` et les exécuter
3. Remplacer l'écran de sélection par un écran de login
4. Le reste du code reste inchangé grâce à l'architecture `teacher_id`
