// controllers/authController.js

exports.login = (req, res) => {
  const { pseudo } = req.body

  if (!pseudo || pseudo.length < 1 || pseudo.length > 20) {
    return res.status(400).json({ error: "Pseudo invalide" })
  }

  // cookie simple
  res.cookie("pseudo", pseudo, {
    httpOnly: true,
    maxAge: 1 * 60 * 60 * 1000, // 1 heure (en ms) -> nbHeure * nbMinute * nbSeconde * nbMs
    sameSite: "lax"
  })

  res.json({ message: "Connecté", pseudo })
}

exports.logout = (req, res) => {
  res.clearCookie("pseudo")
  res.json({ message: "Déconnecté" })
}

exports.me = (req, res) => {
  const pseudo = req.cookies.pseudo

  if (!pseudo) {
    return res.status(401).json({ error: "Non connecté" })
  }

  res.json({ pseudo })
}