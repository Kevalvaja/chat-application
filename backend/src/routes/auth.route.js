import express from "express"
import { signup, login, logout, updateProfile, checkAuth, sendOTP, verifyOTP, UpdatePassword } from "../controllers/auth.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"

const router = express.Router()

router.post("/singup", signup)
router.post("/login", login)
router.post("/logout", logout)
router.put("/update-profile", protectRoute, updateProfile)
router.get("/check", protectRoute, checkAuth)
router.post("/send-otp", sendOTP)
router.post("/verify-otp", verifyOTP)
router.put("/update-password/:id", UpdatePassword)

export default router