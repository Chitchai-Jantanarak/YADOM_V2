import express from "express"
import { protect, admin } from "../middleware/authMiddleware"

const router = express.Router()

// These routes will be implemented in aromaController.ts
router
  .route("/")
  .get((req, res) => res.json({ message: "Get aromas endpoint" }))
  .post(protect, admin, (req, res) => res.json({ message: "Create aroma endpoint" }))

router
  .route("/:id")
  .get((req, res) => res.json({ message: "Get aroma endpoint" }))
  .put(protect, admin, (req, res) => res.json({ message: "Update aroma endpoint" }))
  .delete(protect, admin, (req, res) => res.json({ message: "Delete aroma endpoint" }))

export default router

