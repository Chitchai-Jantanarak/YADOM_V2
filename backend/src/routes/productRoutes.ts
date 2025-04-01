import express from "express"
import {
  getProducts,
  getProductById,
  getProductsByType,
  createProduct,
  updateProduct,
  updateProductStatus,
  deleteProduct,
  getAvailableProducts,
  getBonesByProductId,
} from "../controllers/productController.js"
import { protect, admin } from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/").get(getProducts).post(protect, admin, createProduct)
router.route("/available").get(getAvailableProducts)
router.route("/type/:type").get(getProductsByType)
router.route("/:id").get(getProductById).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct)
router.route("/:id/status").patch(protect, admin, updateProductStatus)
router.route("/:id/bones").get(getBonesByProductId)

export default router

