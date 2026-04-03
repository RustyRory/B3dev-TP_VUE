// express-project/src/config/config.js

import dotenv from "dotenv"
dotenv.config()

export const config = {
  port: process.env.PORT || 3000,
  frontend: process.env.VITE_FRONTEND_URL || "http://localhost:5173",
  backend: process.env.VITE_API_URL || "http://localhost:3000"
}

// export const config = {
//   port: 3000,
//   frontend: "http://localhost:5173",
//   backend: "http://localhost:3000"
// }