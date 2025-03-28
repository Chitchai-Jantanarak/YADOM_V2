import api from "./api"

// Order endpoints
const endpoints = {
  list: "/api/orders",
  admin: "/api/orders/admin",
  details: (id) => `/api/orders/${id}`,
  update: (id) => `/api/orders/${id}`,
  delete: (id) => `/api/orders/${id}`,
  updateStatus: (id) => `/api/orders/${id}/status`,
  recent: "/api/orders/recent",
  create: "/api/orders",
}

export const getOrders = async (params = {}) => {
  const response = await api.get(endpoints.list, { params })
  return response.data
}

export const getAdminOrders = async (params = {}) => {
  const response = await api.get(endpoints.admin, { params })
  return response.data
}

export const getOrderDetails = async (orderId) => {
  const response = await api.get(endpoints.details(orderId))
  return response.data
}

export const createOrder = async () => {
  const response = await api.post(endpoints.create)
  return response.data
}

export const updateOrder = async (orderId, orderData) => {
  const response = await api.put(endpoints.update(orderId), orderData)
  return response.data
}

export const updateOrderStatus = async (orderId, status) => {
  const response = await api.put(endpoints.updateStatus(orderId), { status })
  return response.data
}

export const deleteOrder = async (orderId) => {
  const response = await api.delete(endpoints.delete(orderId))
  return response.data
}

export const getRecentOrders = async (limit = 10) => {
  const response = await api.get(`${endpoints.recent}?limit=${limit}`)
  return response.data
}

