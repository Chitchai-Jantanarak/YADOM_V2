"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import PageTransition from "../../components/layout/PageTransition"
import { getCart, removeCartItem, updateCartItem } from "../../services/cartService"
import { X } from "lucide-react"
import { getImageUrl, handleImageError } from "../../utils/imageUtils"

const UserCart = () => {
  const [cartData, setCartData] = useState({ cartItems: [], total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCartItems()
  }, [])

  const fetchCartItems = async () => {
    try {
      setLoading(true)
      const data = await getCart()
      setCartData(data)
      setError(null)
    } catch (err) {
      setError("Failed to load cart items. Please try again.")
      console.error("Error fetching cart:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleQuantityChange = async (id, currentQuantity, change) => {
    const newQuantity = Math.max(1, currentQuantity + change)

    if (newQuantity === currentQuantity) return

    try {
      await updateCartItem(id, { quantity: newQuantity })
      fetchCartItems()
    } catch (err) {
      setError("Failed to update quantity. Please try again.")
      console.error("Error updating quantity:", err)
    }
  }

  const handleRemoveItem = async (id) => {
    try {
      await removeCartItem(id)
      fetchCartItems()
    } catch (err) {
      setError("Failed to remove item. Please try again.")
      console.error("Error removing item:", err)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {cartData.cartItems.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl mb-4">Your cart is empty</h2>
          <p className="mb-6">Looks like you haven't added any products to your cart yet.</p>
          <Link to="/shop" className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-600">
            You have a total of {cartData.cartItems.length} items in your cart
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-2">ITEM</th>
                  <th className="text-left py-4 px-2">PRICE</th>
                  <th className="text-left py-4 px-2">QUANTITY</th>
                  <th className="text-left py-4 px-2">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {cartData.cartItems.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-4 px-2">
                      <div className="flex items-center">
                        <div className="w-20 h-20 flex-shrink-0 mr-4 bg-gray-100 rounded-md overflow-hidden">
                          <img
                            src={`/src/assets/images/shop/${item.product.id}.png`}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => handleImageError(e, "product")}
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{item.product.name}</h3>
                          {item.productColor && (
                            <p className="text-sm text-gray-600">
                              Color: {item.productColor.colorName || item.productColor.colorCode}
                            </p>
                          )}
                          {item.aroma && <p className="text-sm text-gray-600">Scents: {item.aroma.name}</p>}
                          {item.modifiedBoneGroup && <p className="text-sm text-gray-600">Customized</p>}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2">฿ {(item.price / item.quantity).toFixed(2)}</td>
                    <td className="py-4 px-2">
                      <div className="flex items-center">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                          className="w-8 h-8 flex items-center justify-center border rounded-md"
                        >
                          −
                        </button>
                        <span className="mx-3">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                          className="w-8 h-8 flex items-center justify-center border rounded-md"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-2">฿ {item.price.toFixed(2)}</td>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="mr-4 text-gray-400 hover:text-red-500 transition-colors m-4"
                      aria-label="Remove item"
                    >
                      <X size={18} />
                    </button>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex flex-col md:flex-row justify-between">
            <div className="md:w-1/2"></div>
            <div className="md:w-1/2 bg-gray-50 p-6 rounded-lg">
              <div className="flex justify-between mb-4">
                <span>Subtotal:</span>
                <span>฿ {cartData.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span>Shipping:</span>
                <span>FREE</span>
              </div>
              <div className="border-t pt-4 mt-4 flex justify-between font-bold">
                <span>Grand total:</span>
                <span>฿ {cartData.total.toFixed(2)}</span>
              </div>
              <Link
                to="/user/checkout"
                className="mt-6 w-full bg-blue-500 text-white py-3 px-4 rounded-md flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                Secure Checkout →
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default PageTransition(UserCart)

