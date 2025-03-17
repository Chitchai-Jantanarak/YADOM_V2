import express from "express"
import { protect } from "../middleware/authMiddleware"

const router = express.Router()

// These routes will be implemented in cartController.ts
router
  .route("/")
  .post(protect, (req, res) => res.json({ message: "Add to cart endpoint" }))
  .get(protect, (req, res) => res.json({ message: "Get cart endpoint" }))

router
  .route("/:id")
  .put(protect, (req, res) => res.json({ message: "Update cart item endpoint" }))
  .delete(protect, (req, res) => res.json({ message: "Remove cart item endpoint" }))

export default router

