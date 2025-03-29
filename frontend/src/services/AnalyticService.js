import api from "./api"

// Analytics endpoints
const ENDPOINTS = {
  BASE: "/api/dashboard/analytics",
  BY_DATE_RANGE: (startDate, endDate) => `/api/dashboard/analytics?startDate=${startDate}&endDate=${endDate}`,
}

export const analyticsService = {
  // Get analytics data
  getAnalyticsData: async (params = {}) => {
    try {
      const response = await api.get(ENDPOINTS.BASE, { params })
      return response.data
    } catch (error) {
      console.error("Error fetching analytics data:", error)
      throw error
    }
  },

  // Get analytics data by date range
  getAnalyticsByDateRange: async (startDate, endDate) => {
    try {
      const response = await api.get(ENDPOINTS.BY_DATE_RANGE(startDate, endDate))
      return response.data
    } catch (error) {
      console.error("Error fetching analytics by date range:", error)
      throw error
    }
  },
}

// For backward compatibility with existing code
export const getAnalyticsData = analyticsService.getAnalyticsData
export const getAnalyticsByDateRange = analyticsService.getAnalyticsByDateRange

