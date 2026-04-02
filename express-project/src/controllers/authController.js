export const login = (req, res) => {
  const { pseudo } = req.body
  if (!pseudo || pseudo.length < 1 || pseudo.length > 20)
    return res.status(400).json({ error: "Pseudo invalide" })

  res.cookie("pseudo", pseudo, {
    httpOnly: true,
    maxAge: 60 * 60 * 1000, // 1h
    sameSite: "lax",
    secure: false // true si HTTPS
  })

  res.json({ message: "Connecté", pseudo })
}

export const logout = (req, res) => {
  res.clearCookie("pseudo")
  res.json({ message: "Déconnecté" })
}

export const me = (req, res) => {
  const pseudo = req.cookies.pseudo
  if (!pseudo) return res.status(401).json({ error: "Non connecté" })
  res.json({ pseudo })
}