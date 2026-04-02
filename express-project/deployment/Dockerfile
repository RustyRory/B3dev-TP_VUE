FROM node:20-alpine

WORKDIR /usr/src/app/
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3003   # ou 5000 si Next/Express backend
CMD ["node", "server.js"]