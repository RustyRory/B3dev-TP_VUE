// config/config.js
import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI || "mongodb://mongo:27017/B3devTPVue",
  frontendOrigin: process.env.VITE_FRONTEND_ORIGIN || "http://78.138.58.95",
  frontend: process.env.VITE_FRONTEND_URL || "http://78.138.58.95/B3dev-TP_VUE/",
  backend: process.env.VITE_BACKEND_URL || "http://78.138.58.95/B3dev-TP_VUE/api"
};