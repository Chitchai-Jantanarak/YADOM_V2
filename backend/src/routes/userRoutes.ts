import express from "express"
import multer from "multer"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import fs from "fs"
import {
  register,
  login,
  getProfile,
  updateProfile,
  updateProfileImage,
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
const uploadsDir = path.join(process.cwd(), "uploads")
const profileImagesDir = path.join(uploadsDir, "profile-images")

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir)
}

if (!fs.existsSync(profileImagesDir)) {
  fs.mkdirSync(profileImagesDir)
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profileImagesDir)
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`
    cb(null, uniqueFilename)
  },
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error("Only image files are allowed!"), false)
    }
    cb(null, true)
  },
})

// Public routes
router.post("/register", register)
router.post("/login", login)
router.post("/forgot-password", forgotPassword)
router.post("/verify-otp", verifyOTP)
router.post("/reset-password", resetPassword)

// Protected routes
router.route("/profile").get(protect, getProfile).put(protect, updateProfile)
router.post("/profile/image", protect, upload.single("image"), updateProfileImage)

// Admin routes
router.route("/admin").get(protect, admin, getAllUsers)
router.route("/search").get(protect, admin, searchUsers)
router.route("/:id")
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser)
router.route("/:id/orders").get(protect, admin, getUserOrders)

export default router