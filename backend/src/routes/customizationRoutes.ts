import express from "express"
import { protect } from "../middleware/authMiddleware"

const router = express.Router()

// These routes will be implemented in customizationController.ts
router.route("/").post((req, res) => res.json({ message: "Create customization endpoint" }))

router
  .route("/:id")
  .get((req, res) => res.json({ message: "Get customization endpoint" }))
  .put(protect, (req, res) => res.json({ message: "Update customization endpoint" }))

router.get("/user/:userId", protect, (req, res) => res.json({ message: "Get user customizations endpoint" }))

export default router

