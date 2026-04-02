// backend/server.js
const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const cors = require("cors")
const cookieParser = require("cookie-parser")

const authRoutes = require("./routes/auth")

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
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))
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
server.listen(3003, () => {
  console.log("Server running on http://localhost:3003")
})