"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import PageTransition from "../../components/layout/PageTransition"
import { getUserOrders, cancelOrder } from "../../services/orderService"
import { X, AlertCircle } from "lucide-react"
import { handleImageError } from "../../utils/imageUtils"

const OrderStatusBadge = ({ status }) => {
  const statusColors = {
    WAITING: "bg-yellow-100 text-yellow-800",
    PENDING: "bg-blue-100 text-blue-800",
    CONFIRMED: "bg-green-100 text-green-800",
    COMPLETED: "bg-purple-100 text-purple-800",
    CANCELED: "bg-red-100 text-red-800",
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status] || "bg-gray-100"}`}>
      {status}
    </span>
  )
}

const OrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cancelingOrderId, setCancelingOrderId] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await getUserOrders()
      setOrders(response.orders || [])
      setError(null)
    } catch (err) {
      setError("Failed to load orders. Please try again.")
      console.error("Error fetching orders:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelClick = (orderId) => {
    setSelectedOrderId(orderId)
    setShowConfirmModal(true)
  }

  const confirmCancelOrder = async () => {
    if (!selectedOrderId) return

    try {
      setCancelingOrderId(selectedOrderId)
      await cancelOrder(selectedOrderId)

      // Update the order status in the local state
      setOrders(orders.map((order) => (order.id === selectedOrderId ? { ...order, status: "CANCELED" } : order)))

      setShowConfirmModal(false)
      setSelectedOrderId(null)
    } catch (err) {
      setError("Failed to cancel order. Please try again.")
      console.error("Error canceling order:", err)
    } finally {
      setCancelingOrderId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl mb-4">You haven't placed any orders yet</h2>
          <p className="mb-6">Start shopping to place your first order!</p>
          <Link to="/shop" className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            // Calculate total
            const total = order.cartItems.reduce((sum, item) => sum + item.price, 0)
            const canCancel = order.status === "WAITING" || order.status === "PENDING"

            return (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="text-lg font-semibold">Order #{order.id}</h2>
                      <p className="text-sm text-gray-600">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <OrderStatusBadge status={order.status} />
                      {canCancel && (
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            handleCancelClick(order.id)
                          }}
                          className="text-red-500 hover:text-red-700 p-1"
                          disabled={cancelingOrderId === order.id}
                        >
                          {cancelingOrderId === order.id ? (
                            <div className="animate-spin h-5 w-5 border-t-2 border-red-500 rounded-full"></div>
                          ) : (
                            <X className="h-5 w-5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {order.cartItems.slice(0, 2).map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden">
                          <img
                            src={`/src/assets/images/shop/${item.product.id}`}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => handleImageError(e, "product")}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <div className="font-medium">฿ {item.price.toFixed(2)}</div>
                      </div>
                    ))}

                    {order.cartItems.length > 2 && (
                      <p className="text-sm text-gray-500">
                        + {order.cartItems.length - 2} more {order.cartItems.length - 2 === 1 ? "item" : "items"}
                      </p>
                    )}

                    <div className="flex justify-between pt-4 border-t">
                      <span className="font-medium">Total:</span>
                      <span className="font-bold">฿ {total.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-end">
                      <Link to={`/user/order/${order.id}`} className="text-primary hover:text-primary/80 font-medium">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-2 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold">Cancel Order</h3>
            </div>

            <p className="mb-6">Are you sure you want to cancel this order? This action cannot be undone.</p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                No, Keep Order
              </button>
              <button
                onClick={confirmCancelOrder}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                disabled={cancelingOrderId !== null}
              >
                {cancelingOrderId !== null ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-t-2 border-white rounded-full"></div>
                    <span>Canceling...</span>
                  </div>
                ) : (
                  "Yes, Cancel Order"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PageTransition(OrdersPage)

