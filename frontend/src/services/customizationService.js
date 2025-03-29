import api from "./api"

// Customization endpoints
const ENDPOINTS = {
  BASE: "/api/customization",
  BY_ID: (id) => `/api/customization/${id}`,
  BY_USER: (userId) => `/api/customization/user/${userId}`,
}

export const customizationService = {
  // Create a new modified bone group
  createModifiedBoneGroup: async (data) => {
    try {
      const response = await api.post(ENDPOINTS.BASE, data)
      return response.data
    } catch (error) {
      console.error("Error creating modified bone group:", error)
      throw error
    }
  },

  // Get a modified bone group by ID
  getModifiedBoneGroup: async (id) => {
    try {
      const response = await api.get(ENDPOINTS.BY_ID(id))
      return response.data
    } catch (error) {
      console.error("Error fetching modified bone group:", error)
      throw error
    }
  },

  // Get all modified bone groups for a user
  getUserModifiedBoneGroups: async (userId) => {
    try {
      const response = await api.get(ENDPOINTS.BY_USER(userId))
      return response.data
    } catch (error) {
      console.error("Error fetching user's modified bone groups:", error)
      throw error
    }
  },

  // Update a modified bone group
  updateModifiedBoneGroup: async (id, data) => {
    try {
      const response = await api.put(ENDPOINTS.BY_ID(id), data)
      return response.data
    } catch (error) {
      console.error("Error updating modified bone group:", error)
      throw error
    }
  },

  // Delete a modified bone group
  deleteModifiedBoneGroup: async (id) => {
    try {
      const response = await api.delete(ENDPOINTS.BY_ID(id))
      return response.data
    } catch (error) {
      console.error("Error deleting modified bone group:", error)
      throw error
    }
  },
}

// For backward compatibility with existing code
export const createModifiedBoneGroup = customizationService.createModifiedBoneGroup
export const getModifiedBoneGroup = customizationService.getModifiedBoneGroup
export const getUserModifiedBoneGroups = customizationService.getUserModifiedBoneGroups
export const updateModifiedBoneGroup = customizationService.updateModifiedBoneGroup
export const deleteModifiedBoneGroup = customizationService.deleteModifiedBoneGroup

