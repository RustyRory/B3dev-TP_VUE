// models/User.js
import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  pseudo: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  color: { type: String, default: 'bg-gray-500' },
  createdAt: { type: Date, default: Date.now },
  lastMessageAt: { type: Date }
})

export default mongoose.model("User", userSchema)