import api from "./api"

// API endpoints for products
const ENDPOINTS = {
  BASE: "/api/products",
  BY_ID: (id) => `/api/products/${id}`,
  BY_TYPE: (type) => `/api/products/type/${type}`,
}

export const productService = {
  // Get all products with optional filtering
  getProducts: async (options = {}) => {
    try {
      const { page = 1, limit = 10, type } = options

      // Build query parameters
      const params = new URLSearchParams()
      params.append("page", page)
      params.append("limit", limit)

      // Add type filter if provided
      if (type) {
        params.append("type", type)
      }

      const response = await api.get(`${ENDPOINTS.BASE}?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error("Error fetching products:", error)
      throw error
    }
  },

  // Get products by specific type
  getProductsByType: async (type, page = 1, limit = 10) => {
    try {
      const response = await api.get(`${ENDPOINTS.BY_TYPE(type)}?page=${page}&limit=${limit}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching ${type} products:`, error)
      throw error
    }
  },

  // Get accessories specifically
  getAccessories: async (page = 1, limit = 10) => {
    return productService.getProductsByType("ACCESSORY", page, limit)
  },

  // Get main products specifically
  getMainProducts: async (page = 1, limit = 10) => {
    return productService.getProductsByType("MAIN_PRODUCT", page, limit)
  },

  // Get product by ID
  getProductById: async (id) => {
    try {
      const response = await api.get(ENDPOINTS.BY_ID(id))
      return response.data
    } catch (error) {
      console.error("Error fetching product by ID:", error)
      throw error
    }
  },

  // Create a new product (admin only)
  createProduct: async (productData) => {
    try {
      const response = await api.post(ENDPOINTS.BASE, productData)
      return response.data
    } catch (error) {
      console.error("Error creating product:", error)
      throw error
    }
  },

  // Update an existing product (admin only)
  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(ENDPOINTS.BY_ID(id), productData)
      return response.data
    } catch (error) {
      console.error("Error updating product:", error)
      throw error
    }
  },

  // Delete a product (admin only)
  deleteProduct: async (id) => {
    try {
      const response = await api.delete(ENDPOINTS.BY_ID(id))
      return response.data
    } catch (error) {
      console.error("Error deleting product:", error)
      throw error
    }
  },
}

// For backward compatibility with existing code
export const getProducts = productService.getProducts
export const getProductById = productService.getProductById
export const getProductsByType = productService.getProductsByType
export const createProduct = productService.createProduct
export const updateProduct = productService.updateProduct
export const deleteProduct = productService.deleteProduct

