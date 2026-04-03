import express from "express"
import http from "http"
import { Server } from "socket.io"
import cors from "cors"
import cookieParser from "cookie-parser"

import authRoutes from "./routes/auth.js"
import usersRoutes from "./routes/users.js"
import { config } from "./config/config.js"

import Message from "./models/Message.js"
import User from "./models/User.js"

const app = express()
const server = http.createServer(app)

// ===== CORS =====
// ⚠️ On ne met pas le chemin /B3dev-TP_VUE/ dans origin
const corsOptions = {
  origin: config.frontendOrigin, // seulement le domaine + port
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
app.use("/api/users", usersRoutes)

// ===== SOCKET.IO =====
const io = new Server(server, { cors: corsOptions })
const messages = []

io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  // Envoi de l'historique
  socket.emit("historique", messages)

  socket.on("nouveauMessage", async ({ pseudo, message }) => {
    if (!pseudo || !message) return

    const cleanMessage = message.replace(/</g, "&lt;")

    const msg = await Message.create({
      pseudo,
      message: cleanMessage
    })

    await User.findOneAndUpdate(
      { pseudo },
      { lastMessageAt: new Date() },
      { upsert: true }
    )

    io.emit("message", msg)
  })

  socket.on("disconnect", () => console.log("User disconnected:", socket.id))
})

server.listen(config.port, () =>
  console.log(`Server running on ${config.backend}`)
)