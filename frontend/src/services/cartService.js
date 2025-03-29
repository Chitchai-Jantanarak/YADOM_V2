import api from "./api"

// Cart endpoints
const ENDPOINTS = {
  BASE: "/api/cart",
  ITEM: (id) => `/api/cart/${id}`,
}

export const cartService = {
  // Get all cart items for the current user
  getCartItems: async () => {
    try {
      const response = await api.get(ENDPOINTS.BASE)
      return response.data
    } catch (error) {
      console.error("Error fetching cart items:", error)
      throw error
    }
  },

  // Add item to cart
  addToCart: async (cartItemData) => {
    try {
      const response = await api.post(ENDPOINTS.BASE, cartItemData)
      return response.data
    } catch (error) {
      console.error("Error adding item to cart:", error)
      throw error
    }
  },

  // Update cart item quantity
  updateCartItem: async (id, quantity) => {
    try {
      const response = await api.put(ENDPOINTS.ITEM(id), { quantity })
      return response.data
    } catch (error) {
      console.error("Error updating cart item:", error)
      throw error
    }
  },

  // Remove item from cart
  removeCartItem: async (id) => {
    try {
      const response = await api.delete(ENDPOINTS.ITEM(id))
      return response.data
    } catch (error) {
      console.error("Error removing cart item:", error)
      throw error
    }
  },

  // Clear cart
  clearCart: async () => {
    try {
      const response = await api.delete(ENDPOINTS.BASE)
      return response.data
    } catch (error) {
      console.error("Error clearing cart:", error)
      throw error
    }
  },
}

// For backward compatibility with existing code
export const getCartItems = cartService.getCartItems
export const addToCart = cartService.addToCart
export const updateCartItem = cartService.updateCartItem
export const removeCartItem = cartService.removeCartItem
export const clearCart = cartService.clearCart

