// server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js";
import { config } from "./config/config.js";

import Message from "./models/Message.js";
import User from "./models/User.js";

const app = express();
const server = http.createServer(app);

// ===== CORS =====
const corsOptions = {
  origin: config.frontendOrigin, // ex: http://78.138.58.95
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// ===== ROUTES =====
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);

app.get("/", (req, res) => res.send("API en ligne !"));

// ===== SOCKET.IO =====
const io = new Server(server, {
  cors: corsOptions,
  path: "/B3dev-TP_VUE/socket.io" // IMPORTANT : correspond à Nginx
});

// pseudo → socketId pour les utilisateurs connectés
const connectedUsers = new Map();

const broadcastOnlineUsers = () => {
  const list = Array.from(connectedUsers.entries()).map(([pseudo, { city }]) => ({ pseudo, city }));
  io.emit("usersOnline", list);
};

io.on("connection", async (socket) => {
  console.log("Socket connecté:", socket.id);

  const history = await Message.find().sort({ createdAt: 1 }).limit(50);
  socket.emit("historique", history);

  socket.on("rejoindre", ({ pseudo, city } = {}) => {
    if (!pseudo) return;
    socket.data.pseudo = pseudo;
    connectedUsers.set(pseudo, { socketId: socket.id, city: city || null });
    broadcastOnlineUsers();
  });

  socket.on("nouveauMessage", async ({ pseudo, message }) => {
    if (!pseudo || !message) return;

    const cleanMessage = message.replace(/</g, "&lt;");

    const msg = await Message.create({ pseudo, message: cleanMessage });

    await User.findOneAndUpdate(
      { pseudo },
      { lastMessageAt: new Date() },
      { upsert: true }
    );

    io.emit("message", msg);
  });

  socket.on("disconnect", () => {
    const pseudo = socket.data.pseudo;
    if (pseudo) connectedUsers.delete(pseudo);
    broadcastOnlineUsers();
    console.log("Socket déconnecté:", socket.id);
  });
});

// ===== MONGODB =====
mongoose.connect(config.mongoUri)
  .then(() => {
    console.log("✅ MongoDB connecté !");
    server.listen(config.port, () => console.log(`Server running on ${config.backend}`));
  })
  .catch((err) => console.error("❌ Erreur MongoDB :", err));