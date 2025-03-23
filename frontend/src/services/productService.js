import api from './api';

// API endpoints for products
const ENDPOINTS = {
  BASE: '/api/products',
  BY_ID: (id) => `/api/products/${id}`,
  BY_TYPE: (type) => `/api/products?type=${type}`,
};

export const productService = {
  // Get all products with optional filtering
  getProducts: async (options = {}) => {
    try {
      const { page = 1, limit = 10, type } = options;
      
      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      
      // Add type filter if provided
      if (type) {
        params.append('type', type);
      }
      
      const response = await api.get(`${ENDPOINTS.BASE}?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get products by specific type
  getProductsByType: async (type, page = 1, limit = 10) => {
    try {
      return await productService.getProducts({ page, limit, type });
    } catch (error) {
      console.error(`Error fetching ${type} products:`, error);
      throw error;
    }
  },

  // Get accessories specifically
  getAccessories: async (page = 1, limit = 10) => {
    return productService.getProductsByType('ACCESSORY', page, limit);
  },

  // Get main products specifically
  getMainProducts: async (page = 1, limit = 10) => {
    return productService.getProductsByType('MAIN_PRODUCT', page, limit);
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
};