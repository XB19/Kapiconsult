# Kapi Consult — clone de kapiconsult.tg

- **frontend/** : React 18 + Vite + React Router — refonte v4 inspirée de togoinvest.tg, icônes Lucide (charte dans `src/styles/theme.css`, textes dans `src/content/`)
- **archive/** : versions précédentes du frontend (v1 = copie du site d'origine, v2 = première refonte, v3 = version éditoriale)
- **backend/** : API Node/Express + PostgreSQL (articles, produits, offres, FAQ, contact, candidatures, comptes candidats)
- **tools/** : scripts qui ont servi à convertir le HTML d'origine en JSX et à extraire les données

## Démarrage

1. PostgreSQL doit tourner sur `localhost:5432`. Les identifiants sont dans `backend/.env` (modèle : `backend/.env.example`).
2. Base de données (crée la base `kapiconsult`, les tables et charge le contenu) :
   ```
   cd backend
   npm install
   npm run db:setup
   npm run dev            # API sur http://localhost:4100
   ```
3. Frontend (dans un autre terminal) :
   ```
   cd frontend
   npm install
   npm run dev            # http://localhost:5173 (les appels /api sont redirigés vers le port 4100)
   ```

Production : `cd frontend && npm run build`, puis `cd backend && npm start` : l'API sert aussi le site sur http://localhost:4100.

## Pages
Accueil, À propos, Nos activités, Nos produits (+ filtres par catégorie et fiches), Actualités, Blog, Bons Plans (ZenCard, visionneuse),
articles, FAQ, Offres d'emploi (recherche/filtres), Candidature spontanée (envoi de CV), Contact, Connexion, Inscription, Mon compte.

## Tables PostgreSQL
`articles`, `produits`, `offres`, `faqs` (contenu du site), `contacts`, `candidatures`, `users` (données envoyées par les visiteurs).
Les CV envoyés sont stockés dans `backend/uploads/`.

## Administration du site

Espace réservé : **http://localhost:5175/admin** (connexion avec un compte administrateur).

- Tableau de bord : chiffres clés, derniers messages et candidatures, raccourcis.
- Contenus : articles / actualités / blog / bons plans (brouillon ou publié), produits, offres d'emploi, FAQ — avec envoi d'images.
- Demandes : messages du formulaire de contact (lu / non lu, réponse par email), candidatures (statut, téléchargement du CV et de la lettre).
- Accès : comptes utilisateurs, attribution du rôle administrateur.

Créer ou réinitialiser un administrateur :
```
cd backend
npm run admin:create -- admin@kapiconsult.tg            # mot de passe généré et affiché
npm run admin:create -- prenom.nom@domaine.tg MonMotDePasse Prénom Nom
```
Les images envoyées depuis l'administration sont stockées dans `backend/uploads/media/`.

## Docker

Prérequis : Docker Desktop (ou Docker Engine + Compose).

```
cp .env.docker.example .env      # puis renseigner les mots de passe
docker compose up -d --build
```

- Site : http://localhost:4100 — Administration : http://localhost:4100/admin
- Au premier démarrage, le schéma et le contenu du site sont créés automatiquement, ainsi que l'administrateur défini par `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
- Les données sont conservées dans les volumes `pgdata` (base) et `uploads` (CV, images envoyées).
- Le contenu existant n'est jamais écrasé au redémarrage. Réinitialisation complète : `docker compose exec app node src/db/setup.js --force`.
- Créer un autre administrateur : `docker compose exec app node src/db/create-admin.js prenom.nom@domaine.tg MotDePasse`.
