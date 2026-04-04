# Documentation de projet — TP B3dev Web Application

> VueJs · ExpressJs · Socket.IO · MongoDB · Docker · Nginx

---

## Sommaire

1. [Objectif du TP](#1-objectif-du-tp)
2. [Ce que j'ai réalisé](#2-ce-que-jai-réalisé)
3. [Projet Express (Backend)](#3-projet-express-backend)
   - [Initialisation](#initialisation)
   - [Structure](#structure)
   - [API REST](#api-rest)
   - [WebSocket Socket.IO](#websocket-socketio)
   - [Modèles MongoDB](#modèles-mongodb)
   - [Configuration](#configuration-backend)
4. [Projet Vue (Frontend)](#4-projet-vue-frontend)
   - [Initialisation](#initialisation-1)
   - [Structure](#structure-1)
   - [Vues](#vues)
   - [Composants](#composants)
   - [Composants UI](#composants-ui-shadcn-inspired)
   - [Router & Guards](#router--guards)
   - [État global](#état-global)
   - [Configuration](#configuration-frontend)
5. [Authentification & Sécurité](#5-authentification--sécurité)
6. [Tchat temps réel](#6-tchat-temps-réel)
7. [Géolocalisation](#7-géolocalisation)
8. [PWA](#8-pwa)
9. [Tests unitaires](#9-tests-unitaires)
10. [VPS — Infrastructure](#10-vps--infrastructure)
    - [Création utilisateur & SSH](#création-utilisateur--ssh)
    - [Nginx](#nginx)
    - [Docker](#docker)
    - [MongoDB](#mongodb)
    - [Structure des dossiers](#structure-des-dossiers-vps)
    - [Docker Compose](#docker-compose)
    - [Nginx reverse proxy](#nginx-reverse-proxy)
11. [CI/CD GitHub Actions](#11-cicd-github-actions)

---

## 1. Objectif du TP

Formation **MyDigitalSchool** — réaliser une web application avec Vue.js et Express.

Consignes principales :
- Créer son propre composant `NavBar` en `.vue` pour avoir plusieurs pages
- Utiliser une bibliothèque de composants (comparatif)
- Créer un formulaire sur plusieurs étapes avec possibilité de revenir en arrière
- Installer une transition entre les pages
- Utiliser une API avec des appels REST
- Utiliser un environnement de test
- Mise en production avec CI/CD sur VPS
- Utiliser des ressources internes : stockage interne, géolocalisation, notifications…

Bonus : intégrer le tout dans Docker.

---

## 2. Ce que j'ai réalisé

Web app de **tchat en temps réel** avec inscription, authentification et gestion de compte, déployée sur VPS.

| Fonctionnalité | Statut |
|---|---|
| NavBar custom responsive (hamburger mobile) | ✅ |
| Bibliothèque UI custom inspirée de shadcn (Button, Input, Card) | ✅ |
| Formulaire d'inscription multi-étapes (pseudo, mot de passe, avatar) | ✅ |
| Authentification par pseudo + mot de passe (bcrypt + cookie) | ✅ |
| API REST (register, login, logout, me, update, users) | ✅ |
| Chat temps réel Socket.IO (historique MongoDB + broadcast) | ✅ |
| Présence en ligne des utilisateurs (connect/disconnect temps réel) | ✅ |
| Géolocalisation par IP (ville affichée au hover) | ✅ |
| Page Espace : onglets Tchat / DataTable | ✅ |
| DataTable : compteur de messages, statut en ligne | ✅ |
| Page Paramètres (changer couleur avatar, changer mot de passe) | ✅ |
| Navigation gardée (routes protégées si non connecté) | ✅ |
| PWA (manifest.json + meta tags, installable) | ✅ |
| Tests unitaires Vitest + Vue Test Utils | ✅ |
| Déploiement VPS avec Docker + Nginx | ✅ |
| CI/CD GitHub Actions | ✅ |

---

## 3. Projet Express (Backend)

### Initialisation

```bash
mkdir express-project && cd express-project
npm init -y
npm install express cors cookie-parser dotenv mongoose socket.io bcrypt
```

### Structure

```
express-project/
│
├── src/
│   ├── models/
│   │   ├── User.js        — pseudo, password (hash), color, createdAt, lastMessageAt
│   │   └── Message.js     — pseudo, message, createdAt
│   │
│   ├── routes/
│   │   ├── auth.js        — register, login, logout, me, check-pseudo, update
│   │   └── users.js       — liste des utilisateurs avec compteur messages
│   │
│   ├── controllers/
│   │   └── authController.js
│   │
│   ├── config/
│   │   └── config.js
│   │
│   └── server.js          — Express + Socket.IO + MongoDB
│
├── deployment/
│   └── Dockerfile
└── package.json
```

### API REST

| Méthode | Route | Description | Auth requise |
|---|---|---|---|
| `POST` | `/api/auth/register` | Inscription (pseudo, password, color) | Non |
| `POST` | `/api/auth/login` | Connexion, pose un cookie | Non |
| `POST` | `/api/auth/logout` | Déconnexion, supprime le cookie | Non |
| `GET` | `/api/auth/me` | Retourne pseudo + color si connecté | Cookie |
| `GET` | `/api/auth/check-pseudo` | Vérifie la disponibilité d'un pseudo | Non |
| `PUT` | `/api/auth/update` | Modifie la couleur ou le mot de passe | Cookie |
| `GET` | `/api/users` | Liste des users avec `messageCount` | Non |

### WebSocket Socket.IO

| Événement | Direction | Description |
|---|---|---|
| `rejoindre` | client → serveur | Annonce pseudo + ville (géoloc IP) |
| `historique` | serveur → client | 50 derniers messages depuis MongoDB |
| `nouveauMessage` | client → serveur | Envoi d'un message |
| `message` | serveur → tous | Broadcast du message |
| `usersOnline` | serveur → tous | Liste `[{ pseudo, city }]` des connectés |
| `disconnect` | auto | Mise à jour de la liste en ligne |

Les messages sont **sanitisés** côté serveur (`<` → `&lt;`) avant stockage.

### Modèles MongoDB

**User**
```js
{
  pseudo:        String  // requis, unique
  password:      String  // hash bcrypt, requis
  color:         String  // classe Tailwind, défaut: 'bg-gray-500'
  createdAt:     Date    // auto
  lastMessageAt: Date    // mis à jour à chaque message
}
```

**Message**
```js
{
  pseudo:    String  // requis
  message:   String  // requis, sanitisé
  createdAt: Date    // auto
}
```

### Configuration backend

`.env` (ne pas committer) :
```env
PORT=3000
NODE_ENV=production

JWT_SECRET=ton_secret_jwt_ici
MONGO_URI=mongodb://mongo:27017/B3devTPVue

VITE_FRONTEND_ORIGIN=http://IP_VPS
VITE_FRONTEND_URL=http://IP_VPS/B3dev-TP_VUE/
VITE_BACKEND_URL=http://IP_VPS/B3dev-TP_VUE/api
```

`.env` local :
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=dev_secret_local
MONGO_URI=mongodb://localhost:27017/B3devTPVue
VITE_FRONTEND_ORIGIN=http://localhost:5173
VITE_FRONTEND_URL=http://localhost:5173
VITE_BACKEND_URL=http://localhost:3000
```

---

## 4. Projet Vue (Frontend)

### Initialisation

```bash
npm create vue@latest
cd my-project
npm install
npm install socket.io-client vue-cookies
```

### Structure

```
my-project/
│
├── src/
│   ├── views/
│   │   ├── HomeView.vue       — accueil : hero + 3 features + CTA
│   │   ├── AboutView.vue      — objectifs, fonctionnalités, GitHub
│   │   ├── TchatView.vue      — page protégée : onglets Tchat / DataTable
│   │   ├── RegisterView.vue   — inscription multi-étapes (3 steps)
│   │   └── SettingsView.vue   — paramètres compte (couleur, mot de passe)
│   │
│   ├── components/
│   │   ├── NavBar.vue         — navigation responsive + hamburger mobile
│   │   ├── ConnexionBox.vue   — login/logout, layouts desktop et mobile
│   │   ├── ChatBox.vue        — interface chat (Socket.IO)
│   │   ├── UserList.vue       — liste des users, statut en ligne, tooltip ville
│   │   ├── DataTable.vue      — tableau users, messageCount, statut, tooltip ville
│   │   └── ui/
│   │       ├── Button.vue     — variants: default, outline, ghost, destructive
│   │       ├── Input.vue      — v-model, prop error (bordure rouge)
│   │       └── Card.vue       — conteneur carte
│   │
│   ├── router/
│   │   └── index.js           — routes + guards (tchat, settings protégés)
│   │
│   ├── config/
│   │   ├── authVariables.js   — isLogged, pseudo, color, isLoading (refs globales)
│   │   └── config.js          — URLs backend/frontend depuis .env
│   │
│   ├── service/
│   │   └── authService.js     — awaitAuth() : attend la fin du chargement auth
│   │
│   └── assets/
│       └── main.css           — @import "tailwindcss" + base styles
│
├── public/
│   ├── manifest.json          — PWA manifest
│   ├── favicon.ico
│   └── icons/icon.svg         — icône de l'app
│
├── src/__tests__/             — tests unitaires Vitest
├── deployment/
│   ├── Dockerfile
│   └── nginx.conf
├── vite.config.js
├── vitest.config.js
└── postcss.config.js
```

### Vues

| Vue | Route | Protégée | Description |
|---|---|---|---|
| `HomeView` | `/` | Non | Hero, 3 features, CTA contextuel |
| `AboutView` | `/about` | Non | Objectifs, fonctionnalités, GitHub |
| `RegisterView` | `/register` | Non | Formulaire 3 étapes |
| `TchatView` | `/tchat` | ✅ | Tchat + DataTable (onglets) |
| `SettingsView` | `/settings` | ✅ | Paramètres du compte |

### Composants

**NavBar** — sticky, `z-50`, blur backdrop. Desktop : liens + ConnexionBox. Mobile : hamburger → menu déroulant avec profil utilisateur, liens avec icônes, ConnexionBox verticale.

**ConnexionBox** — prop `layout` (`desktop` | `mobile`). Desktop : inputs compacts, erreur en dropdown. Mobile : champs pleine largeur empilés, erreur inline. Quand connecté : avatar coloré, pseudo, ⚙ paramètres, déconnexion.

**ChatBox** — messages en bulles (propres à droite, autres à gauche), auto-scroll, envoi par Entrée ou bouton.

**UserList** — triée (connectés en premier), dot vert/gris, tooltip ville au hover sur les connectés.

**DataTable** — colonnes : pseudo + dot, créé le, dernier message, nb messages, statut. Tooltip ville au hover sur "En ligne".

### Composants UI

**Button**
```vue
<UiButton variant="default|outline|ghost|destructive" size="sm|default|lg" :disabled="false">
  Texte
</UiButton>
```

**Input**
```vue
<UiInput v-model="val" type="text|password" placeholder="..." :error="false" />
```
La prop `error` passe la bordure en rouge.

**Card**
```vue
<UiCard>Contenu</UiCard>
```

### Router & Guards

```js
router.beforeEach(async (to, _from, next) => {
  if (["/tchat", "/settings"].includes(to.path)) {
    const logged = await awaitAuth()  // attend la fin du chargement du cookie
    if (!logged) next("/")
    else next()
  } else {
    next()
  }
})
```

`awaitAuth()` retourne une Promise qui se résout quand `isLoading` passe à `false`.

### État global

`authVariables.js` — refs Vue partagées entre tous les composants sans Pinia :

```js
export const isLogged = ref(false)   // booléen connexion
export const pseudo   = ref("")      // pseudo de l'utilisateur
export const color    = ref("bg-gray-500")  // couleur avatar
export const isLoading = ref(true)   // true pendant /api/auth/me
```

### Configuration frontend

`.env` production :
```env
VITE_BACKEND_URL=http://IP_VPS/B3dev-TP_VUE/api
VITE_FRONTEND_URL=http://IP_VPS/B3dev-TP_VUE/
```

`.env` local :
```env
VITE_BACKEND_URL=http://localhost:3000
VITE_FRONTEND_URL=http://localhost:5173
```

---

## 5. Authentification & Sécurité

- **Inscription** : pseudo (2-20 car., alphanumérique), mot de passe hashé avec `bcrypt` (10 rounds), couleur avatar
- **Connexion** : vérification `bcrypt.compare`, cookie `httpOnly` posé côté serveur (1h)
- **Vérification** : `/api/auth/me` vérifie le cookie à chaque chargement de page
- **Mise à jour** : `/api/auth/update` vérifie l'ancien mot de passe avant changement
- **Sanitisation** : les messages sont nettoyés (`<` → `&lt;`) avant stockage MongoDB

### Formulaire d'inscription — 3 étapes

| Étape | Contenu | Validation |
|---|---|---|
| 1 | Pseudo + mot de passe + confirmation | Dispo vérifiée en temps réel (debounce 400ms), format regex, passwords identiques |
| 2 | Choix couleur avatar | Palette 8 couleurs, aperçu live |
| 3 | Récapitulatif | Relecture avant validation |

Navigation : bouton "← Retour" disponible à chaque étape, "Continuer" bloqué tant que l'étape n'est pas valide.

---

## 6. Tchat temps réel

### Connexion client

```js
const socket = io(new URL(config.backend).origin, {
  withCredentials: true,
  path: "/B3dev-TP_VUE/socket.io/"
})
```

L'URL passée à `io()` doit être l'**origine** uniquement. Le chemin Socket.IO va dans l'option `path`.

### Flux d'un message

1. Client émet `nouveauMessage { pseudo, message }`
2. Serveur sanitise, crée le `Message` en MongoDB
3. Met à jour `lastMessageAt` sur le `User`
4. Broadcast `message` à tous via `io.emit()`

### Historique

À chaque connexion, le serveur envoie les 50 derniers messages :
```js
const history = await Message.find().sort({ createdAt: 1 }).limit(50)
socket.emit("historique", history)
```

### Présence en ligne

- Serveur maintient un `Map` `pseudo → { socketId, city }`
- À chaque connect/disconnect : broadcast `usersOnline [{ pseudo, city }]`
- `TchatView` écoute `usersOnline` et passe la liste en prop à `UserList` et `DataTable`

---

## 7. Géolocalisation

À la connexion sur `/tchat`, le frontend récupère la ville via l'IP (sans permission navigateur) :

```js
const res = await fetch('https://ipapi.co/json/')
const data = await res.json()  // → data.city
```

Si HTTPS disponible, tente d'abord la géoloc précise du navigateur (`navigator.geolocation`) avec reverse geocoding via `bigdatacloud.net`.

La ville est transmise au serveur avec `socket.emit("rejoindre", { pseudo, city })` et stockée en mémoire. Elle apparaît en tooltip au hover sur les utilisateurs en ligne dans `UserList` et `DataTable`.

---

## 8. PWA

L'application est installable sur mobile et desktop via `public/manifest.json` :

```json
{
  "name": "B3dev Chat",
  "short_name": "B3dev",
  "display": "standalone",
  "start_url": "/B3dev-TP_VUE/",
  "theme_color": "#111827"
}
```

Meta tags dans `index.html` : `theme-color`, `mobile-web-app-capable`, `apple-mobile-web-app-capable`, `manifest`.

Sur Chrome mobile, le navigateur propose automatiquement "Ajouter à l'écran d'accueil".

---

## 9. Tests unitaires

Environnement : **Vitest** + **Vue Test Utils** + **jsdom**

```bash
cd my-project
npm run test:unit
```

| Fichier | Tests | Ce qui est vérifié |
|---|---|---|
| `App.spec.js` | 2 | Montage sans erreur, classe `min-h-screen` |
| `Button.spec.js` | 9 | Variants, tailles, disabled, slot, click, type |
| `authVariables.spec.js` | 6 | Valeurs par défaut, réactivité des refs |
| `authService.spec.js` | 3 | `awaitAuth()` sync, non connecté, async |

**Total : 20 tests, 100% passants.**

Configuration `vitest.config.js` :
```js
export default mergeConfig(viteConfig, defineConfig({
  test: {
    environment: 'jsdom',
    exclude: ['**/e2e/**']
  }
}))
```

---

## 10. VPS — Infrastructure

### Création utilisateur & SSH

```bash
# Sur le VPS en root
adduser newuser
usermod -aG sudo newuser

# Sur le PC local
ssh-keygen -t ed25519 -C "newuser-vps"
ssh-copy-id newuser@IP_VPS
ssh newuser@IP_VPS  # test sans mot de passe
```

### Nginx

```bash
sudo apt update && sudo apt install nginx -y
sudo systemctl enable nginx && sudo systemctl start nginx
```

### Docker

```bash
sudo apt install -y docker.io docker-compose
sudo systemctl enable docker && sudo systemctl start docker
```

### MongoDB

MongoDB tourne dans un conteneur Docker — pas d'installation sur le VPS.

- Se connecte au backend via le nom de service `mongo` (réseau Docker interne)
- Données persistées via volume `./data/mongo:/data/db`
- Survit à un `docker-compose down`

### Structure des dossiers VPS

```
/var/www/
│
├── B3dev-TP_VUE/          ← dépôt cloné
│   ├── express-project/
│   └── my-project/
│
├── data/
│   └── mongo/             ← volume MongoDB
│
├── home/                  ← page d'accueil HTML statique
└── docker-compose.yml
```

### Docker Compose

`/var/www/docker-compose.yml` :

```yaml
version: '3.8'

services:
  tp-vue-api:
    build:
      context: ./B3dev-TP_VUE/express-project
      dockerfile: deployment/Dockerfile
    container_name: tp-vue-api
    ports:
      - "3003:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - mongo

  tp-vue-front:
    build:
      context: ./B3dev-TP_VUE/my-project
      dockerfile: deployment/Dockerfile
    container_name: tp-vue-front
    ports:
      - "8080:80"

  mongo:
    image: mongo
    container_name: mongo
    restart: always
    volumes:
      - ./data/mongo:/data/db
    expose:
      - "27017"
```

Ports gauche = exposés à Nginx. Ports droite = internes aux containers.

**Rebuild manuel :**
```bash
cd /var/www
sudo docker-compose down
sudo docker-compose build --no-cache tp-vue-api tp-vue-front
sudo docker-compose up -d
```

### Nginx reverse proxy

Fichier `/etc/nginx/sites-available/vps` :

```nginx
server {
    listen 80;
    server_name _;
    root /var/www/home;
    index index.html;

    # API
    location /B3dev-TP_VUE/api/ {
        rewrite ^/B3dev-TP_VUE/api/(.*)$ /api/$1 break;
        proxy_pass http://127.0.0.1:3003/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Socket.IO — pas de trailing slash → chemin complet préservé
    location /B3dev-TP_VUE/socket.io/ {
        proxy_pass http://127.0.0.1:3003;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Frontend — trailing slash → strip le préfixe
    location /B3dev-TP_VUE/ {
        proxy_pass http://127.0.0.1:8080/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

> **Règle Nginx** : `proxy_pass http://host/` (trailing slash) supprime le préfixe. `proxy_pass http://host` (sans) le conserve. Socket.IO nécessite que `/B3dev-TP_VUE/socket.io/` soit préservé → pas de trailing slash.

Recharger après modification :
```bash
sudo nginx -t && sudo systemctl reload nginx
```

---

## 11. CI/CD GitHub Actions

### Secrets à configurer sur GitHub

`Settings > Secrets and variables > Actions` :

| Secret | Valeur |
|---|---|
| `VPS_HOST` | IP du VPS |
| `VPS_USER` | Utilisateur SSH |
| `VPS_SSH_KEY` | Clé privée SSH |

### Préparation VPS

```bash
sudo usermod -aG docker github
newgrp docker
```

### `.github/workflows/deploy.yml`

```yaml
name: Deploy to VPS

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to VPS
        uses: appleboy/ssh-action@v0.1.9
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          port: 22
          script: |
            cd /var/www/B3dev-TP_VUE
            git fetch origin main
            git reset --hard origin/main
            cd /var/www
            docker-compose down --remove-orphans
            docker-compose build --no-cache tp-vue-api tp-vue-front
            docker-compose up -d
            docker ps
```

À chaque `git push origin main` :
1. Connexion SSH au VPS
2. Mise à jour du code (`git reset --hard`)
3. Arrêt des containers
4. Rebuild sans cache
5. Redémarrage
