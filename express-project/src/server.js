// backend/server.js
import express from "express"
import http from "http"
import { Server } from "socket.io"
import cors from "cors"
import cookieParser from "cookie-parser"

import authRoutes from "./routes/auth.js"
import { config } from "./config/config.js"

const app = express()
const server = http.createServer(app)

// ===== CORS =====
const corsOptions = {
  //origin: config.frontend, // autorise uniquement le frontend
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
  credentials: true
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

// ===== ROUTES =====
app.use("/api/auth", authRoutes)

// ===== ENDPOINTS =====
app.get("/", (req, res) => res.send("API !"))
app.get('/users', (req, res) => {
  res.json([{ name: 'test' }])
})

// ===== SOCKET.IO =====
const io = new Server(server, { cors: corsOptions })
const messages = []

io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  // Envoi l'historique
  socket.emit("historique", messages)

  socket.on("nouveauMessage", ({ pseudo, message }) => {
    if (!pseudo || !message) return
    const cleanMessage = message.replace(/</g, "&lt;")
    const msg = { id: socket.id, pseudo, message: cleanMessage, date: new Date().toLocaleTimeString() }
    messages.push(msg)
    io.emit("message", msg)
  })

  socket.on("disconnect", () => console.log("User disconnected:", socket.id))
})

server.listen(config.port, () => console.log(`Server running on http://localhost:${config.port}`))