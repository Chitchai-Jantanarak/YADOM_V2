import express from "express"
import { protect, owner } from "../middleware/authMiddleware"

const router = express.Router()

// These routes will be implemented in dashboardController.ts
router.get("/stats", protect, owner, (req, res) => res.json({ message: "Dashboard stats endpoint" }))

export default router

