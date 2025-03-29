import api from "./api"

// Sales endpoints
const ENDPOINTS = {
  BASE: "/api/dashboard/sales",
  BY_DATE_RANGE: (startDate, endDate) => `/api/dashboard/sales?startDate=${startDate}&endDate=${endDate}`,
  BY_CATEGORY: "/api/dashboard/sales/category",
  TOP_PRODUCTS: "/api/dashboard/sales/top-products",
}

export const salesService = {
  // Get sales insights
  getSalesInsights: async (params = {}) => {
    try {
      const response = await api.get(ENDPOINTS.BASE, { params })
      return response.data
    } catch (error) {
      console.error("Error fetching sales insights:", error)
      throw error
    }
  },

  // Get sales by date range
  getSalesByDateRange: async (startDate, endDate) => {
    try {
      const response = await api.get(ENDPOINTS.BY_DATE_RANGE(startDate, endDate))
      return response.data
    } catch (error) {
      console.error("Error fetching sales by date range:", error)
      throw error
    }
  },

  // Get sales by category
  getSalesByCategory: async () => {
    try {
      const response = await api.get(ENDPOINTS.BY_CATEGORY)
      return response.data
    } catch (error) {
      console.error("Error fetching sales by category:", error)
      throw error
    }
  },

  // Get top selling products
  getTopProducts: async (limit = 5) => {
    try {
      const response = await api.get(`${ENDPOINTS.TOP_PRODUCTS}?limit=${limit}`)
      return response.data
    } catch (error) {
      console.error("Error fetching top products:", error)
      throw error
    }
  },
}

// For backward compatibility with existing code
export const getSalesInsights = salesService.getSalesInsights
export const getSalesByDateRange = salesService.getSalesByDateRange
export const getSalesByCategory = salesService.getSalesByCategory
export const getTopProducts = salesService.getTopProducts

