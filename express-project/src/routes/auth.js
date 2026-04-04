import express from "express"
import * as authController from "../controllers/authController.js"

const router = express.Router()

router.post("/register", authController.register)
router.post("/login", authController.login)
router.post("/logout", authController.logout)
router.get("/me", authController.me)
router.get("/check-pseudo", authController.checkPseudo)
router.put("/update", authController.updateProfile)

export default router
