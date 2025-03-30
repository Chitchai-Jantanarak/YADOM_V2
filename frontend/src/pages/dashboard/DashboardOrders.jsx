"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { RefreshCw, Filter } from 'lucide-react'
import { OrdersTable } from "../../components/ui/OrdersTable"
import { useApi } from "../../hooks/useApi"
import { getAllOrders } from "../../services/orderService"
import { ROLES } from "../../services/authService"
import ProtectedRoute from "../../hoc/ProtectedRoute"

export default function OrdersPage() {
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState(null)
  const [dateFilter, setDateFilter] = useState(null)
  const [filteredOrders, setFilteredOrders] = useState([])
  const [originalOrders, setOriginalOrders] = useState([])
  const [pagination, setPagination] = useState(null)

  // Use the custom hook to fetch all orders
  const {
    data: apiResponse,
    loading: ordersLoading,
    error: ordersError,
    execute: refreshOrders,
  } = useApi(getAllOrders, true)

  // Extract orders from API response
  useEffect(() => {
    if (apiResponse) {
      let ordersArray = [];
      
      // Check if the response has the expected structure
      if (Array.isArray(apiResponse)) {
        // If the response is already an array, use it directly
        ordersArray = apiResponse;
      } else if (apiResponse && Array.isArray(apiResponse.orders)) {
        // If the response has an orders property that's an array, use that
        ordersArray = apiResponse.orders;
        
        // If there's pagination info, save it
        if (apiResponse.pagination) {
          setPagination(apiResponse.pagination);
        }
      } else if (apiResponse && Array.isArray(apiResponse.data)) {
        // If the response has a data property that's an array, use that
        ordersArray = apiResponse.data;
        
        // If there's pagination info, save it
        if (apiResponse.pagination) {
          setPagination(apiResponse.pagination);
        }
      } else {
        // Fallback to empty array if structure is unexpected
        console.error("Unexpected API response structure:", apiResponse);
        ordersArray = [];
      }
      
      setOriginalOrders(ordersArray);
      setFilteredOrders(ordersArray);
    } else {
      setOriginalOrders([]);
      setFilteredOrders([]);
    }
  }, [apiResponse]);

  // Apply filters when filter state changes
  useEffect(() => {
    if (!originalOrders.length) return;
    
    let filtered = [...originalOrders];

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Apply date filter
    if (dateFilter) {
      const today = new Date();
      const filterDate = new Date();

      switch (dateFilter) {
        case "today":
          filtered = filtered.filter((order) => {
            const orderDate = new Date(order.createdAt);
            return orderDate.toDateString() === today.toDateString();
          });
          break;
        case "week":
          filterDate.setDate(today.getDate() - 7);
          filtered = filtered.filter((order) => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= filterDate;
          });
          break;
        case "month":
          filterDate.setMonth(today.getMonth() - 1);
          filtered = filtered.filter((order) => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= filterDate;
          });
          break;
        default:
          break;
      }
    }

    setFilteredOrders(filtered);
  }, [statusFilter, dateFilter, originalOrders]);

  // Handle navigation to order details
  const handleViewOrderDetails = (orderId) => {
    navigate(`/orders/${orderId}`);
  }

  // Handle navigation to order edit
  const handleEditOrder = (orderId) => {
    navigate(`/orders/${orderId}/edit`);
  }

  // Handle status filter change
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status === statusFilter ? null : status);
  }

  // Handle date filter change
  const handleDateFilterChange = (date) => {
    setDateFilter(date === dateFilter ? null : date);
  }

  // Clear all filters
  const clearAllFilters = () => {
    setStatusFilter(null);
    setDateFilter(null);
  }


  const OrdersContent = () => (
    <div className="w-full md:pl-64">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Orders</h1>

        <div className="flex flex-wrap gap-2">
          <div className="dropdown relative">
            <button className="px-4 py-2 border rounded-md flex items-center gap-2 hover:bg-gray-50">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
            <div className="dropdown-menu absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 hidden">
              <div className="p-2">
                <h3 className="font-medium mb-2">Status</h3>
                {["Waiting", "Pending", "Confirmed", "Completed", "Canceled"].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusFilterChange(status)}
                    className={`block w-full text-left px-2 py-1 rounded ${statusFilter === status ? "bg-blue-100" : "hover:bg-gray-100"}`}
                  >
                    {status}
                  </button>
                ))}

                <h3 className="font-medium mt-3 mb-2">Date</h3>
                {[
                  { id: "today", label: "Today" },
                  { id: "week", label: "Last 7 days" },
                  { id: "month", label: "Last 30 days" },
                ].map((date) => (
                  <button
                    key={date.id}
                    onClick={() => handleDateFilterChange(date.id)}
                    className={`block w-full text-left px-2 py-1 rounded ${dateFilter === date.id ? "bg-blue-100" : "hover:bg-gray-100"}`}
                  >
                    {date.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={refreshOrders}
            className="px-4 py-2 border rounded-md flex items-center gap-2 hover:bg-gray-50"
            disabled={ordersLoading}
          >
            <RefreshCw className={`h-4 w-4 ${ordersLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {(statusFilter || dateFilter) && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-6 flex justify-between items-center">
          <p>
            {statusFilter && (
              <span>
                Status: <strong>{statusFilter}</strong>
                {dateFilter && ", "}
              </span>
            )}
            {dateFilter && (
              <span>
                Date:{" "}
                <strong>
                  {dateFilter === "today" ? "Today" : dateFilter === "week" ? "Last 7 days" : "Last 30 days"}
                </strong>
              </span>
            )}
          </p>
          <button onClick={clearAllFilters} className="text-sm bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded">
            Clear Filters
          </button>
        </div>
      )}

      {ordersError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{ordersError}</p>
          <button onClick={refreshOrders} className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm">
            Try Again
          </button>
        </div>
      )}

      {ordersLoading && !apiResponse ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredOrders.length > 0 ? (
        <OrdersTable
          orders={filteredOrders}
          onViewDetails={handleViewOrderDetails}
          onEditOrder={handleEditOrder}
          statusFilter={statusFilter}
          onClearFilter={clearAllFilters}
          showPagination={true}
          pagination={pagination}
        />
      ) : (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <span className="text-gray-500 text-3xl">!</span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Orders Found</h2>
          <p className="text-gray-500 mb-6">There are no orders to display at this time.</p>
          <button 
            onClick={refreshOrders}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Refresh Data
          </button>
        </div>
      )}
    </div>
  )

  return (
    <ProtectedRoute requiredRoles={[ROLES.ADMIN, ROLES.OWNER]}>
      <OrdersContent />
    </ProtectedRoute>
  )
}