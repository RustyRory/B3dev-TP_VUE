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
adduser rusty

# Ajouter l’utilisateur aux sudoers
usermod -aG sudo rusty
```
### Gestion des clés SSH

Sur PC local :
```bash
ssh-keygen -t ed25519 -C "rusty-vps"
```
Copier la clé publique sur le VPS :
```bash
ssh-copy-id rusty@IP_VPS
```
Tester la connexion sans mot de passe :
```bash
ssh rusty@IP_VPS
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
```

## Préparer l’espace des applications

### dossier www
```bash
sudo mkdir -p /var/www
sudo chown -R rusty:rusty /var/www
cd /var/www
```
### Cloner les projets
```bash
git clone git@github.com:user/collegelaboussole.git
git clone git@github.com:user/saintbarthvolley.git
git clone git@github.com:user/tpvue.git
mkdir home
```
home/ → page HTML statique d’accueil avec liens vers les apps.

### Structure 

```
/var/www/ :

/var/www/
│
├─ collegelaboussole/
│   ├─ backend/
│   └─ frontend/
│
├─ saintbarthvolley/
│   ├─ backend/
│   └─ frontend/
│
├─ tpvue/
│   ├─ express-project/   (backend Vue)
│   └─ my-project/        (frontend Vue)
│
└─ home/                  (page d’accueil HTML)
```

Chaque app (frontend ou backend) aura son propre container.

## Backend Express

Exemple pour `/tpvue/express-project` et `/collegelaboussole/backend`

`Dockerfile` :

```Dockerfile
FROM node:20-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000   # ou 5000 si Next/Express backend
CMD ["node", "server.js"]
```

## Frontend Vue/Next

- Vue (tpvue/my-project)

`Dockerfile` :

```Dockerfile
# Build
FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve via Nginx
FROM nginx:alpine
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html/tpvue
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

- Next.js (collegelaboussole/frontend)

`Dockerfile` :

```Dockerfile
FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Docker Compose
À la racine `/var/www/`, créer `docker-compose.yml` :
```yaml
version: '3.8'
services:
  # Collegelaboussole
  collegelaboussole-back:
    build: ./CollegeLaBoussole/collegeLaBoussoleApp/backend
    container_name: collegelaboussole-back
    ports:
      - "5000:5000"

  collegelaboussole-front:
    build: ./CollegeLaBoussole/collegeLaBoussoleApp/frontend
    container_name: collegelaboussole-front
    ports:
      - "3000:3000"

  # SaintBarth Volley
  saintbarthvolley-back:
    build: ./saintbarthvolley/backend
    container_name: saintbarthvolley-back
    ports:
      - "5001:5000"

  saintbarthvolley-front:
    build: ./saintbarthvolley/frontend
    container_name: saintbarthvolley-front
    ports:
      - "3001:3000"

  # TP Vue
  tpvue-api:
    build:
      context: ./tpvue/express-project
      dockerfile: deployment/Dockerfile
    container_name: tpvue-api
    ports:
      - "3003:3000"
    environment:
      - NODE_ENV=test

  tpvue-front:
    build:
      context: ./tpvue/my-project
      dockerfile: deployment/Dockerfile
    container_name: tpvue-front
    ports:
      - "8080:80"

```

Les ports à gauche sont exposés pour Nginx.
Les ports à droite sont les ports internes des containers.

## Nginx (reverse proxy)

Fichier `/etc/nginx/sites-available/vps` :

```
server {
    listen 80;
    server_name _;

    # Page d'accueil
    root /var/www/home;
    index index.html;

    location = / {
        try_files $uri $uri/ /index.html;
    }

    # Collegelaboussole
    location /collegelaboussole/ {
        proxy_pass http://127.0.0.1:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    location /collegelaboussole/api/ {
        proxy_pass http://127.0.0.1:5000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # SaintBarth Volley
    location /saintbarthvolley/ {
        proxy_pass http://127.0.0.1:3001/;
    }
    location /saintbarthvolley/api/ {
        proxy_pass http://127.0.0.1:5001/;
    }

    # TP Vue
    location /tpvue/ {
        proxy_pass http://127.0.0.1:8080/;
    }
    location /tpvue/api/ {
        proxy_pass http://127.0.0.1:3003/api/;
    }
}
```

## Déploiement automatisé GitHub Actions

`.github/workflows/deploy.yml`: 

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
            cd /var/www || exit 1
            git fetch origin main
            git reset --hard origin/main

            # Relancer les containers
            docker-compose down
            docker-compose build --no-cache
            docker-compose up -d

            echo "✅ Déploiement terminé"
```

