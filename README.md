# B3dev TP — Web Application

Application de **tchat en temps réel** réalisée dans le cadre de la formation **MyDigitalSchool (B3 Dev)**.

Stack : Vue.js 3 · Express · Socket.IO · MongoDB · Docker · Nginx

🌐 **[Démo en ligne](http://78.138.58.95/B3dev-TP_VUE/)** · 📄 **[Documentation complète](docs/tpWebApp.md)**

---

## Sommaire

- [Fonctionnalités](#fonctionnalités)
- [Stack technique](#stack-technique)
- [Installation locale](#installation-locale)
- [Variables d'environnement](#variables-denvironnement)
- [Scripts disponibles](#scripts-disponibles)
- [Tests](#tests)
- [Déploiement](#déploiement)
- [Structure du projet](#structure-du-projet)
- [Documentation](#documentation)

---

## Fonctionnalités

- **Inscription multi-étapes** — pseudo, mot de passe (bcrypt), choix couleur avatar
- **Authentification sécurisée** — cookie httpOnly, vérification à chaque page
- **Tchat temps réel** — Socket.IO, historique MongoDB, bulles de messages
- **Présence en ligne** — liste des connectés mise à jour en temps réel
- **Géolocalisation** — ville affichée au hover sur les utilisateurs connectés
- **DataTable** — tableau des utilisateurs avec nombre de messages et statut
- **Paramètres de compte** — changer la couleur d'avatar ou le mot de passe
- **Interface responsive** — menu hamburger mobile, sidebar repliable
- **PWA** — installable sur mobile et desktop

---

## Stack technique

| Couche | Technologie |
|---|---|
| Frontend | Vue.js 3 (Composition API), Vue Router 4 |
| Styles | Tailwind CSS v4 |
| Temps réel | Socket.IO v4 |
| Backend | Express.js |
| Base de données | MongoDB + Mongoose |
| Authentification | Cookie httpOnly + bcrypt |
| Tests | Vitest + Vue Test Utils |
| Conteneurisation | Docker + docker-compose |
| Reverse proxy | Nginx |
| CI/CD | GitHub Actions |

---

## Installation locale

### Prérequis

- Node.js ≥ 20
- MongoDB (local ou via Docker)

### 1. Cloner le dépôt

```bash
git clone https://github.com/RustyRory/B3dev-TP_VUE.git
cd B3dev-TP_VUE
```

### 2. Backend

```bash
cd express-project
npm install
# Créer le fichier .env (voir section Variables d'environnement)
node src/server.js
```

### 3. Frontend

```bash
cd my-project
npm install
# Créer le fichier .env (voir section Variables d'environnement)
npm run dev
```

### 4. MongoDB local

Si MongoDB n'est pas installé localement, le lancer via Docker :

```bash
docker run -d -p 27017:27017 --name mongo mongo
```

---

## Variables d'environnement

### `express-project/.env`

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=dev_secret_local
MONGO_URI=mongodb://localhost:27017/B3devTPVue
VITE_FRONTEND_ORIGIN=http://localhost:5173
VITE_FRONTEND_URL=http://localhost:5173
VITE_BACKEND_URL=http://localhost:3000
```

### `my-project/.env`

```env
VITE_BACKEND_URL=http://localhost:3000
VITE_FRONTEND_URL=http://localhost:5173
```

> Ces fichiers sont dans `.gitignore` et ne sont pas committés.

---

## Scripts disponibles

### Frontend (`my-project/`)

```bash
npm run dev        # Serveur de développement (Vite)
npm run build      # Build de production
npm run preview    # Prévisualisation du build
npm run test:unit  # Tests unitaires (Vitest)
```

### Backend (`express-project/`)

```bash
node src/server.js  # Démarrer le serveur
```

---

## Tests

```bash
cd my-project
npm run test:unit
```

20 tests unitaires répartis sur 4 fichiers :

```
✓ App.spec.js           — Montage du composant racine
✓ Button.spec.js        — Composant UI Button (variants, tailles, events)
✓ authVariables.spec.js — État global réactif
✓ authService.spec.js   — Service awaitAuth()
```

---

## Déploiement

Le déploiement est **automatisé via GitHub Actions** à chaque push sur `main`.

Le workflow :
1. Se connecte au VPS en SSH
2. Met à jour le code (`git reset --hard origin/main`)
3. Rebuild les containers Docker sans cache
4. Redémarre les services

Pour déployer manuellement sur le VPS :

```bash
cd /var/www
docker-compose down
docker-compose build --no-cache tp-vue-api tp-vue-front
docker-compose up -d
```

---

## Structure du projet

```
B3dev-TP_VUE/
│
├── my-project/              # Frontend Vue.js
│   ├── src/
│   │   ├── views/           # HomeView, AboutView, TchatView, RegisterView, SettingsView
│   │   ├── components/      # NavBar, ConnexionBox, ChatBox, UserList, DataTable, ui/
│   │   ├── router/          # Routes + guards d'authentification
│   │   ├── config/          # authVariables.js, config.js
│   │   └── service/         # authService.js
│   ├── public/              # manifest.json, favicon, icons
│   ├── src/__tests__/       # Tests unitaires Vitest
│   └── deployment/          # Dockerfile + nginx.conf
│
├── express-project/         # Backend Express
│   ├── src/
│   │   ├── models/          # User.js, Message.js
│   │   ├── routes/          # auth.js, users.js
│   │   ├── controllers/     # authController.js
│   │   └── server.js        # Point d'entrée + Socket.IO
│   └── deployment/          # Dockerfile
│
├── docs/
│   └── tpWebApp.md          # Documentation complète
│
├── .github/
│   └── workflows/
│       └── deploy.yml       # CI/CD GitHub Actions
│
└── docker-compose.dev.yml   # MongoDB local pour développement
```

---

## Documentation

La documentation technique complète est disponible dans [`docs/tpWebApp.md`](docs/tpWebApp.md).

Elle couvre :
- L'architecture du projet (frontend + backend)
- L'API REST et les événements Socket.IO
- Le formulaire d'inscription multi-étapes
- La géolocalisation
- La configuration Nginx et Docker
- Le CI/CD GitHub Actions
- Les tests unitaires
