import api from "./api"

/**
 * Service for handling image operations
 */
const imageService = {
  /**
   * Upload an image file
   * @param {File} file - The image file to upload
   * @returns {Promise<Object>} - Response with URL and success status
   */
  uploadImage: async (file) => {
    try {
      if (!file) {
        throw new Error("No file provided")
      }

      // Validate file is an image
      if (!file.type.startsWith("image/")) {
        throw new Error("File is not an image")
      }

      const formData = new FormData()
      formData.append("file", file)

      // Change this line to use the correct endpoint
      const response = await api.post("/api/upload/profile-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      return {
        success: true,
        url: response.data.url,
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || "Failed to upload image",
      }
    }
  },

  /**
   * Get a user's profile image
   * @param {string} userId - The user ID
   * @returns {Promise<Object>} - Response with URL and success status
   */
  getProfileImage: async (userId) => {
    try {
      const response = await api.get(`/api/upload/profile-image/${userId}`)
      return {
        success: true,
        url: response.data.url,
      }
    } catch (error) {
      console.error("Error fetching profile image:", error)
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch profile image",
      }
    }
  },

  // Also update the uploadFromUrl function if you're using it
  uploadFromUrl: async (url) => {
    try {
      if (!url) {
        throw new Error("No URL provided")
      }

      const formData = new FormData()
      formData.append("url", url)

      // Change this line to use the correct endpoint
      const response = await api.post("/api/upload/profile-image", formData)

      return {
        success: true,
        url: response.data.url,
      }
    } catch (error) {
      console.error("Error uploading image from URL:", error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || "Failed to upload image from URL",
      }
    }
  },
}

export default imageService

