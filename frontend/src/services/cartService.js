import api from "./api"
import { getCurrentUser } from "./authService"

// Cart endpoints
const ENDPOINTS = {
  BASE: "/api/cart",
  BY_ID: (id) => `/api/cart/${id}`,
}

export const cartService = {
  // Add item to cart
  addToCart: async (cartData) => {
    try {
      // Get the current user object
      const currentUser = getCurrentUser()

      if (!currentUser || !currentUser.id) {
        throw new Error("User ID not found. Please log in again.")
      }

      let modifiedBoneGroupId = null

      // Only create a modified bone group if we have modifiedBones data
      // This is for backward compatibility with 3D customization
      if (cartData.modifiedBones && Object.keys(cartData.modifiedBones).length > 0) {
        // Create a modified bone group
        const modifiedBoneGroupResponse = await api.post("/api/customization", {
          userId: currentUser.id,
          modifiedBones: cartData.modifiedBones,
          shareStatus: false,
        })

        modifiedBoneGroupId = modifiedBoneGroupResponse.data.id
      }

      // Prepare the cart payload
      const payload = {
        productId: cartData.productId,
        aromaId: cartData.aromaId || null,
        userId: currentUser.id,
        modifiedBoneGroupId: modifiedBoneGroupId,
        quantity: cartData.quantity || 1,
        price: cartData.price,
      }

      // Handle color selection for accessories
      // Support both the new productColorId and the legacy selectedColor
      if (cartData.productColorId) {
        payload.productColorId = cartData.productColorId
      } else if (cartData.selectedColor) {
        // For backward compatibility, we'll still accept selectedColor
        // but we'll log a deprecation warning
        console.warn("selectedColor is deprecated, please use productColorId instead")

        // If selectedColor is a number, it might be an ID already
        if (typeof cartData.selectedColor === "number") {
          payload.productColorId = cartData.selectedColor
        } else {
          // Otherwise, we'll need to handle it in the backend
          // by passing it as a separate field
          payload.selectedColor = cartData.selectedColor
        }
      }

      // Add to cart
      const cartResponse = await api.post(ENDPOINTS.BASE, payload)
      return cartResponse.data
    } catch (error) {
      console.error("Error adding to cart:", error)
      throw error
    }
  },

  // Get user's cart
  getCart: async () => {
    try {
      const response = await api.get(ENDPOINTS.BASE)
      return response.data
    } catch (error) {
      console.error("Error fetching cart:", error)
      throw error
    }
  },

  // Update cart item
  updateCartItem: async (id, cartItemData) => {
    try {
      // Handle color selection for accessories in updates
      const payload = { ...cartItemData }

      if (payload.productColorId) {
        // Use the new field directly
      } else if (payload.selectedColor) {
        // For backward compatibility
        console.warn("selectedColor is deprecated, please use productColorId instead")

        if (typeof payload.selectedColor === "number") {
          payload.productColorId = payload.selectedColor
          delete payload.selectedColor
        }
      }

      const response = await api.put(ENDPOINTS.BY_ID(id), payload)
      return response.data
    } catch (error) {
      console.error("Error updating cart item:", error)
      throw error
    }
  },

  // Remove cart item
  removeCartItem: async (id) => {
    try {
      const response = await api.delete(ENDPOINTS.BY_ID(id))
      return response.data
    } catch (error) {
      console.error("Error removing cart item:", error)
      throw error
    }
  },
}

export const addToCart = cartService.addToCart
export const getCart = cartService.getCart
export const updateCartItem = cartService.updateCartItem
export const removeCartItem = cartService.removeCartItem

