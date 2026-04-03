import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  frontendOrigin: process.env.VITE_FRONTEND_ORIGIN || "http://localhost:5173", // pour CORS (juste domaine)
  frontend: process.env.VITE_FRONTEND_URL || "http://localhost:5173/B3dev-TP_VUE/", // URL frontend publique
  backend: process.env.VITE_BACKEND_URL || "http://localhost:3000/B3dev-TP_VUE/api", // URL backend publique
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/B3devTPVue", // MongoDB
  jwtSecret: process.env.JWT_SECRET || "ton_secret_jwt_ici"
};