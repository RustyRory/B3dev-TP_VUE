// express-project/src/config/config.js
import dotenv from "dotenv"
dotenv.config()

export const config = {
  port: 3003,
  frontend: "http://78.138.58.95:5173",
  backend: "http://78.138.58.95:3003"
}

// export const config = {
//   port: process.env.PORT || 3003,
//   frontend: process.env.FRONTEND_URL || "http://localhost:5173",
//   backend: process.env.BACKEND_URL || "http://localhost:3003"
// }