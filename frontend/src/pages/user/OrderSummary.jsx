"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import PageTransition from "../../components/layout/PageTransition"
import { getOrderById, getUserOrders, getAllOrders, updateOrderStatus } from "../../services/orderService"
import { getCurrentUser } from "../../services/authService"
import NavBar2 from "../../components/layout/NavBar2"
import { getImageUrl } from "../../utils/imageUtils"

const OrderSummary = () => {
  const { orderId } = useParams()
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const navigate = useNavigate()
  const currentUser = getCurrentUser()

  useEffect(() => {
    if (!currentUser) {
      navigate("/unauthorized")
      return
    }

    fetchOrders()
  }, [])

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId)
    }
  }, [orderId])

  const fetchOrders = async () => {
    try {
      setLoading(true)

      let data
      // If admin or owner, fetch all orders
      if (currentUser.role === "ADMIN" || currentUser.role === "OWNER") {
        data = await getAllOrders()
      } else {
        // Otherwise fetch only user's orders
        data = await getUserOrders()
      }

      setOrders(data.orders || [])

      // If no specific order is selected but we have orders, select the first one
      if (!orderId && data.orders && data.orders.length > 0) {
        fetchOrderDetails(data.orders[0].id)
      }

      setError(null)
    } catch (err) {
      setError("Failed to load orders. Please try again.")
      console.error("Error fetching orders:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchOrderDetails = async (id) => {
    try {
      const data = await getOrderById(id)

      // Check if the user has permission to view this order
      if (currentUser.role !== "ADMIN" && currentUser.role !== "OWNER" && data.userId !== currentUser.id) {
        navigate("/unauthorized")
        return
      }

      setSelectedOrder(data)
    } catch (err) {
      console.error("Error fetching order details:", err)
      // If we get a 403 or 401 error, redirect to unauthorized
      if (err.response && (err.response.status === 403 || err.response.status === 401)) {
        navigate("/unauthorized")
      }
    }
  }

  const handleUpdateStatus = async (id, status) => {
    try {
      setUpdatingStatus(true)
      await updateOrderStatus(id, status)
      // Refresh order details
      fetchOrderDetails(id)
      // Refresh order list
      fetchOrders()
    } catch (err) {
      console.error("Error updating order status:", err)
      alert("Failed to update order status. Please try again.")
    } finally {
      setUpdatingStatus(false)
    }
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
          to="/user/cart"
          className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          Return to Cart
        </Link>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          {currentUser.role === "ADMIN" || currentUser.role === "OWNER" ? "All Orders" : "My Orders"}
        </h1>
        <div className="text-center py-12">
          <h2 className="text-xl mb-4">No orders found</h2>
          {currentUser.role === "CUSTOMER" && (
            <>
              <p className="mb-6">Start shopping to create your first order.</p>
              <Link
                to="/shop"
                className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                Browse Products
              </Link>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      <NavBar2 />
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          {currentUser.role === "ADMIN" || currentUser.role === "OWNER" ? "All Orders" : "My Orders"}
        </h1>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Order History</h2>
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <div className="divide-y">
                {orders.map((order) => (
                  <Link
                    key={order.id}
                    to={`/order/${order.id}`}
                    className={`block p-4 hover:bg-gray-100 transition-colors ${
                      selectedOrder && order.id === selectedOrder.id ? "bg-gray-100" : ""
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Order #{order.id}</p>
                        {(currentUser.role === "ADMIN" || currentUser.role === "OWNER") && (
                          <p className="text-xs text-gray-600">User: {order.user?.name || "Unknown"}</p>
                        )}
                        <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>{getStatusBadge(order.status)}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            {selectedOrder ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Order Details</h2>
                  <div>{getStatusBadge(selectedOrder.status)}</div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="mb-4">
                    <p className="font-medium">Order #{selectedOrder.id}</p>
                    {(currentUser.role === "ADMIN" || currentUser.role === "OWNER") && (
                      <p className="text-sm text-gray-600">Customer: {selectedOrder.user?.name || "Unknown"}</p>
                    )}
                    <p className="text-sm text-gray-600">
                      Placed on: {new Date(selectedOrder.createdAt).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Last Updated: {new Date(selectedOrder.updatedAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="space-y-4 mb-6">
                    {selectedOrder.cartItems.map((item) => (
                      <div key={item.id} className="flex items-start border-b pb-4">
                        <div className="w-16 h-16 flex-shrink-0 mr-4 bg-gray-100 rounded-md overflow-hidden">
                          <img
                            src={getImageUrl(
                              `/src/assets/images/shop/${item.product.id || "/placeholder.svg"}.png`,
                              "product",
                            )}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => (e.target.src = "/src/assets/images/placeholder.png")}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{item.product.name}</h3>
                          {item.productColor && (
                            <p className="text-sm text-gray-600">
                              Color: {item.productColor.colorName || item.productColor.colorCode}
                            </p>
                          )}
                          {item.aroma && <p className="text-sm text-gray-600">Scents: {item.aroma.name}</p>}
                          <div className="flex justify-between mt-2">
                            <span className="text-sm">Qty: {item.quantity}</span>
                            <span className="font-medium">฿ {item.price.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between mb-2">
                      <span>Subtotal:</span>
                      <span>฿ {selectedOrder.cartItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Shipping:</span>
                      <span>FREE</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>฿ {selectedOrder.cartItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Only show action buttons to the customer who owns the order */}
                  {currentUser.id === selectedOrder.userId && (
                    <>
                      {selectedOrder.status === "WAITING" && (
                        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-yellow-800">
                            Your order is waiting for payment. Please complete the payment to proceed.
                          </p>
                          <Link
                            to={`/user/payment/${selectedOrder.id}`}
                            className="mt-2 inline-block bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors"
                          >
                            Complete Payment
                          </Link>
                        </div>
                      )}

                      {selectedOrder.status === "PENDING" && (
                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-blue-800">Your payment has been received. We are processing your order.</p>
                        </div>
                      )}

                      {selectedOrder.status === "CONFIRMED" && (
                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-green-800">
                            Your order has been confirmed and is being prepared for shipping.
                          </p>
                        </div>
                      )}

                      {selectedOrder.status === "COMPLETED" && (
                        <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                          <p className="text-purple-800">
                            Your order has been completed. Thank you for shopping with us!
                          </p>
                        </div>
                      )}

                      {selectedOrder.status === "CANCELED" && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-red-800">This order has been canceled.</p>
                        </div>
                      )}
                    </>
                  )}

                  {/* Admin/Owner actions */}
                  {(currentUser.role === "ADMIN" || currentUser.role === "OWNER") && (
                    <div className="mt-6 p-4 bg-gray-100 border border-gray-200 rounded-lg">
                      <h3 className="font-medium mb-2">Admin Actions</h3>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleUpdateStatus(selectedOrder.id, "CONFIRMED")}
                          className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600 transition-colors disabled:bg-gray-400"
                          disabled={selectedOrder.status === "CONFIRMED" || updatingStatus}
                        >
                          Confirm Order
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(selectedOrder.id, "COMPLETED")}
                          className="bg-purple-500 text-white px-3 py-1 rounded-md text-sm hover:bg-purple-600 transition-colors disabled:bg-gray-400"
                          disabled={selectedOrder.status === "COMPLETED" || updatingStatus}
                        >
                          Mark as Completed
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(selectedOrder.id, "CANCELED")}
                          className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition-colors disabled:bg-gray-400"
                          disabled={selectedOrder.status === "CANCELED" || updatingStatus}
                        >
                          Cancel Order
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg flex items-center justify-center h-64">
                <p className="text-gray-500">Select an order to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageTransition(OrderSummary)

