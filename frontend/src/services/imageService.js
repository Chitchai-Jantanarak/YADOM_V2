import { isImageUrlValid, getFallbackImage } from "../utils/imageUtils"
import api from "./api"

/**
 * Service for handling image operations
 */
const imageService = {
  /**
   * Upload an image file
   * @param {File} file - The image file to upload
   * @returns {Promise<{success: boolean, url: string, error?: string}>}
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

      const response = await api.post("/upload", formData, {
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
   * Upload an image from a URL
   * @param {string} url - The URL of the image to upload
   * @returns {Promise<{success: boolean, url: string, error?: string}>}
   */
  uploadFromUrl: async (url) => {
    try {
      if (!url) {
        throw new Error("No URL provided")
      }

      const formData = new FormData()
      formData.append("url", url)

      const response = await api.post("/upload", formData)

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

  /**
   * Get image URL with validation and fallback
   * @param {string} url - The image URL to validate
   * @param {string} fallbackType - The type of fallback to use
   * @returns {Promise<string>} - The validated URL or fallback
   */
  getValidatedImageUrl: async (url, fallbackType = "generic") => {
    if (!url) return getFallbackImage(fallbackType)

    const isValid = await isImageUrlValid(url)
    return isValid ? url : getFallbackImage(fallbackType)
  },

  /**
   * Preload an image to ensure it's in the browser cache
   * @param {string} url - The image URL to preload
   * @returns {Promise<boolean>} - Whether preloading was successful
   */
  preloadImage: (url) => {
    return new Promise((resolve) => {
      if (!url) {
        resolve(false)
        return
      }

      const img = new Image()
      img.onload = () => resolve(true)
      img.onerror = () => resolve(false)
      img.src = url
    })
  },

  /**
   * Get dimensions of an image
   * @param {string} url - The image URL
   * @returns {Promise<{width: number, height: number}>}
   */
  getImageDimensions: (url) => {
    return new Promise((resolve, reject) => {
      if (!url) {
        reject(new Error("No URL provided"))
        return
      }

      const img = new Image()
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
        })
      }
      img.onerror = () => {
        reject(new Error("Failed to load image"))
      }
      img.src = url
    })
  },
}

export default imageService

