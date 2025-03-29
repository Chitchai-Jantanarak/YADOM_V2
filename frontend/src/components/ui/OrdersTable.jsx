"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Filter, Trash2, Edit, AlertCircle, Eye } from 'lucide-react'

export const OrdersTable = ({ orders }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [sortBy, setSortBy] = useState("createdAt")
  const [localOrders, setLocalOrders] = useState(orders || [])
  const navigate = useNavigate()

  if (!localOrders || localOrders.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 shadow text-center">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-700">No Orders Found</h3>
        <p className="text-gray-500 mt-2">There are no orders to display at this time.</p>
      </div>
    )
  }

  // Handle order deletion
  const handleDelete = (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      // Call mock delete function

      // Update local state to remove the order
      setLocalOrders(localOrders.filter((order) => order.id !== orderId))

      // Show success message
      alert(`Order ${orderId} deleted successfully`)
    }
  }

  // Handle navigation to order details
  const handleViewOrderDetails = (orderId) => {
    navigate(`/orders/${orderId}`)
  }

  // Handle navigation to order edit
  const handleEditOrder = (orderId) => {
    navigate(`/orders/${orderId}/edit`)
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "text-gray-600"
      case "WAITING":
        return "text-amber-500"
      case "CONFIRMED":
        return "text-green-600"
      case "COMPLETED":
        return "text-blue-600"
      case "CANCELED":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  // Filter and sort orders
  const filteredOrders = localOrders.filter((order) => {
    // Convert id to string for search
    const orderId = String(order.id);
    const userId = String(order.userId);
    
    // Filter by search term
    const searchMatch =
      orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.user && order.user.name && order.user.name.toLowerCase().includes(searchTerm.toLowerCase()))

    // Filter by status
    const statusMatch = filterStatus ? order.status === filterStatus : true

    return searchMatch && statusMatch
  })

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === "createdAt") {
      return new Date(b.createdAt) - new Date(a.createdAt)
    } else if (sortBy === "orderId") {
      return String(a.id).localeCompare(String(b.id))
    } else if (sortBy === "status") {
      return a.status.localeCompare(b.status)
    }
    return 0
  })

  return (
    <div className="bg-white rounded-lg shadow mt-8">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Order List</h2>

        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Order ID, User ID or Name"
              className="pl-10 pr-4 py-2 border rounded-md w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          <div className="flex gap-2 flex-wrap">
            <select
              className="border rounded-md px-4 py-2"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="WAITING">Waiting</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELED">Canceled</option>
            </select>

            <select className="border rounded-md px-4 py-2" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="createdAt">Date</option>
              <option value="status">Status</option>
              <option value="orderId">Order ID</option>
            </select>

            <button
              className="bg-gray-100 text-gray-600 px-4 py-2 rounded-md flex items-center gap-2"
              onClick={() => {
                setSearchTerm("")
                setFilterStatus("")
                setSortBy("createdAt")
              }}
            >
              <Filter className="h-5 w-5" />
              <span className="hidden sm:inline">Reset Filter</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cart Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Updated At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 underline cursor-pointer"
                    onClick={() => handleViewOrderDetails(order.id)}
                  >
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{order.user?.name || "Unknown"}</div>
                    <div className="text-xs text-gray-400">ID: {order.userId}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {order.cartItems &&
                      order.cartItems.map((item, index) => (
                        <div key={index}>
                          {item.name} x{item.quantity}
                        </div>
                      ))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`${getStatusColor(order.status)}`}>{order.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.updatedAt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex gap-2">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => handleViewOrderDetails(order.id)}
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button className="text-green-500 hover:text-green-700" onClick={() => handleEditOrder(order.id)}>
                        <Edit className="h-5 w-5" />
                      </button>
                      <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(order.id)}>
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}