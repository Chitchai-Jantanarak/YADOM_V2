import express from "express"
import { register, login, getProfile, updateProfile } from "../controllers/userController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.route("/profile").get(protect, getProfile).put(protect, updateProfile)

export default router

