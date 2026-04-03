# Documentation de projet

## TP B3 dev - Web application - VueJs / ExpressJs

### Objectif du TP

Vous pouvez utiliser en option API ou en composition.

    Créer son propre composant navBar en .vue pour avoir plusieurs "pages".
    Utiliser une bibliotèque de composants (comparatif)
    Creer un formulaire sur plusieurs étapes, avec possibilité de revenir sur l'étape en cours.
    Installer une transition entre les pages.
    Utiliser votre API avec des appels REST
    Utiliser un environnement de test.
    Mise en production (avec CI/CD) sur votre VPS.
    Votre application doit utiliser des ressources internes :
        Stokage interne
        Notification
        nombre d'alerte
        Partage
        Contact Picker. demo
        GeoLocalisation
        Touch event

Voici quelques consignes supplémentaire non-obligatoires, juste pour s'amuser

    Intégrer le tout dans un docker.

### Ce que j'ai fais / ferai

Web app : tchat avec connexion via pseudo et storage dans une bdd (users(id, nom, messages[String], connectedAt, lastMessageAt))

- En local : 
  - Installation de l'environnement de dev (vue + express)
  - Construction du backend
    - Controllers
    - Routes
    - Middleware
    - server.js
  - Construction du frontend
    - Views
    - Components
    - routers
    - services
    - stores
- Construction d'un multi-app sur VPS
  - Config VPS
    - User
    - Clefs ssh
    - Services
      - Nginx
      - Docker
  - Config serv web
  - Config docker 
    - Conteneurisation app
    - Conteneurisation mongo (à faire)
- à faire
  - BDD (mongodb)
  - API rest
  - Datatable view (affichage des données users)
  - Ajouter shadcn 
  - Creer un formulaire sur plusieurs étapes, avec possibilité de revenir sur l'étape en cours.

# Création du projet express

Todo

# Création du projet Vue

Todo

# VPS multi-app (Next.js + Express + Vue + Express), avec Docker et Nginx

J'utilise le VPS fourni par la formation. Je travaille sur plusieurs sites web ou service web.

Il me faut donc configurer le VPS en multi-app

Voici la procédure : 

## VPS

### Création d’un utilisateur avec droits sudo
```bash
# Se connecter en root
ssh root@IP_VPS

# Créer un utilisateur
adduser newuser

# Ajouter l’utilisateur aux sudoers
usermod -aG sudo newuser
```
### Gestion des clés SSH

Sur PC local :
```bash
ssh-keygen -t ed25519 -C "newuser-vps"
```
Copier la clé publique sur le VPS :
```bash
ssh-copy-id newuser@IP_VPS
```
Tester la connexion sans mot de passe :
```bash
ssh newuser@IP_VPS
```

### Installer Nginx
```bash
sudo apt update
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
sudo systemctl status nginx
```

Test rapide : curl [ip]

### Installer Docker
```bash
sudo apt install -y docker.io docker-compose
sudo systemctl enable docker
sudo systemctl start docker
docker --version
docker-compose --version
```

### MongoDB
MongoDB dans un conteneur Docker. Pas besoin d’installer MongoDB directement sur le VPS. 

Le conteneur gère tout :
- Le service MongoDB tourne isolé dans Docker.
- Le backend Express peut se connecter au conteneur via le nom du service (mongo) défini dans  `docker-compose.yml`.
- Les ports sont exposés uniquement si tu veux accéder à MongoDB depuis l’extérieur.
- La persistance se fait via un volume Docker (`./data/mongo:/data/db`), donc même si on recrée le conteneur, les données restent.

Si l'on ne veut pas conteneuriser, il faut installer le service de base de données (noSQL/SQL)
```bash
# Installer MongoDB
sudo apt install -y mongodb

# Activer et démarrer le service
sudo systemctl enable mongodb
sudo systemctl start mongodb

# Vérifier le statut
sudo systemctl status mongodb

# Mongo Shell
mongosh
```

## Préparer l’espace des applications

### dossier www
```bash
sudo mkdir -p /var/www
sudo chown -R newuser:newuser /var/www
cd /var/www
```
### Cloner les projets
```bash
git clone git@github.com:user/app1.git
git clone git@github.com:user/app2.git
git clone git@github.com:user/app3.git
# etc...
mkdir home
```
home/ → page HTML statique d’accueil avec liens vers les apps.

### Structure 

```
/var/www/ :

/var/www/
│
├─ app1/
│   ├─ backend/
│   └─ frontend/
│
├─ app2/
│   ├─ backend/
│   └─ frontend/
│
├─ B3dev-TP_vue/
│   ├─ express-project/   (backend Vue)
│   └─ my-project/        (frontend Vue)
│
└─ home/                  (page d’accueil HTML)
```

