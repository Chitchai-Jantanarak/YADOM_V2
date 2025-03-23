"use client"

import { useState, useEffect } from "react"
import Lenis from "lenis"
import { productService } from "../services/productService"
import { useApi } from "../hooks/useApi"
import { transformProducts } from "../utils/dataTransformers.js"

import PageTransition from "../components/layout/PageTransition"
import NavBar2 from "../components/layout/NavBar2"
import Footer from "../components/layout/Footer"
import ProductGrid from "../components/ui/ProductGrid"
import TextCarousel from "../components/ui/TextCarousel"

const Shop_Product = () => {
  const [page, setPage] = useState(1)
  const [products, setProducts] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  })

  // Use our custom hook for API calls
  const { loading, error, execute: fetchAccessories } = useApi(productService.getAccessories)

  // Load accessory products when page changes
  useEffect(() => {
    const loadAccessories = async () => {
      const data = await fetchAccessories(page, 10)
      if (data) {
        // Transform backend data to frontend format
        setProducts(transformProducts(data.products))
        setPagination(data.pagination)
      }
    }

    loadAccessories()
  }, [page, fetchAccessories])

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

  return (
    <div className="mx-5 min-h-screen bg-white">
      <NavBar2 />

      <header className="w-full flex flex-row justify-center mx-auto px-4 py-8 my-4 border-gray-200 border-b-2">
        <article>
          <h1 className="text-3xl font-bold text-center my-6">ACCESSORIES</h1>
          <h3 className="text-center">Small gadget accessories • decorate your inhalers</h3>
        </article>
      </header>

      <TextCarousel text={["ACCESSORIES", "ACCESSORIES", "ACCESSORIES"]} colorIndex={[4]} font="poppins" />

      <div className="my-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl">Loading accessories...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <>
            {/* Pass productType="ACCESSORY" to ensure only accessories are displayed */}
            <ProductGrid products={products} productType="ACCESSORY" />

            {/* Pagination Controls */}
            {pagination.pages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                <button
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {page} of {pagination.pages}
                </span>
                <button
                  onClick={() => setPage((prev) => Math.min(pagination.pages, prev + 1))}
                  disabled={page === pagination.pages}
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
    </div>
  )
}

export default PageTransition(Shop_Product)

