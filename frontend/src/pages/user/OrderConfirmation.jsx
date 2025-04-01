"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import PageTransition from "../../components/layout/PageTransition"
import { getOrderById } from "../../services/orderService"
import { getImageUrl } from "../../utils/imageUtils"

const OrderConfirmation = () => {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const data = await getOrderById(orderId)
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

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
        <Link
          to="/user/orders"
          className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          View All Orders
        </Link>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Order Not Found</h1>
        <p>The order you're looking for doesn't exist or you don't have permission to view it.</p>
        <Link
          to="/user/orders"
          className="mt-4 bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          View All Orders
        </Link>
      </div>
    )
  }

  const getStatusBadge = (status) => {
    const statusColors = {
      WAITING: "bg-yellow-100 text-yellow-800",
      PENDING: "bg-blue-100 text-blue-800",
      CONFIRMED: "bg-green-100 text-green-800",
      COMPLETED: "bg-purple-100 text-purple-800",
      CANCELED: "bg-red-100 text-red-800",
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs ${statusColors[status] || "bg-gray-100 text-gray-800"}`}>
        {status}
      </span>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Order #{order.id}</h1>
        <div>{getStatusBadge(order.status)}</div>
      </div>

      <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-8">
        <h2 className="text-lg font-semibold text-green-800 mb-2">Thank you for your order!</h2>
        <p className="text-green-700">
          Your order has been received and is now {order.status.toLowerCase()}. We'll notify you when there are any
          updates.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Order Details</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="mb-4">
              <p className="text-sm text-gray-600">Order Date: {new Date(order.createdAt).toLocaleString()}</p>
              <p className="text-sm text-gray-600">Last Updated: {new Date(order.updatedAt).toLocaleString()}</p>
            </div>

            <div className="space-y-4 mb-6">
              {order.cartItems.map((item) => (
                <div key={item.id} className="flex items-start border-b pb-4">
                  <div className="w-16 h-16 flex-shrink-0 mr-4 bg-gray-100 rounded-md overflow-hidden">
                    <img
                      src={`/src/assets/images/shop/${item.product.id}.png`}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target.src = "/src/assets/images/placeholder.png")}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product.name}</h3>
                    {item.aroma && <p className="text-sm text-gray-600">Scents: {item.aroma.name}</p>}
                    <div className="flex justify-between mt-2">
                      <span className="text-sm">Qty: {item.quantity}</span>
                      <span className="font-medium">฿ {item.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-2 mt-2 flex justify-between font-bold">
              <span>Total:</span>
              <span>฿ {order.cartItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="mb-6">
              <p className="font-medium mb-2">Shipping Address:</p>
              <div className="p-4 border rounded-md bg-white">
                <p className="font-medium">{order.user.name}</p>
                <p>{order.user.address}</p>
                <p>Tel: {order.user.tel}</p>
              </div>
            </div>

            <Link
              to="/user/orders"
              className="block w-full bg-primary text-white py-3 px-4 rounded-md text-center hover:bg-primary/90 transition-colors"
            >
              View All Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageTransition(OrderConfirmation)

