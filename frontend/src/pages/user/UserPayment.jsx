"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import PageTransition from "../../components/layout/PageTransition"
import { getOrderById, confirmOrderPayment } from "../../services/orderService"

const UserPayment = () => {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [paymentCompleted, setPaymentCompleted] = useState(false)
  const navigate = useNavigate()

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

  const handlePaymentComplete = async () => {
    try {
      // Use the new confirmOrderPayment function instead of updateOrderStatus
      await confirmOrderPayment(orderId)
      setPaymentCompleted(true)

      // Redirect to order confirmation after 3 seconds
      setTimeout(() => {
        navigate(`/order/${orderId}`)
      }, 3000)
    } catch (err) {
      setError("Failed to update payment status. Please contact support.")
      console.error("Error updating payment status:", err)
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
        <button
          onClick={() => navigate("/user/cart")}
          className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          Return to Cart
        </button>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Order Not Found</h1>
        <p>The order you're looking for doesn't exist or you don't have permission to view it.</p>
        <button
          onClick={() => navigate("/user/cart")}
          className="mt-4 bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          Return to Cart
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Payment</h1>

      {paymentCompleted ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Payment Completed!</p>
          <p>Your order has been received. You will be redirected to the order details page shortly.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="font-medium mb-2">Order #{order.id}</p>
              <p className="text-sm text-gray-600 mb-4">{new Date(order.createdAt).toLocaleString()}</p>

              <div className="space-y-4 mb-6">
                {order.cartItems.map((item) => (
                  <div key={item.id} className="flex items-start border-b pb-4">
                    <div className="flex-1">
                      <h3 className="font-medium">{item.product.name}</h3>
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
            <h2 className="text-xl font-semibold mb-4">QR Payment</h2>
            <div className="bg-gray-50 p-6 rounded-lg flex flex-col items-center">
              <div className="mb-6 p-4 border rounded-md bg-white w-64 h-64 flex items-center justify-center">
                {/* Placeholder for QR code */}
                <div className="text-center">
                  <p className="text-gray-500 mb-2">QR Code</p>
                  <div className="w-48 h-48 border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <p className="text-sm text-gray-400">Scan to pay</p>
                  </div>
                </div>
              </div>

              <p className="text-center mb-6">Please scan the QR code with your banking app to complete the payment.</p>

              <button
                onClick={handlePaymentComplete}
                className="w-full bg-green-500 text-white py-3 px-4 rounded-md flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                I've Completed the Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PageTransition(UserPayment)

