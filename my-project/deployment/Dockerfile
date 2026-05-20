# Build stage
FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_BACKEND_URL=http://78.138.58.95/B3dev-TP_VUE/api
ARG VITE_FRONTEND_URL=http://78.138.58.95/B3dev-TP_VUE/
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_FRONTEND_URL=$VITE_FRONTEND_URL
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