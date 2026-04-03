// models/User.js
import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  pseudo: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  lastMessageAt: { type: Date }
})

export default mongoose.model("User", userSchema)