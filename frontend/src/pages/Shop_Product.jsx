"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import Lenis from "lenis"
import { Link, useNavigate } from "react-router-dom"

import { productService } from "../services/productService"
import { transformProducts } from "../utils/dataTransformers"
import { handleImageError } from "../utils/imageUtils"

import PageTransition from "../components/layout/PageTransition"
import NavBar2 from "../components/layout/NavBar2"
import Footer from "../components/layout/Footer"
import TextCarousel from "../components/ui/TextCarousel"

const Shop_Product = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [mainProducts, setMainProducts] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit, total: 0, pages: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Track which images have already failed to prevent multiple error logs
  const failedImagesRef = useRef(new Set())
  const isMountedRef = useRef(true)

  // Fetch products function
  const fetchProducts = useCallback(
    async (currentPage = page) => {
      if (!isMountedRef.current) return

      try {
        setLoading(true)
        const data = await productService.getAvailableProducts({
          page: currentPage,
          limit,
          type: "MAIN_PRODUCT",
        })

        if (isMountedRef.current) {
          setMainProducts(transformProducts(data.products || []))
          setPagination(data.pagination || { page: currentPage, limit, total: 0, pages: 0 })
          setError(null)
        }
      } catch (err) {
        if (isMountedRef.current) {
          console.error("Error fetching products:", err)
          setError("Failed to load products. Please try again.")
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

  // Fetch products on initial mount
  useEffect(() => {
    isMountedRef.current = true
    fetchProducts()

    return () => {
      isMountedRef.current = false
    }
  }, [fetchProducts])

  // Handle page change
  const handlePageChange = useCallback(
    (newPage) => {
      if (newPage !== page && !loading) {
        setPage(newPage)
        // Clear failed images when changing page
        failedImagesRef.current.clear()
        // Fetch products for the new page
        fetchProducts(newPage)
      }
    },
    [page, loading, fetchProducts],
  )

  // Custom image error handler to prevent multiple logs
  const handleImageLoadError = useCallback((e, productId) => {
    // Only log and handle if this image hasn't failed before
    if (!failedImagesRef.current.has(productId)) {
      console.log(`Failed to load image for product: ${productId}`)
      failedImagesRef.current.add(productId)

      // Use the utility function for fallback
      handleImageError(e, "product")
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <NavBar2 />

      <header className="w-full flex flex-row justify-center mx-auto px-4 py-8 my-4 border-gray-200 border-b-2">
        <article>
          <h1 className="text-3xl font-bold text-center my-6">MAIN PRODUCTS</h1>
          <h3 className="text-center">Our premium inhalers • customize your experience</h3>
        </article>
      </header>

      <TextCarousel text={["PRODUCTS", "PRODUCTS", "PRODUCTS"]} colorIndex={[4]} font="poppins" />

      <div className="my-16 container mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl">Loading products...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-red-500">{error}</p>
          </div>
        ) : mainProducts.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl">No products available</p>
          </div>
        ) : (
          <>
            {/* Display products as sections/highlights */}
            <div className="space-y-32 px-[10%]">
              {mainProducts.map((product, index) => (
                <div
                  key={product.id}
                  className={`flex flex-col md:flex-row gap-16 items-center ${
                    index % 2 === 1 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className="w-full md:w-1/2 relative group">
                    <div className="absolute inset-0 bg-gray-100 rounded-3xl transform scale-105 opacity-50 group-hover:scale-110 transition-transform duration-500 -z-10"></div>
                    <div className="p-8 flex items-center justify-center">
                      <img
                        src={`/src/assets/images/shop/${product.id}.png`}
                        alt={product.name}
                        className="w-full h-auto object-contain max-h-[400px] transform group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => handleImageLoadError(e, product.id)}
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 space-y-6 px-4">
                    <h3 className="text-3xl font-bold">{product.name}</h3>
                    <div className="w-16 h-1 bg-black"></div>
                    <p className="text-gray-700 text-lg">{product.description}</p>
                    <p className="text-2xl font-semibold">${product.price?.toFixed(2)}</p>
                    <div className="flex gap-4 mt-4">
                      <Link
                        to={`/product/MAIN_PRODUCT/${product.id}`}
                        className="inline-block bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors text-lg"
                      >
                        Try!
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.pages > 1 && (
              <div className="flex justify-center mt-20 gap-4">
                <button
                  onClick={() => handlePageChange(Math.max(1, page - 1))}
                  disabled={page === 1 || loading}
                  className="px-6 py-2 border border-black rounded-lg disabled:opacity-50 hover:bg-black hover:text-white transition-colors"
                >
                  Previous
                </button>
                <span className="px-6 py-2">
                  Page {page} of {pagination.pages}
                </span>
                <button
                  onClick={() => handlePageChange(Math.min(pagination.pages, page + 1))}
                  disabled={page === pagination.pages || loading}
                  className="px-6 py-2 border border-black rounded-lg disabled:opacity-50 hover:bg-black hover:text-white transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer carousel={1} />
    </div>
  )
}

export default PageTransition(Shop_Product)

