"use client"

import { useState, useEffect } from "react"
import { CustomersTable } from "../../components/ui/CustomersTable"
import { getAllUsers } from "../../services/userService"
import { getAllOrders } from "../../services/orderService"
import { ROLES } from "../../services/authService"
import ProtectedRoute from "../../hoc/ProtectedRoute"

const DashboardCustomers = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch all users
        const usersData = await getAllUsers()
        
        // Fetch all orders to get the latest order status for each user
        const ordersResponse = await getAllOrders()
        
        // Handle different response formats - ensure we have an array of orders
        const ordersData = Array.isArray(ordersResponse) 
          ? ordersResponse 
          : (ordersResponse.orders || [])
        
        // Map the latest order status to each user
        const customersWithOrderStatus = usersData.map(user => {
          // Find all orders for this user
          const userOrders = Array.isArray(ordersData) 
            ? ordersData.filter(order => order.userId === user.id)
            : []
          
          // Sort by date to get the latest order
          const latestOrder = userOrders.length > 0 
            ? userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
            : null
            
          return {
            ...user,
            latestOrderStatus: latestOrder ? latestOrder.status : 'No Orders'
          }
        })
        
        setCustomers(customersWithOrderStatus)
      } catch (err) {
        console.error('Error fetching customers data:', err)
        setError('Failed to load customers. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const CustomersContent = () => (
    <div className="w-full md:pl-64">
      <div className="container">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Customers</h1>
        
        {loading ? (
          <div className="bg-white rounded-lg p-8 shadow text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-700">Loading customers data...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg p-8 shadow text-center text-red-500">
            <p>{error}</p>
          </div>
        ) : (
          <CustomersTable customers={customers} />
        )}
      </div>
    </div>
  )

  return (
    <ProtectedRoute requiredRoles={[ROLES.ADMIN, ROLES.OWNER]}>
      <CustomersContent />
    </ProtectedRoute>
  )
}

export default DashboardCustomers