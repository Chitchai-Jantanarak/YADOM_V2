"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Filter, Edit, AlertCircle, Eye, Calendar, X } from "lucide-react"
import { updateOrderStatus } from "../../services/orderService"

export const OrdersTable = ({ orders, onViewDetails, onEditOrder, statusFilter, onClearFilter }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState(statusFilter || "")
  const [sortBy, setSortBy] = useState("createdAt")
  const [localOrders, setLocalOrders] = useState(orders || [])
  const [selectedDate, setSelectedDate] = useState(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [statusDropdownOpen, setStatusDropdownOpen] = useState({})
  const [updatingOrderId, setUpdatingOrderId] = useState(null)
  const datePickerRef = useRef(null)
  const buttonRef = useRef(null)
  const navigate = useNavigate()

  // Update local orders when props change
  useEffect(() => {
    setLocalOrders(orders || [])
    setFilterStatus(statusFilter || "")
  }, [orders, statusFilter])

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowDatePicker(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

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

  // Toggle status dropdown
  const toggleStatusDropdown = (orderId, e) => {
    e.stopPropagation()
    setStatusDropdownOpen((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }))
  }

  // Handle status update
  const handleStatusUpdate = async (orderId, newStatus, e) => {
    e.stopPropagation()
    try {
      setUpdatingOrderId(orderId)
      await updateOrderStatus(orderId, newStatus)

      // Update local state
      setLocalOrders((prevOrders) =>
        prevOrders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)),
      )

      // Close dropdown
      setStatusDropdownOpen((prev) => ({
        ...prev,
        [orderId]: false,
      }))
    } catch (error) {
      console.error("Error updating order status:", error)
      alert("Failed to update order status")
    } finally {
      setUpdatingOrderId(null)
    }
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

  // Handle date change
  const handleDateChange = (e) => {
    const dateValue = e.target.value

    if (dateValue) {
      const newDate = new Date(dateValue)
      // Set time to noon to avoid timezone issues
      newDate.setHours(12, 0, 0, 0)
      setSelectedDate(newDate)
    } else {
      setSelectedDate(null)
    }
  }

  // Apply date filter
  const applyDateFilter = () => {
    setShowDatePicker(false)
  }

  // Clear date filter
  const clearDateFilter = () => {
    setSelectedDate(null)
  }

  // Reset all filters
  const resetAllFilters = () => {
    setSearchTerm("")
    setFilterStatus("")
    setSortBy("createdAt")
    clearDateFilter()
    if (onClearFilter) {
      onClearFilter()
    }
  }

  // Toggle date picker visibility
  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker)
  }

  // Filter and sort orders
  const filteredOrders = localOrders.filter((order) => {
    // Convert id to string for search
    const orderId = String(order.id)
    const userId = String(order.userId)

    // Filter by search term
    const searchMatch =
      orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.user && order.user.name && order.user.name.toLowerCase().includes(searchTerm.toLowerCase()))

    // Filter by status
    const statusMatch = filterStatus ? order.status === filterStatus : true

    // Filter by date
    let dateMatch = true
    if (selectedDate) {
      const orderDate = new Date(order.createdAt)
      const filterDate = new Date(selectedDate)

      dateMatch =
        orderDate.getFullYear() === filterDate.getFullYear() &&
        orderDate.getMonth() === filterDate.getMonth() &&
        orderDate.getDate() === filterDate.getDate()
    }

    return searchMatch && statusMatch && dateMatch
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

  // Format date for input value
  const formatDateForInput = (date) => {
    if (!date) return ""
    const d = new Date(date)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
  }

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

          <div className="flex gap-2 flex-wrap items-center">
            {/* Date Filter Button with Custom Dropdown */}
            <div className="relative">
              <button
                ref={buttonRef}
                onClick={toggleDatePicker}
                className="border rounded-md px-4 py-2 flex items-center gap-2"
                type="button"
              >
                <Calendar className="h-4 w-4" />
                <span>
                  {selectedDate
                    ? new Date(selectedDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "Select Date"}
                </span>
                {selectedDate && (
                  <X
                    className="h-4 w-4 ml-1 hover:text-red-500"
                    onClick={(e) => {
                      e.stopPropagation()
                      clearDateFilter()
                    }}
                  />
                )}
              </button>

              {showDatePicker && (
                <div
                  ref={datePickerRef}
                  className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 p-4"
                  style={{ minWidth: "260px" }}
                >
                  <div className="flex flex-col gap-3">
                    <label htmlFor="date-filter" className="text-sm font-medium text-gray-700">
                      Filter by date:
                    </label>
                    <div className="date-input-wrapper">
                      <input
                        id="date-filter"
                        type="date"
                        className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formatDateForInput(selectedDate)}
                        onChange={handleDateChange}
                      />
                    </div>
                    <div className="flex justify-between mt-2">
                      <button
                        className="text-sm text-gray-600 hover:text-gray-800 px-3 py-1 rounded"
                        onClick={clearDateFilter}
                        type="button"
                      >
                        Clear
                      </button>
                      <button
                        className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        onClick={applyDateFilter}
                        type="button"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

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
              onClick={resetAllFilters}
              type="button"
            >
              <Filter className="h-5 w-5" />
              <span className="hidden sm:inline">Reset Filter</span>
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {(filterStatus || selectedDate) && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-6 flex justify-between items-center">
            <p>
              {filterStatus && (
                <span>
                  Status: <strong>{filterStatus}</strong>
                  {selectedDate && ", "}
                </span>
              )}
              {selectedDate && (
                <span>
                  Date:{" "}
                  <strong>
                    {new Date(selectedDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </strong>
                </span>
              )}
            </p>
            <button onClick={resetAllFilters} className="text-sm bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded">
              Clear Filters
            </button>
          </div>
        )}

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
                    onClick={() => (onViewDetails ? onViewDetails(order.id) : handleViewOrderDetails(order.id))}
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
                        onClick={() => (onViewDetails ? onViewDetails(order.id) : handleViewOrderDetails(order.id))}
                        type="button"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <div className="relative">
                        <button
                          className="text-green-500 hover:text-green-700"
                          onClick={(e) => toggleStatusDropdown(order.id, e)}
                          disabled={updatingOrderId === order.id}
                          type="button"
                        >
                          <Edit className="h-5 w-5" />
                        </button>

                        {statusDropdownOpen[order.id] && (
                          <div className="absolute z-10 right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200">
                            <div className="py-1">
                              <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">Update Status</div>
                              {["WAITING", "PENDING", "CONFIRMED", "COMPLETED", "CANCELED"].map((status) => (
                                <button
                                  key={status}
                                  onClick={(e) => handleStatusUpdate(order.id, status, e)}
                                  className={`block w-full text-left px-4 py-2 text-sm ${
                                    status === order.status ? "bg-gray-100 font-medium" : "hover:bg-gray-50"
                                  } ${getStatusColor(status)}`}
                                  disabled={updatingOrderId === order.id}
                                >
                                  {status}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-500">
            Showing {filteredOrders.length} of {filteredOrders.length} customers
          </div>
        </div>
      </div>
    </div>
  )
}

