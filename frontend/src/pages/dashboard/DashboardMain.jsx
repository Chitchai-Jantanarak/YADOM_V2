"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowUpRight, RefreshCw } from "lucide-react"
import { Sidebar } from "../../components/layout/Sidebar"
import { Header } from "../../components/layout/Header"
import { StatCards } from "../../components/ui/StatCards"
import { OrderStatusCards } from "../../components/ui/OrderStatusCards"
import { OrdersTable } from "../../components/ui/OrdersTable"
import { SalesChart } from "../../components/ui/SalesChart"
import { ProductTypeChart } from "../../components/ui/ProductTypeChart"
import { AromaChart } from "../../components/ui/AromaChart"
import { useApi } from "../../hooks/useApi"
import { getDashboardStats } from "../../services/dashboardService"
import { getRecentOrders } from "../../services/orderService"
import { authService, ROLES } from "../../services/authService"
import ProtectedRoute from "../../utils/ProtectedRoute"

export default function Dashboard() {
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState(null)
  const [filteredOrders, setFilteredOrders] = useState([])

  // Use the custom hook to fetch dashboard stats
  const {
    data: dashboardData,
    loading: statsLoading,
    error: statsError,
    execute: refreshStats,
  } = useApi(getDashboardStats, true)

  // Use the custom hook to fetch recent orders
  const {
    data: recentOrders,
    loading: ordersLoading,
    error: ordersError,
    execute: refreshOrders,
  } = useApi(getRecentOrders, true, [10])

  const currentUser = authService.getCurrentUser()
  const isOwner = currentUser && currentUser.role === ROLES.OWNER
  const isAdmin = currentUser && (currentUser.role === ROLES.ADMIN || currentUser.role === ROLES.OWNER)

  // Check if user is authenticated
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login")
    }
  }, [navigate])

  // Refresh all dashboard data
  const refreshDashboard = () => {
    refreshStats()
    refreshOrders(10)
  }

  // Filter orders when status filter changes
  useEffect(() => {
    if (recentOrders) {
      if (statusFilter) {
        setFilteredOrders(recentOrders.filter((order) => order.status === statusFilter))
      } else {
        setFilteredOrders(recentOrders)
      }
    }
  }, [statusFilter, recentOrders])

  // Handle navigation to order details
  const handleViewOrderDetails = (orderId) => {
    navigate(`/orders/${orderId}`)
  }

  // Handle navigation to order edit
  const handleEditOrder = (orderId) => {
    navigate(`/orders/${orderId}/edit`)
  }

  // Handle status filter change
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status)
  }

  // Loading state
  const isLoading = statsLoading || ordersLoading

  // Error state
  const hasError = statsError || ordersError
  const errorMessage = statsError || ordersError

  const DashboardContent = () => (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="ml-0 md:ml-64 flex-1">
        <Header />

        <main className="pt-24 px-4 md:px-6 pb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold">Dashboard</h1>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={refreshDashboard}
                className="px-4 py-2 border rounded-md flex items-center gap-2 hover:bg-gray-50"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          {statusFilter && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-6 flex justify-between items-center">
              <p>
                Filtering orders by status: <span className="font-bold">{statusFilter}</span>
              </p>
              <button
                onClick={() => setStatusFilter(null)}
                className="text-sm bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded"
              >
                Clear Filter
              </button>
            </div>
          )}

          {hasError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <p>{errorMessage}</p>
              <button onClick={refreshDashboard} className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm">
                Try Again
              </button>
            </div>
          )}

          {isLoading && !dashboardData && !recentOrders ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : dashboardData ? (
            <>
              <StatCards
                totalUsers={dashboardData.totalUsers}
                totalProducts={dashboardData.totalProducts}
                totalOrders={dashboardData.totalOrders}
                totalRevenue={dashboardData.totalRevenue}
              />

              <OrderStatusCards orderStats={dashboardData.orderStats} onFilterByStatus={handleStatusFilterChange} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <SalesChart monthlySales={dashboardData.monthlySales} />
                {dashboardData.productTypeStats && (
                  <ProductTypeChart productTypeStats={dashboardData.productTypeStats} />
                )}
              </div>

              {dashboardData.aromaStats && <AromaChart aromaStats={dashboardData.aromaStats} />}

              <OrdersTable
                orders={filteredOrders}
                onViewDetails={handleViewOrderDetails}
                onEditOrder={handleEditOrder}
                statusFilter={statusFilter}
                onClearFilter={() => setStatusFilter(null)}
              />
            </>
          ) : null}
        </main>
      </div>
    </div>
  )

  // Wrap the dashboard content with ProtectedRoute to enforce authentication and role-based access
  return (
    <ProtectedRoute requiredRoles={[ROLES.ADMIN, ROLES.OWNER]}>
      <DashboardContent />
    </ProtectedRoute>
  )
}

