// express-project/src/config/config.js
import dotenv from 'dotenv'

dotenv.config()

export const config = {
  port: process.env.PORT || 3003,
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'defaultsecret'
}