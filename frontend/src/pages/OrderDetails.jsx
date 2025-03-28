"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getOrder } from "../services/mockData"
import { Edit, ArrowLeft } from "lucide-react"

export default function OrderDetails() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true)
        const response = await getOrder(orderId)
        if (response.success) {
          setOrder(response.order)
        } else {
          console.error(response.message)
        }
      } catch (error) {
        console.error("Error fetching order:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [orderId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500">Order Not Found</h2>
          <p className="mt-2">The order you're looking for doesn't exist.</p>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return `${date.getDate()}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`
  }

  // Format time
  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-blue-100 text-blue-800"
      case "WAITING":
        return "bg-amber-100 text-amber-800"
      case "CONFIRMED":
        return "bg-green-100 text-green-800"
      case "COMPLETED":
        return "bg-purple-100 text-purple-800"
      case "CANCELED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Calculate total
  const calculateTotal = () => {
    if (!order.cartItems) return 0
    return order.cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8 my-8">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-3xl font-bold">Order Details</h1>
        </div>

        <button
          onClick={() => navigate(`/orders/${order.id}/edit`)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <Edit className="h-4 w-4" />
          Edit Order
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Order Info */}
        <div className="md:col-span-2">
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Order Information</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <p>
                <span className="font-medium">Order ID:</span> {order.id}
              </p>
              <p>
                <span className="font-medium">User ID:</span> {order.userId}
              </p>
              <p>
                <span className="font-medium">Date:</span> {formatDate(order.createdAt)}
              </p>
              <p>
                <span className="font-medium">Time:</span> {formatTime(order.createdAt)}
              </p>
              <p className="mt-2">
                <span className="font-medium">Status:</span>
                <span className={`ml-2 px-2 py-1 rounded-md text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Customer Information</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <p>
                <span className="font-medium">Name:</span> {order.user?.name || "N/A"}
              </p>
              <p>
                <span className="font-medium">Email:</span> {order.user?.email || "N/A"}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {order.user?.phone || "N/A"}
              </p>
              <p>
                <span className="font-medium">Address:</span> {order.user?.address || "N/A"}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">Order Items</h2>
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.cartItems &&
                    order.cartItems.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md"></div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.price} ฿</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {item.price * item.quantity} ฿
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <h2 className="text-xl font-bold mb-2">Order Summary</h2>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between py-2 border-b">
              <span>Subtotal</span>
              <span className="font-medium">{calculateTotal()} ฿</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span>Shipping</span>
              <span className="font-medium">FREE</span>
            </div>
            <div className="flex justify-between py-2 mt-2">
              <span className="text-lg font-bold">Total</span>
              <span className="text-lg font-bold">{calculateTotal()} ฿</span>
            </div>
          </div>

          {/* Order History */}
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-2">Order History</h2>
            <div className="bg-gray-50 p-4 rounded-md max-h-60 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <p className="font-medium">Created</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(order.createdAt)} {formatTime(order.createdAt)}
                  </p>
                  <p className="text-sm text-gray-600">By: System</p>
                </div>

                {order.statusHistory &&
                  order.statusHistory.map((history, index) => (
                    <div key={index} className="border-t pt-2">
                      <p className="font-medium">Status changed to {history.status}</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(history.updatedAt)} {formatTime(history.updatedAt)}
                      </p>
                      <p className="text-sm text-gray-600">By: {history.updatedByName}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

