import express from "express"
import { register, login, getProfile, updateProfile } from "../controllers/userController"
import { protect } from "../middleware/authMiddleware"

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.route("/profile").get(protect, getProfile).put(protect, updateProfile)

export default router

