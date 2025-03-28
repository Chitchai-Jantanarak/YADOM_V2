"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { updateOrderStatus } from "../services/mockData"

export default function OrderEdit() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState("")
  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  })

  // Mock function to get order details
  const fetchOrderDetails = async (id) => {
    // In a real app, this would be an API call
    // For now, we'll simulate with mock data
    const mockOrder = {
      id: "000001",
      userId: "012345",
      user: {
        name: "John Doe",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "123-456-7890",
        address: "123 Main St, Anytown, USA",
      },
      cartItems: [
        {
          name: "Yadomm ver.1",
          quantity: 2,
          price: 44,
          color: "Green",
          shape: "Can",
          scents: "Herb",
        },
        {
          name: "Yadomm ver.2",
          quantity: 1,
          price: 44,
          color: "Light Blue, Blue, Skin",
          shape: "Cylinder",
          scents: "Herb",
        },
      ],
      status: "PENDING",
      createdAt: "2025-02-19T15:38:00",
      updatedAt: "2025-02-19T15:38:00",
      subtotal: 132.0,
      shipping: 0,
      total: 132.0,
    }

    return mockOrder
  }

  useEffect(() => {
    const getOrderDetails = async () => {
      try {
        setLoading(true)
        const orderData = await fetchOrderDetails(orderId)
        setOrder(orderData)
        setSelectedStatus(orderData.status)

        // Set customer info
        if (orderData.user) {
          setCustomerInfo({
            firstName: orderData.user.firstName || "",
            lastName: orderData.user.lastName || "",
            email: orderData.user.email || "",
            phone: orderData.user.phone || "",
            address: orderData.user.address || "",
          })
        }
      } catch (error) {
        console.error("Error fetching order details:", error)
      } finally {
        setLoading(false)
      }
    }

    getOrderDetails()
  }, [orderId])

  const handleStatusChange = (status) => {
    setSelectedStatus(status)
  }

  const handleCustomerInfoChange = (e) => {
    const { name, value } = e.target
    setCustomerInfo((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCancel = () => {
    navigate(-1)
  }

  const handleSave = async () => {
    try {
      // Get current user (in a real app, this would come from auth context)
      const currentUser = {
        id: "admin123",
        name: "Admin User",
      }

      // Update order status with tracking info
      const result = await updateOrderStatus(order.id, selectedStatus, {
        updatedBy: currentUser.id,
        updatedByName: currentUser.name,
        updatedAt: new Date().toISOString(),
      })

      if (result.success) {
        alert("Order updated successfully")
        navigate(-1)
      }
    } catch (error) {
      console.error("Error updating order:", error)
      alert("Failed to update order")
    }
  }

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

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8 my-8">
      <h1 className="text-3xl font-bold mb-6 border-b pb-4">Edit Order</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Order Details */}
        <div>
          <div className="mb-6">
            <p className="text-xl font-medium">
              OrderID : {order.id} UserID : {order.userId}
            </p>
            <p className="text-gray-500 mt-2">
              Date : {formatDate(order.createdAt)} Time : {formatTime(order.createdAt)}
            </p>
          </div>

          <div className="mb-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name :</label>
                <input
                  type="text"
                  name="firstName"
                  value={customerInfo.firstName}
                  onChange={handleCustomerInfoChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name :</label>
                <input
                  type="text"
                  name="lastName"
                  value={customerInfo.lastName}
                  onChange={handleCustomerInfoChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Gmail :</label>
              <input
                type="email"
                name="email"
                value={customerInfo.email}
                onChange={handleCustomerInfoChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number :</label>
              <input
                type="text"
                name="phone"
                value={customerInfo.phone}
                onChange={handleCustomerInfoChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Address :</label>
              <textarea
                name="address"
                value={customerInfo.address}
                onChange={handleCustomerInfoChange}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Product Items */}
          <div className="space-y-6">
            {order.cartItems.map((item, index) => (
              <div key={index} className="border-t pt-4">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                    <img
                      src={`/placeholder.svg?height=96&width=96&text=${encodeURIComponent(item.name)}`}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium">{item.name}</h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm">
                      <p>
                        Color: <span className="text-gray-600">{item.color}</span>
                      </p>
                      <p>
                        Shape: <span className="text-gray-600">{item.shape}</span>
                      </p>
                      <p>
                        Scents: <span className="text-gray-600">{item.scents}</span>
                      </p>
                    </div>
                    <div className="mt-2">
                      <p>
                        Price: <span className="font-medium">{item.price} ฿</span>
                      </p>
                      <p>
                        Quantity: <span className="font-medium">{item.quantity}</span>
                      </p>
                      <p>
                        Total: <span className="font-medium">{item.price * item.quantity} ฿</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Status and Summary */}
        <div>
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">Status</h2>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div
                className={`border rounded-md p-4 flex items-center gap-2 cursor-pointer ${selectedStatus === "WAITING" ? "bg-amber-100 border-amber-300" : "bg-gray-100"}`}
                onClick={() => handleStatusChange("WAITING")}
              >
                <div
                  className={`w-5 h-5 rounded-md ${selectedStatus === "WAITING" ? "bg-amber-500" : "bg-gray-300"}`}
                ></div>
                <span className="font-medium">Waiting</span>
              </div>

              <div
                className={`border rounded-md p-4 flex items-center gap-2 cursor-pointer ${selectedStatus === "PENDING" ? "bg-blue-100 border-blue-300" : "bg-gray-100"}`}
                onClick={() => handleStatusChange("PENDING")}
              >
                <div
                  className={`w-5 h-5 rounded-md ${selectedStatus === "PENDING" ? "bg-blue-500" : "bg-gray-300"}`}
                ></div>
                <span className="font-medium">Pending</span>
              </div>

              <div
                className={`border rounded-md p-4 flex items-center gap-2 cursor-pointer ${selectedStatus === "CONFIRMED" ? "bg-green-100 border-green-300" : "bg-gray-100"}`}
                onClick={() => handleStatusChange("CONFIRMED")}
              >
                <div
                  className={`w-5 h-5 rounded-md ${selectedStatus === "CONFIRMED" ? "bg-green-500" : "bg-gray-300"}`}
                ></div>
                <span className="font-medium">Confirmed</span>
              </div>

              <div
                className={`border rounded-md p-4 flex items-center gap-2 cursor-pointer ${selectedStatus === "CANCELED" ? "bg-red-100 border-red-300" : "bg-gray-100"}`}
                onClick={() => handleStatusChange("CANCELED")}
              >
                <div
                  className={`w-5 h-5 rounded-md ${selectedStatus === "CANCELED" ? "bg-red-500" : "bg-gray-300"}`}
                ></div>
                <span className="font-medium">Canceled</span>
              </div>
            </div>

            <p className="text-gray-500 mt-4 text-sm">*You can choose multiple order status</p>
          </div>

          <div className="border rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg">Subtotal:</span>
              <span className="text-lg font-bold">{order.subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center mb-4">
              <span className="text-lg">Shipping:</span>
              <span className="text-lg font-bold">
                {order.shipping === 0 ? "FREE" : `${order.shipping.toFixed(2)}`}
              </span>
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-xl">Grand total:</span>
                <span className="text-xl font-bold">{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Order History/Tracking */}
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-2">Order History</h3>
            <div className="border rounded-md p-4 bg-gray-50 space-y-2 max-h-40 overflow-y-auto">
              <div className="text-sm">
                <p className="font-medium">Created</p>
                <p className="text-gray-600">
                  Date: {formatDate(order.createdAt)} Time: {formatTime(order.createdAt)}
                </p>
                <p className="text-gray-600">By: System</p>
              </div>

              {order.statusHistory &&
                order.statusHistory.map((history, index) => (
                  <div key={index} className="text-sm border-t pt-2">
                    <p className="font-medium">Status changed to {history.status}</p>
                    <p className="text-gray-600">
                      Date: {formatDate(history.updatedAt)} Time: {formatTime(history.updatedAt)}
                    </p>
                    <p className="text-gray-600">By: {history.updatedByName}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={handleCancel}
          className="px-8 py-3 border border-blue-500 text-blue-500 rounded-full hover:bg-blue-50 font-medium"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-8 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 font-medium"
        >
          Save
        </button>
      </div>
    </div>
  )
}

