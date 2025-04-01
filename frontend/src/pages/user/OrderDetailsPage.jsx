"use client"

import { useState, useEffect } from "react"
import { useParams, useLocation, Link } from "react-router-dom"
import { getOrderById } from "../../../services/orderService"
import { handleImageError } from "../../../utils/imageUtils"

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

const OrderDetailsPage = () => {
  const { id } = useParams()
  const location = useLocation()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if we just created this order
  const orderCreated = location.state?.orderCreated || false

  useEffect(() => {
    fetchOrderDetails()
  }, [id])

  const fetchOrderDetails = async () => {
    try {
      setLoading(true)
      const data = await getOrderById(id)
      setOrder(data)
      setError(null)
    } catch (err) {
      setError("Failed to load order details. Please try again.")
      console.error("Error fetching order:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || "Order not found"}
        </div>
        <Link to="/user/orders" className="text-primary hover:underline">
          ← Back to Orders
        </Link>
      </div>
    )
  }

  // Calculate total
  const total = order.cartItems.reduce((sum, item) => sum + item.price, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      {orderCreated && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          Your order has been placed successfully!
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">Order #{order.id}</h1>
          <p className="text-gray-600 mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>
          <div className="space-y-6">
            {order.cartItems.map((item) => (
              <div key={item.id} className="flex items-center">
                <div className="w-20 h-20 flex-shrink-0 mr-4 bg-gray-100 rounded-md overflow-hidden">
                  <img
                    src={`/src/assets/images/shop/${item.product.id}`}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => handleImageError(e, "product")}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.product.name}</h3>
                  <div className="text-sm text-gray-600">
                    <p>Quantity: {item.quantity}</p>
                    {item.aroma && <p>Scent: {item.aroma.name}</p>}
                    {item.modifiedBoneGroup && <p>Customized</p>}
                  </div>
                </div>
                <div className="font-medium">฿ {item.price}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-6">
          <div className="flex justify-between mb-2">
            <span>Subtotal:</span>
            <span>฿ {total}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Shipping:</span>
            <span>FREE</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>฿ {total}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Link to="/user/orders" className="text-primary hover:underline">
          ← Back to Orders
        </Link>
      </div>
    </div>
  )
}

export default OrderDetailsPage

