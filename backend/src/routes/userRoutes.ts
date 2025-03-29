import express from "express"
import {
  register,
  login,
  getProfile,
  updateProfile,
  forgotPassword,
  verifyOTP,
  resetPassword,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserOrders,
  searchUsers
} from "../controllers/userController.js"
import { protect, admin } from "../middleware/authMiddleware.js"

const router = express.Router()

// Public routes
router.post("/register", register)
router.post("/login", login)
router.post("/forgot-password", forgotPassword)
router.post("/verify-otp", verifyOTP)
router.post("/reset-password", resetPassword)

// Protected routes
router.route("/profile").get(protect, getProfile).put(protect, updateProfile)

// Admin routes
router.route("/admin").get(protect, admin, getAllUsers)
router.route("/search").get(protect, admin, searchUsers)
router.route("/:id")
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser)
router.route("/:id/orders").get(protect, admin, getUserOrders)

export default router