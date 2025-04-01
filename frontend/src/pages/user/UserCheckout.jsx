"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import PageTransition from "../../components/layout/PageTransition"
import { getCart } from "../../services/cartService"
import { createOrder } from "../../services/orderService"
import { getImageUrl } from "../../utils/imageUtils"

const UserCheckout = () => {
  const [cartData, setCartData] = useState({ cartItems: [], total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [processingOrder, setProcessingOrder] = useState(false)
  const navigate = useNavigate()

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

  const handleCheckout = async () => {
    try {
      setProcessingOrder(true)
      // Create order from cart items
      const orderResponse = await createOrder()

      // Navigate to payment page with order ID
      navigate(`/user/payment/${orderResponse.id}`)
    } catch (err) {
      setError("Failed to create order. Please try again.")
      console.error("Error creating order:", err)
      setProcessingOrder(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (cartData.cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        <div className="text-center py-12">
          <h2 className="text-xl mb-4">Your cart is empty</h2>
          <p className="mb-6">You need to add items to your cart before checkout.</p>
          <Link to="/shop" className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="mb-4 text-sm text-gray-600">
              You have a total of {cartData.cartItems.length} items in your cart
            </div>

            <div className="space-y-4 mb-6">
              {cartData.cartItems.map((item) => (
                <div key={item.id} className="flex items-start border-b pb-4">
                  <div className="w-16 h-16 flex-shrink-0 mr-4 bg-gray-100 rounded-md overflow-hidden">
                    <img
                      src={getImageUrl(
                        `/src/assets/images/shop/${item.product.id || "/placeholder.svg"}.png`,
                        "product",
                      )}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target.src = "/src/assets/images/placeholder.png")}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product.name}</h3>
                    {item.productColor && (
                      <p className="text-sm text-gray-600">
                        Color: {item.productColor.colorName || item.productColor.colorCode}
                      </p>
                    )}
                    {item.aroma && <p className="text-sm text-gray-600">Scents: {item.aroma.name}</p>}
                    <div className="flex justify-between mt-2">
                      <span className="text-sm">Qty: {item.quantity}</span>
                      <span className="font-medium">฿ {item.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>฿ {cartData.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>FREE</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                <span>Grand total:</span>
                <span>฿ {cartData.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="mb-6">
              <p className="font-medium">Your order will be shipped to:</p>
              <div className="mt-2 p-4 border rounded-md bg-white">
                <p className="font-medium">John Doe</p>
                <p>123 Main Street</p>
                <p>Bangkok, 10110</p>
                <p>Thailand</p>
                <p>Tel: +66 123 456 789</p>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={processingOrder}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-md flex items-center justify-center hover:bg-blue-600 transition-colors disabled:bg-blue-300"
            >
              {processingOrder ? (
                <>
                  <span className="mr-2">Processing...</span>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                </>
              ) : (
                "Proceed to Payment"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageTransition(UserCheckout)

