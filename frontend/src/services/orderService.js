import api from "./api"

export const createOrder = async (orderData) => {
  const response = await api.post("/api/orders", orderData)
  return response.data
}

export const getUserOrders = async () => {
  const response = await api.get("/api/orders")
  return response.data
}

export const getAllOrders = async () => {
  try {
    const response = await api.get("/api/orders/admin")
    // Return the entire response to allow components to handle pagination
    return response.data
  } catch (error) {
    console.error("Error fetching orders:", error)
    throw error
  }
}

export const getRecentOrders = async (limit = 10) => {
  const response = await api.get("/api/orders/recent", { params: { limit } })
  return response.data
}

export const getOrderById = async (id) => {
  const response = await api.get(`/api/orders/${id}`)
  return response.data
}

export const updateOrderStatus = async (id, status) => {
  const response = await api.put(`/api/orders/${id}/status`, { status })
  return response.data
}

export const confirmOrderPayment = async (id) => {
  const response = await api.post(`/api/orders/${id}/payment`, {})
  return response.data
}

export const deleteOrder = async (id) => {
  const response = await api.delete(`/api/orders/${id}`)
  return response.data
}

export const cancelOrder = async (id) => {
  // Assuming there's an endpoint for canceling orders
  const response = await api.put(`/api/orders/${id}/status`, { status: "CANCELED" })
  return response.data
}

// For customer orders - reusing getUserOrders since the backend handles the current user
export const getCustomerOrders = getUserOrders