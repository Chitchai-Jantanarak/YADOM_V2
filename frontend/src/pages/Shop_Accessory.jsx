"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import Lenis from "lenis"
import { Link, useNavigate } from "react-router-dom"

import { productService } from "../services/productService"
import { transformProducts } from "../utils/dataTransformers"
import { handleImageError } from "../utils/imageUtils"
import { isAuthenticated } from "../services/authService"
import LoginModal from "../components/ui/LoginModal"

import PageTransition from "../components/layout/PageTransition"
import NavBar2 from "../components/layout/NavBar2"
import Footer from "../components/layout/Footer"
import TextCarousel from "../components/ui/TextCarousel"
import { authService } from "../services/authService" // Import authService

const Shop_Accessory = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [limit] = useState(15)
  const [accessories, setAccessories] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit, total: 0, pages: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState(null)

  // Track which images have already failed to prevent multiple error logs
  const failedImagesRef = useRef(new Set())
  const isMountedRef = useRef(true)

  // Fetch accessories function
  const fetchAccessories = useCallback(
    async (currentPage = page) => {
      if (!isMountedRef.current) return

      try {
        setLoading(true)
        const data = await productService.getAvailableProducts({
          page: currentPage,
          limit,
          type: "ACCESSORY",
        })

        if (isMountedRef.current) {
          setAccessories(transformProducts(data.products || []))
          setPagination(data.pagination || { page: currentPage, limit, total: 0, pages: 0 })
          setError(null)
        }
      } catch (err) {
        if (isMountedRef.current) {
          console.error("Error fetching accessories:", err)
          setError("Failed to load accessories. Please try again.")
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false)
        }
      }
    },
    [page, limit],
  )

  // Initialize Lenis smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  // Fetch accessories on initial mount
  useEffect(() => {
    isMountedRef.current = true
    fetchAccessories()

    return () => {
      isMountedRef.current = false
    }
  }, [fetchAccessories])

  // Handle page change
  const handlePageChange = useCallback(
    (newPage) => {
      if (newPage !== page && !loading) {
        setPage(newPage)
        // Clear failed images when changing page
        failedImagesRef.current.clear()
        // Fetch accessories for the new page
        fetchAccessories(newPage)
      }
    },
    [page, loading, fetchAccessories],
  )

  // Custom image error handler to prevent multiple logs
  const handleImageLoadError = useCallback((e, productId) => {
    // Only log and handle if this image hasn't failed before
    if (!failedImagesRef.current.has(productId)) {
      console.log(`Failed to load image for accessory: ${productId}`)
      failedImagesRef.current.add(productId)

      // Use the utility function for fallback
      handleImageError(e, "product")
    }
  }, [])

  // Handle add to cart
  const handleAddToCart = (e, productId) => {
    e.preventDefault()
    e.stopPropagation()

    // Check if user is authenticated
    if (!isAuthenticated()) {
      setSelectedProductId(productId)
      setShowLoginModal(true)
      return
    }

    // If authenticated, add to cart and redirect to starter
    console.log(`Adding product ${productId} to cart`)
    // TODO: Implement actual cart service call

    // Navigate to starter page
    navigate("/starter")
  }

  // Handle login
  const handleLogin = async (email, password) => {
    try {
      await authService.login(email, password)
      setShowLoginModal(false)

      // If we have a selected product, add it to cart
      if (selectedProductId) {
        console.log(`Adding product ${selectedProductId} to cart after login`)
        // TODO: Implement actual cart service call
      }

      // Navigate to starter page after successful login
      navigate("/starter")
    } catch (err) {
      console.error("Login failed:", err)
      throw err
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <NavBar2 />

      <header className="w-full flex flex-row justify-center mx-auto px-4 py-8 border-gray-200 border-b-2">
        <article className="text-center">
          <h1 className="text-3xl font-bold my-6">ACCESSORIES</h1>
          <h3 className="text-sm text-gray-600">Small gadget accessories to decorate your inhalers</h3>
        </article>
      </header>

      <TextCarousel
        text={["ACCESSORIES", "ACCESSORIES", "ACCESSORIES", "ACCESSORIES", "ACCESSORIES"]}
        colorIndex={[4]}
        font="poppins"
      />

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl">Loading accessories...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-red-500">{error}</p>
          </div>
        ) : accessories.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl">No accessories available</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {accessories.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <Link to={`/product/${product.id}`} className="block h-full">
                    <div className="bg-gray-100 py-2 px-2">
                      <div className="p-4 flex items-center justify-center h-[240px] transition-all duration-200 hover:scale-110">
                        <img
                          src={`/src/assets/images/shop/${product.id}.png`}
                          alt={product.name}
                          className="h-full w-auto object-contain"
                          onError={(e) => handleImageLoadError(e, product.id)}
                        />
                      </div>

                      {/* Color options */}
                      <div className="flex justify-end gap-2 mt-2 mb-1">
                        {product.colors && product.colors.length > 0 ? (
                          product.colors.map((color, index) => (
                            <div
                              key={index}
                              className="w-4 h-4 rounded-md border border-gray-200"
                              style={{ backgroundColor: color }}
                            />
                          ))
                        ) : (
                          <div className="w-4 h-4 rounded-md bg-gray-200" />
                        )}
                      </div>
                    </div>

                    <div className="px-3 py-2">
                      <div className="text-xs text-gray-500 uppercase">{product.name}</div>
                      <div className="font-bold text-sm mt-1">
                        {product.price ? `${product.price.toFixed(2)} B` : "0.00 B"}
                      </div>
                    </div>
                  </Link>

                  {/* Add to cart button - now with auth check */}
                  <button
                    onClick={(e) => handleAddToCart(e, product.id)}
                    className="w-full bg-white border-t border-gray-200 text-black text-xs py-2 hover:bg-black hover:text-white transition-all duration-300 uppercase"
                  >
                    Add to cart
                  </button>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.pages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                <button
                  onClick={() => handlePageChange(Math.max(1, page - 1))}
                  disabled={page === 1 || loading}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {page} of {pagination.pages}
                </span>
                <button
                  onClick={() => handlePageChange(Math.min(pagination.pages, page + 1))}
                  disabled={page === pagination.pages || loading}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
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

export default PageTransition(Shop_Accessory)

