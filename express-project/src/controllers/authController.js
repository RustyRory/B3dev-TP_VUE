import bcrypt from "bcrypt"
import User from "../models/User.js"

const COOKIE_OPTIONS = {
  httpOnly: true,
  maxAge: 60 * 60 * 1000, // 1h
  sameSite: "lax",
  secure: false // true si HTTPS
}

export const register = async (req, res) => {
  const { pseudo, password, color } = req.body
  if (!pseudo || pseudo.length < 2 || pseudo.length > 20)
    return res.status(400).json({ error: "Pseudo invalide (2-20 caractères)" })
  if (!password || password.length < 4)
    return res.status(400).json({ error: "Mot de passe trop court (4 caractères min)" })

  const exists = await User.findOne({ pseudo })
  if (exists) return res.status(409).json({ error: "Pseudo déjà pris" })

  const hashed = await bcrypt.hash(password, 10)
  await User.create({ pseudo, password: hashed, color: color || 'bg-gray-500' })

  res.cookie("pseudo", pseudo, COOKIE_OPTIONS)
  res.json({ message: "Inscrit", pseudo })
}

export const login = async (req, res) => {
  const { pseudo, password } = req.body
  if (!pseudo || !password)
    return res.status(400).json({ error: "Pseudo et mot de passe requis" })

  const user = await User.findOne({ pseudo })
  if (!user) return res.status(401).json({ error: "Pseudo ou mot de passe incorrect" })

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return res.status(401).json({ error: "Pseudo ou mot de passe incorrect" })

  res.cookie("pseudo", pseudo, COOKIE_OPTIONS)
  res.json({ message: "Connecté", pseudo })
}

export const checkPseudo = async (req, res) => {
  const { pseudo } = req.query
  if (!pseudo) return res.status(400).json({ error: "Pseudo requis" })
  const exists = await User.findOne({ pseudo })
  res.json({ available: !exists })
}

export const me = async (req, res) => {
  const pseudo = req.cookies.pseudo
  if (!pseudo) return res.status(401).json({ error: "Non connecté" })
  const user = await User.findOne({ pseudo }).select("pseudo color")
  if (!user) return res.status(401).json({ error: "Utilisateur introuvable" })
  res.json({ pseudo: user.pseudo, color: user.color })
}

export const updateProfile = async (req, res) => {
  const pseudo = req.cookies.pseudo
  if (!pseudo) return res.status(401).json({ error: "Non connecté" })

  const { color, currentPassword, newPassword } = req.body
  const user = await User.findOne({ pseudo })
  if (!user) return res.status(404).json({ error: "Utilisateur introuvable" })

  const updates = {}

  if (color) updates.color = color

  if (newPassword) {
    if (!currentPassword) return res.status(400).json({ error: "Mot de passe actuel requis" })
    const valid = await bcrypt.compare(currentPassword, user.password)
    if (!valid) return res.status(401).json({ error: "Mot de passe actuel incorrect" })
    if (newPassword.length < 4) return res.status(400).json({ error: "Nouveau mot de passe trop court" })
    updates.password = await bcrypt.hash(newPassword, 10)
  }

  await User.updateOne({ pseudo }, updates)
  res.json({ message: "Profil mis à jour" })
}

export const logout = (req, res) => {
  res.clearCookie("pseudo")
  res.json({ message: "Déconnecté" })
}
