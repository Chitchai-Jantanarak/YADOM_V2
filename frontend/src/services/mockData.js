// Mock data for dashboard
export const getDashboardData = () => {
  return {
    totalUsers: 1250,
    totalProducts: 432,
    totalOrders: 5678,
    totalRevenue: 123456.78,
    orderStats: {
      waiting: 24,
      pending: 18,
      confirmed: 36,
      completed: 72,
      canceled: 12,
    },
    recentOrders: [
      {
        id: "000001",
        userId: "012345",
        user: { name: "John Doe" },
        cartItems: [
          { name: "Yadomm ver.1", quantity: 2, price: 100 },
          { name: "Yadomm ver.2", quantity: 1, price: 150 },
        ],
        status: "PENDING",
        createdAt: "2025-02-19T15:38:00",
        updatedAt: "2025-02-19T15:38:00",
        statusHistory: [
          {
            status: "WAITING",
            updatedAt: "2025-02-19T14:30:00",
            updatedBy: "system",
            updatedByName: "System",
          },
          {
            status: "PENDING",
            updatedAt: "2025-02-19T15:38:00",
            updatedBy: "admin123",
            updatedByName: "Admin User",
          },
        ],
      },
      {
        id: "000002",
        userId: "011234",
        user: { name: "Jane Smith" },
        cartItems: [
          { name: "Yadomm ver.1", quantity: 1, price: 100 },
          { name: "Accessory no.1", quantity: 1, price: 50 },
        ],
        status: "WAITING",
        createdAt: "2025-02-19T12:11:12",
        updatedAt: "2025-02-19T12:11:12",
      },
      {
        id: "000003",
        userId: "012123",
        user: { name: "Bob Johnson" },
        cartItems: [
          { name: "Yadomm ver.1", quantity: 1, price: 100 },
          { name: "Accessory no.3", quantity: 1, price: 75 },
        ],
        status: "CONFIRMED",
        createdAt: "2025-02-18T14:37:29",
        updatedAt: "2025-02-19T10:00:00",
      },
      {
        id: "000004",
        userId: "017745",
        user: { name: "Alice Brown" },
        cartItems: [
          { name: "Yadomm ver.1", quantity: 2, price: 200 },
          { name: "Yadomm ver.2", quantity: 1, price: 150 },
        ],
        status: "CANCELED",
        createdAt: "2025-02-19T15:38:00",
        updatedAt: "2025-02-19T15:38:00",
      },
      {
        id: "000005",
        userId: "013349",
        user: { name: "Charlie Wilson" },
        cartItems: [{ name: "Yadomm ver.1", quantity: 1, price: 100 }],
        status: "COMPLETED",
        createdAt: "2025-02-18T11:03:47",
        updatedAt: "2025-02-19T10:00:00",
      },
    ],
    monthlySales: [
      { month: "Jan", revenue: 12500, orders: 125 },
      { month: "Feb", revenue: 15000, orders: 150 },
      { month: "Mar", revenue: 18000, orders: 180 },
      { month: "Apr", revenue: 16000, orders: 160 },
      { month: "May", revenue: 21000, orders: 210 },
      { month: "Jun", revenue: 19000, orders: 190 },
      { month: "Jul", revenue: 22000, orders: 220 },
      { month: "Aug", revenue: 25000, orders: 250 },
      { month: "Sep", revenue: 23000, orders: 230 },
      { month: "Oct", revenue: 27000, orders: 270 },
      { month: "Nov", revenue: 30000, orders: 300 },
      { month: "Dec", revenue: 35000, orders: 350 },
    ],
  }
}

// Store orders in memory for mock operations
let orders = getDashboardData().recentOrders

// Mock function for deleting an order
export const deleteOrder = (orderId) => {
  console.log(`Mock delete order: ${orderId}`)
  orders = orders.filter((order) => order.id !== orderId)
  return { success: true, message: `Order ${orderId} deleted successfully` }
}

// Mock function for updating order status with tracking
export const updateOrderStatus = (orderId, status, trackingInfo = {}) => {
  console.log(`Mock update order ${orderId} status to: ${status}`)

  const orderIndex = orders.findIndex((order) => order.id === orderId)

  if (orderIndex === -1) {
    return { success: false, message: `Order ${orderId} not found` }
  }

  const now = new Date().toISOString()
  const updatedOrder = { ...orders[orderIndex] }

  // Update status
  updatedOrder.status = status
  updatedOrder.updatedAt = now

  // Add to status history
  if (!updatedOrder.statusHistory) {
    updatedOrder.statusHistory = []
  }

  updatedOrder.statusHistory.push({
    status,
    updatedAt: now,
    updatedBy: trackingInfo.updatedBy || "system",
    updatedByName: trackingInfo.updatedByName || "System",
  })

  // Update order in the array
  orders[orderIndex] = updatedOrder

  return {
    success: true,
    message: `Order ${orderId} updated to ${status}`,
    order: updatedOrder,
  }
}

// Mock function to get a specific order
export const getOrder = (orderId) => {
  const order = orders.find((order) => order.id === orderId)
  return order ? { success: true, order } : { success: false, message: "Order not found" }
}

