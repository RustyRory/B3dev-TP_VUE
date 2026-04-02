// backend/server.js
import express from "express"
import http from "http"
import { Server } from "socket.io"
import cors from "cors"
import cookieParser from "cookie-parser"

import authRoutes from "./routes/auth"

import { config } from "./config/config"

const app = express()
const server = http.createServer(app)

// Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
})

// Route par defaut
app.get("/", (req, res) => {
  res.send("API !")
})

// Middleware
// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true
// }))
app.use(cors({
  origin: config.frontendUrl, // ou '*'
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true
}));
app.use(express.json())
app.use(cookieParser())

// Routes
app.use("/api/auth", authRoutes)

// ===== CHAT SOCKET =====
const messages = []

io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  socket.emit("historique", messages)

  socket.on("nouveauMessage", ({ pseudo, message }) => {
    if (!pseudo || !message) return

    // 🔒 sécurité minimale
    const cleanMessage = message.replace(/</g, "&lt;")

    const msg = {
      id: socket.id,
      pseudo,
      message: cleanMessage,
      date: new Date().toLocaleTimeString()
    }

    messages.push(msg)

    io.emit("message", msg)
  })

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
  })
})

// Start server
server.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`)
})