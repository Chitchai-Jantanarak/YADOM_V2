import express from "express"
import { 
  createModifiedBoneGroup, 
  getModifiedBoneGroup, 
  getUserModifiedBoneGroups, 
  updateModifiedBoneGroup 
} from "../controllers/customizationController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/", createModifiedBoneGroup)

router.get("/:id", getModifiedBoneGroup)

router.get("/user/:userId", protect, getUserModifiedBoneGroups)
router.put("/:id", protect, updateModifiedBoneGroup)

export default router