Chaque app (frontend ou backend) aura son propre container.

### home/index.html 

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Mon VPS</title>
  <style>
    body {
      font-family: Arial;
      background: #0f172a;
      color: white;
      text-align: center;
      padding: 50px;
    }
    a {
      display: block;
      margin: 15px;
      padding: 15px;
      background: #1e293b;
      color: white;
      text-decoration: none;
      border-radius: 10px;
      transition: 0.2s;
    }
    a:hover {
      background: #334155;
    }
  </style>
</head>
<body>

  <h1>Les Applications</h1>

  <a href="/app1/">APP1</a>
  <a href="/app2/">APP2</a>
  <a href="/app3/">APP3</a>
  <a href="/B3dev-TP_vue/">TP VUE</a>


</body>
</html>

```

## Backend Express

Exemple pour `/B3dev-TP_vue/express-project`

`Dockerfile` :

```Dockerfile
FROM node:20-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000 
CMD ["node", "server.js"]
```

## Frontend Vue/Next

- Vue (B3dev-TP_vue/my-project)

`Dockerfile` :

```Dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Supprime la config par défaut
RUN rm -rf /usr/share/nginx/html/*

# Copie le build
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Copie config nginx custom
COPY deployment/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

`nginx.conf` : 
```conf
server {
    listen 80;

    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    # Frontend Vue
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Docker Compose
À la racine `/var/www/`, créer `docker-compose.yml` :
```yaml
version: '3.8'

services:
  # App1
  app1-back:
    build: ./app1/backend
    container_name: app1-back
    ports:
      - "3001:3000"

  app1-front:
    build: ./app1/frontend
    container_name: app1-front
    ports:
      - "5001:5000"

  # App2
  app2-back:
    build: ./app2/backend
    container_name: app2-back
    ports:
      - "3002:3000"

  app2-front:
    build: ./app2/frontend
    container_name: app2-front
    ports:
      - "5002:5000"

  # TP Vue API
  B3dev-TP_vue-api:
    build:
      context: ./B3dev-TP_vue/express-project
      dockerfile: deployment/Dockerfile
    container_name: B3dev-TP_vue-api
    ports:
    - "3003:3000"
    environment:
      - NODE_ENV=test

  # TP Vue Front
  B3dev-TP_vue:
    build:
      context: ./B3dev-TP_vue/my-project
      dockerfile: deployment/Dockerfile
    container_name: B3dev-TP_vue-front
    ports:
      - "8080:80"

  # Mongo
  mongo:
    image: mongo
    container_name: mongo
    restart: always
    volumes:
      - ./data/mongo:/data/db
    expose:
      - "27017"
```

Les ports à gauche sont exposés pour Nginx.
Les ports à droite sont les ports internes des containers.

## Nginx (reverse proxy)

Fichier `/etc/nginx/sites-available/vps` (et `/etc/nginx/sites-enable/vps`):

```
server {
    listen 80;
    server_name _;

    root /var/www/home;
    index index.html;

    # ===== TPVUE =====
    location /B3dev-TP_vue/ {
        proxy_pass http://127.0.0.1:8080/;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location /B3dev-TP_vue/api/ {
        proxy_pass http://127.0.0.1:3003/;
    }

    # ===== PAGE D'ACCUEIL (EN DERNIER) =====
    location / {
        try_files $uri $uri/ /index.html;
    }
}

```

## Déploiement automatisé GitHub Actions

`.github/workflows/deploy.yml`: 

Il faut ajouter des secrets sur Github pour que le déploiement fonctionne : 
- `VPS_HOST` : ip du VPS
- `VPS_USER` : User du VPS (`newuser` dans l'exemple)
- `SSH_KEY` : Clé ssh du VPS

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
      # 1️⃣ Récupérer le code depuis le repo
      - uses: actions/checkout@v3

      # 2️⃣ Se connecter au VPS et déployer
      - name: Deploy to VPS
        uses: appleboy/ssh-action@v0.1.9
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          port: 22
          script: |
            # Aller dans le dossier du projet
            cd /var/www/B3dev-TP_vue || exit 1

            # Mettre à jour le code
            git fetch origin main
            git reset --hard origin/main

            # Stopper les containers existants
            cd .. && docker-compose down

            # Rebuild uniquement les services qui ont changé
            docker-compose build --no-cache B3dev-TP_vue-api B3dev-TP_vue-front

            # Relancer les containers en arrière-plan
            docker-compose up -d

            echo "✅ Déploiement terminé"
```
## Update config / Web app

Taper les instructions : 
```bash
sudo nginx -t
sudo systemctl reload nginx
```

Lors d'un push sur main, le code se mets à jour sur le VPS : 
```bash
git add .
git commit -m "-message"
git push origin main
```



