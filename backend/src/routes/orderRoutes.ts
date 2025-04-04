import express from "express"
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  deleteOrder,
  getRecentOrders,
  confirmOrderPayment,
} from "../controllers/orderController.js"
import { protect, admin } from "../middleware/authMiddleware.js"

const router = express.Router()

// Private routes
router.route("/").post(protect, createOrder).get(protect, getUserOrders)

// Important: Define specific routes BEFORE parameterized routes
router.route("/admin").get(protect, admin, getAllOrders)
router.route("/recent").get(protect, admin, getRecentOrders)

// New route for payment confirmation (accessible to customers)
router.route("/:id/payment").post(protect, confirmOrderPayment)

// Parameterized routes
router.route("/:id").get(protect, getOrderById).delete(protect, admin, deleteOrder)
router.route("/:id/status").put(protect, admin, updateOrderStatus)

export default router

