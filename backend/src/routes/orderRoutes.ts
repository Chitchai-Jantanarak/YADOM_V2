import express from "express"
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
} from "../controllers/orderController.js"
import { protect, admin } from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/").post(protect, createOrder).get(protect, getUserOrders)

router.get("/admin", protect, admin, getAllOrders)

router.route("/:id").get(protect, getOrderById)

router.route("/:id/status").put(protect, admin, updateOrderStatus)

export default router

