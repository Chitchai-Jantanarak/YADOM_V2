import api from "./api"

// Aroma endpoints
const ENDPOINTS = {
  BASE: "/api/aromas",
  BY_ID: (id) => `/api/aromas/${id}`,
}

export const aromaService = {
  // Get all aromas
  getAromas: async (params = {}) => {
    try {
      const response = await api.get(ENDPOINTS.BASE, { params })
      return response.data
    } catch (error) {
      console.error("Error fetching aromas:", error)
      throw error
    }
  },

  // Get aroma by ID
  getAromaById: async (id) => {
    try {
      const response = await api.get(ENDPOINTS.BY_ID(id))
      return response.data
    } catch (error) {
      console.error("Error fetching aroma by ID:", error)
      throw error
    }
  },

  // Create a new aroma (admin only)
  createAroma: async (aromaData) => {
    try {
      const response = await api.post(ENDPOINTS.BASE, aromaData)
      return response.data
    } catch (error) {
      console.error("Error creating aroma:", error)
      throw error
    }
  },

  // Update an existing aroma (admin only)
  updateAroma: async (id, aromaData) => {
    try {
      const response = await api.put(ENDPOINTS.BY_ID(id), aromaData)
      return response.data
    } catch (error) {
      console.error("Error updating aroma:", error)
      throw error
    }
  },

  // Delete an aroma (admin only)
  deleteAroma: async (id) => {
    try {
      const response = await api.delete(ENDPOINTS.BY_ID(id))
      return response.data
    } catch (error) {
      console.error("Error deleting aroma:", error)
      throw error
    }
  },
}

// For backward compatibility with existing code
export const getAromas = aromaService.getAromas
export const getAromaById = aromaService.getAromaById
export const createAroma = aromaService.createAroma
export const updateAroma = aromaService.updateAroma
export const deleteAroma = aromaService.deleteAroma

