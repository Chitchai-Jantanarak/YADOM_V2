import express from "express"
import { getDashboardStats } from "../controllers/dashboardController.js"
import { protect, admin, owner } from "../middleware/authMiddleware.js"

const router = express.Router()

// Owner-only route
router.get("/stats", protect, owner, getDashboardStats)

export default router