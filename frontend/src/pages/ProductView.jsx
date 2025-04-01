"use client"

/**
 * ProductView Component - Simplified version without 3D implementation
 * This component displays product details and allows users to add products to cart.
 * It handles color selection for accessories and quantity selection.
 */

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { ShoppingCart, Minus, Plus, ArrowLeft, Check } from "lucide-react"
import { productService } from "../services/productService"
import { transformProduct } from "../utils/dataTransformers"
import { handleImageError } from "../utils/imageUtils"
import { isAuthenticated, authService } from "../services/authService"
import NavBar2 from "../components/layout/NavBar2"
import Footer from "../components/layout/Footer"
import PageTransition from "../components/layout/PageTransition"
import LoginModal from "../components/ui/LoginModal"
import { cartService } from "../services/cartService"

const ProductView = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [addingToCart, setAddingToCart] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  // Fetch product data
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true)
        const data = await productService.getProductById(id)
        const transformedProduct = transformProduct(data)
        setProduct(transformedProduct)

        // Check if product is MAIN_PRODUCT type and redirect to forbidden page
        if (transformedProduct.type === "MAIN_PRODUCT") {
          navigate(`/forbidden/main-product/${id}`, {
            state: {
              productName: transformedProduct.name,
              productId: transformedProduct.id,
            },
          })
          return
        }

        // Set default selected color if available
        if (
          transformedProduct.type === "ACCESSORY" &&
          transformedProduct.colors &&
          transformedProduct.colors.length > 0
        ) {
          setSelectedColor(transformedProduct.colors[0])
        }

        // Fetch related products
        fetchRelatedProducts(transformedProduct.type)

        setLoading(false)
      } catch (err) {
        console.error("Error fetching product:", err)
        setError("Failed to load product. Please try again.")
        setLoading(false)
      }
    }

    fetchProductData()
  }, [id, navigate])

  // Fetch related products
  const fetchRelatedProducts = async (productType) => {
    try {
      const data = await productService.getAvailableProducts({
        limit: 5,
        type: productType,
      })

      // Filter out the current product
      const filtered = data.products.filter((p) => p.id !== Number.parseInt(id))
      setRelatedProducts(filtered.map(transformProduct))
    } catch (err) {
      console.error("Error fetching related products:", err)
    }
  }

  // Handle quantity change
  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(10, value))
    setQuantity(newQuantity)
  }

  // Handle color selection
  const handleColorSelect = (color) => {
    setSelectedColor(color)
  }

  // Handle login
  const handleLogin = async (email, password) => {
    try {
      await authService.login(email, password)
      setShowLoginModal(false)

      // After successful login, proceed with adding to cart
      handleAddToCart()
    } catch (err) {
      console.error("Login failed:", err)
      throw err
    }
  }

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!product) return

    // Check if user is authenticated
    if (!isAuthenticated()) {
      setShowLoginModal(true)
      return
    }

    try {
      setAddingToCart(true)

      // Calculate the total price (product price * quantity)
      const totalPrice = product.price * quantity

      // Prepare cart item data
      const cartItem = {
        productId: product.id,
        quantity,
        price: totalPrice, // Use the calculated total price
      }

      // Add color selection for accessories
      if (product.type === "ACCESSORY" && selectedColor) {
        cartItem.selectedColor = selectedColor
      }

      // Call the cart service to add the item
      await cartService.addToCart(cartItem)

      // Show success message
      alert("Product added to cart!")
      setAddingToCart(false)

      // Navigate to starter page
      navigate("/starter")
    } catch (err) {
      console.error("Error adding to cart:", err)
      setAddingToCart(false)
      alert("Failed to add product to cart. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <NavBar2 />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white">
        <NavBar2 />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-6">
              {error || "The product you're looking for doesn't exist or is no longer available."}
            </p>
            <Link to="/shop" className="inline-block bg-black text-white px-6 py-2 rounded hover:bg-gray-800">
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const isAccessory = product.type === "ACCESSORY"

  // Construct the image path using the product ID
  const imagePath = `/src/assets/images/shop/${product.id}.png`

  return (
    <div className="min-h-screen bg-white">
      <NavBar2 />

      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <div className="mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-black">
            <ArrowLeft size={18} className="mr-2" />
            <span>Back</span>
          </button>
        </div>

        {/* Product detail section */}
        <div className="flex flex-col md:flex-row gap-12">
          {/* Left column - Product image */}
          <div className="w-full md:w-1/2">
            <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
              {/* Use the specified image path format */}
              <img
                src={imagePath || "/placeholder.svg"}
                alt={product.name}
                className="max-h-[400px] w-auto object-contain"
                onError={(e) => {
                  console.error("Image failed to load:", imagePath)
                  handleImageError(e, "product", product.name)
                }}
              />
            </div>
          </div>

          {/* Right column - Product details */}
          <div className="w-full md:w-1/2">
            <h1 className="text-3xl font-bold uppercase mb-2">{product.name}</h1>
            <p className="text-2xl font-bold mb-6">{product.price?.toFixed(2)} B</p>

            {/* Color selection for accessories */}
            {isAccessory && product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <p className="text-sm mb-2">Color:</p>
                <div className="flex gap-2">
                  {product.colors.map((colorCode, index) => (
                    <button
                      key={index}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedColor === colorCode ? "border-black" : "border-gray-200"
                      }`}
                      style={{ backgroundColor: colorCode }}
                      onClick={() => handleColorSelect(colorCode)}
                      aria-label={`Select color ${index + 1}`}
                    >
                      {selectedColor === colorCode && <Check className="h-4 w-4 text-white mx-auto" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity selector */}
            <div className="mb-6">
              <p className="text-sm mb-2">Quantity</p>
              <div className="flex items-center">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l disabled:opacity-50"
                >
                  <Minus size={16} />
                </button>
                <div className="w-12 h-10 flex items-center justify-center border-t border-b border-gray-300">
                  {quantity}
                </div>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= 10}
                  className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-r disabled:opacity-50"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Add to cart button */}
            <button
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition-colors disabled:opacity-70 flex items-center justify-center"
            >
              {addingToCart ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding...
                </span>
              ) : (
                <span className="flex items-center text-white">
                  <ShoppingCart size={18} className="mr-2" />
                  ADD TO CART
                </span>
              )}
            </button>

            {/* Description */}
            <div className="mt-8">
              <h2 className="text-lg font-medium mb-2">Description</h2>
              <p className="text-gray-600">{product.description || "No description available."}</p>
            </div>
          </div>
        </div>

        {/* Related products section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold mb-6">More products from Yadomm</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {relatedProducts.map((relatedProduct) => (
                <Link key={relatedProduct.id} to={`/product/${relatedProduct.id}`} className="block group">
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden ">
                    <div className="p-4 bg-gray-100 flex items-center justify-center h-[150px]">
                      {/* Use the specified image path format for related products */}
                      <img
                        src={`/src/assets/images/shop/${relatedProduct.id}.png`}
                        alt={relatedProduct.name}
                        className="max-h-[120px] w-auto object-contain group-hover:scale-110 transition-all duration-300"
                        onError={(e) => handleImageError(e, "product", relatedProduct.name)}
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-xs uppercase">{relatedProduct.name}</p>
                      <p className="font-bold text-sm mt-1">{relatedProduct.price?.toFixed(2)} B</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer carousel={1} />

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        redirectPath="/starter"
      />
    </div>
  )
}

export default PageTransition(ProductView)

