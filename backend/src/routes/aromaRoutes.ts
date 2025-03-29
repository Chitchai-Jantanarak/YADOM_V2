import express from "express"
import { getAromas, getAromaById, createAroma, updateAroma, deleteAroma } from "../controllers/aromaController.js"
import { protect, admin } from "../middleware/authMiddleware.js"

const router = express.Router()

// Public routes
router.get("/", getAromas)
router.get("/:id", getAromaById)

// Admin routes
router.post("/", protect, admin, createAroma)
router.put("/:id", protect, admin, updateAroma)
router.delete("/:id", protect, admin, deleteAroma)

export default router