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
  origin: config.frontendUrl, 
  credentials: true
}

// Middleware
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

// ===== ROUTES =====
app.use("/api/auth", authRoutes)

app.get("/", (req, res) => {
  res.send("API !")
})

// ===== SOCKET.IO =====
const io = new Server(server, {
  cors: corsOptions
})

const messages = []

io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  socket.emit("historique", messages)

  socket.on("nouveauMessage", ({ pseudo, message }) => {
    if (!pseudo || !message) return

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

// ===== START SERVER =====
server.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`)
})