"use client"

import { useState } from "react"
import { ShoppingCart } from "lucide-react"
import { isAuthenticated, getCurrentUser } from "../../services/authService"
import { mapMeshNamesToBoneIds } from "../../utils/boneMapper"

const CartHandler = ({
  product,
  quantity,
  selectedAroma,
  totalPrice,
  boneConfigurations,
  productBones,
  onAddToCart,
  isAddingToCart,
  onShowLoginModal,
}) => {
  const [error, setError] = useState(null)

  const handleAddToCart = async () => {
    if (!product) return

    // Check if user is authenticated
    if (!isAuthenticated()) {
      onShowLoginModal()
      return
    }

    // Check if aroma is selected
    if (!selectedAroma) {
      setError("Please select an aroma before adding to cart")
      return
    }

    // Check if we have a user ID
    const currentUser = getCurrentUser()
    if (!currentUser || !currentUser.id) {
      setError("User ID not found. Please log in again.")
      onShowLoginModal()
      return
    }

    try {
      setError(null)

      // Prepare modified bone data
      const modifiedBones = Object.entries(boneConfigurations).map(([boneId, colorValue]) => ({
        boneId: boneId,
        modDetail: JSON.stringify({ color: colorValue }),
      }))

      // Map mesh names to actual bone IDs if we have product bones
      const mappedBones =
        productBones && productBones.length > 0 ? mapMeshNamesToBoneIds(modifiedBones, productBones) : modifiedBones

      // Create the cart item with all required data
      const cartData = {
        productId: product.id,
        quantity,
        aromaId: selectedAroma.id,
        modifiedBones: mappedBones,
        price: totalPrice,
        userId: currentUser.id,
      }

      // Call the provided onAddToCart function with the data
      await onAddToCart(cartData)
    } catch (err) {
      console.error("Error preparing cart data:", err)
      setError(err.message || "Failed to prepare product data. Please try again.")
    }
  }

  return (
    <div className="flex flex-col">
      <button
        onClick={handleAddToCart}
        disabled={isAddingToCart}
        className="w-full glass-button bg-gradient-to-r from-pink-400/80 to-purple-500/80 text-white py-3 rounded-full hover:opacity-90 transition-all disabled:opacity-70 flex items-center justify-center shadow-lg border border-white/30 group"
      >
        {isAddingToCart ? (
          <span className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Adding...
          </span>
        ) : (
          <span className="flex items-center font-medium group-hover:scale-105 text-white">
            ADD TO CART <ShoppingCart size={18} className="ml-2" />
          </span>
        )}
      </button>

      {error && <div className="mt-2 text-red-500 text-sm text-center">{error}</div>}
    </div>
  )
}

export default CartHandler

