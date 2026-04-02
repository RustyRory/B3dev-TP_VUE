// middleware/authMiddleware.js

module.exports = (req, res, next) => {
  const pseudo = req.cookies.pseudo

  if (!pseudo) {
    return res.status(401).json({ error: "Non autorisé" })
  }

  req.user = { pseudo }

  next()
}